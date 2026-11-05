using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

public sealed class FcmPushService : IFcmPushService
{
    private const string TokenUrl = "https://oauth2.googleapis.com/token";
    private const string Scope = "https://www.googleapis.com/auth/firebase.messaging";
    private const string Audience = "https://oauth2.googleapis.com/token";

    private readonly IHttpClientFactory _httpFactory;
    private readonly IConfiguration _config;
    private readonly ILogger<FcmPushService> _logger;
    private readonly SemaphoreSlim _tokenLock = new(1, 1);

    private string? _accessToken;
    private DateTime _tokenExpiryUtc = DateTime.MinValue;
    private string? _serviceAccountEmail;
    private string? _projectId;
    private RSA? _privateKey;

    public FcmPushService(IHttpClientFactory httpFactory, IConfiguration config, ILogger<FcmPushService> logger)
    {
        _httpFactory = httpFactory;
        _config = config;
        _logger = logger;
        Initialize();
    }

    public bool IsEnabled { get; private set; }

    public async Task PushAsync(
        IReadOnlyList<string> deviceTokens,
        string type,
        string title,
        string body,
        string? link = null,
        int? notificationId = null)
    {
        if (!IsEnabled || deviceTokens is null || deviceTokens.Count == 0)
        {
            return;
        }

        try
        {
            var accessToken = await GetAccessTokenAsync();
            var client = _httpFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(15);
            var url = $"https://fcm.googleapis.com/v1/projects/{_projectId}/messages:send";

            foreach (var deviceToken in deviceTokens.Distinct())
            {
                var payload = new
                {
                    message = new
                    {
                        token = deviceToken,
                        notification = new { title, body },
                        data = new
                        {
                            type,
                            link = link ?? string.Empty,
                            id = notificationId?.ToString() ?? string.Empty
                        },
                        android = new
                        {
                            priority = "high",
                            ttl = "3600s",
                            notification = new { channel_id = "nehzat_notifications" }
                        }
                    }
                };

                using var request = new HttpRequestMessage(HttpMethod.Post, url)
                {
                    Content = JsonContent.Create(payload)
                };
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                using var response = await client.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    var text = await response.Content.ReadAsStringAsync();
                    _logger.LogWarning("FCM send failed ({Status}): {Details}", (int)response.StatusCode, Truncate(text, 300));
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "FCM push failed");
        }
    }

    private void Initialize()
    {
        if (!_config.GetValue("Fcm:Enabled", false))
        {
            return;
        }

        try
        {
            var json = ResolveServiceAccountJson();
            if (string.IsNullOrWhiteSpace(json))
            {
                _logger.LogWarning("Fcm:Enabled is set but no service account found (Fcm:ServiceAccountFile or Fcm:ServiceAccount). FCM push disabled.");
                return;
            }

            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;
            _serviceAccountEmail = root.TryGetProperty("client_email", out var ce) ? ce.GetString() : null;
            _projectId = root.TryGetProperty("project_id", out var pid) ? pid.GetString() : null;
            var key = root.TryGetProperty("private_key", out var pk) ? pk.GetString() : null;

            if (string.IsNullOrWhiteSpace(_serviceAccountEmail) || string.IsNullOrWhiteSpace(_projectId) || string.IsNullOrWhiteSpace(key))
            {
                _logger.LogWarning("FCM service account JSON is incomplete. FCM push disabled.");
                return;
            }

            _privateKey = RSA.Create();
            _privateKey.ImportFromPem(key.ToCharArray());
            IsEnabled = true;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to load FCM service account. FCM push disabled.");
        }
    }

    private string? ResolveServiceAccountJson()
    {
        var file = _config["Fcm:ServiceAccountFile"];
        if (!string.IsNullOrWhiteSpace(file))
        {
            var path = Path.IsPathRooted(file) ? file : Path.Combine(AppContext.BaseDirectory, file);
            if (File.Exists(path))
            {
                return File.ReadAllText(path);
            }
        }

        return _config["Fcm:ServiceAccount"];
    }

    private async Task<string> GetAccessTokenAsync()
    {
        if (_accessToken is not null && DateTime.UtcNow < _tokenExpiryUtc)
        {
            return _accessToken;
        }

        await _tokenLock.WaitAsync();
        try
        {
            if (_accessToken is not null && DateTime.UtcNow < _tokenExpiryUtc)
            {
                return _accessToken;
            }

            var clientAssertion = BuildServiceAccountJwt();
            using var form = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["client_assertion"] = clientAssertion,
                ["grant_type"] = "urn:ietf:params:oauth:grant-type:jwt-bearer"
            });

            using var client = _httpFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(15);
            using var response = await client.PostAsync(TokenUrl, form);
            var text = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"FCM token exchange failed ({(int)response.StatusCode}): {Truncate(text, 300)}");
            }

            using var doc = JsonDocument.Parse(text);
            var accessToken = doc.RootElement.GetProperty("access_token").GetString()!;
            var expiresIn = doc.RootElement.TryGetProperty("expires_in", out var e) ? e.GetInt32() : 3600;

            _accessToken = accessToken;
            _tokenExpiryUtc = DateTime.UtcNow.AddSeconds(Math.Max(60, expiresIn - 60));
            return accessToken;
        }
        finally
        {
            _tokenLock.Release();
        }
    }

    private string BuildServiceAccountJwt()
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        var header = Base64Url(Encoding.UTF8.GetBytes("""{"alg":"RS256","typ":"JWT"}"""));
        var claims = Base64Url(Encoding.UTF8.GetBytes(
            $"{{\"iss\":\"{_serviceAccountEmail}\",\"scope\":\"{Scope}\",\"aud\":\"{Audience}\",\"iat\":{now},\"exp\":{now + 3600}}}"));
        var signingInput = $"{header}.{claims}";
        var signature = _privateKey!.SignData(
            Encoding.UTF8.GetBytes(signingInput),
            HashAlgorithmName.SHA256,
            RSASignaturePadding.Pkcs1);
        return $"{signingInput}.{Base64Url(signature)}";
    }

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');

    private static string Truncate(string value, int max) =>
        string.IsNullOrEmpty(value) || value.Length <= max ? value : value[..max] + "...";
}

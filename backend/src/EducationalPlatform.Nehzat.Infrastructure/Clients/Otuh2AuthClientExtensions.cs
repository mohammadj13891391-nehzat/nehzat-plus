using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;
using Refit;

namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

public static class Otuh2AuthClientExtensions
{
    public static IServiceCollection AddOtuh2AuthClient(
        this IServiceCollection services,
        string authServiceUrl)
    {
        var retryPolicy = HttpPolicyExtensions
            .HandleTransientHttpError()
            .WaitAndRetryAsync(
                retryCount: 3,
                sleepDurationProvider: retryAttempt =>
                    TimeSpan.FromMilliseconds(Math.Pow(2, retryAttempt) * 100));

        services.AddRefitClient<IOtuh2AuthClient>(new RefitSettings
        {
            ContentSerializer = new SystemTextJsonContentSerializer(
                new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.SnakeCaseLower,
                    PropertyNameCaseInsensitive = true
                })
        })
        .ConfigureHttpClient(client =>
        {
            client.BaseAddress = new Uri(authServiceUrl.TrimEnd('/'));
        })
        .AddPolicyHandler(retryPolicy);

        return services;
    }
}

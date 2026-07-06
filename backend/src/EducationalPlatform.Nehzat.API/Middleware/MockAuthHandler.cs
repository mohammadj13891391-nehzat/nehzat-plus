using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace EducationalPlatform.Nehzat.API.Middleware;

public class MockAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    public MockAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder) : base(options, logger, encoder) { }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var claims = new[] {
            new Claim(ClaimTypes.NameIdentifier, "usr_dev_mock_01H7X8Z5M3P"),
            new Claim(ClaimTypes.Name, "Developer Sandbox Account"),
            new Claim(ClaimTypes.Email, "sandbox-dev@nehzat128.ir"),
            new Claim(ClaimTypes.Role, "manager"),
            new Claim("permissions", "nehzat:courses:create"),
            new Claim("permissions", "personality:assessments:evaluate")
        };

        var identity = new ClaimsIdentity(claims, "MockScheme");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "MockScheme");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

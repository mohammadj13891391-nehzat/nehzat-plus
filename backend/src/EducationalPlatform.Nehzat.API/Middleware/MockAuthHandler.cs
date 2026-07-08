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
            new Claim("sub", "test"),
            new Claim("name", "مدیر سیستم"),
            new Claim("preferred_username", "test"),
            new Claim("email", "admin@nehzat.local"),
            new Claim("userId", "1"),
            new Claim("role", "manager"),
            new Claim("role", "admin")
        };

        var identity = new ClaimsIdentity(claims, "MockScheme");
        var principal = new ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "MockScheme");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}

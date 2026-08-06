using System.Security.Claims;
using EducationalPlatform.Nehzat.API.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IDevTokenService _devTokenService;

        public AuthController(IDevTokenService devTokenService)
        {
            _devTokenService = devTokenService;
        }

        // Sign-up is handled by OTUH2 — this endpoint is disabled in favor of centralized auth.
        [HttpPost("signup")]
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult SignUp()
        {
            return BadRequest(new { message = "ثبت‌نام از طریق سامانه احراز هویت مرکزی (OTUH2) انجام می‌شود" });
        }

        /// <summary>
        /// Development-only centralized sign-in. Validates a fixed set of dev accounts
        /// (documented in docs/AGENTS.md) and issues a short-lived at+jwt token signed
        /// with the dev HMAC key configured under "DevAuth". Active only when
        /// DevAuth:UseMockAuth=true in a Development environment — production still
        /// relies on OTUH2 JWT validation against its JWKS.
        /// </summary>
        [HttpPost("signin")]
        [AllowAnonymous]
        public IActionResult SignIn([FromBody] SignInRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Unauthorized(new { message = "نام کاربری یا رمز عبور نامعتبر است" });
            }

            var account = DevAccounts.Lookup(request.Username, request.Password);
            if (account is null)
            {
                return Unauthorized(new { message = "نام کاربری یا رمز عبور اشتباه است" });
            }

            var token = _devTokenService.CreateToken(
                username: account.Username,
                role: account.Role,
                userId: account.UserId.ToString(),
                studentId: account.StudentId?.ToString(),
                branchId: account.BranchId.ToString());

            return Ok(new
            {
                token,
                username = account.Username,
                userType = account.Role,
                studentId = account.StudentId,
                branchId = account.BranchId,
                imageUrl = account.ImageUrl,
                message = "Sign-in successful"
            });
        }
    }

    /// <summary>
    /// Dev-only in-process credential allowlist (no DB password storage exists: the User
    /// entity stores OidcSubject, not a hash). Mirrors the test accounts in docs/AGENTS.md.
    /// </summary>
    internal static class DevAccounts
    {
        private static readonly List<DevAccount> _accounts = new()
        {
            new DevAccount("test",              "password",      "manager",   1,  null, 1, null),
            new DevAccount("ali.ahmadi",        "password123",   "trainee", 101, 101,  1, "/assets/avatars/ali.png"),
            new DevAccount("fateme.mohammadi",  "password123",   "trainee", 102, 102,  1, "/assets/avatars/fateme.png"),
            new DevAccount("mohammad.rezaei",     "password123",   "trainee", 103, 103,  1, "/assets/avatars/mohammad.png"),
            new DevAccount("coach",               "password123",   "coach",   200, null, 1, null),
        };

        public static DevAccount? Lookup(string username, string password)
        {
            return _accounts.FirstOrDefault(a =>
                a.Username.Equals(username, StringComparison.Ordinal) &&
                a.Secret.Equals(password, StringComparison.Ordinal));
        }
    }

    internal record DevAccount(string Username, string Secret, string Role, int UserId, int? StudentId, int BranchId, string? ImageUrl);

    public record SignInRequest(string Username, string Password);
}

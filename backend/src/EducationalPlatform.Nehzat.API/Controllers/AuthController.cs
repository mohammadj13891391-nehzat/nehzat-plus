using System.Security.Claims;
using EducationalPlatform.Nehzat.API.Security;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IDevTokenService _devTokenService;
        private readonly IConfiguration _configuration;
        private readonly IHostEnvironment _env;
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly AppDbContext _db;

        public AuthController(IDevTokenService devTokenService, IConfiguration configuration, IHostEnvironment env, IAuthService authService, IUserService userService, AppDbContext db)
        {
            _devTokenService = devTokenService;
            _configuration = configuration;
            _env = env;
            _authService = authService;
            _userService = userService;
            _db = db;
        }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var result = await _authService.LoginAsync(request);
        if (result is null)
            return Unauthorized(new { message = "نام کاربری یا رمز عبور اشتباه است" });
        return Ok(result);
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        var result = await _authService.RegisterAsync(request);
        if (result is null)
            return BadRequest(new { message = "نام کاربری تکراری است" });
        return Ok(result);
    }

    [HttpGet("qr/generate")]
    [AllowAnonymous]
    public async Task<IActionResult> GenerateQr([FromQuery] string deviceInfo = "web")
    {
        var result = await _authService.GenerateQrCodeAsync(deviceInfo);
        if (result is null) return BadRequest(new { message = "خطا در ایجاد QR" });
        return Ok(result);
    }

    [HttpGet("qr/poll")]
    [AllowAnonymous]
    public async Task<IActionResult> PollQr([FromQuery] string sessionId)
    {
        var result = await _authService.PollQrStatusAsync(sessionId);
        if (result is null) return NotFound(new { message = "جلسه یافت نشد" });
        return Ok(result);
    }

    [HttpPost("qr/scan")]
    [AllowAnonymous]
    public async Task<IActionResult> ScanQr([FromBody] QrScanRequest request)
    {
        var result = await _authService.ScanAndConfirmQrAsync(request.SessionId, request.Username);
        if (result is null) return BadRequest(new { message = "QR نامعتبر یا منقضی شده" });
        return Ok(result);
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
        public async Task<IActionResult> SignIn([FromBody] SignInRequest request)
        {
            // Hard gate: only in a Development environment, and only when
            // DevAuth:UseMockAuth is explicitly enabled in configuration.
            var useMockAuth = _env.IsDevelopment()
                && _configuration.GetValue<bool>("DevAuth:UseMockAuth", false);
            if (!useMockAuth)
            {
                return NotFound();
            }

            if (request == null || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Unauthorized(new { message = "نام کاربری یا رمز عبور نامعتبر است" });
            }

            var account = LookupDevAccount(request.Username, request.Password);
            if (account is null)
            {
                return Unauthorized(new { message = "نام کاربری یا رمز عبور اشتباه است" });
            }

            var user = await _userService.FindByUsernameAsync(account.Username);
            if (user == null)
            {
                user = await _userService.CreateLocalUserAsync(account.Username, account.Role, account.UserId.ToString());
            }

            if (user.StudentId == null && account.StudentId.HasValue)
            {
                var student = await _db.Students.FirstOrDefaultAsync(s =>
                    s.Email != null && s.Email.StartsWith(account.Username + "@"));
                if (student != null)
                {
                    user.StudentId = student.Id;
                    if (string.IsNullOrEmpty(user.FirstName)) user.FirstName = student.FirstName;
                    if (string.IsNullOrEmpty(user.LastName)) user.LastName = student.LastName;
                    if (string.IsNullOrEmpty(user.Email)) user.Email = student.Email;
                    if (string.IsNullOrEmpty(user.PhoneNumber)) user.PhoneNumber = student.PhoneNumber;
                    user.UpdatedAt = DateTime.UtcNow;
                    await _db.SaveChangesAsync();
                }
            }

            var token = _devTokenService.CreateToken(
                username: account.Username,
                role: account.Role,
                userId: user.Id.ToString(),
                studentId: user.StudentId?.ToString(),
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

        /// <summary>
        /// Dev-only credential allowlist, loaded from configuration (DevAuth:Accounts in
        /// appsettings.Development.json) instead of source, so no credentials live in code.
        /// The User entity stores OidcSubject, not a hash — no DB password verification exists.
        /// </summary>
        private DevAccount? LookupDevAccount(string username, string password)
        {
            var accounts = _configuration.GetSection("DevAuth:Accounts").Get<List<DevAccount>>()
                ?? new List<DevAccount>();
            return accounts.FirstOrDefault(a =>
                a.Username.Equals(username, StringComparison.Ordinal) &&
                a.Password.Equals(password, StringComparison.Ordinal));
        }

        private record DevAccount(string Username, string Password, string Role, int UserId, int? StudentId, int BranchId, string? ImageUrl);

        public record SignInRequest(string Username, string Password);
        public record QrScanRequest(string SessionId, string Username);
    }
}

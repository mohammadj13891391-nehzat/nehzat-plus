using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user is null) return null;

        var studentId = user.StudentId;
        string? imageUrl = null;
        int? branchId = null;

        if (studentId.HasValue)
        {
            var student = await _db.Students.FindAsync(studentId.Value);
            imageUrl = student?.Gender == "male" ? "/assets/avatars/male.png" : "/assets/avatars/female.png";
            branchId = student?.BranchId;
        }

        var token = GenerateJwt(user.Username, user.UserType, user.Id.ToString(),
            studentId?.ToString(), branchId?.ToString());

        return new LoginResponseDto(
            Token: token,
            Username: user.Username,
            Role: user.UserType,
            StudentId: studentId,
            BranchId: branchId,
            ImageUrl: imageUrl
        );
    }

    public async Task<LoginResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        if (await _db.Users.AnyAsync(u => u.Username == request.Username))
            return null;

        var user = new User
        {
            Username = request.Username,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserType = "trainee",
            OidcSubject = $"local:{request.Username}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = GenerateJwt(user.Username, user.UserType, user.Id.ToString(), null, null);

        return new LoginResponseDto(
            Token: token,
            Username: user.Username,
            Role: user.UserType,
            StudentId: null,
            BranchId: null,
            ImageUrl: null
        );
    }

    public async Task<QrCodeResponseDto?> GenerateQrCodeAsync(string deviceInfo)
    {
        var sessionId = Guid.NewGuid().ToString("N");
        var expiresAt = DateTime.UtcNow.AddMinutes(5);

        var session = new QrSession
        {
            QrSessionId = sessionId,
            Status = "pending",
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = expiresAt
        };

        _db.QrSessions.Add(session);
        await _db.SaveChangesAsync();

        var qrData = $"NEHZAT-QR:{sessionId}";

        return new QrCodeResponseDto(
            SessionId: sessionId,
            QrData: qrData,
            ExpiresAt: expiresAt
        );
    }

    public async Task<QrPollResponseDto?> PollQrStatusAsync(string sessionId)
    {
        var session = await _db.QrSessions.FirstOrDefaultAsync(q => q.QrSessionId == sessionId);
        if (session is null) return null;

        if (session.Status == "expired" || session.ExpiresAt < DateTime.UtcNow)
        {
            session.Status = "expired";
            await _db.SaveChangesAsync();
            return new QrPollResponseDto("expired", null, null, null, null, null);
        }

        if (session.Status == "confirmed" && session.ConfirmedToken is not null)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == session.ScannedByUsername);
            return new QrPollResponseDto(
                Status: "confirmed",
                Token: session.ConfirmedToken,
                Username: user?.Username,
                Role: user?.UserType,
                StudentId: user?.StudentId,
                BranchId: null
            );
        }

        return new QrPollResponseDto(session.Status, null, null, null, null, null);
    }

    public async Task<QrScanConfirmDto?> ScanAndConfirmQrAsync(string sessionId, string username)
    {
        var session = await _db.QrSessions.FirstOrDefaultAsync(q => q.QrSessionId == sessionId);
        if (session is null || session.Status != "pending" || session.ExpiresAt < DateTime.UtcNow)
            return null;

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user is null) return null;

        var token = GenerateJwt(user.Username, user.UserType, user.Id.ToString(),
            user.StudentId?.ToString(), null);

        session.Status = "confirmed";
        session.ScannedByUsername = username;
        session.ScannedAt = DateTime.UtcNow;
        session.ConfirmedAt = DateTime.UtcNow;
        session.ConfirmedToken = token;

        await _db.SaveChangesAsync();

        return new QrScanConfirmDto(
            Status: "confirmed",
            Message: "ورود با موفقیت تأیید شد"
        );
    }

    private string GenerateJwt(string username, string role, string userId, string? studentId, string? branchId)
    {
        // Issuer/audience must match the JWT validation in Program.cs, which reads the
        // same DevAuth section (DevAuth:Issuer / DevAuth:Audience) — single source of truth.
        var devAuth = _configuration.GetSection("DevAuth");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            devAuth["DevAuthKey"] ?? _configuration["Jwt:Key"] ?? "dev-secret-key-for-local-only"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new("sub", username),
            new("role", role),
            new("userId", userId)
        };

        if (studentId is not null) claims.Add(new Claim("studentId", studentId));
        if (branchId is not null) claims.Add(new Claim("branchId", branchId));

        var token = new JwtSecurityToken(
            issuer: devAuth["Issuer"] ?? "http://localhost:3000",
            audience: devAuth["Audience"] ?? "http://localhost:3000",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: creds
        );
        token.Header["typ"] = "at+jwt";

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

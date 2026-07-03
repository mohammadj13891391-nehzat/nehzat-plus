using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using LessonPlanner.Api.Data;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IConfiguration _configuration;

    public UserService(AppDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task CreateUserAsync(string username, string password, string? imageUrl, int? studentId, string userType, string? firstName = null, string? lastName = null, string? email = null, string? phoneNumber = null)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        var user = new User
        {
            Username = username,
            PasswordHash = hash,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            ImageUrl = imageUrl,
            StudentId = studentId,
            ApprovalStatus = "approved",
            UserType = userType,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
    }

    public async Task CreatePendingUserAsync(string username, string password, string? imageUrl, string? firstName = null, string? lastName = null, string? email = null, string? phoneNumber = null)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
        var user = new User
        {
            Username = username,
            PasswordHash = hash,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            ImageUrl = imageUrl,
            ApprovalStatus = "pending",
            UserType = "trainee",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
    }

    public async Task<List<User>> GetPendingUsersAsync()
    {
        return await _db.Users
            .Where(u => u.ApprovalStatus == "pending")
            .Include(u => u.Student)
            .ToListAsync();
    }

    public async Task ApproveUserAsync(int userId, string firstName, string lastName, string email, string phoneNumber, string studentId)
    {
        var student = new Student
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            StudentId = studentId,
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        var user = await _db.Users.FindAsync(userId);
        if (user != null)
        {
            user.ApprovalStatus = "approved";
            user.StudentId = student.Id;
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public async Task RejectUserAsync(int userId)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user != null)
        {
            user.ApprovalStatus = "rejected";
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public async Task<User?> FindUserAsync(string username)
    {
        return await _db.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<User?> FindUserByStudentIdAsync(int studentId)
    {
        return await _db.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.StudentId == studentId);
    }

    public async Task<bool> ValidateUserAsync(string username, string password)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user?.PasswordHash == null) return false;
        return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
    }

    public async Task UpdateUserProfileAsync(string username, string imageUrl)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user != null)
        {
            user.ImageUrl = imageUrl;
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public async Task UpdateUserTypeAsync(int userId, string userType)
    {
        var user = await _db.Users.FindAsync(userId);
        if (user != null)
        {
            user.UserType = userType;
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Role, user.UserType),
            new("userId", user.Id.ToString()),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N")),
            new(JwtRegisteredClaimNames.Sub, user.Username)
        };

        if (user.StudentId.HasValue)
            claims.Add(new Claim("studentId", user.StudentId.Value.ToString()));

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(double.Parse(jwtSettings["ExpireDays"] ?? "7")),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

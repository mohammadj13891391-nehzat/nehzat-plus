using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _db;

    public UserService(AppDbContext db)
    {
        _db = db;
    }

    public async Task CreateUserAsync(string username, string password, string? imageUrl, int? studentId, string userType, string? firstName = null, string? lastName = null, string? email = null, string? phoneNumber = null)
    {
        // Password is no longer stored locally — OTUH2 handles authentication
        // The password parameter is kept for backward compatibility but ignored
        var user = new User
        {
            Username = username,
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
        // Password is no longer stored locally — OTUH2 handles authentication
        var user = new User
        {
            Username = username,
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

    public Task<bool> ValidateUserAsync(string username, string password)
    {
        // Password validation is handled by OTUH2 OAuth service
        // This method remains for backward compatibility but always returns false
        // since local password storage has been removed
        return Task.FromResult(false);
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

    public async Task<User?> FindByOidcSubjectAsync(string oidcSubject)
    {
        return await _db.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.OidcSubject == oidcSubject);
    }

    public async Task<User> CreateLocalUserAsync(string username, string userType, string? oidcSubject = null)
    {
        var user = new User
        {
            Username = username,
            OidcSubject = oidcSubject,
            ApprovalStatus = "approved",
            UserType = userType,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task SyncOidcSubjectAsync(string username, string oidcSubject)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user != null && user.OidcSubject != oidcSubject)
        {
            user.OidcSubject = oidcSubject;
            user.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    public async Task<User?> FindByUsernameAsync(string username)
    {
        return await _db.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.Username == username);
    }

    public string GenerateJwtToken(User user)
    {
        // JWT generation is now handled by OTUH2 OAuth service.
        // This method is kept for backward compatibility with AuthController.
        throw new InvalidOperationException(
            "Local JWT generation is disabled. Authentication is handled by OTUH2 OAuth service.");
    }
}

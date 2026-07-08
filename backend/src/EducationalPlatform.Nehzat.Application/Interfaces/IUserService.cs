using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IUserService
{
    Task CreateUserAsync(string username, string password, string? imageUrl, int? studentId, string userType, string? firstName = null, string? lastName = null, string? email = null, string? phoneNumber = null);
    Task CreatePendingUserAsync(string username, string password, string? imageUrl, string? firstName = null, string? lastName = null, string? email = null, string? phoneNumber = null);
    Task<List<User>> GetPendingUsersAsync();
    Task ApproveUserAsync(int userId, string firstName, string lastName, string email, string phoneNumber, string studentId);
    Task RejectUserAsync(int userId);
    Task<User?> FindUserAsync(string username);
    Task<User?> FindUserByStudentIdAsync(int studentId);
    Task<bool> ValidateUserAsync(string username, string password);
    Task UpdateUserProfileAsync(string username, string imageUrl);
    Task UpdateUserTypeAsync(int userId, string userType);
    Task<User?> FindByOidcSubjectAsync(string oidcSubject);
    Task<User> CreateLocalUserAsync(string username, string userType, string? oidcSubject = null);
    Task SyncOidcSubjectAsync(string username, string oidcSubject);
    Task<User?> FindByUsernameAsync(string username);
    string GenerateJwtToken(User user);
}

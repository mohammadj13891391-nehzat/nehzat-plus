using Refit;

namespace EducationalPlatform.Nehzat.Infrastructure.Clients;

public interface IOtuh2AuthClient
{
    // ── OAuth2 / OIDC ──

    [Post("/connect/token")]
    [Headers("Content-Type: application/x-www-form-urlencoded")]
    Task<TokenResponse> GetTokenAsync([Body(BodySerializationMethod.UrlEncoded)] Dictionary<string, string> parameters);

    [Get("/connect/userinfo")]
    Task<UserInfoResponse> GetUserInfoAsync([Header("Authorization")] string bearerToken);

    [Post("/connect/introspect")]
    [Headers("Content-Type: application/x-www-form-urlencoded")]
    Task<IntrospectionResponse> IntrospectTokenAsync([Body(BodySerializationMethod.UrlEncoded)] Dictionary<string, string> parameters);

    // ── Internal Provisioning (X-API-Key) ──

    [Post("/api/internal/users")]
    Task<UserResponse> CreateServiceUserAsync(
        [Header("X-API-Key")] string apiKey,
        [Body] CreateServiceUserRequest request);

    [Get("/api/internal/users/{id}")]
    Task<UserResponse> GetUserByIdAsync(
        [Header("X-API-Key")] string apiKey,
        int id);

    [Get("/api/internal/users/by-username/{username}")]
    Task<UserResponse> GetUserByUsernameAsync(
        [Header("X-API-Key")] string apiKey,
        string username);

    [Post("/api/internal/users/{userId}/roles")]
    Task<ApiResponse> AssignRoleAsync(
        [Header("X-API-Key")] string apiKey,
        int userId,
        [Body] AssignRoleRequest request);

    // ── Public Registration ──

    [Post("/api/auth/register")]
    Task<ApiResponse> RegisterAsync([Body] RegisterRequest request);

    // ── Admin: Role Management (Bearer token) ──

    [Get("/api/admin/roles")]
    Task<List<RoleDefinitionResponse>> GetRolesAsync([Header("Authorization")] string bearerToken);

    [Post("/api/admin/roles")]
    Task<ApiResponse> CreateRoleAsync(
        [Header("Authorization")] string bearerToken,
        [Body] CreateRoleRequest request);

    [Delete("/api/admin/roles/{roleName}")]
    Task<ApiResponse> DeleteRoleAsync(
        [Header("Authorization")] string bearerToken,
        string roleName);

    // ── Admin: Client Management (Bearer token) ──

    [Get("/api/admin/clients")]
    Task<List<ClientResponse>> GetClientsAsync([Header("Authorization")] string bearerToken);

    [Post("/api/admin/clients")]
    Task<ClientResponse> CreateClientAsync(
        [Header("Authorization")] string bearerToken,
        [Body] CreateClientRequest request);

    [Delete("/api/admin/clients/{clientId}")]
    Task<ApiResponse> DeleteClientAsync(
        [Header("Authorization")] string bearerToken,
        string clientId);
}

// ── DTOs ──

public record TokenResponse(
    string AccessToken,
    string TokenType,
    int ExpiresIn,
    string? RefreshToken,
    string? IdToken);

public record UserInfoResponse(
    string Sub,
    string? Name,
    string? Email,
    bool? EmailVerified,
    string[]? Roles);

public record UserResponse(
    int Id,
    string Username,
    string? Email,
    string? FirstName,
    string? LastName,
    string ApprovalStatus,
    string[] Roles,
    DateTime CreatedAt);

public record CreateServiceUserRequest(
    string Username,
    string Password,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string Role);

public record RegisterRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber);

public record AssignRoleRequest(string Role);

public record CreateRoleRequest(string Name, string Description);

public record RoleDefinitionResponse(string Name, string Description, int UserCount);

public record ClientResponse(
    string ClientId,
    string DisplayName,
    string Type,
    string[] GrantTypes,
    string[] Permissions);

public record CreateClientRequest(
    string ClientId,
    string ClientSecret,
    string DisplayName,
    string Type,
    string[] GrantTypes,
    string[] Permissions);

public record ApiResponse(string Message, bool Success = true);

public record IntrospectionResponse(
    bool Active,
    string? Sub,
    string? Username,
    string[]? Roles,
    string? Scope,
    long? Exp);

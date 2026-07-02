namespace LessonPlanner.Api.DTOs;

public record CreateParentRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string? Address,
    string? NationalCode,
    int[]? StudentIds
);

public record UpdateParentRequest(
    string? Username,
    string? Password,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? Address,
    string? NationalCode,
    int[]? StudentIds,
    string? Status
);

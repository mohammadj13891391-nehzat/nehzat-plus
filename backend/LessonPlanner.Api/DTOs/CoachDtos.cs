namespace LessonPlanner.Api.DTOs;

public record CreateCoachRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string? Specialization,
    string? NationalCode,
    int[]? AssignedCourseIds
);

public record UpdateCoachRequest(
    string? Username,
    string? Password,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? Specialization,
    string? NationalCode,
    int[]? AssignedCourseIds,
    string? Status
);

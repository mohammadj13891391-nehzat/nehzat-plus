namespace LessonPlanner.Api.DTOs;

public record CreateCoachRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string? Specialization,
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
    int[]? AssignedCourseIds,
    string? Status
);

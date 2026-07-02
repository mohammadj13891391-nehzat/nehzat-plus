namespace LessonPlanner.Api.DTOs;

public record CreateEvaluatorRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string? Expertise,
    int[]? AssignedMadrasahIds,
    string? NationalCode
);

public record UpdateEvaluatorRequest(
    string? Username,
    string? Password,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? Expertise,
    int[]? AssignedMadrasahIds,
    string? NationalCode,
    string? Status
);

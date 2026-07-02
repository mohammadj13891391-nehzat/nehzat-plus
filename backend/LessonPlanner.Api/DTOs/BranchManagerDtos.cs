namespace LessonPlanner.Api.DTOs;

public record CreateBranchManagerRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string AssignedBranch,
    string AssignedProvince,
    string Gender,
    string? NationalCode
);

public record UpdateBranchManagerRequest(
    string? Username,
    string? Password,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? AssignedBranch,
    string? AssignedProvince,
    string? Gender,
    string? NationalCode,
    string? Status
);

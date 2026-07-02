namespace LessonPlanner.Api.DTOs;

public record ApproveUserRequest(
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    string StudentId,
    int[] CourseIds
);

public record ApproveUserResponse(string Message, object Student, int EnrolledCourses);

public record RejectUserResponse(string Message);

public record SystemStatisticsResponse(
    int TotalCourses,
    int TotalAssignments,
    int TotalAttachments,
    int ActiveCourses
);

public record AttachmentData(
    string? Title,
    string? Description,
    string? Kind,
    string? Url,
    int? DisplayOrder
);

public record CreateUserRequest(
    string Username,
    string Password,
    string UserType,
    string? FirstName = null,
    string? LastName = null,
    string? Email = null,
    string? PhoneNumber = null
);

public record AdminCreateStudentRequest(
    string Username,
    string Password,
    string FirstName,
    string LastName,
    string Email,
    string? PhoneNumber,
    string? StudentId,
    string? NationalCode
);

public record AdminUpdateStudentRequest(
    string? Username,
    string? Password,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? StudentId,
    string? NationalCode,
    string? Status
);

using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record ApproveUserRequest(
    [Required(ErrorMessage = "نام الزامی است")]
    [StringLength(100)]
    string FirstName,

    [Required(ErrorMessage = "نام خانوادگی الزامی است")]
    [StringLength(100)]
    string LastName,

    [Required(ErrorMessage = "ایمیل الزامی است")]
    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [StringLength(200)]
    string Email,

    [Required(ErrorMessage = "شماره تلفن الزامی است")]
    [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
    string PhoneNumber,

    [Required(ErrorMessage = "کد دانش‌آموزی الزامی است")]
    [StringLength(50)]
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
    [Required(ErrorMessage = "نام کاربری الزامی است")]
    [StringLength(100, MinimumLength = 3)]
    [RegularExpression(@"^[a-zA-Z0-9_.\-]+$", ErrorMessage = "نام کاربری معتبر نیست")]
    string Username,

    [Required(ErrorMessage = "رمز عبور الزامی است")]
    [StringLength(128, MinimumLength = 6)]
    string Password,

    [Required(ErrorMessage = "نوع کاربر الزامی است")]
    [RegularExpression(@"^(admin|manager|headquarters|branch_manager|coach|parent|evaluator|trainee)$", ErrorMessage = "نوع کاربر معتبر نیست")]
    string UserType,

    [StringLength(100)]
    string? FirstName = null,

    [StringLength(100)]
    string? LastName = null,

    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [StringLength(200)]
    string? Email = null,

    [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
    string? PhoneNumber = null
);

public record CreateBranchRequest(
    [Required(ErrorMessage = "نام شعبه الزامی است")]
    [StringLength(200, MinimumLength = 2)]
    string Name,

    [Required(ErrorMessage = "استان الزامی است")]
    [StringLength(100)]
    string Province,

    [StringLength(500)]
    string? Description
);

public record UpdateBranchRequest(
    [Required(ErrorMessage = "نام شعبه الزامی است")]
    [StringLength(200, MinimumLength = 2)]
    string Name,

    [Required(ErrorMessage = "استان الزامی است")]
    [StringLength(100)]
    string Province,

    [StringLength(500)]
    string? Description
);

public record AdminCreateStudentRequest(
    [Required(ErrorMessage = "نام کاربری الزامی است")]
    [StringLength(100, MinimumLength = 3)]
    [RegularExpression(@"^[a-zA-Z0-9_.\-]+$", ErrorMessage = "نام کاربری معتبر نیست")]
    string Username,

    [Required(ErrorMessage = "رمز عبور الزامی است")]
    [StringLength(128, MinimumLength = 6)]
    string Password,

    [Required(ErrorMessage = "نام الزامی است")]
    [StringLength(100)]
    string FirstName,

    [Required(ErrorMessage = "نام خانوادگی الزامی است")]
    [StringLength(100)]
    string LastName,

    [Required(ErrorMessage = "ایمیل الزامی است")]
    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [StringLength(200)]
    string Email,

    [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
    string? PhoneNumber,

    [StringLength(50)]
    string? StudentId,

    [StringLength(20)]
    string? NationalCode,

    int? BranchId
);

public record AdminUpdateStudentRequest(
    [StringLength(100, MinimumLength = 3)]
    [RegularExpression(@"^[a-zA-Z0-9_.\-]+$", ErrorMessage = "نام کاربری معتبر نیست")]
    string? Username,

    [StringLength(128, MinimumLength = 6)]
    string? Password,

    [StringLength(100)]
    string? FirstName,

    [StringLength(100)]
    string? LastName,

    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [StringLength(200)]
    string? Email,

    [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
    string? PhoneNumber,

    [StringLength(50)]
    string? StudentId,

    [StringLength(20)]
    string? NationalCode,

    [RegularExpression(@"^(active|inactive|graduated)$", ErrorMessage = "وضعیت معتبر نیست")]
    string? Status,

    int? BranchId
);

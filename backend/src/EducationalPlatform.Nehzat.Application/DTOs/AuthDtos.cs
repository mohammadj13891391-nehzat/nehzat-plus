using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record LoginRequest(
    [Required(ErrorMessage = "نام کاربری الزامی است")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "نام کاربری باید بین ۳ تا ۱۰۰ کاراکتر باشد")]
    string Username,

    [Required(ErrorMessage = "رمز عبور الزامی است")]
    [StringLength(128, MinimumLength = 6, ErrorMessage = "رمز عبور باید حداقل ۶ کاراکتر باشد")]
    string Password
);

public record SignupRequest(
    [Required(ErrorMessage = "نام کاربری الزامی است")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "نام کاربری باید بین ۳ تا ۱۰۰ کاراکتر باشد")]
    [RegularExpression(@"^[a-zA-Z0-9_.\-]+$", ErrorMessage = "نام کاربری فقط می‌تواند شامل حروف، اعداد، نقطه، خط زیر و خط تیره باشد")]
    string Username,

    [Required(ErrorMessage = "رمز عبور الزامی است")]
    [StringLength(128, MinimumLength = 6, ErrorMessage = "رمز عبور باید حداقل ۶ کاراکتر باشد")]
    string Password,

    [Required(ErrorMessage = "تکرار رمز عبور الزامی است")]
    [StringLength(128, MinimumLength = 6)]
    string RetryPassword,

    [Required(ErrorMessage = "نام الزامی است")]
    [StringLength(100, ErrorMessage = "نام نباید بیشتر از ۱۰۰ کاراکتر باشد")]
    string FirstName,

    [Required(ErrorMessage = "نام خانوادگی الزامی است")]
    [StringLength(100, ErrorMessage = "نام خانوادگی نباید بیشتر از ۱۰۰ کاراکتر باشد")]
    string LastName,

    [Required(ErrorMessage = "ایمیل الزامی است")]
    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [StringLength(200, ErrorMessage = "ایمیل نباید بیشتر از ۲۰۰ کاراکتر باشد")]
    string Email,

    [Required(ErrorMessage = "شماره تلفن الزامی است")]
    [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره تلفن باید ۱۱ رقم و با 09 شروع شود")]
    string PhoneNumber,

    string? ImageUrl = null
);

public record StudentInfo(
    string FirstName,
    string LastName,
    string Email,
    string StudentId,
    string? PhoneNumber = null
);

public record AuthResponse(
    string Message,
    string Username,
    string? ImageUrl,
    string UserType,
    int? StudentId = null,
    StudentInfo? StudentInfo = null,
    string? ApprovalStatus = null,
    int? BranchId = null
);

public record AuthTokenResponse(
    string Token,
    string Message,
    string Username,
    string? ImageUrl,
    string UserType,
    int? UserId,
    int? StudentId = null,
    StudentInfo? StudentInfo = null,
    string? ApprovalStatus = null,
    int? BranchId = null
);

public record SignupResponse(string Message, string Status);

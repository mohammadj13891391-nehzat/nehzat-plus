using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateCoachRequest(
    [Required(ErrorMessage = "نام کاربری الزامی است")]
    [StringLength(100, MinimumLength = 3)]
    [RegularExpression(@"^[a-zA-Z0-9_.\-]+$", ErrorMessage = "نام کاربری معتبر نیست")]
    string Username,

    [StringLength(128, MinimumLength = 6)]
    string? Password,

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

    [StringLength(100)]
    string? Specialization,

    [StringLength(20)]
    string? NationalCode,

    int? BranchId
);

public record UpdateCoachRequest(
    [StringLength(100)]
    string? FirstName,

    [StringLength(100)]
    string? LastName,

    [EmailAddress(ErrorMessage = "ایمیل معتبر نیست")]
    [StringLength(200)]
    string? Email,

    [RegularExpression(@"^09\d{9}$", ErrorMessage = "شماره تلفن معتبر نیست")]
    string? PhoneNumber,

    [StringLength(100)]
    string? Specialization,

    [StringLength(20)]
    string? NationalCode,

    [RegularExpression(@"^(active|inactive)$", ErrorMessage = "وضعیت معتبر نیست")]
    string? Status,

    int? BranchId,

    int[]? AssignedCourseIds
);

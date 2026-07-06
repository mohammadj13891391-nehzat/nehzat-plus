using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateDailySeriesRequest(
    string? TitlePrefix,
    string? DescriptionPrefix,
    string? Type,
    int? MaxScore,
    string? StartDate,
    int Days
);

public record FindByEmailPhoneRequest(
    [Required(ErrorMessage = "ایمیل الزامی است")]
    [EmailAddress]
    string Email,

    [Required(ErrorMessage = "شماره تلفن الزامی است")]
    [RegularExpression(@"^09\d{9}$")]
    string PhoneNumber
);

public record SubmissionData(
    int? DailyScore,
    int? CumulativeScore,
    string? Status,
    string? Notes,
    bool? IsCompleted,
    int? TimeSpent
);

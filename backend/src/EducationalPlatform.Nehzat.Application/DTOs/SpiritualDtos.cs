using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record SpiritualPracticeItemDto(
    int Id,
    string Key,
    string TitleFa,
    string? DescriptionFa,
    string StepKind,
    int? MinAge,
    int? MaxAge,
    string GenderMask,
    string RoleMask,
    int SortOrder,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record SpiritualOccasionDto(
    int Id,
    string Key,
    string TitleFa,
    string? DescriptionFa,
    int? HijriMonth,
    int? HijriDay,
    string GenderMask,
    int SortOrder,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record SpiritualOccasionDetailDto(
    int Id,
    string Key,
    string TitleFa,
    string? DescriptionFa,
    int? HijriMonth,
    int? HijriDay,
    string GenderMask,
    int SortOrder,
    List<SpiritualPracticeItemDto> Practices,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record SpiritualCatalogQueryDto(
    int? UserId,
    int? Age,
    string? Gender,
    string? Role,
    int? HijriMonth,
    int? HijriDay
);

public record UpsertDailyEntryRequest(
    [Required(ErrorMessage = "شناسه کاربر الزامی است")]
    int UserId,

    [Required(ErrorMessage = "تاریخ ورودی الزامی است")]
    DateTime EntryDate,

    [Range(1, 10, ErrorMessage = "امتیاز حالت باید بین ۱ تا ۱۰ باشد")]
    int? MoodScore,

    string? Notes,

    string? CompletedSteps
);

public record DailySpiritualEntryDto(
    int Id,
    int UserId,
    DateTime EntryDate,
    int? MoodScore,
    string? Notes,
    string? CompletedSteps,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record DailySpiritualEntryHistoryDto(
    int Id,
    int UserId,
    DateTime EntryDate,
    int? MoodScore,
    string? Notes,
    string? CompletedSteps,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record MarkOccasionPracticeRequest(
    [Required(ErrorMessage = "شناسه کاربر الزامی است")]
    int UserId,

    [Required(ErrorMessage = "شناسه مناسبت الزامی است")]
    int OccasionId,

    [Required(ErrorMessage = "شناسه عمل الزامی است")]
    int PracticeItemId,

    [Required(ErrorMessage = "سال هجری الزامی است")]
    int HijriYear,

    bool IsCompleted,

    string? Notes
);

public record UserOccasionProgressDto(
    int Id,
    int UserId,
    int OccasionId,
    int PracticeItemId,
    int HijriYear,
    bool IsCompleted,
    DateTime? CompletedAt,
    string? Notes,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record SpiritualPathDto(
    int Id,
    string Key,
    string TitleFa,
    string? DescriptionFa,
    string GenderMask,
    int SortOrder,
    int AgeEntryPoint,
    int AgeFinalizePoint,
    string Status,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record StudentPathSelectionDto(
    int Id,
    int StudentId,
    int HijriSelectionYear,
    string Stage,
    int? FinalizedPathId,
    string? FinalizedPathTitle,
    DateTime SelectedAt,
    DateTime? FinalizedAt,
    DateTime UpdatedAt
);

public record PathRankingRequest(
    [Required(ErrorMessage = "شناسه انتخاب الزامی است")]
    int SelectionId,

    [Required(ErrorMessage = "شناسه مسیر الزامی است")]
    int PathId,

    [Required(ErrorMessage = "ترتیب رتبه الزامی است")]
    [Range(1, 100, ErrorMessage = "ترتیب رتبه باید بین ۱ تا ۱۰۰ باشد")]
    int RankOrdinal
);

public record FinalizePathRequest(
    [Required(ErrorMessage = "شناسه دانش‌آموز الزامی است")]
    int StudentId,

    [Required(ErrorMessage = "شناسه مسیر نهایی الزامی است")]
    int PathId,

    string? Reason
);

public record AvailablePathsDto(
    int Id,
    string Key,
    string TitleFa,
    string? DescriptionFa,
    string GenderMask,
    int SortOrder,
    int AgeEntryPoint,
    int AgeFinalizePoint,
    string Status
);

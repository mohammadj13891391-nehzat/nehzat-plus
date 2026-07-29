using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateHadithBookRequest(
        [Required] string Title,
        [Required] string TitleTranslation,
        string? Description,
        string? AuthorName,
        int HadithCount = 0,
        int DisplayOrder = 0
    );

    public record UpdateHadithBookRequest(
        string? Title,
        string? TitleTranslation,
        string? Description,
        string? AuthorName,
        int? HadithCount,
        int? DisplayOrder,
        bool? IsActive
    );

    public record HadithBookDto(
        int Id,
        string Title,
        string TitleTranslation,
        string? Description,
        string? AuthorName,
        int HadithCount,
        int DisplayOrder,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record HadithBookDetailDto(
        int Id,
        string Title,
        string TitleTranslation,
        string? Description,
        string? AuthorName,
        int HadithCount,
        int DisplayOrder,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        List<HadithChapterDto> Chapters
    );

    public record CreateHadithChapterRequest(
        [Required] string Title,
        [Required] string TitleTranslation,
        string? Description,
        int DisplayOrder = 0,
        int HadithBookId = 0
    );

    public record UpdateHadithChapterRequest(
        string? Title,
        string? TitleTranslation,
        string? Description,
        int? DisplayOrder
    );

    public record HadithChapterDto(
        int Id,
        int HadithBookId,
        string Title,
        string TitleTranslation,
        string? Description,
        int DisplayOrder,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record HadithChapterDetailDto(
        int Id,
        int HadithBookId,
        string Title,
        string TitleTranslation,
        string? Description,
        int DisplayOrder,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        List<HadithDto> Hadiths
    );

    public record CreateHadithRequest(
        int HadithNumber,
        [Required] string MatnArabic,
        [Required] string Translation,
        string? TranslationEnglish,
        string? Isnad,
        string? Takhrij,
        string? GharibWords,
        string? Explanation,
        string? FiqhTakeaway,
        string? AudioUrl,
        string Grade = "Sahih",
        int DisplayOrder = 0,
        int HadithChapterId = 0
    );

    public record UpdateHadithRequest(
        int? HadithNumber,
        string? MatnArabic,
        string? Translation,
        string? TranslationEnglish,
        string? Isnad,
        string? Takhrij,
        string? GharibWords,
        string? Explanation,
        string? FiqhTakeaway,
        string? AudioUrl,
        string? Grade,
        int? DisplayOrder,
        bool? IsActive
    );

    public record HadithDto(
        int Id,
        int HadithChapterId,
        int HadithNumber,
        string MatnArabic,
        string Translation,
        string? TranslationEnglish,
        string? Isnad,
        string? Takhrij,
        string? GharibWords,
        string? Explanation,
        string? FiqhTakeaway,
        string? AudioUrl,
        string Grade,
        int DisplayOrder,
        bool IsActive,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record SubmitReviewRequest(
        int HadithId,
        bool IsCorrect,
        int ResponseTimeMs = 0
    );

    public record UserHadithProgressDto(
        int Id,
        int HadithId,
        int UserId,
        string MasteryLevel,
        int RepetitionCount,
        int ConsecutiveCorrect,
        int TotalAttempts,
        int CorrectAttempts,
        DateTime? LastReviewedAt,
        DateTime NextReviewAt,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record HadithReviewDto(
        int Id,
        int HadithId,
        string MatnArabic,
        string Translation,
        string? AudioUrl,
        UserHadithProgressDto Progress
    );

    public record CreateHadithAssessmentRequest(
        [Required] string Question,
        [Required] string CorrectAnswer,
        string? OptionA,
        string? OptionB,
        string? OptionC,
        string? OptionD,
        string Type = "MultipleChoice",
        string Difficulty = "Medium",
        int DisplayOrder = 0,
        int? HadithId = null,
        int? HadithChapterId = null
    );

    public record HadithAssessmentDto(
        int Id,
        string Question,
        string CorrectAnswer,
        string? OptionA,
        string? OptionB,
        string? OptionC,
        string? OptionD,
        string Type,
        string Difficulty,
        int DisplayOrder,
        int? HadithId,
        int? HadithChapterId,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record HadithDashboardStatsDto(
        int TotalBooks,
        int TotalHadiths,
        int TotalMemorized,
        int CurrentStreak,
        int TotalXp
    );
}

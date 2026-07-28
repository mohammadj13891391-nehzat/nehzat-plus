using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateMathTopicRequest(
    [Required] string Title,
    string? Description,
    [Required] string DifficultyLevel,
    string? IconUrl,
    int DisplayOrder
);

public record UpdateMathTopicRequest(
    string? Title,
    string? Description,
    string? DifficultyLevel,
    string? IconUrl,
    int? DisplayOrder,
    bool? IsActive
);

public record CreateMathLessonRequest(
    [Required] string Title,
    [Required] string Content,
    string? Summary,
    string? VideoUrl,
    [Required] int MathTopicId,
    int DurationMinutes,
    int DisplayOrder
);

public record UpdateMathLessonRequest(
    string? Title,
    string? Content,
    string? Summary,
    string? VideoUrl,
    int? DurationMinutes,
    int? DisplayOrder,
    bool? IsPublished
);

public record CreateMathQuestionRequest(
    [Required] string QuestionText,
    [Required] string OptionA,
    [Required] string OptionB,
    [Required] string OptionC,
    [Required] string OptionD,
    [Required] string CorrectOption,
    string? Explanation,
    [Required] int MathLessonId,
    [Required] string DifficultyLevel,
    int Points
);

public record UpdateMathQuestionRequest(
    string? QuestionText,
    string? OptionA,
    string? OptionB,
    string? OptionC,
    string? OptionD,
    string? CorrectOption,
    string? Explanation,
    string? DifficultyLevel,
    int? Points
);

public record RecordMathProgressRequest(
    [Required] int StudentId,
    [Required] int MathLessonId,
    int? MathQuestionId,
    bool IsCompleted,
    int? Score
);

public record UpdateMathProgressRequest(
    bool? IsCompleted,
    int? Score
);

public record CreateMathScholarRequest(
    [Required] string Name,
    string? NameArabic,
    string? BirthYear,
    string? DeathYear,
    string? BirthPlace,
    string? Biography,
    string? ImageUrl,
    string? KnownFor
);

public record UpdateMathScholarRequest(
    string? Name,
    string? NameArabic,
    string? BirthYear,
    string? DeathYear,
    string? BirthPlace,
    string? Biography,
    string? ImageUrl,
    string? KnownFor
);

public record CreateMathContributionRequest(
    [Required] int MathScholarId,
    [Required] int MathTopicId,
    [Required] string Title,
    string? Description,
    string? YearRange
);

public record UpdateMathContributionRequest(
    int? MathScholarId,
    int? MathTopicId,
    string? Title,
    string? Description,
    string? YearRange
);

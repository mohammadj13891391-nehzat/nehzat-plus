using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record GenerateWeeklyAssessmentRequest(
    [Required(ErrorMessage = "شناسه دوره الزامی است")]
    int CourseId,

    int? GeneratedByUserId,

    [Required(ErrorMessage = "عنوان ارزیابی الزامی است")]
    [StringLength(200, ErrorMessage = "عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد")]
    string Title,

    [StringLength(1000, ErrorMessage = "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد")]
    string Description,

    [Range(10, 300, ErrorMessage = "مدت زمان باید بین ۱۰ تا ۳۰۰ دقیقه باشد")]
    int DurationMinutes,

    [Range(10, 500, ErrorMessage = "حداکثر نمره باید بین ۱۰ تا ۵۰۰ باشد")]
    int MaxScore,

    [Required(ErrorMessage = "تاریخ ارزیابی الزامی است")]
    DateTime AssessmentDate,

    Dictionary<string, object>? Criteria
);

public record SubmitAssessmentResultRequest(
    [Required(ErrorMessage = "شناسه دانش‌آموز الزامی است")]
    int StudentId,

    [Required(ErrorMessage = "تاریخ تکمیل الزامی است")]
    DateTime CompletedAt,

    [Required(ErrorMessage = "نمره الزامی است")]
    int Score,

    [Required(ErrorMessage = "حداکثر نمره ممکن الزامی است")]
    int MaxPossibleScore,

    [Required(ErrorMessage = "درصد نمره الزامی است")]
    double Percentage,

    [Required(ErrorMessage = "وضعیت الزامی است")]
    [StringLength(50)]
    string Status,

    string? AnswersJson,

    string? Feedback,

    [Range(0, 500)]
    int TimeSpentMinutes
);

public record AssessmentQuestionRequest(
    [Required(ErrorMessage = "نوع سوال الزامی است")]
    [StringLength(50)]
    string Type,

    [Required(ErrorMessage = "متن سوال الزامی است")]
    string QuestionText,

    string? OptionsJson,

    string? CorrectAnswerJson,

    [Range(1, 100)]
    int Points,

    [Range(0, 100)]
    int Order,

    [StringLength(50)]
    string Difficulty,

    [StringLength(200)]
    string? Topic,

    string? Explanation
);

public record AssessmentQuestionResponse(
    int Id,
    string Type,
    string QuestionText,
    string? OptionsJson,
    string? CorrectAnswerJson,
    int Points,
    int Order,
    string Difficulty,
    string? Topic,
    string? Explanation
);

public record UpdateAssessmentRequest(
    string? Title,
    string? Description,
    string? Type,
    int? MaxScore,
    int? DurationMinutes,
    DateTime? AssessmentDate,
    string? Status,
    string? Instructions,
    Dictionary<string, object>? Criteria
);

public record AssessmentResponse(
    int Id,
    string Title,
    string Description,
    string Type,
    int MaxScore,
    int DurationMinutes,
    DateTime AssessmentDate,
    string Status,
    string? Instructions,
    int CourseId,
    string? CourseTitle,
    int? GeneratedByUserId,
    string? GenerationCriteria,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record AssessmentResultResponse(
    int Id,
    DateTime CompletedAt,
    int Score,
    int MaxPossibleScore,
    double Percentage,
    string Status,
    string? AnswersJson,
    string? Feedback,
    int TimeSpentMinutes,
    int AssessmentId,
    int StudentId,
    string? StudentName,
    DateTime CreatedAt,
    DateTime UpdatedAt
);

public record AssessmentAnalyticsResponse(
    object Assessment,
    int TotalStudents,
    int CompletedCount,
    double CompletionRate,
    double AverageScore,
    double PassRate,
    List<object> QuestionStats
);

public record StudentAssessmentHistoryResponse(
    object Student,
    List<object> History,
    List<object> Trend,
    object Statistics
);

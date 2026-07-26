using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateIssueSurveyRequest(
    [Required(ErrorMessage = "عنوان نظرسنجی الزامی است")]
    [StringLength(200, ErrorMessage = "عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد")]
    string Title,

    [StringLength(1000, ErrorMessage = "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد")]
    string Description,

    [Required(ErrorMessage = "نوع نظرسنجی الزامی است")]
    [StringLength(50)]
    string SurveyType,

    [StringLength(50)]
    string TargetRole,

    [Required(ErrorMessage = "تاریخ شروع الزامی است")]
    DateTime StartDate,

    [Required(ErrorMessage = "تاریخ پایان الزامی است")]
    DateTime EndDate,

    bool IsAnonymous,

    int ScoreScaleMin,
    int ScoreScaleMax
);

public record UpdateIssueSurveyRequest(
    string? Title,
    string? Description,
    string? SurveyType,
    string? TargetRole,
    DateTime? StartDate,
    DateTime? EndDate,
    bool? IsAnonymous,
    string? Status,
    int? ScoreScaleMin,
    int? ScoreScaleMax
);

public record IssueSurveyResponse(
    int Id,
    string Title,
    string Description,
    string SurveyType,
    string TargetRole,
    string Status,
    DateTime StartDate,
    DateTime EndDate,
    bool IsAnonymous,
    int ScoreScaleMin,
    int ScoreScaleMax,
    int CreatedById,
    string? CreatedByName,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int QuestionCount,
    int ResponseCount
);

public record CreateIssueQuestionRequest(
    [Required(ErrorMessage = "شناسه نظرسنجی الزامی است")]
    int SurveyId,

    int? ItemPoolId,

    [Required(ErrorMessage = "متن گویه الزامی است")]
    [StringLength(500, ErrorMessage = "متن گویه نباید بیشتر از ۵۰۰ کاراکتر باشد")]
    string QuestionText,

    [Required(ErrorMessage = "دسته‌بندی الزامی است")]
    [StringLength(100)]
    string Category,

    [StringLength(100)]
    string? SubCategory,

    [StringLength(50)]
    string? TargetAudience,

    int SortOrder
);

public record UpdateIssueQuestionRequest(
    string? QuestionText,
    string? Category,
    string? SubCategory,
    string? TargetAudience,
    int? SortOrder,
    bool? IsActive
);

public record IssueQuestionResponse(
    int Id,
    int SurveyId,
    int? ItemPoolId,
    string QuestionText,
    string Category,
    string? SubCategory,
    string? TargetAudience,
    int SortOrder,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateIssueItemPoolRequest(
    [Required(ErrorMessage = "متن گویه الزامی است")]
    [StringLength(500)]
    string QuestionText,

    [Required(ErrorMessage = "دسته‌بندی الزامی است")]
    [StringLength(100)]
    string Category,

    [StringLength(100)]
    string? SubCategory,

    [StringLength(50)]
    string? TargetAudience,

    [StringLength(2000)]
    string? SuggestedActions,

    [StringLength(50)]
    string Source
);

public record IssueItemPoolResponse(
    int Id,
    string QuestionText,
    string Category,
    string? SubCategory,
    string? TargetAudience,
    string? SuggestedActions,
    string Source,
    int UsageCount,
    double? AvgScore,
    string Trend,
    bool IsActive,
    DateTime CreatedAt
);

public record SubmitSurveyResponseRequest(
    int SurveyId,
    List<SubmitAnswerItem> Answers,
    string? Comment
);

public record SubmitAnswerItem(
    int QuestionId,
    int Score
);

public record SurveyResponseRecord(
    int Id,
    int SurveyId,
    int QuestionId,
    string QuestionText,
    int? RespondentId,
    string? RespondentRole,
    int? RespondentBranchId,
    int Score,
    DateTime AnsweredAt
);

public record CreateIssueActionRequest(
    int SurveyId,

    int? QuestionId,

    [Required(ErrorMessage = "عنوان اقدام الزامی است")]
    [StringLength(300)]
    string Title,

    [StringLength(2000)]
    string Description,

    [Required(ErrorMessage = "دسته‌بندی الزامی است")]
    [StringLength(100)]
    string Category,

    [StringLength(20)]
    string Priority,

    int? AssignedToId,

    [StringLength(200)]
    string? AssignedTeam,

    DateTime? TargetDate,

    [StringLength(500)]
    string? KpiDefinition
);

public record UpdateIssueActionRequest(
    string? Title,
    string? Description,
    string? Priority,
    string? Status,
    int? AssignedToId,
    string? AssignedTeam,
    DateTime? TargetDate,
    string? KpiDefinition
);

public record IssueActionResponse(
    int Id,
    int SurveyId,
    int? QuestionId,
    string? QuestionText,
    string Category,
    string Title,
    string Description,
    string Priority,
    string Status,
    int? AssignedToId,
    string? AssignedToName,
    string? AssignedTeam,
    DateTime? TargetDate,
    DateTime? CompletedAt,
    string? KpiDefinition,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int UpdateCount
);

public record CreateActionUpdateRequest(
    [Required(ErrorMessage = "وضعیت جدید الزامی است")]
    [StringLength(20)]
    string NewStatus,

    [StringLength(1000)]
    string Note,

    int? ProgressPercent
);

public record IssueActionUpdateResponse(
    int Id,
    int ActionId,
    int UpdatedById,
    string? UpdatedByName,
    string PreviousStatus,
    string NewStatus,
    string Note,
    int? ProgressPercent,
    DateTime CreatedAt
);

public record SurveyAnalyticsResponse(
    int SurveyId,
    string Title,
    int TotalRespondents,
    int TotalQuestions,
    double OverallAverage,
    List<CategoryAnalytics> CategoryBreakdown,
    List<QuestionAnalytics> TopCriticalIssues,
    List<QuestionAnalytics> TopStrengths
);

public record CategoryAnalytics(
    string Category,
    double AverageScore,
    int QuestionCount,
    string Severity
);

public record QuestionAnalytics(
    int QuestionId,
    string QuestionText,
    string Category,
    double AverageScore,
    double StandardDeviation,
    int ResponseCount,
    string Severity
);

public record SurveyTrendResponse(
    int SurveyId,
    string Title,
    DateTime ConductedAt,
    List<CategoryTrend> CategoryTrends
);

public record CategoryTrend(
    string Category,
    double AverageScore,
    int QuestionCount
);

public record IssueDashboardSummaryResponse(
    int ActiveSurveys,
    int OpenActions,
    int CompletedActions,
    double CriticalIssuePercentage,
    double ImprovingTrendPercentage
);

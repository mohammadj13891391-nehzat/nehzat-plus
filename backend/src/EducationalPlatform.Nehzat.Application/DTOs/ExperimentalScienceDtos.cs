using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    // ===== ExperimentTopic DTOs =====
    public record CreateExperimentTopicRequest(
        [Required] string Title,
        string Description = "",
        string DifficultyLevel = "beginner",
        string? IconUrl = null,
        int SortOrder = 0
    );

    public record UpdateExperimentTopicRequest(
        string? Title = null,
        string? Description = null,
        string? DifficultyLevel = null,
        string? IconUrl = null,
        int? SortOrder = null
    );

    public record ExperimentTopicDto(
        int Id,
        string Title,
        string Description,
        string DifficultyLevel,
        string? IconUrl,
        int SortOrder,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== Experiment DTOs =====
    public record CreateExperimentRequest(
        [Required] int TopicId,
        [Required] string Title,
        string Objective = "",
        string MaterialsNeeded = "",
        string Procedure = "",
        string ExpectedResult = "",
        string Content = "",
        string DifficultyLevel = "beginner",
        int EstimatedMinutes = 0,
        int SortOrder = 0,
        string? VideoUrl = null
    );

    public record UpdateExperimentRequest(
        int? TopicId = null,
        string? Title = null,
        string? Objective = null,
        string? MaterialsNeeded = null,
        string? Procedure = null,
        string? ExpectedResult = null,
        string? Content = null,
        string? DifficultyLevel = null,
        int? EstimatedMinutes = null,
        int? SortOrder = null,
        string? VideoUrl = null
    );

    public record ExperimentDto(
        int Id,
        int TopicId,
        string Title,
        string Objective,
        string MaterialsNeeded,
        string Procedure,
        string ExpectedResult,
        string Content,
        string DifficultyLevel,
        int EstimatedMinutes,
        int SortOrder,
        string? VideoUrl,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== ExperimentAnalysis DTOs =====
    public record CreateExperimentAnalysisRequest(
        [Required] int ExperimentId,
        [Required] string Title,
        string Content = "",
        string AnalysisType = "scientific",
        string DifficultyLevel = "beginner",
        int SortOrder = 0
    );

    public record UpdateExperimentAnalysisRequest(
        string? Title = null,
        string? Content = null,
        string? AnalysisType = null,
        string? DifficultyLevel = null,
        int? SortOrder = null
    );

    public record ExperimentAnalysisDto(
        int Id,
        int ExperimentId,
        string Title,
        string Content,
        string AnalysisType,
        string DifficultyLevel,
        int SortOrder,
        DateTime CreatedAt
    );

    // ===== ExperimentQuestion DTOs =====
    public record CreateExperimentQuestionRequest(
        [Required] int ExperimentId,
        [Required] string QuestionText,
        string QuestionType = "multiple-choice",
        string OptionsJson = "[]",
        int Points = 10,
        int DifficultyRating = 1,
        string? TopicTag = null,
        string CorrectAnswerJson = ""
    );

    public record ExperimentQuestionDto(
        int Id,
        int ExperimentId,
        string QuestionText,
        string QuestionType,
        string OptionsJson,
        int Points,
        int DifficultyRating,
        string? TopicTag,
        string CorrectAnswerJson,
        DateTime CreatedAt
    );

    // ===== ExperimentAttempt DTOs =====
    public record SubmitExperimentAttemptRequest(
        [Required] int StudentId,
        [Required] int QuestionId,
        [Required] string SelectedAnswer,
        int AttemptNumber = 1,
        int TimeSpentSeconds = 0
    );

    public record ExperimentAttemptDto(
        int Id,
        int StudentId,
        int QuestionId,
        string SelectedAnswer,
        bool IsCorrect,
        int AttemptNumber,
        int TimeSpentSeconds,
        DateTime AttemptedAt
    );

    // ===== ExperimentProgress DTOs =====
    public record UpdateExperimentProgressRequest(
        [Required] int StudentId,
        [Required] int ExperimentId,
        string Status = "not_started",
        double Score = 0,
        int TimeSpentMinutes = 0,
        int AttemptCount = 0
    );

    public record ExperimentProgressDto(
        int Id,
        int StudentId,
        int ExperimentId,
        string Status,
        double Score,
        int TimeSpentMinutes,
        int AttemptCount,
        DateTime? CompletedAt,
        DateTime LastActivityAt
    );
}

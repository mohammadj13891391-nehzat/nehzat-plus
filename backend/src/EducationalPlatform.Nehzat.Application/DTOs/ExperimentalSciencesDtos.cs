using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    // ===== Phase DTOs =====
    public record CreatePhaseRequest(
        [Required] string Title,
        string Description = "",
        int Order = 0,
        string Icon = ""
    );

    public record UpdatePhaseRequest(
        string? Title = null,
        string? Description = null,
        int? Order = null,
        string? Icon = null
    );

    public record PhaseDto(
        int Id,
        string Title,
        string Description,
        int Order,
        string Icon,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== Topic DTOs =====
    public record CreateTopicRequest(
        [Required] int PhaseId,
        [Required] string Title,
        string Description = "",
        int Order = 0,
        string DifficultyLevel = "child",
        string Icon = ""
    );

    public record UpdateTopicRequest(
        int? PhaseId = null,
        string? Title = null,
        string? Description = null,
        int? Order = null,
        string? DifficultyLevel = null,
        string? Icon = null
    );

    public record TopicDto(
        int Id,
        int PhaseId,
        string Title,
        string Description,
        int Order,
        string DifficultyLevel,
        string Icon,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== Lesson DTOs =====
    public record CreateLessonRequest(
        [Required] int TopicId,
        [Required] string Title,
        string Content = "",
        string VideoUrl = "",
        int Order = 0,
        int EstimatedMinutes = 0
    );

    public record UpdateLessonRequest(
        int? TopicId = null,
        string? Title = null,
        string? Content = null,
        string? VideoUrl = null,
        int? Order = null,
        int? EstimatedMinutes = null
    );

    public record LessonDto(
        int Id,
        int TopicId,
        string Title,
        string Content,
        string VideoUrl,
        int Order,
        int EstimatedMinutes,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== Experiment DTOs =====
    public record CreateExperimentRequest(
        [Required] int LessonId,
        [Required] string Title,
        string Materials = "",
        string Steps = "",
        string ExpectedResult = "",
        string SafetyNotes = "",
        int Order = 0,
        int EstimatedMinutes = 0
    );

    public record UpdateExperimentRequest(
        int? LessonId = null,
        string? Title = null,
        string? Materials = null,
        string? Steps = null,
        string? ExpectedResult = null,
        string? SafetyNotes = null,
        int? Order = null,
        int? EstimatedMinutes = null
    );

    public record ExperimentDto(
        int Id,
        int LessonId,
        string Title,
        string Materials,
        string Steps,
        string ExpectedResult,
        string SafetyNotes,
        int Order,
        int EstimatedMinutes,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== Quiz DTOs =====
    public record CreateExpSciQuizRequest(
        [Required] int LessonId,
        [Required] string Title,
        int PassingScore = 70,
        int TimeLimitMinutes = 10
    );

    public record UpdateExpSciQuizRequest(
        int? LessonId = null,
        string? Title = null,
        int? PassingScore = null,
        int? TimeLimitMinutes = null
    );

    public record ExpSciQuizDto(
        int Id,
        int LessonId,
        string Title,
        int PassingScore,
        int TimeLimitMinutes,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== QuizQuestion DTOs =====
    public record CreateExpSciQuizQuestionRequest(
        [Required] int QuizId,
        [Required] string QuestionText,
        string Options = "[]",
        int CorrectAnswer = 0,
        string Explanation = "",
        int Order = 0,
        int Points = 10
    );

    public record UpdateExpSciQuizQuestionRequest(
        int? QuizId = null,
        string? QuestionText = null,
        string? Options = null,
        int? CorrectAnswer = null,
        string? Explanation = null,
        int? Order = null,
        int? Points = null
    );

    public record ExpSciQuizQuestionDto(
        int Id,
        int QuizId,
        string QuestionText,
        string Options,
        int CorrectAnswer,
        string Explanation,
        int Order,
        int Points,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    // ===== StudentProgress DTOs =====
    public record CreateStudentProgressRequest(
        [Required] int StudentId,
        [Required] int TopicId,
        string Status = "notStarted",
        double Score = 0,
        int CompletedLessons = 0,
        int TotalLessons = 0,
        DateTime? CompletedAt = null
    );

    public record UpdateStudentProgressRequest(
        int? StudentId = null,
        int? TopicId = null,
        string? Status = null,
        double? Score = null,
        int? CompletedLessons = null,
        int? TotalLessons = null,
        DateTime? CompletedAt = null
    );

    public record StudentProgressDto(
        int Id,
        int StudentId,
        int TopicId,
        string Status,
        double Score,
        int CompletedLessons,
        int TotalLessons,
        DateTime? CompletedAt,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}

using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    // ===== LearningPath DTOs =====
    public record CreateLearningPathRequest(
        [Required] string Title,
        string? Description = null,
        [Required] string Slug = "",
        int AgeRangeMin = 5,
        int AgeRangeMax = 50,
        string? IconUrl = null,
        string? ColorHex = null,
        int SortOrder = 0,
        bool IsActive = true
    );

    public record UpdateLearningPathRequest(
        string? Title = null,
        string? Description = null,
        string? Slug = null,
        int? AgeRangeMin = null,
        int? AgeRangeMax = null,
        string? IconUrl = null,
        string? ColorHex = null,
        int? SortOrder = null,
        bool? IsActive = null
    );

    // ===== LearningLevel DTOs =====
    public record CreateLearningLevelRequest(
        [Required] int LearningPathId,
        [Required] string Title,
        string? Description = null,
        int LevelNumber = 1,
        string DifficultyLabel = "مبتدی",
        int SortOrder = 0
    );

    public record UpdateLearningLevelRequest(
        string? Title = null,
        string? Description = null,
        int? LevelNumber = null,
        string? DifficultyLabel = null,
        int? SortOrder = null
    );

    // ===== StudyModule DTOs =====
    public record CreateStudyModuleRequest(
        [Required] int LearningLevelId,
        [Required] string Title,
        string? Description = null,
        decimal? EstimatedHours = null,
        string? LearningObjectives = null,
        int SortOrder = 0
    );

    public record UpdateStudyModuleRequest(
        string? Title = null,
        string? Description = null,
        decimal? EstimatedHours = null,
        string? LearningObjectives = null,
        int? SortOrder = null
    );

    // ===== StudyLesson DTOs =====
    public record CreateStudyLessonRequest(
        [Required] int StudyModuleId,
        [Required] string Title,
        string? Description = null,
        int EstimatedMinutes = 15,
        int? PoemId = null,
        int SortOrder = 0
    );

    public record UpdateStudyLessonRequest(
        string? Title = null,
        string? Description = null,
        int? EstimatedMinutes = null,
        int? PoemId = null,
        int? SortOrder = null
    );

    // ===== LessonContentBlock DTOs =====
    public record CreateContentBlockRequest(
        [Required] int StudyLessonId,
        [Required] string BlockType,
        string? Title = null,
        string Content = "",
        int SortOrder = 0
    );

    public record UpdateContentBlockRequest(
        string? BlockType = null,
        string? Title = null,
        string? Content = null,
        int? SortOrder = null
    );

    // ===== Learning Quiz DTOs =====
    public record CreateLearningQuizRequest(
        [Required] int StudyLessonId,
        [Required] string Title,
        string? Description = null,
        int PassingScore = 70,
        int MaxAttempts = 3,
        int SortOrder = 0
    );

    public record UpdateLearningQuizRequest(
        string? Title = null,
        string? Description = null,
        int? PassingScore = null,
        int? MaxAttempts = null,
        int? SortOrder = null
    );

    // ===== Learning QuizQuestion DTOs =====
    public record CreateLearningQuizQuestionRequest(
        [Required] int QuizId,
        [Required] string QuestionText,
        string QuestionType = "multiple_choice",
        int Points = 1,
        int SortOrder = 0
    );

    public record UpdateLearningQuizQuestionRequest(
        string? QuestionText = null,
        string? QuestionType = null,
        int? Points = null,
        int? SortOrder = null
    );

    // ===== QuizOption DTOs =====
    public record CreateQuizOptionRequest(
        [Required] int QuizQuestionId,
        [Required] string OptionText,
        bool IsCorrect = false,
        int SortOrder = 0
    );

    public record UpdateQuizOptionRequest(
        string? OptionText = null,
        bool? IsCorrect = null,
        int? SortOrder = null
    );

    // ===== Enrollment DTOs =====
    public record EnrollUserRequest(
        [Required] int UserId,
        [Required] int LearningPathId
    );

    // ===== Quiz Submission =====
    public record SubmitQuizRequest(
        [Required] int QuizId,
        [Required] int UserId,
        List<AnswerDto> Answers
    );

    public record AnswerDto(
        int QuestionId,
        string Answer
    );

    // ===== Dashboard / Tree DTOs =====
    public record LearningPathTreeDto(
        LearningPathDto Path,
        List<LearningLevelTreeDto> Levels
    );

    public record LearningPathDto(
        int Id,
        string Title,
        string? Description,
        string Slug,
        int AgeRangeMin,
        int AgeRangeMax,
        string? IconUrl,
        string? ColorHex,
        bool IsActive,
        int SortOrder,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );

    public record LearningLevelTreeDto(
        int Id,
        int LearningPathId,
        string Title,
        string? Description,
        int LevelNumber,
        string DifficultyLabel,
        int SortOrder,
        List<StudyModuleTreeDto> Modules
    );

    public record StudyModuleTreeDto(
        int Id,
        int LearningLevelId,
        string Title,
        string? Description,
        decimal? EstimatedHours,
        int SortOrder,
        List<StudyLessonSummaryDto> Lessons
    );

    public record StudyLessonSummaryDto(
        int Id,
        int StudyModuleId,
        string Title,
        string? Description,
        int EstimatedMinutes,
        int SortOrder
    );

    public record UserDashboardDto(
        List<UserEnrollmentDto> Enrollments
    );

    public record UserEnrollmentDto(
        int Id,
        int UserId,
        int LearningPathId,
        string LearningPathTitle,
        string Status,
        DateTime EnrolledAt,
        DateTime? CompletedAt,
        int CompletedLessons,
        int TotalLessons,
        double AverageScore
    );

    public record QuizResultDto(
        int AttemptId,
        int QuizId,
        int Score,
        int MaxScore,
        bool Passed,
        int AttemptNumber,
        DateTime StartedAt,
        DateTime? CompletedAt
    );
}

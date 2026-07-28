using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    // ===== Arabic Poet DTOs =====
    public record CreateArabicPoetRequest(
        [Required] string Name,
        string? Nasab = null,
        string? PenName = null,
        DateTime? BirthDate = null,
        DateTime? DeathDate = null,
        string? BirthPlace = null,
        string? DeathPlace = null,
        string? Era = null,
        int Century = 0,
        string? Biography = null,
        string? DifficultyLevel = "beginner",
        string? Level = null,
        string? AgeRange = null,
        int SortOrder = 0
    );

    public record UpdateArabicPoetRequest(
        string? Name = null,
        string? Nasab = null,
        string? PenName = null,
        DateTime? BirthDate = null,
        DateTime? DeathDate = null,
        string? BirthPlace = null,
        string? DeathPlace = null,
        string? Era = null,
        int? Century = null,
        string? Biography = null,
        string? DifficultyLevel = null,
        string? Level = null,
        string? AgeRange = null,
        int? SortOrder = null
    );

    // ===== Arabic Poem DTOs =====
    public record CreateArabicPoemRequest(
        [Required] int PoetId,
        [Required] string Title,
        string? Bahr = null,
        string? Qafiya = null,
        string? Genre = null,
        string Content = "",
        string? Translation = null,
        string? Interpretation = null,
        string? SourceBook = null,
        int VerseCount = 0,
        string? DifficultyLevel = "beginner",
        string? Theme = null,
        string? ExerciseData = null,
        string? PrerequisiteIds = null,
        int SortOrder = 0
    );

    public record UpdateArabicPoemRequest(
        int? PoetId = null,
        string? Title = null,
        string? Bahr = null,
        string? Qafiya = null,
        string? Genre = null,
        string? Content = null,
        string? Translation = null,
        string? Interpretation = null,
        string? SourceBook = null,
        int? VerseCount = null,
        string? DifficultyLevel = null,
        string? Theme = null,
        string? ExerciseData = null,
        string? PrerequisiteIds = null,
        int? SortOrder = null
    );

    // ===== Analysis DTOs =====
    public record CreateArabicAnalysisRequest(
        [Required] int PoemId,
        [Required] string Title,
        string Content = "",
        string AnalysisType = "general",
        string? DifficultyLevel = "beginner",
        string? Objectives = null,
        string? QuizData = null,
        int SortOrder = 0
    );

    public record UpdateArabicAnalysisRequest(
        string? Title = null,
        string? Content = null,
        string? AnalysisType = null,
        string? DifficultyLevel = null,
        string? Objectives = null,
        string? QuizData = null,
        int? SortOrder = null
    );

    // ===== Course DTOs =====
    public record CreateArabicCourseRequest(
        [Required] string Title,
        string? Description = null,
        string Level = "beginner",
        string? AgeRange = null,
        int SortOrder = 0,
        string? Icon = null,
        string? Color = null,
        string? PrerequisiteCourseIds = null
    );

    public record UpdateArabicCourseRequest(
        string? Title = null,
        string? Description = null,
        string? Level = null,
        string? AgeRange = null,
        int? SortOrder = null,
        string? Icon = null,
        string? Color = null,
        string? PrerequisiteCourseIds = null
    );

    // ===== Lesson DTOs =====
    public record CreateArabicLessonRequest(
        [Required] int CourseId,
        [Required] string Title,
        string? Description = null,
        string? Objectives = null,
        int? PoemId = null,
        string? Content = null,
        string? ExerciseData = null,
        string? QuizData = null,
        int DurationMinutes = 30,
        int SortOrder = 0,
        string? PrerequisiteLessonIds = null
    );

    public record UpdateArabicLessonRequest(
        string? Title = null,
        string? Description = null,
        string? Objectives = null,
        int? PoemId = null,
        string? Content = null,
        string? ExerciseData = null,
        string? QuizData = null,
        int? DurationMinutes = null,
        int? SortOrder = null,
        string? PrerequisiteLessonIds = null
    );

    // ===== Progress DTOs =====
    public record UpdateArabicProgressRequest(
        [Required] int LessonId,
        string Status = "completed",
        double Score = 0
    );
}

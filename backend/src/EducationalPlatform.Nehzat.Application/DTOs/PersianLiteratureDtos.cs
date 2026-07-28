using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    // ===== Poet DTOs =====
    public record CreatePoetRequest(
        [Required] string Name,
        string? PenName = null,
        DateTime? BirthDate = null,
        DateTime? DeathDate = null,
        string? BirthPlace = null,
        string? DeathPlace = null,
        string? Era = null,
        int Century = 0,
        string? Biography = null,
        string? DifficultyLevel = "beginner",
        int SortOrder = 0
    );

    public record UpdatePoetRequest(
        string? Name = null,
        string? PenName = null,
        DateTime? BirthDate = null,
        DateTime? DeathDate = null,
        string? BirthPlace = null,
        string? DeathPlace = null,
        string? Era = null,
        int? Century = null,
        string? Biography = null,
        string? DifficultyLevel = null,
        int? SortOrder = null
    );

    // ===== Poem DTOs =====
    public record CreatePoemRequest(
        [Required] int PoetId,
        [Required] string Title,
        string? Genre = null,
        string Content = "",
        string? Translation = null,
        string? Interpretation = null,
        string? SourceBook = null,
        int VerseCount = 0,
        string? DifficultyLevel = "beginner",
        string? Theme = null,
        int SortOrder = 0
    );

    public record UpdatePoemRequest(
        int? PoetId = null,
        string? Title = null,
        string? Genre = null,
        string? Content = null,
        string? Translation = null,
        string? Interpretation = null,
        string? SourceBook = null,
        int? VerseCount = null,
        string? DifficultyLevel = null,
        string? Theme = null,
        int? SortOrder = null
    );

    // ===== Analysis DTOs =====
    public record CreateAnalysisRequest(
        [Required] int PoemId,
        [Required] string Title,
        string Content = "",
        string AnalysisType = "general",
        string? DifficultyLevel = "beginner",
        int SortOrder = 0
    );

    public record UpdateAnalysisRequest(
        string? Title = null,
        string? Content = null,
        string? AnalysisType = null,
        string? DifficultyLevel = null,
        int? SortOrder = null
    );
}

using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateQuranCurriculumRequest(
        [Required] string Title,
        [Required] int StartSurah,
        [Required] int EndSurah,
        [Required] int TeacherId,
        string Description = "",
        string Language = "fa",
        int TotalAyahs = 0,
        int EstimatedDays = 0,
        string DifficultyLevel = "beginner",
        string LearningObjectives = ""
    );

    public record UpdateQuranCurriculumRequest(
        string? Title = null,
        string? Description = null,
        string? Language = null,
        int? StartSurah = null,
        int? EndSurah = null,
        int? TotalAyahs = null,
        int? EstimatedDays = null,
        string? DifficultyLevel = null,
        string? LearningObjectives = null,
        int? TeacherId = null
    );

    public record QuranCurriculumDto(
        int Id,
        string Title,
        string Description,
        string Language,
        int StartSurah,
        int EndSurah,
        int TotalAyahs,
        int EstimatedDays,
        string DifficultyLevel,
        string LearningObjectives,
        int TeacherId,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
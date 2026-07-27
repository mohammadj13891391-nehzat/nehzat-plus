using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateRecitationLevelRequest(
        [Required] int LevelNumber,
        [Required] string Name,
        string Description = "",
        string Criteria = "",
        string ColorCode = "",
        int PointsRequired = 0,
        int EstimatedWeeks = 0
    );

    public record UpdateRecitationLevelRequest(
        int? LevelNumber = null,
        string? Name = null,
        string? Description = null,
        string? Criteria = null,
        string? ColorCode = null,
        int? PointsRequired = null,
        int? EstimatedWeeks = null
    );

    public record RecitationLevelDto(
        int Id,
        int LevelNumber,
        string Name,
        string Description,
        string Criteria,
        string ColorCode,
        int PointsRequired,
        int EstimatedWeeks,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
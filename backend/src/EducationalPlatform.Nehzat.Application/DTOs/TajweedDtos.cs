using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateTajweedRuleRequest(
        [Required] string RuleCode,
        [Required] string Name,
        [Required] string Description,
        string ExampleText = "",
        int RuleLevel = 1,
        string AffectedRecitationType = "",
        string Guidelines = "",
        int SurahId = 0,
        int AyahNumber = 0
    );

    public record UpdateTajweedRuleRequest(
        string? RuleCode = null,
        string? Name = null,
        string? Description = null,
        string? ExampleText = null,
        int? RuleLevel = null,
        string? AffectedRecitationType = null,
        string? Guidelines = null,
        int? SurahId = null,
        int? AyahNumber = null
    );

    public record TajweedRuleDto(
        int Id,
        string RuleCode,
        string Name,
        string Description,
        string ExampleText,
        int RuleLevel,
        string AffectedRecitationType,
        string Guidelines,
        int SurahId,
        int AyahNumber,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
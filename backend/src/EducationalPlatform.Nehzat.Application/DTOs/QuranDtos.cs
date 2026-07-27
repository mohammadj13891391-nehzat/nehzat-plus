using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateSurahRequest(
        [Required] string Number,
        [Required] string Name,
        string TranslatedName = "",
        string RevelationPlace = "",
        int RevelationOrder = 0,
        int TotalAyahs = 0,
        string Type = "",
        string Bismillah = "",
        int HizbBegin = 0,
        int HizbEnd = 0,
        int JuzBegin = 0,
        int JuzEnd = 0,
        string Ruqyah = "",
        string Summary = ""
    );

    public record UpdateSurahRequest(
        string? Number = null,
        string? Name = null,
        string? TranslatedName = null,
        string? RevelationPlace = null,
        int? RevelationOrder = null,
        int? TotalAyahs = null,
        string? Type = null,
        string? Bismillah = null,
        int? HizbBegin = null,
        int? HizbEnd = null,
        int? JuzBegin = null,
        int? JuzEnd = null,
        string? Ruqyah = null,
        string? Summary = null
    );

    public record SurahDto(
        int Id,
        string Number,
        string Name,
        string TranslatedName,
        string RevelationPlace,
        int RevelationOrder,
        int TotalAyahs,
        string Type,
        string Bismillah,
        int HizbBegin,
        int HizbEnd,
        int JuzBegin,
        int JuzEnd,
        string Ruqyah,
        string Summary,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs
{
    public record CreateAyahRequest(
        [Required] int SurahId,
        [Required] int VerseNumber,
        [Required] string Text,
        string Translation = "",
        string Transliteration = "",
        string Footnote = "",
        string Ruku = "",
        string Sajda = "",
        int AyaNumber = 0,
        string Juz = "",
        string HizbQuarter = ""
    );

    public record UpdateAyahRequest(
        int? SurahId = null,
        int? VerseNumber = null,
        string? Text = null,
        string? Translation = null,
        string? Transliteration = null,
        string? Footnote = null,
        string? Ruku = null,
        string? Sajda = null,
        int? AyaNumber = null,
        string? Juz = null,
        string? HizbQuarter = null
    );

    public record AyahDto(
        int Id,
        int SurahId,
        int VerseNumber,
        string Text,
        string Translation,
        string Transliteration,
        string Footnote,
        string Ruku,
        string Sajda,
        int AyaNumber,
        string Juz,
        string HizbQuarter,
        DateTime CreatedAt,
        DateTime UpdatedAt
    );
}
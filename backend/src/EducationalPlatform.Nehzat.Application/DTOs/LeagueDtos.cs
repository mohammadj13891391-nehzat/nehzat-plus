using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateLeagueRequest(
    [Required(ErrorMessage = "نام لیگ الزامی است")]
    [StringLength(200)]
    string Name,

    [StringLength(5000)]
    string? Description,

    [Required(ErrorMessage = "فصل لیگ الزامی است")]
    [StringLength(100)]
    string Season,

    [Required]
    DateTime StartDate,

    [Required]
    DateTime EndDate,

    int? CourseId
);

public record UpdateLeagueRequest(
    [StringLength(200)]
    string? Name,

    [StringLength(5000)]
    string? Description,

    [StringLength(100)]
    string? Season,

    DateTime? StartDate,

    DateTime? EndDate,

    [RegularExpression(@"^(active|completed)$", ErrorMessage = "وضعیت معتبر نیست")]
    string? Status,

    int? CourseId
);

public record LeagueResponse(
    int Id,
    string Name,
    string? Description,
    string Season,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    int? CourseId,
    string? CourseName,
    int ParticipantCount,
    DateTime CreatedAt
);

public record LeagueRankingResponse(
    int Id,
    int StudentId,
    string StudentName,
    decimal Score,
    int Rank,
    int? PreviousRank,
    string Trend,
    DateTime LastUpdated
);

public record LeagueDetailResponse(
    int Id,
    string Name,
    string? Description,
    string Season,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    int? CourseId,
    string? CourseName,
    List<LeagueRankingResponse> Rankings,
    DateTime CreatedAt
);

public record UpdateLeagueRankingRequest(
    [Required]
    int StudentId,

    [Range(0, 100)]
    decimal Score,

    int? PreviousRank,

    [RegularExpression(@"^(up|down|stable)$")]
    string? Trend
);

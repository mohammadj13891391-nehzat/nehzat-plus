using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateCompetitionRequest(
    [Required(ErrorMessage = "عنوان الزامی است")]
    [StringLength(200)]
    string Title,

    [StringLength(5000)]
    string? Description,

    [RegularExpression(@"^(assignment_based|assessment_based|mixed)$", ErrorMessage = "نوع مسابقه معتبر نیست")]
    string Type,

    [Required]
    DateTime StartDate,

    [Required]
    DateTime EndDate,

    int? CourseId
);

public record UpdateCompetitionRequest(
    [StringLength(200)]
    string? Title,

    [StringLength(5000)]
    string? Description,

    [RegularExpression(@"^(assignment_based|assessment_based|mixed)$", ErrorMessage = "نوع مسابقه معتبر نیست")]
    string? Type,

    DateTime? StartDate,

    DateTime? EndDate,

    [RegularExpression(@"^(draft|published|in_progress|completed|cancelled)$", ErrorMessage = "وضعیت معتبر نیست")]
    string? Status,

    int? CourseId
);

public record CompetitionResponse(
    int Id,
    string Title,
    string? Description,
    string Type,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    int? CourseId,
    string? CourseName,
    int ParticipantCount,
    DateTime CreatedAt
);

public record CompetitionDetailResponse(
    int Id,
    string Title,
    string? Description,
    string Type,
    DateTime StartDate,
    DateTime EndDate,
    string Status,
    int? CourseId,
    string? CourseName,
    List<CompetitionParticipantResponse> Participants,
    DateTime CreatedAt
);

public record CompetitionParticipantResponse(
    int Id,
    int StudentId,
    string StudentName,
    decimal? Score,
    int? Rank,
    DateTime? CompletedAt
);

public record RegisterParticipantRequest(
    [Required]
    int StudentId
);

public record UpdateParticipantScoreRequest(
    [Range(0, 100)]
    decimal? Score,

    int? Rank,

    DateTime? CompletedAt
);

public record CompetitionResultResponse(
    int CompetitionId,
    string CompetitionTitle,
    List<CompetitionParticipantResponse> Rankings
);

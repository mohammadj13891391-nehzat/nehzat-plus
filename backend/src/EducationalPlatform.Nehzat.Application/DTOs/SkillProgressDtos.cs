using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record AgeGroupDto(
    int Id,
    string Key,
    string Name,
    string? Description,
    int MinAge,
    int MaxAge,
    int SortOrder
);

public record CreateAgeGroupRequest(
    [Required][StringLength(50)] string Key,
    [Required][StringLength(100)] string Name,
    [StringLength(500)] string? Description,
    int MinAge,
    int MaxAge,
    int SortOrder = 0
);

public record StudentSkillProgressDto(
    int Id,
    int StudentId,
    int ObjectiveId,
    string ObjectiveTitle,
    int? RingId,
    string ProficiencyLevel,
    int Score,
    DateTime? LastAssessedAt
);

public record UpdateSkillProgressRequest(
    string? ProficiencyLevel,
    int? Score,
    DateTime? LastAssessedAt
);

// Phase 2.3 — Level Transition: summary DTOs
public record ProgressSummaryDto(
    int TotalObjectives,
    int MasteredCount,
    int AchievedCount,
    int InProgressCount,
    int NotStartedCount,
    int AverageScore
);

public record SubjectAreaProgressDto(
    int SubjectAreaId,
    string SubjectAreaTitle,
    string SubjectAreaKey,
    double AverageScore,
    int MasteredCount,
    int TotalObjectives
);

public record StudentProgressSummaryDto(
    int StudentId,
    ProgressSummaryDto Summary,
    List<SubjectAreaProgressDto> SubjectAreas
);

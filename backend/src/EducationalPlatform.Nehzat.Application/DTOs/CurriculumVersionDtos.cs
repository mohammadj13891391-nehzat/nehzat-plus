using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateCurriculumVersionRequest(
    [Required][StringLength(100)] string Key,
    [Required][StringLength(50)] string VersionNumber,
    [StringLength(500)] string? Description,
    string Status = "draft",
    DateTime? ValidFrom = null,
    DateTime? ValidTo = null
);

public record UpdateCurriculumVersionRequest(
    [StringLength(50)] string? VersionNumber,
    [StringLength(500)] string? Description,
    string? Status,
    DateTime? ValidFrom,
    DateTime? ValidTo
);

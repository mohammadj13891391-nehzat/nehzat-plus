using System.ComponentModel.DataAnnotations;

namespace EducationalPlatform.Nehzat.Application.DTOs;

public record CreateMonthlyBookletRequest(
    [Required] int StudentId,
    [Required] int Month,
    [Required] int Year,
    [Required][StringLength(200)] string Title,
    [Required] string Content,
    int? CreatedByUserId = null
);

public record UpdateMonthlyBookletRequest(
    [StringLength(200)] string? Title,
    string? Content,
    string? Status
);

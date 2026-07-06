using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_evaluators")]
public class Evaluator
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Username { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(255)")]
    public string? PasswordHash { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string FirstName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string LastName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string Email { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string? PhoneNumber { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string? Expertise { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string AssignedMadrasahIds { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string? NationalCode { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    public int? BranchId { get; set; }

    [ForeignKey(nameof(BranchId))]
    public Branch? Branch { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

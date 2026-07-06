using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Username { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(255)")]
    public string? PasswordHash { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? FirstName { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? LastName { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? Email { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string? PhoneNumber { get; set; }

    [Column(TypeName = "nvarchar(255)")]
    public string? ImageUrl { get; set; }

    public int? StudentId { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string ApprovalStatus { get; set; } = "pending";

    [Column(TypeName = "nvarchar(50)")]
    public string UserType { get; set; } = "trainee";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(StudentId))]
    public Student? Student { get; set; }
}

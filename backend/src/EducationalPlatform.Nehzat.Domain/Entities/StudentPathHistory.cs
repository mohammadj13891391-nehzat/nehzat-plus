using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_student_path_history")]
public class StudentPathHistory
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; } = null!;

    public int ChangedByUserId { get; set; }

    [ForeignKey(nameof(ChangedByUserId))]
    public User ChangedByUser { get; set; } = null!;

    [Column(TypeName = "nvarchar(20)")]
    public string? PreviousStage { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string? NewStage { get; set; }

    public int? PreviousFinalizedPathId { get; set; }

    public int? NewFinalizedPathId { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? Reason { get; set; }

    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}

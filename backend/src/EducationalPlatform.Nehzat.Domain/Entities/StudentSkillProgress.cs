using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_student_skill_progress")]
public class StudentSkillProgress
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; } = null!;

    public int ObjectiveId { get; set; }

    [ForeignKey(nameof(ObjectiveId))]
    public CurriculumObjective Objective { get; set; } = null!;

    public int? RingId { get; set; }

    [ForeignKey(nameof(RingId))]
    public Ring? Ring { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string ProficiencyLevel { get; set; } = "not_started";

    public int Score { get; set; } = 0;

    [Column(TypeName = "date")]
    public DateTime? LastAssessedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_student_path_selections")]
public class StudentPathSelection
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; } = null!;

    public int HijriSelectionYear { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Stage { get; set; } = "ranking";

    public int? FinalizedPathId { get; set; }

    [ForeignKey(nameof(FinalizedPathId))]
    public SpiritualPath? FinalizedPath { get; set; }

    public DateTime SelectedAt { get; set; } = DateTime.UtcNow;

    public DateTime? FinalizedAt { get; set; }

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StudentPathRanking> Rankings { get; set; } = new List<StudentPathRanking>();
}

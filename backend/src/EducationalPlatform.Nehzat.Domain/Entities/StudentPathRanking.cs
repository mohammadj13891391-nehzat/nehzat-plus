using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_student_path_rankings")]
public class StudentPathRanking
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SelectionId { get; set; }

    [ForeignKey(nameof(SelectionId))]
    public StudentPathSelection Selection { get; set; } = null!;

    public int PathId { get; set; }

    [ForeignKey(nameof(PathId))]
    public SpiritualPath Path { get; set; } = null!;

    public int RankOrdinal { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

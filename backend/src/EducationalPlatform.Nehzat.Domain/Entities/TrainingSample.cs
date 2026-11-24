using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_training_samples")]
public class TrainingSample
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [MaxLength(500)]
    public string AudioPath { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string Text { get; set; } = string.Empty;

    [MaxLength(200)]
    public string CoachName { get; set; } = string.Empty;

    public int? CoachId { get; set; }

    public int? DurationSec { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

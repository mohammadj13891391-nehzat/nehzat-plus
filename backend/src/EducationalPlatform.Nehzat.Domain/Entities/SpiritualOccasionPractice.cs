using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_spiritual_occasion_practices")]
public class SpiritualOccasionPractice
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int OccasionId { get; set; }

    [ForeignKey(nameof(OccasionId))]
    public SpiritualOccasion Occasion { get; set; } = null!;

    public int PracticeItemId { get; set; }

    [ForeignKey(nameof(PracticeItemId))]
    public SpiritualPracticeItem PracticeItem { get; set; } = null!;

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

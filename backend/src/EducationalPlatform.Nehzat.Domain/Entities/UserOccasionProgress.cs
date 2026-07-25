using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_user_occasion_progress")]
public class UserOccasionProgress
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int UserId { get; set; }

    [ForeignKey(nameof(UserId))]
    public User User { get; set; } = null!;

    public int OccasionId { get; set; }

    [ForeignKey(nameof(OccasionId))]
    public SpiritualOccasion Occasion { get; set; } = null!;

    public int PracticeItemId { get; set; }

    [ForeignKey(nameof(PracticeItemId))]
    public SpiritualPracticeItem PracticeItem { get; set; } = null!;

    public int HijriYear { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAt { get; set; }

    [Column(TypeName = "text")]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

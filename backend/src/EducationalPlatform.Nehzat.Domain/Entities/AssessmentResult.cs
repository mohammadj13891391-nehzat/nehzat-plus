using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_assessment_results")]
public class AssessmentResult
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "date")]
    public DateTime CompletedAt { get; set; }

    public int Score { get; set; } = 0;

    public int MaxPossibleScore { get; set; } = 0;

    public double Percentage { get; set; } = 0;

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "completed";

    [Column(TypeName = "text")]
    public string? AnswersJson { get; set; }

    [Column(TypeName = "text")]
    public string? Feedback { get; set; }

    public int TimeSpentMinutes { get; set; } = 0;

    public int AssessmentId { get; set; }

    [ForeignKey(nameof(AssessmentId))]
    public Assessment Assessment { get; set; } = null!;

    public int StudentId { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student Student { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

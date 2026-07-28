using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math;

[Table("Nehzat_math_progress")]
public class MathProgress
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int MathLessonId { get; set; }

    public int? MathQuestionId { get; set; }

    public bool IsCompleted { get; set; }

    public int? Score { get; set; }

    public int AttemptCount { get; set; } = 1;

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    [ForeignKey(nameof(StudentId))]
    public virtual User Student { get; set; } = null!;

    [JsonIgnore]
    [ForeignKey(nameof(MathLessonId))]
    public MathLesson Lesson { get; set; } = null!;

    [JsonIgnore]
    [ForeignKey(nameof(MathQuestionId))]
    public MathQuestion? Question { get; set; }
}

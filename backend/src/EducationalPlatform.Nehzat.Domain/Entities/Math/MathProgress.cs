using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math
{
    [Table("Nehzat_math_progress")]
    public class MathProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int StudentId { get; set; }

        [ForeignKey(nameof(StudentId))]
        [JsonIgnore]
        public User? Student { get; set; }

        public int MathLessonId { get; set; }

        [ForeignKey(nameof(MathLessonId))]
        [JsonIgnore]
        public MathLesson? Lesson { get; set; }

        public int? MathQuestionId { get; set; }

        [ForeignKey(nameof(MathQuestionId))]
        [JsonIgnore]
        public MathQuestion? Question { get; set; }

        public bool IsCompleted { get; set; }

        public int? Score { get; set; }

        public int AttemptCount { get; set; } = 1;

        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

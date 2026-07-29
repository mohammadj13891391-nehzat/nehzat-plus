using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math
{
    [Table("Nehzat_math_questions")]
    public class MathQuestion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(2000)")]
        public string QuestionText { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string OptionA { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string OptionB { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string OptionC { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string OptionD { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1)")]
        public string CorrectOption { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1000)")]
        public string? Explanation { get; set; }

        public int MathLessonId { get; set; }

        [ForeignKey(nameof(MathLessonId))]
        [JsonIgnore]
        public MathLesson? Lesson { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = string.Empty;

        public int Points { get; set; } = 10;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

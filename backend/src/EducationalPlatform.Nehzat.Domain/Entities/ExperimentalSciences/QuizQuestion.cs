using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    [Table("Nehzat_experimentalsciences_quiz_questions")]
    public class QuizQuestion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int QuizId { get; set; }

        [Column(TypeName = "text")]
        public string QuestionText { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string Options { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string CorrectAnswer { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int Order { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [JsonIgnore]
        public Quiz Quiz { get; set; } = null!;
    }
}

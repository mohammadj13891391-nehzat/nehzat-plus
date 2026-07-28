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

        public int QuizId { get; set; }

        [Column(TypeName = "text")]
        public string QuestionText { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Options { get; set; } = "[]";

        [Column(TypeName = "int")]
        public int CorrectAnswer { get; set; }

        [Column(TypeName = "text")]
        public string Explanation { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int Order { get; set; }

        [Column(TypeName = "int")]
        public int Points { get; set; } = 10;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [ForeignKey("QuizId")]
        public Quiz Quiz { get; set; } = null!;
    }
}

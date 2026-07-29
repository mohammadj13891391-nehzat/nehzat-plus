using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience
{
    [Table("Nehzat_experimental_science_questions")]
    public class ExperimentQuestion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ExperimentId { get; set; }

        [ForeignKey(nameof(ExperimentId))]
        [JsonIgnore]
        public Experiment? Experiment { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string QuestionType { get; set; } = "multiple-choice";

        [Column(TypeName = "text")]
        public string QuestionText { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string OptionsJson { get; set; } = "[]";

        public int Points { get; set; } = 10;

        public int DifficultyRating { get; set; } = 1;

        [Column(TypeName = "nvarchar(100)")]
        public string? TopicTag { get; set; }

        [Column(TypeName = "text")]
        public string CorrectAnswerJson { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

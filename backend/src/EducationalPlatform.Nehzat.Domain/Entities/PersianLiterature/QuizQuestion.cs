using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_quiz_questions")]
    public class QuizQuestion
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int QuizId { get; set; }

        [ForeignKey(nameof(QuizId))]
        [JsonIgnore]
        public Quiz? Quiz { get; set; }

        [Column(TypeName = "text")]
        public string QuestionText { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string QuestionType { get; set; } = "multiple_choice";

        public int Points { get; set; } = 1;
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
    }
}

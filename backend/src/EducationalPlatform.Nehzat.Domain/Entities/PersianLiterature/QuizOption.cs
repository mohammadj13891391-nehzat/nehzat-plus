using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_quiz_options")]
    public class QuizOption
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int QuizQuestionId { get; set; }

        [ForeignKey(nameof(QuizQuestionId))]
        [JsonIgnore]
        public QuizQuestion? QuizQuestion { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string OptionText { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }
        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

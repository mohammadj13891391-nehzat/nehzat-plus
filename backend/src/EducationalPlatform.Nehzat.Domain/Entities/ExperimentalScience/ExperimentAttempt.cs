using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience
{
    [Table("Nehzat_experimental_science_attempts")]
    public class ExperimentAttempt
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int QuestionId { get; set; }

        [Column(TypeName = "text")]
        public string SelectedAnswer { get; set; } = string.Empty;

        public bool IsCorrect { get; set; }

        public int AttemptNumber { get; set; } = 1;

        public int TimeSpentSeconds { get; set; }

        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; } = null!;

        [ForeignKey(nameof(QuestionId))]
        public ExperimentQuestion Question { get; set; } = null!;
    }
}

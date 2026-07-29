using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_user_quiz_attempts")]
    public class UserQuizAttempt
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        [JsonIgnore]
        public User? User { get; set; }

        public int QuizId { get; set; }

        [ForeignKey(nameof(QuizId))]
        [JsonIgnore]
        public Quiz? Quiz { get; set; }

        public int Score { get; set; }
        public int MaxScore { get; set; }
        public bool Passed { get; set; }

        [Column(TypeName = "text")]
        public string? AnswersJson { get; set; }

        public int AttemptNumber { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

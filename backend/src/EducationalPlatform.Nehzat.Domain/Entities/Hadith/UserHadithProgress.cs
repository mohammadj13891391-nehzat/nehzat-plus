using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Domain.Entities.Hadith
{
    [Table("Nehzat_user_hadith_progress")]
    public class UserHadithProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int UserId { get; set; }

        [Column(TypeName = "int")]
        public int HadithId { get; set; }

        [Column(TypeName = "float")]
        public float Stability { get; set; }

        [Column(TypeName = "float")]
        public float Difficulty { get; set; }

        [Column(TypeName = "float")]
        public float Retrievability { get; set; }

        [Column(TypeName = "int")]
        public int RepetitionCount { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string MasteryLevel { get; set; } = string.Empty;

        public DateTime? LastReviewedAt { get; set; }

        public DateTime NextReviewAt { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "int")]
        public int ConsecutiveCorrect { get; set; }

        [Column(TypeName = "int")]
        public int TotalAttempts { get; set; }

        [Column(TypeName = "int")]
        public int CorrectAttempts { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public User User { get; set; } = null!;

        [JsonIgnore]
        public Hadith Hadith { get; set; } = null!;
    }
}

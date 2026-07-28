using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature
{
    [Table("Nehzat_arabic_user_progress")]
    public class ArabicUserProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }

        public int LessonId { get; set; }

        [ForeignKey(nameof(LessonId))]
        public ArabicLesson? Lesson { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "not_started"; // not_started, in_progress, completed

        [Column(TypeName = "float")]
        public double Score { get; set; }

        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }
}

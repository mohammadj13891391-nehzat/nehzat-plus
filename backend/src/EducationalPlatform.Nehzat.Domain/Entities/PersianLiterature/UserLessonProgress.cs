using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_user_lesson_progress")]
    public class UserLessonProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserEnrollmentId { get; set; }

        [ForeignKey(nameof(UserEnrollmentId))]
        [JsonIgnore]
        public UserEnrollment? UserEnrollment { get; set; }

        public int StudyLessonId { get; set; }

        [ForeignKey(nameof(StudyLessonId))]
        [JsonIgnore]
        public StudyLesson? StudyLesson { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "not_started";

        public int? Score { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

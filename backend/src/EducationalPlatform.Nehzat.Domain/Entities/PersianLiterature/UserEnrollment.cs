using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_user_enrollments")]
    public class UserEnrollment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        [JsonIgnore]
        public User? User { get; set; }

        public int LearningPathId { get; set; }

        [ForeignKey(nameof(LearningPathId))]
        [JsonIgnore]
        public LearningPath? LearningPath { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "active";

        public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<UserLessonProgress> LessonProgress { get; set; } = new List<UserLessonProgress>();
    }
}

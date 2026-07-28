using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    public enum ProgressStatus
    {
        NotStarted = 0,
        InProgress = 1,
        Completed = 2
    }

    [Table("Nehzat_experimentalsciences_student_progress")]
    public class StudentProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int TopicId { get; set; }

        [Column(TypeName = "int")]
        public ProgressStatus Status { get; set; } = ProgressStatus.NotStarted;

        [Column(TypeName = "float")]
        public double Score { get; set; }

        [Column(TypeName = "int")]
        public int CompletedLessons { get; set; }

        [Column(TypeName = "int")]
        public int TotalLessons { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        [ForeignKey("TopicId")]
        public Topic Topic { get; set; } = null!;
    }
}

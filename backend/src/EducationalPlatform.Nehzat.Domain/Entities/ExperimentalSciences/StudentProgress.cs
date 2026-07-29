using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    public enum ProgressStatus
    {
        NotStarted,
        InProgress,
        Completed
    }

    [Table("Nehzat_experimentalsciences_student_progress")]
    public class StudentProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int StudentId { get; set; }

        [Column(TypeName = "int")]
        public int TopicId { get; set; }

        [Column(TypeName = "datetime2")]
        public DateTime? CompletedAt { get; set; }

        [Column(TypeName = "decimal(5,2)")]
        public decimal? Score { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public ProgressStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Student Student { get; set; } = null!;

        [JsonIgnore]
        public Topic Topic { get; set; } = null!;
    }
}

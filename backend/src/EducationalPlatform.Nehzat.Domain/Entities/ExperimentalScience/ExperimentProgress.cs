using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience
{
    [Table("Nehzat_experimental_science_progress")]
    public class ExperimentProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int StudentId { get; set; }

        public int ExperimentId { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Status { get; set; } = "not_started";

        [Column(TypeName = "float")]
        public double Score { get; set; }

        public int TimeSpentMinutes { get; set; }

        public int AttemptCount { get; set; }

        public DateTime? CompletedAt { get; set; }

        public DateTime LastActivityAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(StudentId))]
        public Student Student { get; set; } = null!;

        [ForeignKey(nameof(ExperimentId))]
        public Experiment Experiment { get; set; } = null!;
    }
}

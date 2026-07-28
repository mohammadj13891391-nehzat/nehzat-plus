using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    public enum DifficultyLevel
    {
        Child = 0,
        Teen = 1,
        YoungAdult = 2,
        Adult = 3,
        Senior = 4
    }

    [Table("Nehzat_experimentalsciences_topics")]
    public class Topic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int PhaseId { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int Order { get; set; }

        [Column(TypeName = "int")]
        public DifficultyLevel DifficultyLevel { get; set; } = DifficultyLevel.Child;

        [Column(TypeName = "nvarchar(100)")]
        public string Icon { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [ForeignKey("PhaseId")]
        public Phase Phase { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

        [JsonIgnore]
        public ICollection<StudentProgress> StudentProgresses { get; set; } = new List<StudentProgress>();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    public enum DifficultyLevel
    {
        Child,
        Teen,
        YoungAdult,
        Adult,
        Senior
    }

    [Table("Nehzat_experimentalsciences_topics")]
    public class Topic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int PhaseId { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int Order { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public DifficultyLevel DifficultyLevel { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [JsonIgnore]
        public Phase Phase { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }
}

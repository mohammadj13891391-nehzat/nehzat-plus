using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    [Table("Nehzat_experimentalsciences_lessons")]
    public class Lesson
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int TopicId { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string? VideoUrl { get; set; }

        [Column(TypeName = "int")]
        public int Order { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [JsonIgnore]
        public Topic Topic { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Experiment> Experiments { get; set; } = new List<Experiment>();

        [JsonIgnore]
        public Quiz? Quiz { get; set; }
    }
}

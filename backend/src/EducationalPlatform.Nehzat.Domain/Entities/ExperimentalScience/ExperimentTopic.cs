using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience
{
    [Table("Nehzat_experimental_science_topics")]
    public class ExperimentTopic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = "beginner";

        [Column(TypeName = "nvarchar(200)")]
        public string? IconUrl { get; set; }

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<Experiment> Experiments { get; set; } = new List<Experiment>();
    }
}

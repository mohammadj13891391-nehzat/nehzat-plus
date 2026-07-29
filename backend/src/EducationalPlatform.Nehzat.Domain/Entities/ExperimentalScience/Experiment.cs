using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience
{
    [Table("Nehzat_experimental_science_experiments")]
    public class Experiment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int TopicId { get; set; }

        [ForeignKey(nameof(TopicId))]
        [JsonIgnore]
        public ExperimentTopic? Topic { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Objective { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string MaterialsNeeded { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Procedure { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string ExpectedResult { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = "beginner";

        public int EstimatedMinutes { get; set; }

        public int SortOrder { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? VideoUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<ExperimentAnalysis> Analyses { get; set; } = new List<ExperimentAnalysis>();

        [JsonIgnore]
        public ICollection<ExperimentQuestion> Questions { get; set; } = new List<ExperimentQuestion>();
    }
}

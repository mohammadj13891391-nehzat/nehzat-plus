using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience
{
    [Table("Nehzat_experimental_science_analyses")]
    public class ExperimentAnalysis
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int ExperimentId { get; set; }

        [ForeignKey(nameof(ExperimentId))]
        [JsonIgnore]
        public Experiment? Experiment { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string AnalysisType { get; set; } = "scientific";

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = "beginner";

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

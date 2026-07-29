using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences
{
    [Table("Nehzat_experimentalsciences_experiments")]
    public class Experiment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int LessonId { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Materials { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Steps { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string ExpectedResult { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int Order { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        [JsonIgnore]
        public Lesson Lesson { get; set; } = null!;
    }
}

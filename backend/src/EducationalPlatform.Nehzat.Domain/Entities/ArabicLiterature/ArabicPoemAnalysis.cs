using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature
{
    [Table("Nehzat_arabic_literature_analyses")]
    public class ArabicPoemAnalysis
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int PoemId { get; set; }

        [ForeignKey(nameof(PoemId))]
        [JsonIgnore]
        public ArabicPoem? Poem { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string AnalysisType { get; set; } = "general";

        [Column(TypeName = "nvarchar(50)")]
        public string? DifficultyLevel { get; set; } = "beginner";

        [Column(TypeName = "text")]
        public string? Objectives { get; set; } // JSON array of learning objectives

        [Column(TypeName = "text")]
        public string? QuizData { get; set; } // JSON - quiz questions related to this analysis

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature
{
    [Table("Nehzat_arabic_literature_poems")]
    public class ArabicPoem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int PoetId { get; set; }

        [ForeignKey(nameof(PoetId))]
        [JsonIgnore]
        public ArabicPoet? Poet { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(100)")]
        public string? Bahr { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Qafiya { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Genre { get; set; }

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Translation { get; set; }

        [Column(TypeName = "text")]
        public string? Interpretation { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string? SourceBook { get; set; }

        [Column(TypeName = "int")]
        public int VerseCount { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? DifficultyLevel { get; set; } = "beginner";

        [Column(TypeName = "nvarchar(100)")]
        public string? Theme { get; set; }

        [Column(TypeName = "text")]
        public string? ExerciseData { get; set; } // JSON - exercises for this poem

        [Column(TypeName = "nvarchar(500)")]
        public string? PrerequisiteIds { get; set; } // JSON array of poem IDs that should be studied before this one

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<ArabicPoemAnalysis> Analyses { get; set; } = new List<ArabicPoemAnalysis>();
    }
}

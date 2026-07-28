using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_persian_literature_poems")]
    public class Poem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int PoetId { get; set; }

        [ForeignKey(nameof(PoetId))]
        [JsonIgnore]
        public Poet? Poet { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

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

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<PoemAnalysis> Analyses { get; set; } = new List<PoemAnalysis>();
    }
}

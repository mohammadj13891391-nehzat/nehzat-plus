using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Hadith
{
    [Table("Nehzat_hadith_assessments")]
    public class HadithAssessment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Question { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string CorrectAnswer { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string? OptionA { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? OptionB { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? OptionC { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? OptionD { get; set; }

        [Column(TypeName = "nvarchar(30)")]
        public string Type { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(20)")]
        public string Difficulty { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int DisplayOrder { get; set; }

        [Column(TypeName = "int")]
        public int? HadithId { get; set; }

        [Column(TypeName = "int")]
        public int? HadithChapterId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public Hadith? Hadith { get; set; }

        [JsonIgnore]
        public HadithChapter? HadithChapter { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Hadith
{
    [Table("Nehzat_hadiths")]
    public class Hadith
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int HadithNumber { get; set; }

        [Column(TypeName = "text")]
        public string MatnArabic { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string Translation { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(max)")]
        public string? TranslationEnglish { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Isnad { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Takhrij { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? GharibWords { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? Explanation { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string? FiqhTakeaway { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? AudioUrl { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string Grade { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int DisplayOrder { get; set; }

        [Column(TypeName = "bit")]
        public bool IsActive { get; set; }

        [Column(TypeName = "int")]
        public int HadithChapterId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public HadithChapter HadithChapter { get; set; } = null!;

        [JsonIgnore]
        public ICollection<UserHadithProgress> UserProgress { get; set; } = new List<UserHadithProgress>();
    }
}

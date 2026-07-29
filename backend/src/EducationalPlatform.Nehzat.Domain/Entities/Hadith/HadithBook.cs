using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Hadith
{
    [Table("Nehzat_hadith_books")]
    public class HadithBook
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string TitleTranslation { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string? AuthorName { get; set; }

        [Column(TypeName = "int")]
        public int HadithCount { get; set; }

        [Column(TypeName = "int")]
        public int DisplayOrder { get; set; }

        [Column(TypeName = "bit")]
        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<HadithChapter> Chapters { get; set; } = new List<HadithChapter>();
    }
}

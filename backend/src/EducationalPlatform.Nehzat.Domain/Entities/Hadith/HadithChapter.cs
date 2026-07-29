using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Hadith
{
    [Table("Nehzat_hadith_chapters")]
    public class HadithChapter
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

        [Column(TypeName = "int")]
        public int DisplayOrder { get; set; }

        [Column(TypeName = "int")]
        public int HadithBookId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public HadithBook HadithBook { get; set; } = null!;

        [JsonIgnore]
        public ICollection<Hadith> Hadiths { get; set; } = new List<Hadith>();
    }
}

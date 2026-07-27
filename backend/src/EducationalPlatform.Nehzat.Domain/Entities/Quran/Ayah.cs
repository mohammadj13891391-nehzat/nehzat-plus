using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_ayahs")]
    public class Ayah
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int SurahId { get; set; }

        [Column(TypeName = "int")]
        public int VerseNumber { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string Text { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string Translation { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1000)")]
        public string Transliteration { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string Footnote { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string Ruku { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(20)")]
        public string Sajda { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int AyaNumber { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public string Juz { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(10)")]
        public string HizbQuarter { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Surah Surah { get; set; } = null!;
    }
}
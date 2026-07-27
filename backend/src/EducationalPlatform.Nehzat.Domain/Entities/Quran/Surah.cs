using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_surahs")]
    public class Surah
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Number { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(200)")]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(100)")]
        public string TranslatedName { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string RevelationPlace { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int RevelationOrder { get; set; }

        [Column(TypeName = "int")]
        public int TotalAyahs { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string Type { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Bismillah { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int HizbBegin { get; set; }

        [Column(TypeName = "int")]
        public int HizbEnd { get; set; }

        [Column(TypeName = "int")]
        public int JuzBegin { get; set; }

        [Column(TypeName = "int")]
        public int JuzEnd { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Ruqyah { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Summary { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public ICollection<Ayah> Ayahs { get; set; } = new List<Ayah>();
    }
}
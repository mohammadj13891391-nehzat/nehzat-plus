using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_tajweed_rules")]
    public class TajweedRule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string RuleCode { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(200)")]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1000)")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string ExampleText { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int RuleLevel { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string AffectedRecitationType { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string Guidelines { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int SurahId { get; set; }

        [Column(TypeName = "int")]
        public int AyahNumber { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Surah Surah { get; set; } = null!;
    }
}
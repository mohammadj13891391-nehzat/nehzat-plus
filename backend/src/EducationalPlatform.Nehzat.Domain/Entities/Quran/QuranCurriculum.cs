using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_curricula")]
    public class QuranCurriculum
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1000)")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(100)")]
        public string Language { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int StartSurah { get; set; }

        [Column(TypeName = "int")]
        public int EndSurah { get; set; }

        [Column(TypeName = "int")]
        public int TotalAyahs { get; set; }

        [Column(TypeName = "int")]
        public int EstimatedDays { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string LearningObjectives { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int TeacherId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Teacher Teacher { get; set; } = null!;
        public ICollection<Surah> Surahs { get; set; } = new List<Surah>();
    }
}
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_student_progress")]
    public class QuranStudentProgress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int StudentId { get; set; }

        [Column(TypeName = "int")]
        public int SurahId { get; set; }

        [Column(TypeName = "int")]
        public int AyahNumber { get; set; }

        [Column(TypeName = "int")]
        public int SurahProgress { get; set; }

        [Column(TypeName = "int")]
        public int TotalSurahs { get; set; }

        [Column(TypeName = "int")]
        public int Percentage { get; set; }

        [Column(TypeName = "date")]
        public DateTime ProgressDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "text")]
        public string Notes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Student Student { get; set; } = null!;
        public Surah Surah { get; set; } = null!;
    }
}
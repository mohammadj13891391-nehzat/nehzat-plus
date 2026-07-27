using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_student_courses")]
    public class QuranStudentCourse
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int StudentId { get; set; }

        [Column(TypeName = "int")]
        public int CourseId { get; set; }

        [Column(TypeName = "int")]
        public int SurahId { get; set; }

        [Column(TypeName = "int")]
        public int CurrentPage { get; set; }

        [Column(TypeName = "int")]
        public int CurrentAyah { get; set; }

        [Column(TypeName = "int")]
        public int RecitationLevelId { get; set; }

        [Column(TypeName = "date")]
        public DateTime EnrolledDate { get; set; } = DateTime.UtcNow;

        [Column(TypeName = "date")]
        public DateTime? CompletionDate { get; set; }

        [Column(TypeName = "int")]
        public int Grade { get; set; }

        [Column(TypeName = "text")]
        public string Notes { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Student Student { get; set; } = null!;
        public Course Course { get; set; } = null!;
        public Surah Surah { get; set; } = null!;
    }
}
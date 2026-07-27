using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities.Quran
{
    [Table("Nehzat_quran_recitation_levels")]
    public class RecitationLevel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "int")]
        public int LevelNumber { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(1000)")]
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string Criteria { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(50)")]
        public string ColorCode { get; set; } = string.Empty;

        [Column(TypeName = "int")]
        public int PointsRequired { get; set; }

        [Column(TypeName = "int")]
        public int EstimatedWeeks { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public ICollection<QuranStudentCourse> QuranStudentCourses { get; set; } = new List<QuranStudentCourse>();
    }
}
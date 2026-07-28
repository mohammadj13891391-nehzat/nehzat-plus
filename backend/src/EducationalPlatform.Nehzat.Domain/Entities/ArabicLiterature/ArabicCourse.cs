using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature
{
    [Table("Nehzat_arabic_courses")]
    public class ArabicCourse
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string? Description { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Level { get; set; } = "beginner"; // beginner, intermediate, advanced

        [Column(TypeName = "nvarchar(50)")]
        public string? AgeRange { get; set; }

        public int SortOrder { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Icon { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? Color { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? PrerequisiteCourseIds { get; set; } // JSON array of ints

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<ArabicLesson> Lessons { get; set; } = new List<ArabicLesson>();
    }
}

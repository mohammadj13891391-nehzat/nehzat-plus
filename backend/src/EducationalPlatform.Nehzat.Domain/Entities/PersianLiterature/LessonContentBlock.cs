using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_lesson_content_blocks")]
    public class LessonContentBlock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int StudyLessonId { get; set; }

        [ForeignKey(nameof(StudyLessonId))]
        [JsonIgnore]
        public StudyLesson? StudyLesson { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string BlockType { get; set; } = "text";

        [Column(TypeName = "nvarchar(200)")]
        public string? Title { get; set; }

        [Column(TypeName = "text")]
        public string Content { get; set; } = string.Empty;

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

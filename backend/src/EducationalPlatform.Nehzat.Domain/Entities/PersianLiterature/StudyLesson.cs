using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_study_lessons")]
    public class StudyLesson
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int StudyModuleId { get; set; }

        [ForeignKey(nameof(StudyModuleId))]
        [JsonIgnore]
        public StudyModule? StudyModule { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        public int EstimatedMinutes { get; set; } = 15;

        public int? PoemId { get; set; }

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<LessonContentBlock> ContentBlocks { get; set; } = new List<LessonContentBlock>();

        [JsonIgnore]
        public ICollection<Quiz> Quizzes { get; set; } = new List<Quiz>();
    }
}

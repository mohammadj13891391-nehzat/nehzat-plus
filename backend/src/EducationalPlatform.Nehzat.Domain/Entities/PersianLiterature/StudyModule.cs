using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_study_modules")]
    public class StudyModule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int LearningLevelId { get; set; }

        [ForeignKey(nameof(LearningLevelId))]
        [JsonIgnore]
        public LearningLevel? LearningLevel { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        public decimal? EstimatedHours { get; set; }

        [Column(TypeName = "text")]
        public string? LearningObjectives { get; set; }

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<StudyLesson> Lessons { get; set; } = new List<StudyLesson>();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_learning_levels")]
    public class LearningLevel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int LearningPathId { get; set; }

        [ForeignKey(nameof(LearningPathId))]
        [JsonIgnore]
        public LearningPath? LearningPath { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        public int LevelNumber { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLabel { get; set; } = string.Empty;

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<StudyModule> Modules { get; set; } = new List<StudyModule>();
    }
}

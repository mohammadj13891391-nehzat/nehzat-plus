using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_learning_paths")]
    public class LearningPath
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string Slug { get; set; } = string.Empty;

        public int AgeRangeMin { get; set; }
        public int AgeRangeMax { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? IconUrl { get; set; }

        [Column(TypeName = "nvarchar(7)")]
        public string? ColorHex { get; set; }

        public int SortOrder { get; set; }
        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<LearningLevel> Levels { get; set; } = new List<LearningLevel>();
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math
{
    [Table("Nehzat_math_topics")]
    public class MathTopic
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Title { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string? Description { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string DifficultyLevel { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(500)")]
        public string? IconUrl { get; set; }

        public int DisplayOrder { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<MathLesson> Lessons { get; set; } = new List<MathLesson>();
    }
}

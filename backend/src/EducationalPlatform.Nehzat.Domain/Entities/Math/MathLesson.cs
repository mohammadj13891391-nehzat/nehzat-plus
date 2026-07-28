using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math;

[Table("Nehzat_math_lessons")]
public class MathLesson
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(2000)")]
    public string Content { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string? Summary { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? VideoUrl { get; set; }

    public int MathTopicId { get; set; }

    public int DurationMinutes { get; set; }

    public int DisplayOrder { get; set; }

    public bool IsPublished { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    [ForeignKey(nameof(MathTopicId))]
    public MathTopic Topic { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<MathQuestion> Questions { get; set; } = new List<MathQuestion>();

    [JsonIgnore]
    public virtual ICollection<MathProgress> ProgressRecords { get; set; } = new List<MathProgress>();
}

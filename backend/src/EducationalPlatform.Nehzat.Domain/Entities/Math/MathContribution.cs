using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math;

[Table("Nehzat_math_contributions")]
public class MathContribution
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int MathScholarId { get; set; }

    public int MathTopicId { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(2000)")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? YearRange { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    [ForeignKey(nameof(MathScholarId))]
    public MathScholar Scholar { get; set; } = null!;

    [JsonIgnore]
    [ForeignKey(nameof(MathTopicId))]
    public MathTopic Topic { get; set; } = null!;
}

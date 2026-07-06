using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("assessments")]
public class Assessment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string Type { get; set; } = "weekly";

    public int MaxScore { get; set; } = 100;

    public int DurationMinutes { get; set; } = 60;

    [Column(TypeName = "date")]
    public DateTime AssessmentDate { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "draft";

    [Column(TypeName = "text")]
    public string? Instructions { get; set; }

    public int CourseId { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course Course { get; set; } = null!;

    public int? GeneratedByUserId { get; set; }

    [ForeignKey(nameof(GeneratedByUserId))]
    public User? GeneratedByUser { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? GenerationCriteria { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AssessmentQuestion> Questions { get; set; } = new List<AssessmentQuestion>();
    public ICollection<AssessmentResult> Results { get; set; } = new List<AssessmentResult>();
}
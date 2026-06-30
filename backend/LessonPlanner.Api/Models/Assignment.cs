using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("assignments")]
public class Assignment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(max)")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string Type { get; set; } = string.Empty;

    public int MaxScore { get; set; }

    [Column(TypeName = "date")]
    public DateTime AssignmentDate { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    [Column(TypeName = "nvarchar(max)")]
    public string? Instructions { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int CourseId { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course Course { get; set; } = null!;

    public ICollection<AssignmentSubmission> Submissions { get; set; } = new List<AssignmentSubmission>();
    public ICollection<AssignmentAttachment> Attachments { get; set; } = new List<AssignmentAttachment>();
}

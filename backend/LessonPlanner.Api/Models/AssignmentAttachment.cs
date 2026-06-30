using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("assignment_attachments")]
public class AssignmentAttachment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string? Title { get; set; }

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Kind { get; set; } = "other";

    [Column(TypeName = "nvarchar(255)")]
    public string Url { get; set; } = string.Empty;

    public int DisplayOrder { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int AssignmentId { get; set; }

    [ForeignKey(nameof(AssignmentId))]
    public Assignment Assignment { get; set; } = null!;
}

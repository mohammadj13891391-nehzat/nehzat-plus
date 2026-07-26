using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_actions")]
public class IssueAction
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SurveyId { get; set; }

    [ForeignKey(nameof(SurveyId))]
    public IssueSurvey Survey { get; set; } = null!;

    public int? QuestionId { get; set; }

    [ForeignKey(nameof(QuestionId))]
    public IssueSurveyQuestion? Question { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(300)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(2000)")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string Priority { get; set; } = "medium";

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "proposed";

    public int? AssignedToId { get; set; }

    [ForeignKey(nameof(AssignedToId))]
    public User? AssignedTo { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string? AssignedTeam { get; set; }

    public DateTime? TargetDate { get; set; }

    public DateTime? CompletedAt { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? KpiDefinition { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<IssueActionUpdate> Updates { get; set; } = new List<IssueActionUpdate>();
}

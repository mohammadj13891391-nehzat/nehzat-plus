using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_survey_questions")]
public class IssueSurveyQuestion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SurveyId { get; set; }

    [ForeignKey(nameof(SurveyId))]
    public IssueSurvey Survey { get; set; } = null!;

    public int? ItemPoolId { get; set; }

    [ForeignKey(nameof(ItemPoolId))]
    public IssueItemPool? ItemPool { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string QuestionText { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string? SubCategory { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string? TargetAudience { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<IssueSurveyResponse> Responses { get; set; } = new List<IssueSurveyResponse>();
    public ICollection<IssueAction> Actions { get; set; } = new List<IssueAction>();
}

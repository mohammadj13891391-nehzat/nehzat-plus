using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_surveys")]
public class IssueSurvey
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(1000)")]
    public string Description { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string SurveyType { get; set; } = "general";

    [Column(TypeName = "nvarchar(50)")]
    public string TargetRole { get; set; } = "all";

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "draft";

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public bool IsAnonymous { get; set; } = true;

    [Column(TypeName = "nvarchar(50)")]
    public string MinScoreLabel { get; set; } = "کاملاً مخالف / بحرانی";

    [Column(TypeName = "nvarchar(50)")]
    public string MaxScoreLabel { get; set; } = "کاملاً موافق / کم‌اهمیت";

    public int ScoreScaleMin { get; set; } = 1;

    public int ScoreScaleMax { get; set; } = 5;

    public int CreatedById { get; set; }

    [ForeignKey(nameof(CreatedById))]
    public User CreatedBy { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<IssueSurveyQuestion> Questions { get; set; } = new List<IssueSurveyQuestion>();
    public ICollection<IssueSurveyResponse> Responses { get; set; } = new List<IssueSurveyResponse>();
    public ICollection<IssueSurveyComment> Comments { get; set; } = new List<IssueSurveyComment>();
    public ICollection<IssueAction> Actions { get; set; } = new List<IssueAction>();
}

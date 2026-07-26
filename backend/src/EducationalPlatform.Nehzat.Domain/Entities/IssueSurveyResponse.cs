using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_survey_responses")]
public class IssueSurveyResponse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SurveyId { get; set; }

    [ForeignKey(nameof(SurveyId))]
    public IssueSurvey Survey { get; set; } = null!;

    public int QuestionId { get; set; }

    [ForeignKey(nameof(QuestionId))]
    public IssueSurveyQuestion Question { get; set; } = null!;

    public int? RespondentId { get; set; }

    [ForeignKey(nameof(RespondentId))]
    public User? Respondent { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string? RespondentRole { get; set; }

    public int? RespondentBranchId { get; set; }

    [ForeignKey(nameof(RespondentBranchId))]
    public Branch? RespondentBranch { get; set; }

    public int Score { get; set; }

    public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
}

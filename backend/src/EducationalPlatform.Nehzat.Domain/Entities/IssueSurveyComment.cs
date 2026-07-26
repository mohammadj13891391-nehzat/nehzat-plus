using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_survey_comments")]
public class IssueSurveyComment
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SurveyId { get; set; }

    [ForeignKey(nameof(SurveyId))]
    public IssueSurvey Survey { get; set; } = null!;

    public int? RespondentId { get; set; }

    [ForeignKey(nameof(RespondentId))]
    public User? Respondent { get; set; }

    [Column(TypeName = "nvarchar(2000)")]
    public string Comment { get; set; } = string.Empty;

    public bool IsPublic { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

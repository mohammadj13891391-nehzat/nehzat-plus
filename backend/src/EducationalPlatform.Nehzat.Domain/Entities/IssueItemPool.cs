using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_item_pool")]
public class IssueItemPool
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string QuestionText { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string Category { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string? SubCategory { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string? TargetAudience { get; set; }

    [Column(TypeName = "nvarchar(2000)")]
    public string? SuggestedActions { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Source { get; set; } = "manual";

    public int UsageCount { get; set; }

    public double? AvgScore { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Trend { get; set; } = "stable";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<IssueSurveyQuestion> SurveyQuestions { get; set; } = new List<IssueSurveyQuestion>();
}

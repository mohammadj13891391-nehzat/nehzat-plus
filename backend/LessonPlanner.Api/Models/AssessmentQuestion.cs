using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("assessment_questions")]
public class AssessmentQuestion
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Type { get; set; } = "multiple_choice";

    [Column(TypeName = "text")]
    public string QuestionText { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string? OptionsJson { get; set; }

    [Column(TypeName = "text")]
    public string? CorrectAnswerJson { get; set; }

    public int Points { get; set; } = 10;

    public int Order { get; set; } = 0;

    [Column(TypeName = "nvarchar(50)")]
    public string Difficulty { get; set; } = "medium";

    [Column(TypeName = "nvarchar(200)")]
    public string? Topic { get; set; }

    [Column(TypeName = "text")]
    public string? Explanation { get; set; }

    public int AssessmentId { get; set; }

    [ForeignKey(nameof(AssessmentId))]
    public Assessment Assessment { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
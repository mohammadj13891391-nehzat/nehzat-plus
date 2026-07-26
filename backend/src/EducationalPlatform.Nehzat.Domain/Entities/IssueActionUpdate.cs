using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_issue_action_updates")]
public class IssueActionUpdate
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ActionId { get; set; }

    [ForeignKey(nameof(ActionId))]
    public IssueAction Action { get; set; } = null!;

    public int UpdatedById { get; set; }

    [ForeignKey(nameof(UpdatedById))]
    public User UpdatedBy { get; set; } = null!;

    [Column(TypeName = "nvarchar(20)")]
    public string PreviousStatus { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string NewStatus { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(1000)")]
    public string Note { get; set; } = string.Empty;

    public int? ProgressPercent { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

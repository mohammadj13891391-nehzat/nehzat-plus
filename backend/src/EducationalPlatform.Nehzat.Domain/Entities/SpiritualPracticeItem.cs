using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_spiritual_practice_items")]
public class SpiritualPracticeItem
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string TitleFa { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string? DescriptionFa { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string StepKind { get; set; } = string.Empty;

    public int? MinAge { get; set; }

    public int? MaxAge { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string GenderMask { get; set; } = "mixed";

    [Column(TypeName = "nvarchar(100)")]
    public string RoleMask { get; set; } = "*";

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

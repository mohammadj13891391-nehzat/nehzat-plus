using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_spiritual_occasions")]
public class SpiritualOccasion
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

    public int? HijriMonth { get; set; }

    public int? HijriDay { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string GenderMask { get; set; } = "mixed";

    public int SortOrder { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<SpiritualOccasionPractice> Practices { get; set; } = new List<SpiritualOccasionPractice>();
}

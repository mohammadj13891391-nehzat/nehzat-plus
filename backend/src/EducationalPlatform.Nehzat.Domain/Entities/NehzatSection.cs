using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_nehzat_sections")]
public class NehzatSection
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string? Gender { get; set; }

    public int? ParentSectionId { get; set; }

    [ForeignKey(nameof(ParentSectionId))]
    public NehzatSection? ParentSection { get; set; }

    public ICollection<NehzatSection> ChildSections { get; set; } = new List<NehzatSection>();

    public ICollection<Madrasah> Madrasahs { get; set; } = new List<Madrasah>();
}

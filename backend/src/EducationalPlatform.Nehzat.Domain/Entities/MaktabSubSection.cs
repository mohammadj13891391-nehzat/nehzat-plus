using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_maktab_sub_sections")]
public class MaktabSubSection
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string? Level { get; set; }

    public int MadrasahBranchId { get; set; }

    [ForeignKey(nameof(MadrasahBranchId))]
    public MadrasahBranch? MadrasahBranch { get; set; }
}

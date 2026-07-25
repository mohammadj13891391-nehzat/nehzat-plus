using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_madrasahs")]
public class Madrasah
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string? Label { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string? Level { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Gender { get; set; } = "mixed";

    public int Grade { get; set; } = 1;

    public int Capacity { get; set; } = 30;

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    public int? SectionId { get; set; }

    [ForeignKey(nameof(SectionId))]
    public NehzatSection? Section { get; set; }

    public int? ManagerId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MadrasahBranch> Branches { get; set; } = new List<MadrasahBranch>();
}

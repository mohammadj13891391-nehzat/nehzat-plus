using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_madrasah_branches")]
public class MadrasahBranch
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string? Province { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? City { get; set; }

    [Column(TypeName = "nvarchar(300)")]
    public string? Address { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string? Phone { get; set; }

    public int Capacity { get; set; } = 0;

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    public int MadrasahId { get; set; }

    [ForeignKey(nameof(MadrasahId))]
    public Madrasah? Madrasah { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<MaktabSubSection> SubSections { get; set; } = new List<MaktabSubSection>();
}

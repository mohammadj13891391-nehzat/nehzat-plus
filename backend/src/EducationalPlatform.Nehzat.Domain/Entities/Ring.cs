using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_rings")]
public class Ring
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string? Description { get; set; }

    public int MadrasahId { get; set; }

    [ForeignKey(nameof(MadrasahId))]
    public Madrasah? Madrasah { get; set; }

    public int? CoachId { get; set; }

    public int? CourseId { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    [Column(TypeName = "nvarchar(50)")]
    public string? Gender { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RingStudent> RingStudents { get; set; } = new List<RingStudent>();
    public ICollection<RingBook> RingBooks { get; set; } = new List<RingBook>();
    public ICollection<RingTeachingMethod> RingTeachingMethods { get; set; } = new List<RingTeachingMethod>();
}

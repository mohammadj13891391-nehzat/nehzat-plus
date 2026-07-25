using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_ring_students")]
public class RingStudent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RingId { get; set; }

    [ForeignKey(nameof(RingId))]
    public Ring? Ring { get; set; }

    public int StudentId { get; set; }

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";
}

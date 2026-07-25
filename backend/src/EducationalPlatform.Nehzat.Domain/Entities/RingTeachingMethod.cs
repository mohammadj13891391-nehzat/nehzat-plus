using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_ring_teaching_methods")]
public class RingTeachingMethod
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RingId { get; set; }

    [ForeignKey(nameof(RingId))]
    public Ring? Ring { get; set; }

    public int TeachingMethodId { get; set; }

    [ForeignKey(nameof(TeachingMethodId))]
    public TeachingMethod? TeachingMethod { get; set; }
}

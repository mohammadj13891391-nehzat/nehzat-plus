using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_ring_books")]
public class RingBook
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int RingId { get; set; }

    [ForeignKey(nameof(RingId))]
    public Ring? Ring { get; set; }

    public int BookId { get; set; }

    [ForeignKey(nameof(BookId))]
    public Book? Book { get; set; }

    public int SortOrder { get; set; } = 0;
}

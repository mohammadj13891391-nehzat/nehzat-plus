using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_books")]
public class Book
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(300)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string? Author { get; set; }

    public int SubjectAreaId { get; set; }

    [ForeignKey(nameof(SubjectAreaId))]
    public SubjectArea? SubjectArea { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string? Level { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? Publisher { get; set; }

    public int? Pages { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RingBook> RingBooks { get; set; } = new List<RingBook>();
}

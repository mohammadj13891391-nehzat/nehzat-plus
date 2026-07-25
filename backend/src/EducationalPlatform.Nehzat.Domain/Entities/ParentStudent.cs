using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_parent_students")]
public class ParentStudent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int ParentId { get; set; }

    public int StudentId { get; set; }

    [ForeignKey(nameof(ParentId))]
    public Parent? Parent { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student? Student { get; set; }
}

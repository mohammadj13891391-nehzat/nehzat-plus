using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_curriculum_objectives")]
public class CurriculumObjective
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Key { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(300)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(1000)")]
    public string? Description { get; set; }

    public int SubjectAreaId { get; set; }

    [ForeignKey(nameof(SubjectAreaId))]
    public SubjectArea? SubjectArea { get; set; }

    public int? ParentObjectiveId { get; set; }

    [ForeignKey(nameof(ParentObjectiveId))]
    public CurriculumObjective? ParentObjective { get; set; }

    public int SortOrder { get; set; } = 0;

    [Column(TypeName = "nvarchar(50)")]
    public string Level { get; set; } = "beginner";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CurriculumObjective> ChildObjectives { get; set; } = new List<CurriculumObjective>();
}

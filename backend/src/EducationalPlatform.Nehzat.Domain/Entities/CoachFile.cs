using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_coach_files")]
public class CoachFile
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int CoachId { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(300)")]
    public string FileName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(500)")]
    public string StoredPath { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string ContentType { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string Kind { get; set; } = "other";

    public long SizeBytes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CoachId))]
    public Coach? Coach { get; set; }
}

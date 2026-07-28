using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.Math;

[Table("Nehzat_math_scholars")]
public class MathScholar
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(200)")]
    public string? NameArabic { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? BirthYear { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? DeathYear { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string? BirthPlace { get; set; }

    [Column(TypeName = "nvarchar(2000)")]
    public string? Biography { get; set; }

    [Column(TypeName = "nvarchar(500)")]
    public string? ImageUrl { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string? KnownFor { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public virtual ICollection<MathContribution> Contributions { get; set; } = new List<MathContribution>();
}

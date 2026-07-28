using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature
{
    [Table("Nehzat_persian_literature_poets")]
    public class Poet
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string Name { get; set; } = string.Empty;

        [Column(TypeName = "nvarchar(100)")]
        public string? PenName { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BirthDate { get; set; }

        [Column(TypeName = "date")]
        public DateTime? DeathDate { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string? BirthPlace { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string? DeathPlace { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Era { get; set; }

        [Column(TypeName = "int")]
        public int Century { get; set; }

        [Column(TypeName = "nvarchar(500)")]
        public string? Biography { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string? DifficultyLevel { get; set; } = "beginner";

        public int SortOrder { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [JsonIgnore]
        public ICollection<Poem> Poems { get; set; } = new List<Poem>();
    }
}

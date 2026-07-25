using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_leagues")]
public class League
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Season { get; set; } = string.Empty;

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string Status { get; set; } = "active";

    public int? CourseId { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course? Course { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<LeagueRanking> Rankings { get; set; } = new List<LeagueRanking>();
}

[Table("Nehzat_league_rankings")]
public class LeagueRanking
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int LeagueId { get; set; }

    public int StudentId { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal Score { get; set; }

    public int Rank { get; set; }

    public int? PreviousRank { get; set; }

    [Column(TypeName = "nvarchar(10)")]
    public string Trend { get; set; } = "stable";

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(LeagueId))]
    public League? League { get; set; }

    [ForeignKey(nameof(StudentId))]
    public Student? Student { get; set; }
}

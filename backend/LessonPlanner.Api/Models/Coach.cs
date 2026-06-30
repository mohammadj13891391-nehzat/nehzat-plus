using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("coaches")]
public class Coach
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string Username { get; set; } = string.Empty;

    [Column(TypeName = "varchar(255)")]
    public string? PasswordHash { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string FirstName { get; set; } = string.Empty;

    [Column(TypeName = "varchar(100)")]
    public string LastName { get; set; } = string.Empty;

    [Column(TypeName = "varchar(100)")]
    public string Email { get; set; } = string.Empty;

    [Column(TypeName = "varchar(20)")]
    public string? PhoneNumber { get; set; }

    [Column(TypeName = "varchar(100)")]
    public string? Specialization { get; set; }

    [Column(TypeName = "varchar(50)")]
    public string Status { get; set; } = "active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CoachCourse> CoachCourses { get; set; } = new List<CoachCourse>();
}

[Table("coach_courses")]
public class CoachCourse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int CoachId { get; set; }

    public int CourseId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(CoachId))]
    public Coach? Coach { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course? Course { get; set; }
}

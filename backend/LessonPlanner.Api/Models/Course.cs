using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LessonPlanner.Api.Models;

[Table("courses")]
public class Course
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(200)")]
    public string Title { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(max)")]
    public string? Description { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string CourseCode { get; set; } = string.Empty;

    public int Credits { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Instructor { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    [Column(TypeName = "date")]
    public DateTime StartDate { get; set; }

    [Column(TypeName = "date")]
    public DateTime EndDate { get; set; }

    public int MaxStudents { get; set; } = 0;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<StudentCourse> StudentCourses { get; set; } = new List<StudentCourse>();
    public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
}

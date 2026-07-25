using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EducationalPlatform.Nehzat.Domain.Entities;

[Table("Nehzat_teachers")]
public class Teacher
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string Username { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(255)")]
    public string? PasswordHash { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string FirstName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string LastName { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(100)")]
    public string Email { get; set; } = string.Empty;

    [Column(TypeName = "nvarchar(20)")]
    public string? PhoneNumber { get; set; }

    [Column(TypeName = "nvarchar(100)")]
    public string? Specialization { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string? NationalCode { get; set; }

    [Column(TypeName = "nvarchar(50)")]
    public string Status { get; set; } = "active";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public int? BranchId { get; set; }

    [ForeignKey(nameof(BranchId))]
    public Branch? Branch { get; set; }

    public ICollection<TeacherCourse> TeacherCourses { get; set; } = new List<TeacherCourse>();
    public ICollection<AssignmentGrading> GradedSubmissions { get; set; } = new List<AssignmentGrading>();
}

[Table("Nehzat_teacher_courses")]
public class TeacherCourse
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int TeacherId { get; set; }

    public int CourseId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(TeacherId))]
    public Teacher? Teacher { get; set; }

    [ForeignKey(nameof(CourseId))]
    public Course? Course { get; set; }
}

[Table("Nehzat_assignment_gradings")]
public class AssignmentGrading
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public int SubmissionId { get; set; }

    public int TeacherId { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? DailyScore { get; set; }

    [Column(TypeName = "decimal(5,2)")]
    public decimal? CumulativeScore { get; set; }

    [Column(TypeName = "nvarchar(20)")]
    public string? Status { get; set; }

    [Column(TypeName = "text")]
    public string? Feedback { get; set; }

    public DateTime GradedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey(nameof(SubmissionId))]
    public AssignmentSubmission? Submission { get; set; }

    [ForeignKey(nameof(TeacherId))]
    public Teacher? Teacher { get; set; }
}
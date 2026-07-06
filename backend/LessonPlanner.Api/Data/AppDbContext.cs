using Microsoft.EntityFrameworkCore;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Assignment> Assignments => Set<Assignment>();
    public DbSet<AssignmentSubmission> AssignmentSubmissions => Set<AssignmentSubmission>();
    public DbSet<AssignmentAttachment> AssignmentAttachments => Set<AssignmentAttachment>();
    public DbSet<StudentCourse> StudentCourses => Set<StudentCourse>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Coach> Coaches => Set<Coach>();
    public DbSet<CoachCourse> CoachCourses => Set<CoachCourse>();
    public DbSet<BranchManager> BranchManagers => Set<BranchManager>();
    public DbSet<Parent> Parents => Set<Parent>();
    public DbSet<Evaluator> Evaluators => Set<Evaluator>();
    public DbSet<Assessment> Assessments => Set<Assessment>();
    public DbSet<AssessmentQuestion> AssessmentQuestions => Set<AssessmentQuestion>();
    public DbSet<AssessmentResult> AssessmentResults => Set<AssessmentResult>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .IsRequired(false);
        });

        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasIndex(e => e.Name).IsUnique();
        });

        modelBuilder.Entity<Student>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.StudentId).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Assignment>(entity =>
        {
            entity.HasOne(e => e.Course)
                  .WithMany(c => c.Assignments)
                  .HasForeignKey(e => e.CourseId);
        });

        modelBuilder.Entity<AssignmentSubmission>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany(s => s.Submissions)
                  .HasForeignKey(e => e.StudentId);

            entity.HasOne(e => e.Assignment)
                  .WithMany(a => a.Submissions)
                  .HasForeignKey(e => e.AssignmentId);
        });

        modelBuilder.Entity<AssignmentAttachment>(entity =>
        {
            entity.HasOne(e => e.Assignment)
                  .WithMany(a => a.Attachments)
                  .HasForeignKey(e => e.AssignmentId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<StudentCourse>(entity =>
        {
            entity.HasOne(e => e.Student)
                  .WithMany(s => s.StudentCourses)
                  .HasForeignKey(e => e.StudentId);

            entity.HasOne(e => e.Course)
                  .WithMany(c => c.StudentCourses)
                  .HasForeignKey(e => e.CourseId);
        });

        modelBuilder.Entity<Coach>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<CoachCourse>(entity =>
        {
            entity.HasOne(e => e.Coach)
                  .WithMany(c => c.CoachCourses)
                  .HasForeignKey(e => e.CoachId);

            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId);
        });

        modelBuilder.Entity<BranchManager>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(true)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Parent>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Evaluator>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();

            entity.HasOne(e => e.Branch)
                  .WithMany()
                  .HasForeignKey(e => e.BranchId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Assessment>(entity =>
        {
            entity.HasOne(e => e.Course)
                  .WithMany()
                  .HasForeignKey(e => e.CourseId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.GeneratedByUser)
                  .WithMany()
                  .HasForeignKey(e => e.GeneratedByUserId)
                  .IsRequired(false)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasIndex(e => e.CourseId);
            entity.HasIndex(e => e.AssessmentDate);
            entity.HasIndex(e => e.Status);
        });

        modelBuilder.Entity<AssessmentQuestion>(entity =>
        {
            entity.HasOne(e => e.Assessment)
                  .WithMany(a => a.Questions)
                  .HasForeignKey(e => e.AssessmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => e.AssessmentId);
            entity.HasIndex(e => e.Topic);
            entity.HasIndex(e => e.Difficulty);
        });

        modelBuilder.Entity<AssessmentResult>(entity =>
        {
            entity.HasOne(e => e.Assessment)
                  .WithMany(a => a.Results)
                  .HasForeignKey(e => e.AssessmentId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Student)
                  .WithMany()
                  .HasForeignKey(e => e.StudentId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasIndex(e => e.AssessmentId);
            entity.HasIndex(e => e.StudentId);
            entity.HasIndex(e => e.CompletedAt);
        });
    }
}

using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class StudentService : IStudentService
{
    private readonly AppDbContext _db;

    public StudentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Student> CreateAsync(string firstName, string lastName, string email, string phoneNumber, string studentId, string? gender = null)
    {
        var student = new Student
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            StudentId = studentId,
            Gender = gender ?? "mixed",
            Status = "active",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        return await CreateAsync(student);
    }

    public async Task<Student> CreateAsync(Student student)
    {
        _db.Students.Add(student);
        await _db.SaveChangesAsync();
        return student;
    }

    public async Task<List<Student>> GetAllAsync()
    {
        return await _db.Students
            .Include(s => s.StudentCourses)
            .ThenInclude(sc => sc.Course)
            .ToListAsync();
    }

    public async Task<Student?> FindByIdAsync(int id)
    {
        return await _db.Students
            .Include(s => s.StudentCourses)
            .ThenInclude(sc => sc.Course)
            .Include(s => s.Submissions)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<Student?> FindByEmailAsync(string email)
    {
        return await _db.Students
            .Include(s => s.StudentCourses)
            .ThenInclude(sc => sc.Course)
            .FirstOrDefaultAsync(s => s.Email == email);
    }

    public async Task<Student?> FindByUsernameAsync(string username)
    {
        var user = await _db.Users
            .Include(u => u.Student)
            .FirstOrDefaultAsync(u => u.Username == username);
        if (user?.Student == null) return null;
        return await FindByIdAsync(user.Student.Id);
    }

    public async Task<Student> UpdateAsync(int id, Student student)
    {
        var existing = await _db.Students.FindAsync(id);
        if (existing == null) throw new KeyNotFoundException("Student not found");

        if (student.FirstName != null) existing.FirstName = student.FirstName;
        if (student.LastName != null) existing.LastName = student.LastName;
        if (student.Email != null) existing.Email = student.Email;
        if (student.PhoneNumber != null) existing.PhoneNumber = student.PhoneNumber;
        if (student.Address != null) existing.Address = student.Address;
        if (student.DateOfBirth != null) existing.DateOfBirth = student.DateOfBirth;
        if (student.Status != null) existing.Status = student.Status;
        if (student.Gender != null) existing.Gender = student.Gender;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return (await FindByIdAsync(id))!;
    }

    public async Task DeleteAsync(int id)
    {
        var student = await _db.Students
            .Include(s => s.StudentCourses)
            .Include(s => s.Submissions)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (student != null)
        {
            var users = await _db.Users.Where(u => u.StudentId == id).ToListAsync();
            foreach (var user in users)
            {
                user.StudentId = null;
            }

            _db.StudentCourses.RemoveRange(student.StudentCourses);
            _db.AssignmentSubmissions.RemoveRange(student.Submissions);

            _db.Students.Remove(student);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<object> GetStudentProgressAsync(int studentId)
    {
        var student = await _db.Students
            .Include(s => s.StudentCourses)
            .ThenInclude(sc => sc.Course)
            .Include(s => s.Submissions)
            .ThenInclude(sb => sb.Assignment)
            .FirstOrDefaultAsync(s => s.Id == studentId)
            ?? throw new KeyNotFoundException("Student not found");

        return new
        {
            Student = student,
            Courses = student.StudentCourses,
            Submissions = student.Submissions
        };
    }

    public async Task<BiweeklyProgressResponse> GetBiweeklyProgressAsync(int studentId)
    {
        var student = await _db.Students
            .Include(s => s.StudentCourses)
                .ThenInclude(sc => sc.Course)
            .Include(s => s.Submissions)
                .ThenInclude(sb => sb.Assignment)
            .FirstOrDefaultAsync(s => s.Id == studentId)
            ?? throw new KeyNotFoundException("Student not found");

        var now = DateTime.UtcNow;
        var periodEnd = now.Date.AddDays(1).AddTicks(-1);
        var periodStart = periodEnd.AddDays(-13);

        var courseIds = student.StudentCourses.Select(sc => sc.CourseId).ToList();
        
        var assignments = await _db.Assignments
            .Where(a => courseIds.Contains(a.CourseId) && a.AssignmentDate >= periodStart && a.AssignmentDate <= periodEnd)
            .OrderBy(a => a.AssignmentDate)
            .ToListAsync();

        var submissionDict = student.Submissions
            .Where(s => s.Assignment != null && s.Assignment.AssignmentDate >= periodStart && s.Assignment.AssignmentDate <= periodEnd)
            .ToDictionary(s => s.AssignmentId);

        var assignmentItems = new List<AssignmentProgressItem>();
        int completedCount = 0;
        int totalScore = 0;
        int scoredCount = 0;

        foreach (var assignment in assignments)
        {
            var isSubmitted = submissionDict.ContainsKey(assignment.Id);
            var submission = isSubmitted ? submissionDict[assignment.Id] : null;

            if (isSubmitted) completedCount++;
            if (submission?.DailyScore > 0)
            {
                totalScore += submission.DailyScore;
                scoredCount++;
            }

            assignmentItems.Add(new AssignmentProgressItem(
                assignment.Id,
                assignment.Title,
                assignment.AssignmentDate,
                isSubmitted,
                submission?.DailyScore,
                submission?.CumulativeScore,
                submission?.Status ?? "pending"
            ));
        }

        var totalAssignments = assignments.Count;
        var completedAssignments = completedCount;
        var pendingAssignments = totalAssignments - completedAssignments;
        var completionPercentage = totalAssignments > 0 ? (double)completedAssignments / totalAssignments * 100 : 0;
        var averageScore = scoredCount > 0 ? (double)totalScore / scoredCount : 0;

        var studentName = $"{student.FirstName} {student.LastName}".Trim();

        // Generate 14-day timeline
        var periodStartDate = periodStart;
        for (int i = 0; i < 14; i++)
        {
            var date = periodStartDate.AddDays(i);
            var dayAssignments = assignments.Where(a => a.AssignmentDate.Date == date.Date).ToList();
        }

        return new BiweeklyProgressResponse(
            StudentId: studentId,
            StudentName: studentName,
            PeriodStart: periodStart,
            PeriodEnd: periodEnd,
            TotalAssignments: totalAssignments,
            CompletedAssignments: completedAssignments,
            PendingAssignments: pendingAssignments,
            CompletionPercentage: Math.Round(completionPercentage, 1),
            AverageScore: Math.Round(averageScore, 1),
            TotalSubmissions: student.Submissions.Count(s => s.Assignment != null && s.Assignment.AssignmentDate >= periodStart && s.Assignment.AssignmentDate <= periodEnd),
            Assignments: assignmentItems
        );
    }
}

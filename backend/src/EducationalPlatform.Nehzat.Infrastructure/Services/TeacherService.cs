using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class TeacherService : ITeacherService
{
    private readonly AppDbContext _db;

    public TeacherService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<Teacher>> GetAllAsync()
    {
        return await _db.Teachers
            .Include(t => t.Branch)
            .Include(t => t.TeacherCourses)
                .ThenInclude(tc => tc.Course)
            .OrderBy(t => t.LastName).ThenBy(t => t.FirstName)
            .ToListAsync();
    }

    public async Task<Teacher?> GetByIdAsync(int id)
    {
        return await _db.Teachers
            .Include(t => t.Branch)
            .Include(t => t.TeacherCourses)
                .ThenInclude(tc => tc.Course)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Teacher> CreateAsync(CreateTeacherRequest request)
    {
        if (await _db.Teachers.AnyAsync(t => t.Username == request.Username))
            throw new InvalidOperationException("استاد با این نام کاربری قبلاً ثبت شده است.");

        if (await _db.Teachers.AnyAsync(t => t.Email == request.Email))
            throw new InvalidOperationException("استاد با این ایمیل قبلاً ثبت شده است.");

        if (!string.IsNullOrEmpty(request.NationalCode) &&
            await _db.Teachers.AnyAsync(t => t.NationalCode == request.NationalCode))
            throw new InvalidOperationException("استاد با این کد ملی قبلاً ثبت شده است.");

        var teacher = new Teacher
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Specialization = request.Specialization,
            NationalCode = request.NationalCode,
            Status = "active",
            BranchId = request.BranchId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Teachers.Add(teacher);
        await _db.SaveChangesAsync();

        if (request.AssignedCourseIds?.Length > 0)
        {
            foreach (var courseId in request.AssignedCourseIds)
            {
                if (await _db.Courses.AnyAsync(c => c.Id == courseId))
                {
                    _db.TeacherCourses.Add(new TeacherCourse
                    {
                        TeacherId = teacher.Id,
                        CourseId = courseId,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
            await _db.SaveChangesAsync();
        }

        return await GetByIdAsync(teacher.Id) ?? teacher;
    }

    public async Task<Teacher> UpdateAsync(int id, UpdateTeacherRequest request)
    {
        var existing = await _db.Teachers.FindAsync(id)
            ?? throw new KeyNotFoundException("استاد پیدا نشد.");

        if (request.FirstName != null) existing.FirstName = request.FirstName;
        if (request.LastName != null) existing.LastName = request.LastName;
        if (request.Email != null)
        {
            if (await _db.Teachers.AnyAsync(t => t.Email == request.Email && t.Id != id))
                throw new InvalidOperationException("استاد دیگری با این ایمیل وجود دارد.");
            existing.Email = request.Email;
        }
        if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber;
        if (request.Specialization != null) existing.Specialization = request.Specialization;
        if (request.NationalCode != null)
        {
            if (await _db.Teachers.AnyAsync(t => t.NationalCode == request.NationalCode && t.Id != id))
                throw new InvalidOperationException("استاد دیگری با این کد ملی وجود دارد.");
            existing.NationalCode = request.NationalCode;
        }
        if (request.Status != null) existing.Status = request.Status;
        if (request.BranchId != null) existing.BranchId = request.BranchId;

        existing.UpdatedAt = DateTime.UtcNow;

        if (request.AssignedCourseIds != null)
        {
            var existingCourseIds = await _db.TeacherCourses
                .Where(tc => tc.TeacherId == id)
                .Select(tc => tc.CourseId)
                .ToListAsync();

            var toRemove = existingCourseIds.Except(request.AssignedCourseIds).ToList();
            var toAdd = request.AssignedCourseIds.Except(existingCourseIds).ToList();

            if (toRemove.Count > 0)
            {
                _db.TeacherCourses.RemoveRange(
                    _db.TeacherCourses.Where(tc => tc.TeacherId == id && toRemove.Contains(tc.CourseId)));
            }

            foreach (var courseId in toAdd)
            {
                if (await _db.Courses.AnyAsync(c => c.Id == courseId))
                {
                    _db.TeacherCourses.Add(new TeacherCourse
                    {
                        TeacherId = id,
                        CourseId = courseId,
                        CreatedAt = DateTime.UtcNow
                    });
                }
            }
        }

        await _db.SaveChangesAsync();
        return await GetByIdAsync(id) ?? existing;
    }

    public async Task DeleteAsync(int id)
    {
        var existing = await _db.Teachers.FindAsync(id)
            ?? throw new KeyNotFoundException("استاد پیدا نشد.");

        _db.Teachers.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<List<Teacher>> GetByCourseAsync(int courseId)
    {
        return await _db.TeacherCourses
            .Where(tc => tc.CourseId == courseId)
            .Select(tc => tc.Teacher!)
            .ToListAsync();
    }

    public async Task<TeacherDashboardSummary> GetDashboardSummaryAsync(int teacherId)
    {
        var teacher = await _db.Teachers
            .Include(t => t.TeacherCourses)
                .ThenInclude(tc => tc.Course)
                    .ThenInclude(c => c.Assignments)
            .Include(t => t.GradedSubmissions)
            .FirstOrDefaultAsync(t => t.Id == teacherId)
            ?? throw new KeyNotFoundException("استاد پیدا نشد.");

        var courseIds = teacher.TeacherCourses.Select(tc => tc.CourseId).ToList();
        
        var totalStudents = await _db.StudentCourses
            .CountAsync(sc => courseIds.Contains(sc.CourseId) && sc.Status == "enrolled");

        var pendingGradings = await _db.AssignmentGradings
            .Include(ag => ag.Submission)
                .ThenInclude(s => s.Assignment)
            .Where(ag => ag.TeacherId == teacherId)
            .CountAsync();

        var completedGradings = teacher.GradedSubmissions.Count;
        
        var avgScore = teacher.GradedSubmissions
            .Where(g => g.DailyScore.HasValue)
            .Select(g => g.DailyScore!.Value)
            .DefaultIfEmpty(0)
            .Average();

        return new TeacherDashboardSummary(
            TotalCourses: teacher.TeacherCourses.Count,
            TotalStudents: totalStudents,
            PendingGradings: pendingGradings,
            CompletedGradings: completedGradings,
            AverageScore: (double)Math.Round(avgScore, 1)
        );
    }

    public async Task<AssignmentGrading> GradeSubmissionAsync(GradeSubmissionRequest request)
    {
        var submission = await _db.AssignmentSubmissions
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == request.SubmissionId)
            ?? throw new KeyNotFoundException("ارسال پیدا نشد.");

        if (await _db.AssignmentGradings.AnyAsync(g => g.SubmissionId == request.SubmissionId))
            throw new InvalidOperationException("این ارسال قبلاً نمره‌دهی شده است.");

        if (!await _db.Teachers.AnyAsync(t => t.Id == request.TeacherId))
            throw new KeyNotFoundException("استاد پیدا نشد.");

        var grading = new AssignmentGrading
        {
            SubmissionId = request.SubmissionId,
            TeacherId = request.TeacherId,
            DailyScore = request.DailyScore,
            CumulativeScore = request.CumulativeScore,
            Status = request.Status ?? "graded",
            Feedback = request.Feedback,
            GradedAt = DateTime.UtcNow
        };

        _db.AssignmentGradings.Add(grading);

        submission.Status = request.Status ?? "graded";
        if (request.DailyScore.HasValue) submission.DailyScore = (int)request.DailyScore.Value;
        if (request.CumulativeScore.HasValue) submission.CumulativeScore = (int)request.CumulativeScore.Value;
        if (request.Feedback != null) submission.Feedback = request.Feedback;

        await _db.SaveChangesAsync();

        return await _db.AssignmentGradings
            .Include(g => g.Submission)
            .Include(g => g.Teacher)
            .FirstAsync(g => g.Id == grading.Id);
    }

    public async Task<List<AssignmentGrading>> GetGradingsByTeacherAsync(int teacherId)
    {
        return await _db.AssignmentGradings
            .Include(g => g.Submission)
                .ThenInclude(s => s.Student)
            .Include(g => g.Submission)
                .ThenInclude(s => s.Assignment)
            .Where(g => g.TeacherId == teacherId)
            .OrderByDescending(g => g.GradedAt)
            .ToListAsync();
    }

    public async Task<List<AssignmentGrading>> GetPendingGradingsAsync(int teacherId)
    {
        var courseIds = await _db.TeacherCourses
            .Where(tc => tc.TeacherId == teacherId)
            .Select(tc => tc.CourseId)
            .ToListAsync();

        var pendingSubmissions = await _db.AssignmentSubmissions
            .Include(s => s.Assignment)
            .Include(s => s.Student)
            .Where(s => courseIds.Contains(s.Assignment.CourseId))
            .Where(s => !_db.AssignmentGradings.Any(g => g.SubmissionId == s.Id))
            .OrderBy(s => s.SubmissionDate)
            .ToListAsync();

        return pendingSubmissions.Select(s => new AssignmentGrading
        {
            SubmissionId = s.Id,
            TeacherId = teacherId,
            Submission = s,
            Status = "pending"
        }).ToList();
    }
}
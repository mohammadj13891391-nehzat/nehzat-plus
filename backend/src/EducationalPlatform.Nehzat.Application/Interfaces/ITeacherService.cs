using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ITeacherService
{
    Task<List<Teacher>> GetAllAsync();
    Task<Teacher?> GetByIdAsync(int id);
    Task<Teacher> CreateAsync(CreateTeacherRequest request);
    Task<Teacher> UpdateAsync(int id, UpdateTeacherRequest request);
    Task DeleteAsync(int id);
    Task<List<Teacher>> GetByCourseAsync(int courseId);
    Task<TeacherDashboardSummary> GetDashboardSummaryAsync(int teacherId);
    Task<AssignmentGrading> GradeSubmissionAsync(GradeSubmissionRequest request);
    Task<List<AssignmentGrading>> GetGradingsByTeacherAsync(int teacherId);
    Task<List<AssignmentGrading>> GetPendingGradingsAsync(int teacherId);
}
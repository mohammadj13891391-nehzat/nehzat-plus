using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IAssessmentService
{
    Task<Assessment> CreateAsync(Assessment assessment);
    Task<List<Assessment>> GetAllAsync();
    Task<Assessment?> FindByIdAsync(int id);
    Task<Assessment> UpdateAsync(int id, Assessment assessment);
    Task DeleteAsync(int id);

    Task<List<Assessment>> GetByCourseAsync(int courseId);
    Task<List<Assessment>> GetByCourseAndDateRangeAsync(int courseId, DateTime startDate, DateTime endDate);
    Task<List<Assessment>> GetByStatusAsync(string status);

    Task<AssessmentQuestion> CreateQuestionAsync(AssessmentQuestion question);
    Task<List<AssessmentQuestion>> GetQuestionsAsync(int assessmentId);
    Task<AssessmentQuestion?> GetQuestionByIdAsync(int id);
    Task<AssessmentQuestion> UpdateQuestionAsync(int id, AssessmentQuestion question);
    Task DeleteQuestionAsync(int id);

    Task<AssessmentResult> CreateResultAsync(AssessmentResult result);
    Task<List<AssessmentResult>> GetResultsAsync(int assessmentId);
    Task<List<AssessmentResult>> GetResultsByStudentAsync(int studentId);
    Task<AssessmentResult?> GetResultByIdAsync(int id);
    Task<AssessmentResult?> GetResultByAssessmentAndStudentAsync(int assessmentId, int studentId);

    Task<Assessment> GenerateWeeklyAssessmentAsync(int courseId, int generatedByUserId, string title, string description, int durationMinutes, int maxScore, DateTime assessmentDate, Dictionary<string, object> criteria);
    Task<List<AssessmentQuestion>> GenerateQuestionsFromCourseContentAsync(int assessmentId, int courseId, Dictionary<string, object> criteria);
    Task<object> GetAssessmentAnalyticsAsync(int assessmentId);
    Task<object> GetStudentAssessmentHistoryAsync(int studentId, int courseId);
}

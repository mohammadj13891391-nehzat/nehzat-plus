using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities.Math;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IMathService
    {
        // Topic operations
        Task<List<MathTopic>> GetAllTopicsAsync();
        Task<MathTopic?> FindTopicByIdAsync(int id);
        Task<MathTopic> CreateTopicAsync(MathTopic topic);
        Task<MathTopic> UpdateTopicAsync(int id, MathTopic topic);
        Task DeleteTopicAsync(int id);
        Task<List<MathTopic>> SearchTopicsAsync(string query, int maxResults = 10);

        // Lesson operations
        Task<List<MathLesson>> GetAllLessonsAsync(int? topicId = null);
        Task<MathLesson?> FindLessonByIdAsync(int id);
        Task<MathLesson> CreateLessonAsync(MathLesson lesson);
        Task<MathLesson> UpdateLessonAsync(int id, MathLesson lesson);
        Task DeleteLessonAsync(int id);
        Task<List<MathLesson>> SearchLessonsAsync(string query, int maxResults = 10);

        // Question operations
        Task<List<MathQuestion>> GetAllQuestionsAsync(int? lessonId = null);
        Task<MathQuestion?> FindQuestionByIdAsync(int id);
        Task<MathQuestion> CreateQuestionAsync(MathQuestion question);
        Task<MathQuestion> UpdateQuestionAsync(int id, MathQuestion question);
        Task DeleteQuestionAsync(int id);

        // Progress operations
        Task<List<MathProgress>> GetStudentProgressAsync(int studentId);
        Task<MathProgress?> GetStudentLessonProgressAsync(int studentId, int lessonId);
        Task<MathProgress> RecordProgressAsync(MathProgress progress);
        Task<MathProgress> UpdateProgressAsync(int id, MathProgress progress);

        // Scholar operations
        Task<List<MathScholar>> GetAllScholarsAsync();
        Task<MathScholar?> FindScholarByIdAsync(int id);
        Task<MathScholar> CreateScholarAsync(MathScholar scholar);
        Task<MathScholar> UpdateScholarAsync(int id, MathScholar scholar);
        Task DeleteScholarAsync(int id);
        Task<List<MathScholar>> SearchScholarsAsync(string query, int maxResults = 10);

        // Contribution operations
        Task<List<MathContribution>> GetContributionsByTopicAsync(int topicId);
        Task<List<MathContribution>> GetContributionsByScholarAsync(int scholarId);
        Task<MathContribution> CreateContributionAsync(MathContribution contribution);
        Task<MathContribution> UpdateContributionAsync(int id, MathContribution contribution);
        Task DeleteContributionAsync(int id);

        // Dashboard
        Task<Dictionary<string, object>> GetDashboardStatsAsync();
    }
}

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMathService
{
    Task<List<Domain.Entities.Math.MathTopic>> GetAllTopicsAsync();
    Task<Domain.Entities.Math.MathTopic?> FindTopicByIdAsync(int id);
    Task<Domain.Entities.Math.MathTopic> CreateTopicAsync(Domain.Entities.Math.MathTopic topic);
    Task<Domain.Entities.Math.MathTopic> UpdateTopicAsync(int id, Domain.Entities.Math.MathTopic topic);
    Task DeleteTopicAsync(int id);
    Task<List<Domain.Entities.Math.MathTopic>> SearchTopicsAsync(string query, int maxResults = 10);

    Task<List<Domain.Entities.Math.MathLesson>> GetAllLessonsAsync(int? topicId = null);
    Task<Domain.Entities.Math.MathLesson?> FindLessonByIdAsync(int id);
    Task<Domain.Entities.Math.MathLesson> CreateLessonAsync(Domain.Entities.Math.MathLesson lesson);
    Task<Domain.Entities.Math.MathLesson> UpdateLessonAsync(int id, Domain.Entities.Math.MathLesson lesson);
    Task DeleteLessonAsync(int id);
    Task<List<Domain.Entities.Math.MathLesson>> SearchLessonsAsync(string query, int maxResults = 10);

    Task<List<Domain.Entities.Math.MathQuestion>> GetAllQuestionsAsync(int? lessonId = null);
    Task<Domain.Entities.Math.MathQuestion?> FindQuestionByIdAsync(int id);
    Task<Domain.Entities.Math.MathQuestion> CreateQuestionAsync(Domain.Entities.Math.MathQuestion question);
    Task<Domain.Entities.Math.MathQuestion> UpdateQuestionAsync(int id, Domain.Entities.Math.MathQuestion question);
    Task DeleteQuestionAsync(int id);

    Task<List<Domain.Entities.Math.MathProgress>> GetStudentProgressAsync(int studentId);
    Task<Domain.Entities.Math.MathProgress?> GetStudentLessonProgressAsync(int studentId, int lessonId);
    Task<Domain.Entities.Math.MathProgress> RecordProgressAsync(Domain.Entities.Math.MathProgress progress);
    Task<Domain.Entities.Math.MathProgress> UpdateProgressAsync(int id, Domain.Entities.Math.MathProgress progress);

    Task<List<Domain.Entities.Math.MathScholar>> GetAllScholarsAsync();
    Task<Domain.Entities.Math.MathScholar?> FindScholarByIdAsync(int id);
    Task<Domain.Entities.Math.MathScholar> CreateScholarAsync(Domain.Entities.Math.MathScholar scholar);
    Task<Domain.Entities.Math.MathScholar> UpdateScholarAsync(int id, Domain.Entities.Math.MathScholar scholar);
    Task DeleteScholarAsync(int id);
    Task<List<Domain.Entities.Math.MathScholar>> SearchScholarsAsync(string query, int maxResults = 10);

    Task<List<Domain.Entities.Math.MathContribution>> GetContributionsByTopicAsync(int topicId);
    Task<List<Domain.Entities.Math.MathContribution>> GetContributionsByScholarAsync(int scholarId);
    Task<Domain.Entities.Math.MathContribution?> FindContributionByIdAsync(int id);
    Task<Domain.Entities.Math.MathContribution> CreateContributionAsync(Domain.Entities.Math.MathContribution contribution);
    Task<Domain.Entities.Math.MathContribution> UpdateContributionAsync(int id, Domain.Entities.Math.MathContribution contribution);
    Task DeleteContributionAsync(int id);

    Task<Dictionary<string, object>> GetDashboardStatsAsync();
}

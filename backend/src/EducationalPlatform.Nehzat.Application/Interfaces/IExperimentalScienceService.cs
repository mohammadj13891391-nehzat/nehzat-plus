using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IExperimentalScienceService
    {
        // Topic operations
        Task<List<ExperimentTopic>> GetAllTopicsAsync(string? difficulty = null);
        Task<ExperimentTopic?> GetTopicByIdAsync(int id);
        Task<ExperimentTopic> CreateTopicAsync(CreateExperimentTopicRequest request);
        Task<ExperimentTopic> UpdateTopicAsync(int id, UpdateExperimentTopicRequest request);
        Task DeleteTopicAsync(int id);
        Task<List<ExperimentTopic>> SearchTopicsAsync(string query, int maxResults = 20);

        // Experiment operations
        Task<List<Experiment>> GetAllExperimentsAsync(int? topicId = null, string? difficulty = null);
        Task<Experiment?> GetExperimentByIdAsync(int id);
        Task<Experiment> CreateExperimentAsync(CreateExperimentRequest request);
        Task<Experiment> UpdateExperimentAsync(int id, UpdateExperimentRequest request);
        Task DeleteExperimentAsync(int id);
        Task<List<Experiment>> SearchExperimentsAsync(string query, int maxResults = 20);

        // Analysis operations
        Task<List<ExperimentAnalysis>> GetAnalysesByExperimentAsync(int experimentId);
        Task<ExperimentAnalysis> CreateAnalysisAsync(CreateExperimentAnalysisRequest request);
        Task<ExperimentAnalysis> UpdateAnalysisAsync(int id, UpdateExperimentAnalysisRequest request);
        Task DeleteAnalysisAsync(int id);

        // Question operations
        Task<List<ExperimentQuestion>> GetQuestionsByExperimentAsync(int experimentId);
        Task<ExperimentQuestion> CreateQuestionAsync(CreateExperimentQuestionRequest request);
        Task DeleteQuestionAsync(int id);

        // Attempt operations
        Task<ExperimentAttempt> SubmitAttemptAsync(SubmitExperimentAttemptRequest request);
        Task<List<ExperimentAttempt>> GetAttemptsByStudentAsync(int studentId);

        // Progress operations
        Task<ExperimentProgress?> GetProgressAsync(int studentId, int experimentId);
        Task<ExperimentProgress> UpdateProgressAsync(UpdateExperimentProgressRequest request);
        Task<List<ExperimentProgress>> GetOverallProgressAsync(int studentId);

        // Dashboard
        Task<object> GetDashboardStatsAsync();
    }
}

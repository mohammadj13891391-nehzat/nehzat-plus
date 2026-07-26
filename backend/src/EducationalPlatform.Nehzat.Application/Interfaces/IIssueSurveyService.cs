using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IIssueSurveyService
{
    // Survey CRUD
    Task<IssueSurvey> CreateSurveyAsync(IssueSurvey survey);
    Task<List<IssueSurvey>> GetAllSurveysAsync();
    Task<IssueSurvey?> FindSurveyByIdAsync(int id);
    Task<IssueSurvey> UpdateSurveyAsync(int id, IssueSurvey survey);
    Task DeleteSurveyAsync(int id);
    Task<IssueSurvey> PublishSurveyAsync(int id);
    Task<IssueSurvey> CloseSurveyAsync(int id);
    Task<IssueSurvey> DuplicateSurveyAsync(int id);

    // Questions
    Task<IssueSurveyQuestion> CreateQuestionAsync(IssueSurveyQuestion question);
    Task<List<IssueSurveyQuestion>> GetQuestionsAsync(int surveyId);
    Task<IssueSurveyQuestion?> FindQuestionByIdAsync(int id);
    Task<IssueSurveyQuestion> UpdateQuestionAsync(int id, IssueSurveyQuestion question);
    Task DeleteQuestionAsync(int id);
    Task ReorderQuestionsAsync(int surveyId, List<int> questionIds);

    // Item Pool
    Task<IssueItemPool> CreatePoolItemAsync(IssueItemPool item);
    Task<List<IssueItemPool>> GetAllPoolItemsAsync(string? category = null);
    Task<IssueItemPool> AddPoolItemToSurveyAsync(int poolItemId, int surveyId, int sortOrder);

    // Responses
    Task<IssueSurveyResponse> SubmitResponseAsync(IssueSurveyResponse response);
    Task<List<IssueSurveyResponse>> GetSurveyResponsesAsync(int surveyId);
    Task<List<IssueSurveyResponse>> GetRespondentResponsesAsync(int surveyId, int respondentId);

    // Comments
    Task<IssueSurveyComment> AddCommentAsync(IssueSurveyComment comment);
    Task<List<IssueSurveyComment>> GetSurveyCommentsAsync(int surveyId);

    // Actions
    Task<IssueAction> CreateActionAsync(IssueAction action);
    Task<List<IssueAction>> GetSurveyActionsAsync(int surveyId);
    Task<IssueAction> UpdateActionAsync(int id, IssueAction action);
    Task<IssueAction> UpdateActionStatusAsync(int id, string newStatus, int updatedById, string note, int? progressPercent);

    // Analytics
    Task<object> GetSurveyAnalyticsAsync(int surveyId);
    Task<List<object>> GetCategoryBreakdownAsync(int surveyId);
    Task<List<object>> GetTopCriticalIssuesAsync(int surveyId, int limit);
    Task<object> GetIssueDashboardSummaryAsync();
    Task<List<object>> GetSurveyTrendsAsync(int? count = 5);
    Task<List<object>> ExportSurveyDataAsync(int surveyId, string format);
}

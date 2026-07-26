using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class IssueSurveyService : IIssueSurveyService
{
    private readonly AppDbContext _db;

    public IssueSurveyService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<IssueSurvey> CreateSurveyAsync(IssueSurvey survey)
    {
        _db.Set<IssueSurvey>().Add(survey);
        await _db.SaveChangesAsync();
        return survey;
    }

    public async Task<List<IssueSurvey>> GetAllSurveysAsync()
    {
        return await _db.Set<IssueSurvey>()
            .Include(s => s.CreatedBy)
            .Include(s => s.Questions)
            .Include(s => s.Responses)
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();
    }

    public async Task<IssueSurvey?> FindSurveyByIdAsync(int id)
    {
        return await _db.Set<IssueSurvey>()
            .Include(s => s.CreatedBy)
            .Include(s => s.Questions.OrderBy(q => q.SortOrder))
            .Include(s => s.Responses)
            .Include(s => s.Comments)
            .Include(s => s.Actions)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<IssueSurvey> UpdateSurveyAsync(int id, IssueSurvey survey)
    {
        var existing = await _db.Set<IssueSurvey>().FindAsync(id)
            ?? throw new KeyNotFoundException("IssueSurvey not found");

        if (survey.Title != null) existing.Title = survey.Title;
        if (survey.Description != null) existing.Description = survey.Description;
        if (survey.SurveyType != null) existing.SurveyType = survey.SurveyType;
        if (survey.TargetRole != null) existing.TargetRole = survey.TargetRole;
        if (survey.Status != null) existing.Status = survey.Status;
        if (survey.StartDate != default) existing.StartDate = survey.StartDate;
        if (survey.EndDate != default) existing.EndDate = survey.EndDate;
        existing.IsAnonymous = survey.IsAnonymous;
        if (survey.ScoreScaleMin > 0) existing.ScoreScaleMin = survey.ScoreScaleMin;
        if (survey.ScoreScaleMax > 0) existing.ScoreScaleMax = survey.ScoreScaleMax;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return (await FindSurveyByIdAsync(id))!;
    }

    public async Task DeleteSurveyAsync(int id)
    {
        var survey = await _db.Set<IssueSurvey>()
            .Include(s => s.Questions)
            .Include(s => s.Responses)
            .Include(s => s.Comments)
            .Include(s => s.Actions)
            .ThenInclude(a => a.Updates)
            .FirstOrDefaultAsync(s => s.Id == id);
        if (survey != null)
        {
            var actionUpdates = survey.Actions.SelectMany(a => a.Updates).ToList();
            _db.Set<IssueActionUpdate>().RemoveRange(actionUpdates);
            _db.Set<IssueAction>().RemoveRange(survey.Actions);
            _db.Set<IssueSurveyComment>().RemoveRange(survey.Comments);
            _db.Set<IssueSurveyResponse>().RemoveRange(survey.Responses);
            _db.Set<IssueSurveyQuestion>().RemoveRange(survey.Questions);
            _db.Set<IssueSurvey>().Remove(survey);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<IssueSurvey> PublishSurveyAsync(int id)
    {
        var survey = await _db.Set<IssueSurvey>().FindAsync(id)
            ?? throw new KeyNotFoundException("IssueSurvey not found");
        survey.Status = "active";
        survey.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return survey;
    }

    public async Task<IssueSurvey> CloseSurveyAsync(int id)
    {
        var survey = await _db.Set<IssueSurvey>().FindAsync(id)
            ?? throw new KeyNotFoundException("IssueSurvey not found");
        survey.Status = "closed";
        survey.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return survey;
    }

    public async Task<IssueSurvey> DuplicateSurveyAsync(int id)
    {
        var original = await _db.Set<IssueSurvey>()
            .Include(s => s.Questions)
            .FirstOrDefaultAsync(s => s.Id == id)
            ?? throw new KeyNotFoundException("IssueSurvey not found");

        var duplicate = new IssueSurvey
        {
            Title = $"{original.Title} (کپی)",
            Description = original.Description,
            SurveyType = original.SurveyType,
            TargetRole = original.TargetRole,
            Status = "draft",
            StartDate = original.StartDate,
            EndDate = original.EndDate,
            IsAnonymous = original.IsAnonymous,
            ScoreScaleMin = original.ScoreScaleMin,
            ScoreScaleMax = original.ScoreScaleMax,
            CreatedById = original.CreatedById,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            Questions = original.Questions.Select(q => new IssueSurveyQuestion
            {
                QuestionText = q.QuestionText,
                Category = q.Category,
                SubCategory = q.SubCategory,
                TargetAudience = q.TargetAudience,
                SortOrder = q.SortOrder,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }).ToList()
        };

        _db.Set<IssueSurvey>().Add(duplicate);
        await _db.SaveChangesAsync();
        return duplicate;
    }

    public async Task<IssueSurveyQuestion> CreateQuestionAsync(IssueSurveyQuestion question)
    {
        _db.Set<IssueSurveyQuestion>().Add(question);

        if (question.ItemPoolId == null)
        {
            var poolItem = new IssueItemPool
            {
                QuestionText = question.QuestionText,
                Category = question.Category,
                SubCategory = question.SubCategory,
                TargetAudience = question.TargetAudience,
                Source = "survey_auto",
                UsageCount = 1,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Set<IssueItemPool>().Add(poolItem);
            await _db.SaveChangesAsync();
            question.ItemPoolId = poolItem.Id;
            await _db.SaveChangesAsync();
        }
        else
        {
            var poolItem = await _db.Set<IssueItemPool>().FindAsync(question.ItemPoolId);
            if (poolItem != null)
            {
                poolItem.UsageCount++;
                poolItem.UpdatedAt = DateTime.UtcNow;
            }
            await _db.SaveChangesAsync();
        }

        return question;
    }

    public async Task<List<IssueSurveyQuestion>> GetQuestionsAsync(int surveyId)
    {
        return await _db.Set<IssueSurveyQuestion>()
            .Where(q => q.SurveyId == surveyId)
            .OrderBy(q => q.SortOrder)
            .ToListAsync();
    }

    public async Task<IssueSurveyQuestion?> FindQuestionByIdAsync(int id)
    {
        return await _db.Set<IssueSurveyQuestion>().FindAsync(id);
    }

    public async Task<IssueSurveyQuestion> UpdateQuestionAsync(int id, IssueSurveyQuestion question)
    {
        var existing = await _db.Set<IssueSurveyQuestion>().FindAsync(id)
            ?? throw new KeyNotFoundException("Question not found");

        if (question.QuestionText != null) existing.QuestionText = question.QuestionText;
        if (question.Category != null) existing.Category = question.Category;
        if (question.SubCategory != null) existing.SubCategory = question.SubCategory;
        if (question.TargetAudience != null) existing.TargetAudience = question.TargetAudience;
        if (question.SortOrder >= 0) existing.SortOrder = question.SortOrder;
        existing.IsActive = question.IsActive;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteQuestionAsync(int id)
    {
        var question = await _db.Set<IssueSurveyQuestion>().FindAsync(id);
        if (question != null)
        {
            _db.Set<IssueSurveyQuestion>().Remove(question);
            await _db.SaveChangesAsync();
        }
    }

    public async Task ReorderQuestionsAsync(int surveyId, List<int> questionIds)
    {
        var questions = await _db.Set<IssueSurveyQuestion>()
            .Where(q => q.SurveyId == surveyId)
            .ToListAsync();

        var orderMap = questionIds.Select((id, index) => new { id, order = index }).ToDictionary(x => x.id, x => x.order);
        foreach (var q in questions)
        {
            if (orderMap.TryGetValue(q.Id, out var order))
            {
                q.SortOrder = order;
                q.UpdatedAt = DateTime.UtcNow;
            }
        }
        await _db.SaveChangesAsync();
    }

    public async Task<IssueItemPool> CreatePoolItemAsync(IssueItemPool item)
    {
        _db.Set<IssueItemPool>().Add(item);
        await _db.SaveChangesAsync();
        return item;
    }

    public async Task<List<IssueItemPool>> GetAllPoolItemsAsync(string? category = null)
    {
        var query = _db.Set<IssueItemPool>().Where(i => i.IsActive);
        if (!string.IsNullOrEmpty(category))
            query = query.Where(i => i.Category == category);
        return await query.OrderByDescending(i => i.UsageCount).ToListAsync();
    }

    public async Task<IssueItemPool> AddPoolItemToSurveyAsync(int poolItemId, int surveyId, int sortOrder)
    {
        var poolItem = await _db.Set<IssueItemPool>().FindAsync(poolItemId)
            ?? throw new KeyNotFoundException("Pool item not found");

        var question = new IssueSurveyQuestion
        {
            SurveyId = surveyId,
            ItemPoolId = poolItemId,
            QuestionText = poolItem.QuestionText,
            Category = poolItem.Category,
            SubCategory = poolItem.SubCategory,
            TargetAudience = poolItem.TargetAudience,
            SortOrder = sortOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Set<IssueSurveyQuestion>().Add(question);
        poolItem.UsageCount++;
        poolItem.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return poolItem;
    }

    public async Task<IssueSurveyResponse> SubmitResponseAsync(IssueSurveyResponse response)
    {
        var existing = await _db.Set<IssueSurveyResponse>()
            .FirstOrDefaultAsync(r =>
                r.SurveyId == response.SurveyId &&
                r.QuestionId == response.QuestionId &&
                r.RespondentId == response.RespondentId);
        if (existing != null)
        {
            existing.Score = response.Score;
            existing.AnsweredAt = DateTime.UtcNow;
        }
        else
        {
            _db.Set<IssueSurveyResponse>().Add(response);
        }
        await _db.SaveChangesAsync();
        return response;
    }

    public async Task<List<IssueSurveyResponse>> GetSurveyResponsesAsync(int surveyId)
    {
        return await _db.Set<IssueSurveyResponse>()
            .Where(r => r.SurveyId == surveyId)
            .Include(r => r.Question)
            .Include(r => r.Respondent)
            .OrderBy(r => r.AnsweredAt)
            .ToListAsync();
    }

    public async Task<List<IssueSurveyResponse>> GetRespondentResponsesAsync(int surveyId, int respondentId)
    {
        return await _db.Set<IssueSurveyResponse>()
            .Where(r => r.SurveyId == surveyId && r.RespondentId == respondentId)
            .Include(r => r.Question)
            .ToListAsync();
    }

    public async Task<IssueSurveyComment> AddCommentAsync(IssueSurveyComment comment)
    {
        _db.Set<IssueSurveyComment>().Add(comment);
        await _db.SaveChangesAsync();
        return comment;
    }

    public async Task<List<IssueSurveyComment>> GetSurveyCommentsAsync(int surveyId)
    {
        return await _db.Set<IssueSurveyComment>()
            .Where(c => c.SurveyId == surveyId)
            .Include(c => c.Respondent)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<IssueAction> CreateActionAsync(IssueAction action)
    {
        _db.Set<IssueAction>().Add(action);
        await _db.SaveChangesAsync();
        return action;
    }

    public async Task<List<IssueAction>> GetSurveyActionsAsync(int surveyId)
    {
        return await _db.Set<IssueAction>()
            .Where(a => a.SurveyId == surveyId)
            .Include(a => a.AssignedTo)
            .Include(a => a.Question)
            .Include(a => a.Updates)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IssueAction> UpdateActionAsync(int id, IssueAction action)
    {
        var existing = await _db.Set<IssueAction>().FindAsync(id)
            ?? throw new KeyNotFoundException("Action not found");

        if (action.Title != null) existing.Title = action.Title;
        if (action.Description != null) existing.Description = action.Description;
        if (action.Priority != null) existing.Priority = action.Priority;
        if (action.Status != null) existing.Status = action.Status;
        if (action.AssignedToId.HasValue) existing.AssignedToId = action.AssignedToId;
        if (action.AssignedTeam != null) existing.AssignedTeam = action.AssignedTeam;
        if (action.TargetDate.HasValue) existing.TargetDate = action.TargetDate;
        if (action.KpiDefinition != null) existing.KpiDefinition = action.KpiDefinition;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<IssueAction> UpdateActionStatusAsync(int id, string newStatus, int updatedById, string note, int? progressPercent)
    {
        var action = await _db.Set<IssueAction>().FindAsync(id)
            ?? throw new KeyNotFoundException("Action not found");

        var previousStatus = action.Status;
        action.Status = newStatus;
        action.UpdatedAt = DateTime.UtcNow;
        if (newStatus == "completed")
            action.CompletedAt = DateTime.UtcNow;

        var update = new IssueActionUpdate
        {
            ActionId = id,
            UpdatedById = updatedById,
            PreviousStatus = previousStatus,
            NewStatus = newStatus,
            Note = note,
            ProgressPercent = progressPercent,
            CreatedAt = DateTime.UtcNow
        };
        _db.Set<IssueActionUpdate>().Add(update);
        await _db.SaveChangesAsync();

        return (await _db.Set<IssueAction>()
            .Include(a => a.AssignedTo)
            .Include(a => a.Question)
            .Include(a => a.Updates)
            .FirstOrDefaultAsync(a => a.Id == id))!;
    }

    public async Task<object> GetSurveyAnalyticsAsync(int surveyId)
    {
        var survey = await _db.Set<IssueSurvey>()
            .Include(s => s.Questions)
            .FirstOrDefaultAsync(s => s.Id == surveyId)
            ?? throw new KeyNotFoundException("Survey not found");

        var responses = await _db.Set<IssueSurveyResponse>()
            .Where(r => r.SurveyId == surveyId)
            .Include(r => r.Question)
            .ToListAsync();

        var respondentIds = responses.Select(r => r.RespondentId).Distinct().Count();
        var questions = survey.Questions.Where(q => q.IsActive).ToList();

        var questionStats = questions.Select(q =>
        {
            var qResponses = responses.Where(r => r.QuestionId == q.Id).ToList();
            var avg = qResponses.Any() ? qResponses.Average(r => r.Score) : 0;
            var stdDev = qResponses.Any()
                ? Math.Sqrt(qResponses.Average(r => Math.Pow(r.Score - avg, 2)))
                : 0;
            return new
            {
                questionId = q.Id,
                questionText = q.QuestionText,
                category = q.Category,
                averageScore = Math.Round(avg, 2),
                standardDeviation = Math.Round(stdDev, 2),
                responseCount = qResponses.Count,
                severity = avg < 1.7 ? "critical" : avg < 2.5 ? "problem" : "solvable"
            };
        }).ToList();

        var categoryBreakdown = questions
            .GroupBy(q => q.Category)
            .Select(g =>
            {
                var catResponses = responses.Where(r => g.Any(q => q.Id == r.QuestionId)).ToList();
                var avg = catResponses.Any() ? catResponses.Average(r => r.Score) : 0;
                return new
                {
                    category = g.Key,
                    averageScore = Math.Round(avg, 2),
                    questionCount = g.Count(),
                    severity = avg < 1.7 ? "critical" : avg < 2.5 ? "problem" : "solvable"
                };
            }).OrderBy(c => c.averageScore).ToList();

        var avg = questionStats.Any() ? questionStats.Average(q => q.averageScore) : 0;

        return new
        {
            surveyId = survey.Id,
            title = survey.Title,
            totalRespondents = respondentIds,
            totalQuestions = questions.Count,
            overallAverage = Math.Round(avg, 2),
            categoryBreakdown,
            topCriticalIssues = questionStats.Where(q => q.severity == "critical").OrderBy(q => q.averageScore).Take(10).ToList(),
            topStrengths = questionStats.Where(q => q.severity == "solvable").OrderByDescending(q => q.averageScore).Take(5).ToList()
        };
    }

    public async Task<List<object>> GetCategoryBreakdownAsync(int surveyId)
    {
        var analytics = await GetSurveyAnalyticsAsync(surveyId);
        var obj = (dynamic)analytics;
        return obj.categoryBreakdown;
    }

    public async Task<List<object>> GetTopCriticalIssuesAsync(int surveyId, int limit)
    {
        var analytics = await GetSurveyAnalyticsAsync(surveyId);
        var obj = (dynamic)analytics;
        return ((List<object>)obj.topCriticalIssues).Take(limit).ToList();
    }

    public async Task<object> GetIssueDashboardSummaryAsync()
    {
        var activeSurveys = await _db.Set<IssueSurvey>().CountAsync(s => s.Status == "active");
        var openActions = await _db.Set<IssueAction>().CountAsync(a => a.Status != "completed" && a.Status != "cancelled");
        var completedActions = await _db.Set<IssueAction>().CountAsync(a => a.Status == "completed");
        var totalResponses = await _db.Set<IssueSurveyResponse>().CountAsync();
        var criticalResponses = await _db.Set<IssueSurveyResponse>().CountAsync(r => r.Score < 2);
        var criticalPercentage = totalResponses > 0 ? (double)criticalResponses / totalResponses * 100 : 0;

        return new
        {
            activeSurveys,
            openActions,
            completedActions,
            criticalIssuePercentage = Math.Round(criticalPercentage, 1),
            improvingTrendPercentage = 0.0 // placeholder for trend calculation
        };
    }

    public async Task<List<object>> GetSurveyTrendsAsync(int? count = 5)
    {
        var surveys = await _db.Set<IssueSurvey>()
            .Include(s => s.Responses)
            .Include(s => s.Questions)
            .Where(s => s.Status == "closed")
            .OrderByDescending(s => s.EndDate)
            .Take(count ?? 5)
            .ToListAsync();

        return surveys.Select(s =>
        {
            var avg = s.Responses.Any() ? s.Responses.Average(r => r.Score) : 0;
            return (object)new
            {
                surveyId = s.Id,
                title = s.Title,
                conductedAt = s.EndDate,
                overallAverage = Math.Round(avg, 2),
                responseCount = s.Responses.Select(r => r.RespondentId).Distinct().Count()
            };
        }).ToList();
    }

    public async Task<List<object>> ExportSurveyDataAsync(int surveyId, string format)
    {
        var responses = await _db.Set<IssueSurveyResponse>()
            .Where(r => r.SurveyId == surveyId)
            .Include(r => r.Question)
            .Include(r => r.Respondent)
            .ToListAsync();

        var comments = await _db.Set<IssueSurveyComment>()
            .Where(c => c.SurveyId == surveyId)
            .Include(c => c.Respondent)
            .ToListAsync();

        if (format == "json")
        {
            return responses.Select(r => (object)new
            {
                questionText = r.Question?.QuestionText,
                category = r.Question?.Category,
                respondentId = r.RespondentId,
                respondentName = r.Respondent?.Username,
                respondentRole = r.RespondentRole,
                score = r.Score,
                answeredAt = r.AnsweredAt
            }).ToList();
        }

        // Default: structured response list
        return responses.Select(r => (object)new
        {
            r.Id,
            r.SurveyId,
            QuestionText = r.Question?.QuestionText,
            Category = r.Question?.Category,
            r.RespondentId,
            RespondentName = r.Respondent?.Username,
            r.RespondentRole,
            r.Score,
            r.AnsweredAt
        }).ToList();
    }
}

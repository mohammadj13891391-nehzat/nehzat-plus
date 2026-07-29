using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalScience;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class ExperimentalScienceService : IExperimentalScienceService
    {
        private readonly AppDbContext _db;

        public ExperimentalScienceService(AppDbContext db)
        {
            _db = db;
        }

        // ========== Topic operations ==========

        public async Task<List<ExperimentTopic>> GetAllTopicsAsync(string? difficulty = null)
        {
            var query = _db.Set<ExperimentTopic>().AsQueryable();

            if (!string.IsNullOrWhiteSpace(difficulty))
                query = query.Where(t => t.DifficultyLevel == difficulty);

            return await query.OrderBy(t => t.SortOrder).ThenBy(t => t.Title).ToListAsync();
        }

        public async Task<ExperimentTopic?> GetTopicByIdAsync(int id)
        {
            return await _db.Set<ExperimentTopic>()
                .Include(t => t.Experiments.OrderBy(e => e.SortOrder))
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<ExperimentTopic> CreateTopicAsync(CreateExperimentTopicRequest request)
        {
            if (await _db.Set<ExperimentTopic>().AnyAsync(t => t.Title == request.Title.Trim()))
                throw new InvalidOperationException("عنوان موضوع تکراری است.");

            var entity = new ExperimentTopic
            {
                Title = request.Title.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                IconUrl = request.IconUrl?.Trim(),
                SortOrder = request.SortOrder
            };

            _db.Set<ExperimentTopic>().Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ExperimentTopic> UpdateTopicAsync(int id, UpdateExperimentTopicRequest request)
        {
            var existing = await _db.Set<ExperimentTopic>().FindAsync(id)
                ?? throw new KeyNotFoundException("موضوع یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.DifficultyLevel != null) existing.DifficultyLevel = request.DifficultyLevel.Trim();
            if (request.IconUrl != null) existing.IconUrl = request.IconUrl.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteTopicAsync(int id)
        {
            var entity = await _db.Set<ExperimentTopic>().FindAsync(id)
                ?? throw new KeyNotFoundException("موضوع یافت نشد.");
            _db.Set<ExperimentTopic>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ExperimentTopic>> SearchTopicsAsync(string query, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<ExperimentTopic>();

            return await _db.Set<ExperimentTopic>()
                .Where(t => t.Title.Contains(query) || t.Description.Contains(query))
                .OrderBy(t => t.SortOrder)
                .ThenBy(t => t.Title)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Experiment operations ==========

        public async Task<List<Experiment>> GetAllExperimentsAsync(int? topicId = null, string? difficulty = null)
        {
            var query = _db.Set<Experiment>()
                .Include(e => e.Topic)
                .AsQueryable();

            if (topicId.HasValue)
                query = query.Where(e => e.TopicId == topicId.Value);

            if (!string.IsNullOrWhiteSpace(difficulty))
                query = query.Where(e => e.DifficultyLevel == difficulty);

            return await query.OrderBy(e => e.SortOrder).ThenBy(e => e.Title).ToListAsync();
        }

        public async Task<Experiment?> GetExperimentByIdAsync(int id)
        {
            return await _db.Set<Experiment>()
                .Include(e => e.Topic)
                .Include(e => e.Analyses.OrderBy(a => a.SortOrder))
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Experiment> CreateExperimentAsync(CreateExperimentRequest request)
        {
            var topicExists = await _db.Set<ExperimentTopic>().AnyAsync(t => t.Id == request.TopicId);
            if (!topicExists)
                throw new KeyNotFoundException("موضوع یافت نشد.");

            var entity = new Experiment
            {
                TopicId = request.TopicId,
                Title = request.Title.Trim(),
                Objective = request.Objective?.Trim() ?? string.Empty,
                MaterialsNeeded = request.MaterialsNeeded?.Trim() ?? string.Empty,
                Procedure = request.Procedure?.Trim() ?? string.Empty,
                ExpectedResult = request.ExpectedResult?.Trim() ?? string.Empty,
                Content = request.Content?.Trim() ?? string.Empty,
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                EstimatedMinutes = request.EstimatedMinutes,
                SortOrder = request.SortOrder,
                VideoUrl = request.VideoUrl?.Trim()
            };

            _db.Set<Experiment>().Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Experiment> UpdateExperimentAsync(int id, UpdateExperimentRequest request)
        {
            var existing = await _db.Set<Experiment>().FindAsync(id)
                ?? throw new KeyNotFoundException("آزمایش یافت نشد.");

            if (request.TopicId.HasValue)
            {
                var topicExists = await _db.Set<ExperimentTopic>().AnyAsync(t => t.Id == request.TopicId.Value);
                if (!topicExists)
                    throw new KeyNotFoundException("موضوع یافت نشد.");
                existing.TopicId = request.TopicId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Objective != null) existing.Objective = request.Objective.Trim();
            if (request.MaterialsNeeded != null) existing.MaterialsNeeded = request.MaterialsNeeded.Trim();
            if (request.Procedure != null) existing.Procedure = request.Procedure.Trim();
            if (request.ExpectedResult != null) existing.ExpectedResult = request.ExpectedResult.Trim();
            if (request.Content != null) existing.Content = request.Content.Trim();
            if (request.DifficultyLevel != null) existing.DifficultyLevel = request.DifficultyLevel.Trim();
            if (request.EstimatedMinutes.HasValue) existing.EstimatedMinutes = request.EstimatedMinutes.Value;
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;
            if (request.VideoUrl != null) existing.VideoUrl = request.VideoUrl.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteExperimentAsync(int id)
        {
            var entity = await _db.Set<Experiment>().FindAsync(id)
                ?? throw new KeyNotFoundException("آزمایش یافت نشد.");
            _db.Set<Experiment>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Experiment>> SearchExperimentsAsync(string query, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<Experiment>();

            return await _db.Set<Experiment>()
                .Include(e => e.Topic)
                .Where(e => e.Title.Contains(query) || e.Objective.Contains(query) || e.Content.Contains(query))
                .OrderBy(e => e.SortOrder)
                .ThenBy(e => e.Title)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Analysis operations ==========

        public async Task<List<ExperimentAnalysis>> GetAnalysesByExperimentAsync(int experimentId)
        {
            return await _db.Set<ExperimentAnalysis>()
                .Where(a => a.ExperimentId == experimentId)
                .OrderBy(a => a.SortOrder)
                .ToListAsync();
        }

        public async Task<ExperimentAnalysis> CreateAnalysisAsync(CreateExperimentAnalysisRequest request)
        {
            var experimentExists = await _db.Set<Experiment>().AnyAsync(e => e.Id == request.ExperimentId);
            if (!experimentExists)
                throw new KeyNotFoundException("آزمایش یافت نشد.");

            var entity = new ExperimentAnalysis
            {
                ExperimentId = request.ExperimentId,
                Title = request.Title.Trim(),
                Content = request.Content?.Trim() ?? string.Empty,
                AnalysisType = request.AnalysisType?.Trim() ?? "scientific",
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                SortOrder = request.SortOrder
            };

            _db.Set<ExperimentAnalysis>().Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ExperimentAnalysis> UpdateAnalysisAsync(int id, UpdateExperimentAnalysisRequest request)
        {
            var existing = await _db.Set<ExperimentAnalysis>().FindAsync(id)
                ?? throw new KeyNotFoundException("تحلیل یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Content != null) existing.Content = request.Content.Trim();
            if (request.AnalysisType != null) existing.AnalysisType = request.AnalysisType.Trim();
            if (request.DifficultyLevel != null) existing.DifficultyLevel = request.DifficultyLevel.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteAnalysisAsync(int id)
        {
            var entity = await _db.Set<ExperimentAnalysis>().FindAsync(id)
                ?? throw new KeyNotFoundException("تحلیل یافت نشد.");
            _db.Set<ExperimentAnalysis>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Question operations ==========

        public async Task<List<ExperimentQuestion>> GetQuestionsByExperimentAsync(int experimentId)
        {
            return await _db.Set<ExperimentQuestion>()
                .Where(q => q.ExperimentId == experimentId)
                .ToListAsync();
        }

        public async Task<ExperimentQuestion> CreateQuestionAsync(CreateExperimentQuestionRequest request)
        {
            var experimentExists = await _db.Set<Experiment>().AnyAsync(e => e.Id == request.ExperimentId);
            if (!experimentExists)
                throw new KeyNotFoundException("آزمایش یافت نشد.");

            var entity = new ExperimentQuestion
            {
                ExperimentId = request.ExperimentId,
                QuestionType = request.QuestionType?.Trim() ?? "multiple-choice",
                QuestionText = request.QuestionText.Trim(),
                OptionsJson = request.OptionsJson?.Trim() ?? "[]",
                Points = request.Points,
                DifficultyRating = request.DifficultyRating,
                TopicTag = request.TopicTag?.Trim(),
                CorrectAnswerJson = request.CorrectAnswerJson?.Trim() ?? string.Empty
            };

            _db.Set<ExperimentQuestion>().Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteQuestionAsync(int id)
        {
            var entity = await _db.Set<ExperimentQuestion>().FindAsync(id)
                ?? throw new KeyNotFoundException("سوال یافت نشد.");
            _db.Set<ExperimentQuestion>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Attempt operations ==========

        public async Task<ExperimentAttempt> SubmitAttemptAsync(SubmitExperimentAttemptRequest request)
        {
            var studentExists = await _db.Students.AnyAsync(s => s.Id == request.StudentId);
            if (!studentExists)
                throw new KeyNotFoundException("دانش‌آموز یافت نشد.");

            var question = await _db.Set<ExperimentQuestion>().FindAsync(request.QuestionId)
                ?? throw new KeyNotFoundException("سوال یافت نشد.");

            var isCorrect = string.Equals(
                request.SelectedAnswer?.Trim(),
                question.CorrectAnswerJson?.Trim(),
                StringComparison.OrdinalIgnoreCase);

            var entity = new ExperimentAttempt
            {
                StudentId = request.StudentId,
                QuestionId = request.QuestionId,
                SelectedAnswer = request.SelectedAnswer?.Trim() ?? string.Empty,
                IsCorrect = isCorrect,
                AttemptNumber = request.AttemptNumber,
                TimeSpentSeconds = request.TimeSpentSeconds
            };

            _db.Set<ExperimentAttempt>().Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<List<ExperimentAttempt>> GetAttemptsByStudentAsync(int studentId)
        {
            return await _db.Set<ExperimentAttempt>()
                .Include(a => a.Question)
                .Where(a => a.StudentId == studentId)
                .OrderByDescending(a => a.AttemptedAt)
                .ToListAsync();
        }

        // ========== Progress operations ==========

        public async Task<ExperimentProgress?> GetProgressAsync(int studentId, int experimentId)
        {
            return await _db.Set<ExperimentProgress>()
                .Include(p => p.Experiment)
                .FirstOrDefaultAsync(p => p.StudentId == studentId && p.ExperimentId == experimentId);
        }

        public async Task<ExperimentProgress> UpdateProgressAsync(UpdateExperimentProgressRequest request)
        {
            var existing = await _db.Set<ExperimentProgress>()
                .FirstOrDefaultAsync(p => p.StudentId == request.StudentId && p.ExperimentId == request.ExperimentId);

            if (existing == null)
            {
                var studentExists = await _db.Students.AnyAsync(s => s.Id == request.StudentId);
                if (!studentExists)
                    throw new KeyNotFoundException("دانش‌آموز یافت نشد.");

                var experimentExists = await _db.Set<Experiment>().AnyAsync(e => e.Id == request.ExperimentId);
                if (!experimentExists)
                    throw new KeyNotFoundException("آزمایش یافت نشد.");

                existing = new ExperimentProgress
                {
                    StudentId = request.StudentId,
                    ExperimentId = request.ExperimentId,
                    Status = request.Status?.Trim() ?? "not_started",
                    Score = request.Score,
                    TimeSpentMinutes = request.TimeSpentMinutes,
                    AttemptCount = request.AttemptCount
                };

                _db.Set<ExperimentProgress>().Add(existing);
            }
            else
            {
                if (request.Status != null) existing.Status = request.Status.Trim();
                existing.Score = request.Score;
                existing.TimeSpentMinutes = request.TimeSpentMinutes;
                existing.AttemptCount = request.AttemptCount;
            }

            if (existing.Status == "completed" || existing.Status == "passed")
                existing.CompletedAt ??= DateTime.UtcNow;

            existing.LastActivityAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task<List<ExperimentProgress>> GetOverallProgressAsync(int studentId)
        {
            return await _db.Set<ExperimentProgress>()
                .Include(p => p.Experiment)
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.LastActivityAt)
                .ToListAsync();
        }

        // ========== Dashboard ==========

        public async Task<object> GetDashboardStatsAsync()
        {
            var topicCount = await _db.Set<ExperimentTopic>().CountAsync();
            var experimentCount = await _db.Set<Experiment>().CountAsync();
            var analysisCount = await _db.Set<ExperimentAnalysis>().CountAsync();
            var questionCount = await _db.Set<ExperimentQuestion>().CountAsync();
            var attemptCount = await _db.Set<ExperimentAttempt>().CountAsync();
            var difficultyCount = await _db.Set<ExperimentTopic>()
                .Select(t => t.DifficultyLevel)
                .Distinct()
                .CountAsync();

            return new
            {
                totalTopics = topicCount,
                totalExperiments = experimentCount,
                totalAnalyses = analysisCount,
                totalQuestions = questionCount,
                totalAttempts = attemptCount,
                distinctDifficultyLevels = difficultyCount
            };
        }
    }
}
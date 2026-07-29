using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class MathService : IMathService
    {
        private readonly AppDbContext _db;

        public MathService(AppDbContext db)
        {
            _db = db;
        }

        // ========== Topic operations ==========

        public async Task<List<MathTopic>> GetAllTopicsAsync()
        {
            return await _db.MathTopics
                .OrderBy(t => t.DisplayOrder)
                .ThenBy(t => t.Title)
                .ToListAsync();
        }

        public async Task<MathTopic?> FindTopicByIdAsync(int id)
        {
            return await _db.MathTopics
                .Include(t => t.Lessons.OrderBy(l => l.DisplayOrder))
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<MathTopic> CreateTopicAsync(MathTopic topic)
        {
            if (await _db.MathTopics.AnyAsync(t => t.Title == topic.Title.Trim()))
                throw new InvalidOperationException("عنوان تکراری است");

            var entity = new MathTopic
            {
                Title = topic.Title.Trim(),
                Description = topic.Description?.Trim(),
                DifficultyLevel = topic.DifficultyLevel?.Trim() ?? string.Empty,
                IconUrl = topic.IconUrl?.Trim(),
                DisplayOrder = topic.DisplayOrder,
                IsActive = topic.IsActive
            };

            _db.MathTopics.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<MathTopic> UpdateTopicAsync(int id, MathTopic topic)
        {
            var existing = await _db.MathTopics.FindAsync(id)
                ?? throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");

            if (!string.IsNullOrWhiteSpace(topic.Title) && topic.Title.Trim() != existing.Title)
            {
                if (await _db.MathTopics.AnyAsync(t => t.Title == topic.Title.Trim()))
                    throw new InvalidOperationException("عنوان تکراری است");
                existing.Title = topic.Title.Trim();
            }
            if (topic.Description != null) existing.Description = topic.Description.Trim();
            if (!string.IsNullOrWhiteSpace(topic.DifficultyLevel)) existing.DifficultyLevel = topic.DifficultyLevel.Trim();
            if (topic.IconUrl != null) existing.IconUrl = topic.IconUrl.Trim();
            if (topic.DisplayOrder != 0) existing.DisplayOrder = topic.DisplayOrder;
            existing.IsActive = topic.IsActive;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteTopicAsync(int id)
        {
            var existing = await _db.MathTopics.FindAsync(id)
                ?? throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");
            _db.MathTopics.Remove(existing);
            await _db.SaveChangesAsync();
        }

        public async Task<List<MathTopic>> SearchTopicsAsync(string query, int maxResults = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<MathTopic>();

            return await _db.MathTopics
                .Where(t => t.Title.Contains(query) || (t.Description != null && t.Description.Contains(query)))
                .OrderBy(t => t.DisplayOrder)
                .ThenBy(t => t.Title)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Lesson operations ==========

        public async Task<List<MathLesson>> GetAllLessonsAsync(int? topicId = null)
        {
            var query = _db.MathLessons
                .Include(l => l.Topic)
                .AsQueryable();

            if (topicId.HasValue)
                query = query.Where(l => l.MathTopicId == topicId.Value);

            return await query
                .OrderBy(l => l.DisplayOrder)
                .ThenBy(l => l.Title)
                .ToListAsync();
        }

        public async Task<MathLesson?> FindLessonByIdAsync(int id)
        {
            return await _db.MathLessons
                .Include(l => l.Topic)
                .Include(l => l.Questions)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<MathLesson> CreateLessonAsync(MathLesson lesson)
        {
            var topicExists = await _db.MathTopics.AnyAsync(t => t.Id == lesson.MathTopicId);
            if (!topicExists)
                throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");

            if (await _db.MathLessons.AnyAsync(l => l.Title == lesson.Title.Trim() && l.MathTopicId == lesson.MathTopicId))
                throw new InvalidOperationException("عنوان تکراری است");

            var entity = new MathLesson
            {
                MathTopicId = lesson.MathTopicId,
                Title = lesson.Title.Trim(),
                Content = lesson.Content?.Trim() ?? string.Empty,
                Summary = lesson.Summary?.Trim(),
                VideoUrl = lesson.VideoUrl?.Trim(),
                DurationMinutes = lesson.DurationMinutes,
                DisplayOrder = lesson.DisplayOrder,
                IsPublished = lesson.IsPublished
            };

            _db.MathLessons.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<MathLesson> UpdateLessonAsync(int id, MathLesson lesson)
        {
            var existing = await _db.MathLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس ریاضی یافت نشد");

            if (lesson.MathTopicId != 0 && lesson.MathTopicId != existing.MathTopicId)
            {
                var topicExists = await _db.MathTopics.AnyAsync(t => t.Id == lesson.MathTopicId);
                if (!topicExists)
                    throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");
                existing.MathTopicId = lesson.MathTopicId;
            }
            if (!string.IsNullOrWhiteSpace(lesson.Title)) existing.Title = lesson.Title.Trim();
            if (lesson.Content != null) existing.Content = lesson.Content.Trim();
            if (lesson.Summary != null) existing.Summary = lesson.Summary.Trim();
            if (lesson.VideoUrl != null) existing.VideoUrl = lesson.VideoUrl.Trim();
            if (lesson.DurationMinutes != 0) existing.DurationMinutes = lesson.DurationMinutes;
            if (lesson.DisplayOrder != 0) existing.DisplayOrder = lesson.DisplayOrder;
            existing.IsPublished = lesson.IsPublished;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteLessonAsync(int id)
        {
            var existing = await _db.MathLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس ریاضی یافت نشد");
            _db.MathLessons.Remove(existing);
            await _db.SaveChangesAsync();
        }

        public async Task<List<MathLesson>> SearchLessonsAsync(string query, int maxResults = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<MathLesson>();

            return await _db.MathLessons
                .Include(l => l.Topic)
                .Where(l => l.Title.Contains(query) || l.Content.Contains(query))
                .OrderBy(l => l.DisplayOrder)
                .ThenBy(l => l.Title)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Question operations ==========

        public async Task<List<MathQuestion>> GetAllQuestionsAsync(int? lessonId = null)
        {
            var query = _db.MathQuestions
                .Include(q => q.Lesson)
                .AsQueryable();

            if (lessonId.HasValue)
                query = query.Where(q => q.MathLessonId == lessonId.Value);

            return await query
                .OrderBy(q => q.Id)
                .ToListAsync();
        }

        public async Task<MathQuestion?> FindQuestionByIdAsync(int id)
        {
            return await _db.MathQuestions
                .Include(q => q.Lesson)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<MathQuestion> CreateQuestionAsync(MathQuestion question)
        {
            var lessonExists = await _db.MathLessons.AnyAsync(l => l.Id == question.MathLessonId);
            if (!lessonExists)
                throw new KeyNotFoundException("درس ریاضی یافت نشد");

            var entity = new MathQuestion
            {
                MathLessonId = question.MathLessonId,
                QuestionText = question.QuestionText.Trim(),
                OptionA = question.OptionA.Trim(),
                OptionB = question.OptionB.Trim(),
                OptionC = question.OptionC.Trim(),
                OptionD = question.OptionD.Trim(),
                CorrectOption = question.CorrectOption.Trim().ToUpperInvariant(),
                Explanation = question.Explanation?.Trim(),
                DifficultyLevel = question.DifficultyLevel?.Trim() ?? string.Empty,
                Points = question.Points
            };

            _db.MathQuestions.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<MathQuestion> UpdateQuestionAsync(int id, MathQuestion question)
        {
            var existing = await _db.MathQuestions.FindAsync(id)
                ?? throw new KeyNotFoundException("سؤال ریاضی یافت نشد");

            if (question.MathLessonId != 0 && question.MathLessonId != existing.MathLessonId)
            {
                var lessonExists = await _db.MathLessons.AnyAsync(l => l.Id == question.MathLessonId);
                if (!lessonExists)
                    throw new KeyNotFoundException("درس ریاضی یافت نشد");
                existing.MathLessonId = question.MathLessonId;
            }
            if (!string.IsNullOrWhiteSpace(question.QuestionText)) existing.QuestionText = question.QuestionText.Trim();
            if (!string.IsNullOrWhiteSpace(question.OptionA)) existing.OptionA = question.OptionA.Trim();
            if (!string.IsNullOrWhiteSpace(question.OptionB)) existing.OptionB = question.OptionB.Trim();
            if (!string.IsNullOrWhiteSpace(question.OptionC)) existing.OptionC = question.OptionC.Trim();
            if (!string.IsNullOrWhiteSpace(question.OptionD)) existing.OptionD = question.OptionD.Trim();
            if (!string.IsNullOrWhiteSpace(question.CorrectOption)) existing.CorrectOption = question.CorrectOption.Trim().ToUpperInvariant();
            if (question.Explanation != null) existing.Explanation = question.Explanation.Trim();
            if (!string.IsNullOrWhiteSpace(question.DifficultyLevel)) existing.DifficultyLevel = question.DifficultyLevel.Trim();
            if (question.Points != 0) existing.Points = question.Points;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuestionAsync(int id)
        {
            var existing = await _db.MathQuestions.FindAsync(id)
                ?? throw new KeyNotFoundException("سؤال ریاضی یافت نشد");
            _db.MathQuestions.Remove(existing);
            await _db.SaveChangesAsync();
        }

        // ========== Progress operations ==========

        public async Task<List<MathProgress>> GetStudentProgressAsync(int studentId)
        {
            return await _db.MathProgresses
                .Include(p => p.Lesson)
                .Where(p => p.StudentId == studentId)
                .OrderByDescending(p => p.UpdatedAt)
                .ToListAsync();
        }

        public async Task<MathProgress?> GetStudentLessonProgressAsync(int studentId, int lessonId)
        {
            return await _db.MathProgresses
                .Include(p => p.Lesson)
                .Include(p => p.Question)
                .FirstOrDefaultAsync(p => p.StudentId == studentId && p.MathLessonId == lessonId);
        }

        public async Task<MathProgress> RecordProgressAsync(MathProgress progress)
        {
            var lessonExists = await _db.MathLessons.AnyAsync(l => l.Id == progress.MathLessonId);
            if (!lessonExists)
                throw new KeyNotFoundException("درس ریاضی یافت نشد");

            var entity = new MathProgress
            {
                StudentId = progress.StudentId,
                MathLessonId = progress.MathLessonId,
                MathQuestionId = progress.MathQuestionId,
                IsCompleted = progress.IsCompleted,
                Score = progress.Score,
                AttemptCount = progress.AttemptCount,
                CompletedAt = progress.IsCompleted ? DateTime.UtcNow : null
            };

            _db.MathProgresses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<MathProgress> UpdateProgressAsync(int id, MathProgress progress)
        {
            var existing = await _db.MathProgresses.FindAsync(id)
                ?? throw new KeyNotFoundException("پیشرفت ریاضی یافت نشد");

            if (progress.IsCompleted != existing.IsCompleted)
            {
                existing.IsCompleted = progress.IsCompleted;
                existing.CompletedAt = progress.IsCompleted ? DateTime.UtcNow : null;
            }
            if (progress.Score.HasValue) existing.Score = progress.Score;
            if (progress.AttemptCount != 0) existing.AttemptCount = progress.AttemptCount;
            if (progress.MathQuestionId.HasValue) existing.MathQuestionId = progress.MathQuestionId;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        // ========== Scholar operations ==========

        public async Task<List<MathScholar>> GetAllScholarsAsync()
        {
            return await _db.MathScholars
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<MathScholar?> FindScholarByIdAsync(int id)
        {
            return await _db.MathScholars
                .Include(s => s.Contributions)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<MathScholar> CreateScholarAsync(MathScholar scholar)
        {
            if (await _db.MathScholars.AnyAsync(s => s.Name == scholar.Name.Trim()))
                throw new InvalidOperationException("عنوان تکراری است");

            var entity = new MathScholar
            {
                Name = scholar.Name.Trim(),
                NameArabic = scholar.NameArabic?.Trim(),
                BirthYear = scholar.BirthYear?.Trim(),
                DeathYear = scholar.DeathYear?.Trim(),
                BirthPlace = scholar.BirthPlace?.Trim(),
                Biography = scholar.Biography?.Trim(),
                ImageUrl = scholar.ImageUrl?.Trim(),
                KnownFor = scholar.KnownFor?.Trim()
            };

            _db.MathScholars.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<MathScholar> UpdateScholarAsync(int id, MathScholar scholar)
        {
            var existing = await _db.MathScholars.FindAsync(id)
                ?? throw new KeyNotFoundException("دانشمند ریاضی یافت نشد");

            if (!string.IsNullOrWhiteSpace(scholar.Name) && scholar.Name.Trim() != existing.Name)
            {
                if (await _db.MathScholars.AnyAsync(s => s.Name == scholar.Name.Trim()))
                    throw new InvalidOperationException("عنوان تکراری است");
                existing.Name = scholar.Name.Trim();
            }
            if (scholar.NameArabic != null) existing.NameArabic = scholar.NameArabic.Trim();
            if (scholar.BirthYear != null) existing.BirthYear = scholar.BirthYear.Trim();
            if (scholar.DeathYear != null) existing.DeathYear = scholar.DeathYear.Trim();
            if (scholar.BirthPlace != null) existing.BirthPlace = scholar.BirthPlace.Trim();
            if (scholar.Biography != null) existing.Biography = scholar.Biography.Trim();
            if (scholar.ImageUrl != null) existing.ImageUrl = scholar.ImageUrl.Trim();
            if (scholar.KnownFor != null) existing.KnownFor = scholar.KnownFor.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteScholarAsync(int id)
        {
            var existing = await _db.MathScholars.FindAsync(id)
                ?? throw new KeyNotFoundException("دانشمند ریاضی یافت نشد");
            _db.MathScholars.Remove(existing);
            await _db.SaveChangesAsync();
        }

        public async Task<List<MathScholar>> SearchScholarsAsync(string query, int maxResults = 10)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<MathScholar>();

            return await _db.MathScholars
                .Where(s => s.Name.Contains(query) || (s.KnownFor != null && s.KnownFor.Contains(query)))
                .OrderBy(s => s.Name)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Contribution operations ==========

        public async Task<List<MathContribution>> GetContributionsByTopicAsync(int topicId)
        {
            return await _db.MathContributions
                .Include(c => c.Scholar)
                .Include(c => c.Topic)
                .Where(c => c.MathTopicId == topicId)
                .OrderBy(c => c.YearRange)
                .ToListAsync();
        }

        public async Task<List<MathContribution>> GetContributionsByScholarAsync(int scholarId)
        {
            return await _db.MathContributions
                .Include(c => c.Scholar)
                .Include(c => c.Topic)
                .Where(c => c.MathScholarId == scholarId)
                .OrderBy(c => c.YearRange)
                .ToListAsync();
        }

        public async Task<MathContribution?> FindContributionByIdAsync(int id)
        {
            return await _db.MathContributions
                .Include(c => c.Scholar)
                .Include(c => c.Topic)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<MathContribution> CreateContributionAsync(MathContribution contribution)
        {
            var scholarExists = await _db.MathScholars.AnyAsync(s => s.Id == contribution.MathScholarId);
            if (!scholarExists)
                throw new KeyNotFoundException("دانشمند ریاضی یافت نشد");

            var topicExists = await _db.MathTopics.AnyAsync(t => t.Id == contribution.MathTopicId);
            if (!topicExists)
                throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");

            var entity = new MathContribution
            {
                MathScholarId = contribution.MathScholarId,
                MathTopicId = contribution.MathTopicId,
                Title = contribution.Title.Trim(),
                Description = contribution.Description?.Trim(),
                YearRange = contribution.YearRange?.Trim()
            };

            _db.MathContributions.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<MathContribution> UpdateContributionAsync(int id, MathContribution contribution)
        {
            var existing = await _db.MathContributions.FindAsync(id)
                ?? throw new KeyNotFoundException("مشارکت ریاضی یافت نشد");

            if (contribution.MathScholarId != 0 && contribution.MathScholarId != existing.MathScholarId)
            {
                var scholarExists = await _db.MathScholars.AnyAsync(s => s.Id == contribution.MathScholarId);
                if (!scholarExists)
                    throw new KeyNotFoundException("دانشمند ریاضی یافت نشد");
                existing.MathScholarId = contribution.MathScholarId;
            }
            if (contribution.MathTopicId != 0 && contribution.MathTopicId != existing.MathTopicId)
            {
                var topicExists = await _db.MathTopics.AnyAsync(t => t.Id == contribution.MathTopicId);
                if (!topicExists)
                    throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");
                existing.MathTopicId = contribution.MathTopicId;
            }
            if (!string.IsNullOrWhiteSpace(contribution.Title)) existing.Title = contribution.Title.Trim();
            if (contribution.Description != null) existing.Description = contribution.Description.Trim();
            if (contribution.YearRange != null) existing.YearRange = contribution.YearRange.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteContributionAsync(int id)
        {
            var existing = await _db.MathContributions.FindAsync(id)
                ?? throw new KeyNotFoundException("مشارکت ریاضی یافت نشد");
            _db.MathContributions.Remove(existing);
            await _db.SaveChangesAsync();
        }

        // ========== Dashboard ==========

        public async Task<Dictionary<string, object>> GetDashboardStatsAsync()
        {
            var topicCount = await _db.MathTopics.CountAsync();
            var lessonCount = await _db.MathLessons.CountAsync();
            var questionCount = await _db.MathQuestions.CountAsync();
            var scholarCount = await _db.MathScholars.CountAsync();
            var contributionCount = await _db.MathContributions.CountAsync();
            var studentCount = await _db.MathProgresses
                .Select(p => p.StudentId)
                .Distinct()
                .CountAsync();
            var difficultyCount = await _db.MathTopics
                .Where(t => t.DifficultyLevel != null && t.DifficultyLevel != string.Empty)
                .Select(t => t.DifficultyLevel)
                .Distinct()
                .CountAsync();

            return new Dictionary<string, object>
            {
                { "totalTopics", topicCount },
                { "totalLessons", lessonCount },
                { "totalQuestions", questionCount },
                { "totalScholars", scholarCount },
                { "totalContributions", contributionCount },
                { "activeStudents", studentCount },
                { "distinctDifficultyLevels", difficultyCount }
            };
        }
    }
}

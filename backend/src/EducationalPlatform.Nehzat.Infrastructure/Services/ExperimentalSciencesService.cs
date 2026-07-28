using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class ExperimentalSciencesService : IExperimentalSciencesService
    {
        private readonly AppDbContext _db;

        public ExperimentalSciencesService(AppDbContext db)
        {
            _db = db;
        }

        // Phase operations
        public async Task<List<Phase>> GetAllPhasesAsync()
        {
            return await _db.ExperimentalSciencesPhases
                .OrderBy(p => p.Order)
                .ToListAsync();
        }

        public async Task<Phase?> FindPhaseByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesPhases
                .Include(p => p.Topics)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Phase> CreatePhaseAsync(CreatePhaseRequest request)
        {
            var entity = new Phase
            {
                Title = request.Title.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                Order = request.Order,
                Icon = request.Icon?.Trim() ?? string.Empty
            };

            _db.ExperimentalSciencesPhases.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Phase> UpdatePhaseAsync(int id, UpdatePhaseRequest request)
        {
            var existing = await _db.ExperimentalSciencesPhases.FindAsync(id)
                ?? throw new KeyNotFoundException("فاز یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Order.HasValue) existing.Order = request.Order.Value;
            if (request.Icon != null) existing.Icon = request.Icon.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeletePhaseAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesPhases.FindAsync(id)
                ?? throw new KeyNotFoundException("فاز یافت نشد.");
            _db.ExperimentalSciencesPhases.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // Topic operations
        public async Task<List<Topic>> GetAllTopicsAsync()
        {
            return await _db.ExperimentalSciencesTopics
                .Include(t => t.Phase)
                .OrderBy(t => t.PhaseId)
                .ThenBy(t => t.Order)
                .ToListAsync();
        }

        public async Task<List<Topic>> GetTopicsByPhaseIdAsync(int phaseId)
        {
            return await _db.ExperimentalSciencesTopics
                .Where(t => t.PhaseId == phaseId)
                .OrderBy(t => t.Order)
                .ToListAsync();
        }

        public async Task<Topic?> FindTopicByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesTopics
                .Include(t => t.Phase)
                .Include(t => t.Lessons)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<Topic> CreateTopicAsync(CreateTopicRequest request)
        {
            var phaseExists = await _db.ExperimentalSciencesPhases.AnyAsync(p => p.Id == request.PhaseId);
            if (!phaseExists)
                throw new InvalidOperationException("فاز مورد نظر یافت نشد.");

            var entity = new Topic
            {
                PhaseId = request.PhaseId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                Order = request.Order,
                DifficultyLevel = request.DifficultyLevel,
                Icon = request.Icon?.Trim() ?? string.Empty
            };

            _db.ExperimentalSciencesTopics.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Topic> UpdateTopicAsync(int id, UpdateTopicRequest request)
        {
            var existing = await _db.ExperimentalSciencesTopics.FindAsync(id)
                ?? throw new KeyNotFoundException("موضوع یافت نشد.");

            if (request.PhaseId.HasValue)
            {
                var phaseExists = await _db.ExperimentalSciencesPhases.AnyAsync(p => p.Id == request.PhaseId.Value);
                if (!phaseExists)
                    throw new InvalidOperationException("فاز مورد نظر یافت نشد.");
                existing.PhaseId = request.PhaseId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Order.HasValue) existing.Order = request.Order.Value;
            if (request.DifficultyLevel.HasValue) existing.DifficultyLevel = request.DifficultyLevel.Value;
            if (request.Icon != null) existing.Icon = request.Icon.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteTopicAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesTopics.FindAsync(id)
                ?? throw new KeyNotFoundException("موضوع یافت نشد.");
            _db.ExperimentalSciencesTopics.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // Lesson operations
        public async Task<List<Lesson>> GetAllLessonsAsync()
        {
            return await _db.ExperimentalSciencesLessons
                .Include(l => l.Topic)
                .OrderBy(l => l.TopicId)
                .ThenBy(l => l.Order)
                .ToListAsync();
        }

        public async Task<List<Lesson>> GetLessonsByTopicIdAsync(int topicId)
        {
            return await _db.ExperimentalSciencesLessons
                .Where(l => l.TopicId == topicId)
                .OrderBy(l => l.Order)
                .ToListAsync();
        }

        public async Task<Lesson?> FindLessonByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesLessons
                .Include(l => l.Topic)
                .Include(l => l.Experiments)
                .Include(l => l.Quiz)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Lesson> CreateLessonAsync(CreateLessonRequest request)
        {
            var topicExists = await _db.ExperimentalSciencesTopics.AnyAsync(t => t.Id == request.TopicId);
            if (!topicExists)
                throw new InvalidOperationException("موضوع مورد نظر یافت نشد.");

            var entity = new Lesson
            {
                TopicId = request.TopicId,
                Title = request.Title.Trim(),
                Content = request.Content?.Trim() ?? string.Empty,
                VideoUrl = request.VideoUrl?.Trim() ?? string.Empty,
                Order = request.Order,
                EstimatedMinutes = request.EstimatedMinutes
            };

            _db.ExperimentalSciencesLessons.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Lesson> UpdateLessonAsync(int id, UpdateLessonRequest request)
        {
            var existing = await _db.ExperimentalSciencesLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس یافت نشد.");

            if (request.TopicId.HasValue)
            {
                var topicExists = await _db.ExperimentalSciencesTopics.AnyAsync(t => t.Id == request.TopicId.Value);
                if (!topicExists)
                    throw new InvalidOperationException("موضوع مورد نظر یافت نشد.");
                existing.TopicId = request.TopicId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Content != null) existing.Content = request.Content.Trim();
            if (request.VideoUrl != null) existing.VideoUrl = request.VideoUrl.Trim();
            if (request.Order.HasValue) existing.Order = request.Order.Value;
            if (request.EstimatedMinutes.HasValue) existing.EstimatedMinutes = request.EstimatedMinutes.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteLessonAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس یافت نشد.");
            _db.ExperimentalSciencesLessons.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // Experiment operations
        public async Task<List<Experiment>> GetAllExperimentsAsync()
        {
            return await _db.ExperimentalSciencesExperiments
                .Include(e => e.Lesson)
                .OrderBy(e => e.LessonId)
                .ThenBy(e => e.Order)
                .ToListAsync();
        }

        public async Task<List<Experiment>> GetExperimentsByLessonIdAsync(int lessonId)
        {
            return await _db.ExperimentalSciencesExperiments
                .Where(e => e.LessonId == lessonId)
                .OrderBy(e => e.Order)
                .ToListAsync();
        }

        public async Task<Experiment?> FindExperimentByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesExperiments
                .Include(e => e.Lesson)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Experiment> CreateExperimentAsync(CreateExperimentRequest request)
        {
            var lessonExists = await _db.ExperimentalSciencesLessons.AnyAsync(l => l.Id == request.LessonId);
            if (!lessonExists)
                throw new InvalidOperationException("درس مورد نظر یافت نشد.");

            var entity = new Experiment
            {
                LessonId = request.LessonId,
                Title = request.Title.Trim(),
                Materials = request.Materials?.Trim() ?? string.Empty,
                Steps = request.Steps?.Trim() ?? string.Empty,
                ExpectedResult = request.ExpectedResult?.Trim() ?? string.Empty,
                SafetyNotes = request.SafetyNotes?.Trim() ?? string.Empty,
                Order = request.Order,
                EstimatedMinutes = request.EstimatedMinutes
            };

            _db.ExperimentalSciencesExperiments.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Experiment> UpdateExperimentAsync(int id, UpdateExperimentRequest request)
        {
            var existing = await _db.ExperimentalSciencesExperiments.FindAsync(id)
                ?? throw new KeyNotFoundException("آزمایش یافت نشد.");

            if (request.LessonId.HasValue)
            {
                var lessonExists = await _db.ExperimentalSciencesLessons.AnyAsync(l => l.Id == request.LessonId.Value);
                if (!lessonExists)
                    throw new InvalidOperationException("درس مورد نظر یافت نشد.");
                existing.LessonId = request.LessonId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Materials != null) existing.Materials = request.Materials.Trim();
            if (request.Steps != null) existing.Steps = request.Steps.Trim();
            if (request.ExpectedResult != null) existing.ExpectedResult = request.ExpectedResult.Trim();
            if (request.SafetyNotes != null) existing.SafetyNotes = request.SafetyNotes.Trim();
            if (request.Order.HasValue) existing.Order = request.Order.Value;
            if (request.EstimatedMinutes.HasValue) existing.EstimatedMinutes = request.EstimatedMinutes.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteExperimentAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesExperiments.FindAsync(id)
                ?? throw new KeyNotFoundException("آزمایش یافت نشد.");
            _db.ExperimentalSciencesExperiments.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // Quiz operations
        public async Task<List<Quiz>> GetAllQuizzesAsync()
        {
            return await _db.ExperimentalSciencesQuizzes
                .Include(q => q.Lesson)
                .ToListAsync();
        }

        public async Task<Quiz?> FindQuizByLessonIdAsync(int lessonId)
        {
            return await _db.ExperimentalSciencesQuizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.LessonId == lessonId);
        }

        public async Task<Quiz?> FindQuizByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesQuizzes
                .Include(q => q.Lesson)
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<Quiz> CreateQuizAsync(CreateExpSciQuizRequest request)
        {
            var lessonExists = await _db.ExperimentalSciencesLessons.AnyAsync(l => l.Id == request.LessonId);
            if (!lessonExists)
                throw new InvalidOperationException("درس مورد نظر یافت نشد.");

            var existingQuiz = await _db.ExperimentalSciencesQuizzes.FirstOrDefaultAsync(q => q.LessonId == request.LessonId);
            if (existingQuiz != null)
                throw new InvalidOperationException("این درس قبلاً آزمون دارد.");

            var entity = new Quiz
            {
                LessonId = request.LessonId,
                Title = request.Title.Trim(),
                PassingScore = request.PassingScore,
                TimeLimitMinutes = request.TimeLimitMinutes
            };

            _db.ExperimentalSciencesQuizzes.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Quiz> UpdateQuizAsync(int id, UpdateExpSciQuizRequest request)
        {
            var existing = await _db.ExperimentalSciencesQuizzes.FindAsync(id)
                ?? throw new KeyNotFoundException("آزمون یافت نشد.");

            if (request.LessonId.HasValue)
            {
                var lessonExists = await _db.ExperimentalSciencesLessons.AnyAsync(l => l.Id == request.LessonId.Value);
                if (!lessonExists)
                    throw new InvalidOperationException("درس مورد نظر یافت نشد.");
                existing.LessonId = request.LessonId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.PassingScore.HasValue) existing.PassingScore = request.PassingScore.Value;
            if (request.TimeLimitMinutes.HasValue) existing.TimeLimitMinutes = request.TimeLimitMinutes.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuizAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesQuizzes.FindAsync(id)
                ?? throw new KeyNotFoundException("آزمون یافت نشد.");
            _db.ExperimentalSciencesQuizzes.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // QuizQuestion operations
        public async Task<List<QuizQuestion>> GetAllQuizQuestionsAsync()
        {
            return await _db.ExperimentalSciencesQuizQuestions
                .Include(qq => qq.Quiz)
                .ToListAsync();
        }

        public async Task<List<QuizQuestion>> GetQuestionsByQuizIdAsync(int quizId)
        {
            return await _db.ExperimentalSciencesQuizQuestions
                .Where(qq => qq.QuizId == quizId)
                .OrderBy(qq => qq.Order)
                .ToListAsync();
        }

        public async Task<QuizQuestion?> FindQuizQuestionByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesQuizQuestions
                .Include(qq => qq.Quiz)
                .FirstOrDefaultAsync(qq => qq.Id == id);
        }

        public async Task<QuizQuestion> CreateQuizQuestionAsync(CreateExpSciQuizQuestionRequest request)
        {
            var quizExists = await _db.ExperimentalSciencesQuizzes.AnyAsync(q => q.Id == request.QuizId);
            if (!quizExists)
                throw new InvalidOperationException("آزمون مورد نظر یافت نشد.");

            var entity = new QuizQuestion
            {
                QuizId = request.QuizId,
                QuestionText = request.QuestionText.Trim(),
                Options = request.Options?.Trim() ?? "[]",
                CorrectAnswer = request.CorrectAnswer,
                Explanation = request.Explanation?.Trim() ?? string.Empty,
                Order = request.Order,
                Points = request.Points
            };

            _db.ExperimentalSciencesQuizQuestions.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<QuizQuestion> UpdateQuizQuestionAsync(int id, UpdateExpSciQuizQuestionRequest request)
        {
            var existing = await _db.ExperimentalSciencesQuizQuestions.FindAsync(id)
                ?? throw new KeyNotFoundException("سوال یافت نشد.");

            if (request.QuizId.HasValue)
            {
                var quizExists = await _db.ExperimentalSciencesQuizzes.AnyAsync(q => q.Id == request.QuizId.Value);
                if (!quizExists)
                    throw new InvalidOperationException("آزمون مورد نظر یافت نشد.");
                existing.QuizId = request.QuizId.Value;
            }
            if (request.QuestionText != null) existing.QuestionText = request.QuestionText.Trim();
            if (request.Options != null) existing.Options = request.Options.Trim();
            if (request.CorrectAnswer.HasValue) existing.CorrectAnswer = request.CorrectAnswer.Value;
            if (request.Explanation != null) existing.Explanation = request.Explanation.Trim();
            if (request.Order.HasValue) existing.Order = request.Order.Value;
            if (request.Points.HasValue) existing.Points = request.Points.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuizQuestionAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesQuizQuestions.FindAsync(id)
                ?? throw new KeyNotFoundException("سوال یافت نشد.");
            _db.ExperimentalSciencesQuizQuestions.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // StudentProgress operations
        public async Task<List<StudentProgress>> GetAllStudentProgressAsync()
        {
            return await _db.ExperimentalSciencesStudentProgresses
                .Include(sp => sp.Student)
                .Include(sp => sp.Topic)
                .ToListAsync();
        }

        public async Task<List<StudentProgress>> GetProgressByStudentIdAsync(int studentId)
        {
            return await _db.ExperimentalSciencesStudentProgresses
                .Include(sp => sp.Topic)
                .Where(sp => sp.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<List<StudentProgress>> GetProgressByTopicIdAsync(int topicId)
        {
            return await _db.ExperimentalSciencesStudentProgresses
                .Include(sp => sp.Student)
                .Where(sp => sp.TopicId == topicId)
                .ToListAsync();
        }

        public async Task<StudentProgress?> FindStudentProgressByIdAsync(int id)
        {
            return await _db.ExperimentalSciencesStudentProgresses
                .Include(sp => sp.Student)
                .Include(sp => sp.Topic)
                .FirstOrDefaultAsync(sp => sp.Id == id);
        }

        public async Task<StudentProgress> CreateStudentProgressAsync(CreateStudentProgressRequest request)
        {
            var studentExists = await _db.Students.AnyAsync(s => s.Id == request.StudentId);
            if (!studentExists)
                throw new InvalidOperationException("دانش‌آموز مورد نظر یافت نشد.");

            var topicExists = await _db.ExperimentalSciencesTopics.AnyAsync(t => t.Id == request.TopicId);
            if (!topicExists)
                throw new InvalidOperationException("موضوع مورد نظر یافت نشد.");

            var existingProgress = await _db.ExperimentalSciencesStudentProgresses
                .FirstOrDefaultAsync(sp => sp.StudentId == request.StudentId && sp.TopicId == request.TopicId);
            if (existingProgress != null)
                throw new InvalidOperationException("پیشرفت این دانش‌آموز برای این موضوع قبلاً ثبت شده است.");

            var entity = new StudentProgress
            {
                StudentId = request.StudentId,
                TopicId = request.TopicId,
                Status = request.Status,
                Score = request.Score,
                CompletedLessons = request.CompletedLessons,
                TotalLessons = request.TotalLessons
            };

            _db.ExperimentalSciencesStudentProgresses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<StudentProgress> UpdateStudentProgressAsync(int id, UpdateStudentProgressRequest request)
        {
            var existing = await _db.ExperimentalSciencesStudentProgresses.FindAsync(id)
                ?? throw new KeyNotFoundException("پیشرفت یافت نشد.");

            if (request.StudentId.HasValue)
            {
                var studentExists = await _db.Students.AnyAsync(s => s.Id == request.StudentId.Value);
                if (!studentExists)
                    throw new InvalidOperationException("دانش‌آموز مورد نظر یافت نشد.");
                existing.StudentId = request.StudentId.Value;
            }
            if (request.TopicId.HasValue)
            {
                var topicExists = await _db.ExperimentalSciencesTopics.AnyAsync(t => t.Id == request.TopicId.Value);
                if (!topicExists)
                    throw new InvalidOperationException("موضوع مورد نظر یافت نشد.");
                existing.TopicId = request.TopicId.Value;
            }
            if (request.Status.HasValue) existing.Status = request.Status.Value;
            if (request.Score.HasValue) existing.Score = request.Score.Value;
            if (request.CompletedLessons.HasValue) existing.CompletedLessons = request.CompletedLessons.Value;
            if (request.TotalLessons.HasValue) existing.TotalLessons = request.TotalLessons.Value;

            if (existing.Status == ProgressStatus.Completed && existing.CompletedAt == null)
                existing.CompletedAt = DateTime.UtcNow;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteStudentProgressAsync(int id)
        {
            var entity = await _db.ExperimentalSciencesStudentProgresses.FindAsync(id)
                ?? throw new KeyNotFoundException("پیشرفت یافت نشد.");
            _db.ExperimentalSciencesStudentProgresses.Remove(entity);
            await _db.SaveChangesAsync();
        }
    }
}

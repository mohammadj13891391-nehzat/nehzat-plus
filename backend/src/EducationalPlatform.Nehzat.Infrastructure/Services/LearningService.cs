using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using System.Text.Json;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class LearningService : ILearningService
    {
        private readonly AppDbContext _db;

        public LearningService(AppDbContext db)
        {
            _db = db;
        }

        // ========== LearningPath operations ==========

        public async Task<List<LearningPath>> GetAllPathsAsync()
        {
            return await _db.LearningPaths
                .OrderBy(p => p.SortOrder)
                .ThenBy(p => p.Title)
                .ToListAsync();
        }

        public async Task<LearningPath?> FindPathByIdAsync(int id)
        {
            return await _db.LearningPaths
                .Include(p => p.Levels.OrderBy(l => l.SortOrder))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<LearningPath> CreatePathAsync(CreateLearningPathRequest request)
        {
            var entity = new LearningPath
            {
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                Slug = request.Slug.Trim().ToLower().Replace(" ", "-"),
                AgeRangeMin = request.AgeRangeMin,
                AgeRangeMax = request.AgeRangeMax,
                IconUrl = request.IconUrl?.Trim(),
                ColorHex = request.ColorHex?.Trim(),
                SortOrder = request.SortOrder,
                IsActive = request.IsActive
            };

            _db.LearningPaths.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<LearningPath> UpdatePathAsync(int id, UpdateLearningPathRequest request)
        {
            var existing = await _db.LearningPaths.FindAsync(id)
                ?? throw new KeyNotFoundException("مسیر یادگیری یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Slug != null) existing.Slug = request.Slug.Trim().ToLower().Replace(" ", "-");
            if (request.AgeRangeMin.HasValue) existing.AgeRangeMin = request.AgeRangeMin.Value;
            if (request.AgeRangeMax.HasValue) existing.AgeRangeMax = request.AgeRangeMax.Value;
            if (request.IconUrl != null) existing.IconUrl = request.IconUrl.Trim();
            if (request.ColorHex != null) existing.ColorHex = request.ColorHex.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;
            if (request.IsActive.HasValue) existing.IsActive = request.IsActive.Value;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeletePathAsync(int id)
        {
            var entity = await _db.LearningPaths.FindAsync(id)
                ?? throw new KeyNotFoundException("مسیر یادگیری یافت نشد.");
            _db.LearningPaths.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Full tree ==========

        public async Task<LearningPathTreeDto> GetPathTreeAsync(int pathId)
        {
            var path = await _db.LearningPaths
                .Include(p => p.Levels.OrderBy(l => l.SortOrder))
                    .ThenInclude(l => l.Modules.OrderBy(m => m.SortOrder))
                        .ThenInclude(m => m.Lessons.OrderBy(ls => ls.SortOrder))
                .FirstOrDefaultAsync(p => p.Id == pathId)
                ?? throw new KeyNotFoundException("مسیر یادگیری یافت نشد.");

            return new LearningPathTreeDto(
                new LearningPathDto(
                    path.Id, path.Title, path.Description, path.Slug,
                    path.AgeRangeMin, path.AgeRangeMax, path.IconUrl,
                    path.ColorHex, path.IsActive, path.SortOrder,
                    path.CreatedAt, path.UpdatedAt
                ),
                path.Levels.Select(l => new LearningLevelTreeDto(
                    l.Id, l.LearningPathId, l.Title, l.Description,
                    l.LevelNumber, l.DifficultyLabel, l.SortOrder,
                    l.Modules.Select(m => new StudyModuleTreeDto(
                        m.Id, m.LearningLevelId, m.Title, m.Description,
                        m.EstimatedHours, m.SortOrder,
                        m.Lessons.Select(ls => new StudyLessonSummaryDto(
                            ls.Id, ls.StudyModuleId, ls.Title, ls.Description,
                            ls.EstimatedMinutes, ls.SortOrder
                        )).ToList()
                    )).ToList()
                )).ToList()
            );
        }

        // ========== LearningLevel operations ==========

        public async Task<List<LearningLevel>> GetLevelsAsync(int pathId)
        {
            return await _db.LearningLevels
                .Where(l => l.LearningPathId == pathId)
                .OrderBy(l => l.SortOrder)
                .ThenBy(l => l.LevelNumber)
                .ToListAsync();
        }

        public async Task<LearningLevel?> FindLevelByIdAsync(int id)
        {
            return await _db.LearningLevels
                .Include(l => l.Modules.OrderBy(m => m.SortOrder))
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<LearningLevel> CreateLevelAsync(CreateLearningLevelRequest request)
        {
            var pathExists = await _db.LearningPaths.AnyAsync(p => p.Id == request.LearningPathId);
            if (!pathExists)
                throw new KeyNotFoundException("مسیر یادگیری یافت نشد.");

            var entity = new LearningLevel
            {
                LearningPathId = request.LearningPathId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                LevelNumber = request.LevelNumber,
                DifficultyLabel = request.DifficultyLabel.Trim(),
                SortOrder = request.SortOrder
            };

            _db.LearningLevels.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<LearningLevel> UpdateLevelAsync(int id, UpdateLearningLevelRequest request)
        {
            var existing = await _db.LearningLevels.FindAsync(id)
                ?? throw new KeyNotFoundException("سطح یادگیری یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.LevelNumber.HasValue) existing.LevelNumber = request.LevelNumber.Value;
            if (request.DifficultyLabel != null) existing.DifficultyLabel = request.DifficultyLabel.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteLevelAsync(int id)
        {
            var entity = await _db.LearningLevels.FindAsync(id)
                ?? throw new KeyNotFoundException("سطح یادگیری یافت نشد.");
            _db.LearningLevels.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== StudyModule operations ==========

        public async Task<List<StudyModule>> GetModulesAsync(int levelId)
        {
            return await _db.StudyModules
                .Where(m => m.LearningLevelId == levelId)
                .OrderBy(m => m.SortOrder)
                .ThenBy(m => m.Title)
                .ToListAsync();
        }

        public async Task<StudyModule?> FindModuleByIdAsync(int id)
        {
            return await _db.StudyModules
                .Include(m => m.Lessons.OrderBy(ls => ls.SortOrder))
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<StudyModule> CreateModuleAsync(CreateStudyModuleRequest request)
        {
            var levelExists = await _db.LearningLevels.AnyAsync(l => l.Id == request.LearningLevelId);
            if (!levelExists)
                throw new KeyNotFoundException("سطح یادگیری یافت نشد.");

            var entity = new StudyModule
            {
                LearningLevelId = request.LearningLevelId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                EstimatedHours = request.EstimatedHours,
                LearningObjectives = request.LearningObjectives?.Trim(),
                SortOrder = request.SortOrder
            };

            _db.StudyModules.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<StudyModule> UpdateModuleAsync(int id, UpdateStudyModuleRequest request)
        {
            var existing = await _db.StudyModules.FindAsync(id)
                ?? throw new KeyNotFoundException("ماژول آموزشی یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.EstimatedHours.HasValue) existing.EstimatedHours = request.EstimatedHours.Value;
            if (request.LearningObjectives != null) existing.LearningObjectives = request.LearningObjectives.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteModuleAsync(int id)
        {
            var entity = await _db.StudyModules.FindAsync(id)
                ?? throw new KeyNotFoundException("ماژول آموزشی یافت نشد.");
            _db.StudyModules.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== StudyLesson operations ==========

        public async Task<List<StudyLesson>> GetLessonsAsync(int moduleId)
        {
            return await _db.StudyLessons
                .Where(ls => ls.StudyModuleId == moduleId)
                .OrderBy(ls => ls.SortOrder)
                .ThenBy(ls => ls.Title)
                .ToListAsync();
        }

        public async Task<StudyLesson?> FindLessonByIdAsync(int id)
        {
            return await _db.StudyLessons
                .Include(ls => ls.ContentBlocks.OrderBy(cb => cb.SortOrder))
                .Include(ls => ls.Quizzes.OrderBy(q => q.SortOrder))
                .FirstOrDefaultAsync(ls => ls.Id == id);
        }

        public async Task<StudyLesson> CreateLessonAsync(CreateStudyLessonRequest request)
        {
            var moduleExists = await _db.StudyModules.AnyAsync(m => m.Id == request.StudyModuleId);
            if (!moduleExists)
                throw new KeyNotFoundException("ماژول آموزشی یافت نشد.");

            if (request.PoemId.HasValue)
            {
                var poemExists = await _db.PersianLiteraturePoems.AnyAsync(p => p.Id == request.PoemId.Value);
                if (!poemExists)
                    throw new KeyNotFoundException("شعر یافت نشد.");
            }

            var entity = new StudyLesson
            {
                StudyModuleId = request.StudyModuleId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                EstimatedMinutes = request.EstimatedMinutes,
                PoemId = request.PoemId,
                SortOrder = request.SortOrder
            };

            _db.StudyLessons.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<StudyLesson> UpdateLessonAsync(int id, UpdateStudyLessonRequest request)
        {
            var existing = await _db.StudyLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.EstimatedMinutes.HasValue) existing.EstimatedMinutes = request.EstimatedMinutes.Value;
            if (request.PoemId.HasValue) existing.PoemId = request.PoemId.Value;
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteLessonAsync(int id)
        {
            var entity = await _db.StudyLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس یافت نشد.");
            _db.StudyLessons.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== LessonContentBlock operations ==========

        public async Task<List<LessonContentBlock>> GetContentBlocksAsync(int lessonId)
        {
            return await _db.LessonContentBlocks
                .Where(cb => cb.StudyLessonId == lessonId)
                .OrderBy(cb => cb.SortOrder)
                .ToListAsync();
        }

        public async Task<LessonContentBlock> CreateContentBlockAsync(CreateContentBlockRequest request)
        {
            var lessonExists = await _db.StudyLessons.AnyAsync(ls => ls.Id == request.StudyLessonId);
            if (!lessonExists)
                throw new KeyNotFoundException("درس یافت نشد.");

            var entity = new LessonContentBlock
            {
                StudyLessonId = request.StudyLessonId,
                BlockType = request.BlockType.Trim(),
                Title = request.Title?.Trim(),
                Content = request.Content?.Trim() ?? string.Empty,
                SortOrder = request.SortOrder
            };

            _db.LessonContentBlocks.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<LessonContentBlock> UpdateContentBlockAsync(int id, UpdateContentBlockRequest request)
        {
            var existing = await _db.LessonContentBlocks.FindAsync(id)
                ?? throw new KeyNotFoundException("بلاک محتوا یافت نشد.");

            if (request.BlockType != null) existing.BlockType = request.BlockType.Trim();
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Content != null) existing.Content = request.Content.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteContentBlockAsync(int id)
        {
            var entity = await _db.LessonContentBlocks.FindAsync(id)
                ?? throw new KeyNotFoundException("بلاک محتوا یافت نشد.");
            _db.LessonContentBlocks.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Quiz operations ==========

        public async Task<List<Quiz>> GetQuizzesAsync(int lessonId)
        {
            return await _db.Quizzes
                .Where(q => q.StudyLessonId == lessonId)
                .OrderBy(q => q.SortOrder)
                .ToListAsync();
        }

        public async Task<Quiz?> FindQuizByIdAsync(int id)
        {
            return await _db.Quizzes
                .Include(q => q.Questions.OrderBy(qq => qq.SortOrder))
                    .ThenInclude(qq => qq.Options.OrderBy(o => o.SortOrder))
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<Quiz> CreateQuizAsync(CreateLearningQuizRequest request)
        {
            var lessonExists = await _db.StudyLessons.AnyAsync(ls => ls.Id == request.StudyLessonId);
            if (!lessonExists)
                throw new KeyNotFoundException("درس یافت نشد.");

            var entity = new Quiz
            {
                StudyLessonId = request.StudyLessonId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                PassingScore = request.PassingScore,
                MaxAttempts = request.MaxAttempts,
                SortOrder = request.SortOrder
            };

            _db.Quizzes.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Quiz> UpdateQuizAsync(int id, UpdateLearningQuizRequest request)
        {
            var existing = await _db.Quizzes.FindAsync(id)
                ?? throw new KeyNotFoundException("کوئیز یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.PassingScore.HasValue) existing.PassingScore = request.PassingScore.Value;
            if (request.MaxAttempts.HasValue) existing.MaxAttempts = request.MaxAttempts.Value;
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuizAsync(int id)
        {
            var entity = await _db.Quizzes.FindAsync(id)
                ?? throw new KeyNotFoundException("کوئیز یافت نشد.");
            _db.Quizzes.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<QuizQuestion>> GetQuizQuestionsAsync(int quizId)
        {
            return await _db.QuizQuestions
                .Where(q => q.QuizId == quizId)
                .Include(q => q.Options.OrderBy(o => o.SortOrder))
                .OrderBy(q => q.SortOrder)
                .ToListAsync();
        }

        // ========== QuizQuestion operations ==========

        public async Task<QuizQuestion> CreateQuestionAsync(CreateLearningQuizQuestionRequest request)
        {
            var quizExists = await _db.Quizzes.AnyAsync(q => q.Id == request.QuizId);
            if (!quizExists)
                throw new KeyNotFoundException("کوئیز یافت نشد.");

            var entity = new QuizQuestion
            {
                QuizId = request.QuizId,
                QuestionText = request.QuestionText.Trim(),
                QuestionType = request.QuestionType.Trim(),
                Points = request.Points,
                SortOrder = request.SortOrder
            };

            _db.QuizQuestions.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<QuizQuestion> UpdateQuestionAsync(int id, UpdateLearningQuizQuestionRequest request)
        {
            var existing = await _db.QuizQuestions.FindAsync(id)
                ?? throw new KeyNotFoundException("سوال یافت نشد.");

            if (request.QuestionText != null) existing.QuestionText = request.QuestionText.Trim();
            if (request.QuestionType != null) existing.QuestionType = request.QuestionType.Trim();
            if (request.Points.HasValue) existing.Points = request.Points.Value;
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuestionAsync(int id)
        {
            var entity = await _db.QuizQuestions.FindAsync(id)
                ?? throw new KeyNotFoundException("سوال یافت نشد.");
            _db.QuizQuestions.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== QuizOption operations ==========

        public async Task<QuizOption> CreateOptionAsync(CreateQuizOptionRequest request)
        {
            var questionExists = await _db.QuizQuestions.AnyAsync(q => q.Id == request.QuizQuestionId);
            if (!questionExists)
                throw new KeyNotFoundException("سوال یافت نشد.");

            var entity = new QuizOption
            {
                QuizQuestionId = request.QuizQuestionId,
                OptionText = request.OptionText.Trim(),
                IsCorrect = request.IsCorrect,
                SortOrder = request.SortOrder
            };

            _db.QuizOptions.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<QuizOption> UpdateOptionAsync(int id, UpdateQuizOptionRequest request)
        {
            var existing = await _db.QuizOptions.FindAsync(id)
                ?? throw new KeyNotFoundException("گزینه یافت نشد.");

            if (request.OptionText != null) existing.OptionText = request.OptionText.Trim();
            if (request.IsCorrect.HasValue) existing.IsCorrect = request.IsCorrect.Value;
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteOptionAsync(int id)
        {
            var entity = await _db.QuizOptions.FindAsync(id)
                ?? throw new KeyNotFoundException("گزینه یافت نشد.");
            _db.QuizOptions.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== User enrollment operations ==========

        public async Task<UserEnrollment> EnrollUserAsync(EnrollUserRequest request)
        {
            var userExists = await _db.Users.AnyAsync(u => u.Id == request.UserId);
            if (!userExists)
                throw new KeyNotFoundException("کاربر یافت نشد.");

            var pathExists = await _db.LearningPaths.AnyAsync(p => p.Id == request.LearningPathId);
            if (!pathExists)
                throw new KeyNotFoundException("مسیر یادگیری یافت نشد.");

            var alreadyEnrolled = await _db.UserEnrollments
                .AnyAsync(e => e.UserId == request.UserId && e.LearningPathId == request.LearningPathId && e.Status == "active");
            if (alreadyEnrolled)
                throw new InvalidOperationException("کاربر قبلاً در این مسیر ثبت‌نام کرده است.");

            var entity = new UserEnrollment
            {
                UserId = request.UserId,
                LearningPathId = request.LearningPathId,
                Status = "active",
                EnrolledAt = DateTime.UtcNow
            };

            _db.UserEnrollments.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<List<UserEnrollment>> GetUserEnrollmentsAsync(int userId)
        {
            return await _db.UserEnrollments
                .Where(e => e.UserId == userId)
                .Include(e => e.LearningPath)
                .Include(e => e.LessonProgress)
                .OrderByDescending(e => e.EnrolledAt)
                .ToListAsync();
        }

        public async Task<UserEnrollment> UpdateEnrollmentStatusAsync(int id, string status)
        {
            var existing = await _db.UserEnrollments.FindAsync(id)
                ?? throw new KeyNotFoundException("ثبت‌نام یافت نشد.");

            existing.Status = status.Trim();
            if (status == "completed")
                existing.CompletedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        // ========== User lesson progress ==========

        public async Task<UserLessonProgress> CompleteLessonAsync(int enrollmentId, int lessonId)
        {
            var enrollment = await _db.UserEnrollments.FindAsync(enrollmentId)
                ?? throw new KeyNotFoundException("ثبت‌نام یافت نشد.");

            var lessonExists = await _db.StudyLessons.AnyAsync(ls => ls.Id == lessonId);
            if (!lessonExists)
                throw new KeyNotFoundException("درس یافت نشد.");

            var progress = await _db.UserLessonProgresses
                .FirstOrDefaultAsync(p => p.UserEnrollmentId == enrollmentId && p.StudyLessonId == lessonId);

            if (progress == null)
            {
                progress = new UserLessonProgress
                {
                    UserEnrollmentId = enrollmentId,
                    StudyLessonId = lessonId,
                    Status = "completed",
                    StartedAt = DateTime.UtcNow,
                    CompletedAt = DateTime.UtcNow
                };
                _db.UserLessonProgresses.Add(progress);
            }
            else
            {
                progress.Status = "completed";
                progress.CompletedAt = DateTime.UtcNow;
                progress.UpdatedAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
            return progress;
        }

        public async Task<UserLessonProgress> UpdateLessonProgressAsync(int enrollmentId, int lessonId, string status, int? score = null)
        {
            var progress = await _db.UserLessonProgresses
                .FirstOrDefaultAsync(p => p.UserEnrollmentId == enrollmentId && p.StudyLessonId == lessonId);

            if (progress == null)
            {
                progress = new UserLessonProgress
                {
                    UserEnrollmentId = enrollmentId,
                    StudyLessonId = lessonId,
                    Status = status,
                    Score = score,
                    StartedAt = status == "in_progress" ? DateTime.UtcNow : null,
                    CompletedAt = status == "completed" || status == "passed" || status == "failed" ? DateTime.UtcNow : null
                };
                _db.UserLessonProgresses.Add(progress);
            }
            else
            {
                progress.Status = status;
                if (score.HasValue) progress.Score = score.Value;
                if (status == "in_progress" && !progress.StartedAt.HasValue)
                    progress.StartedAt = DateTime.UtcNow;
                if (status == "completed" || status == "passed" || status == "failed")
                    progress.CompletedAt = DateTime.UtcNow;
                progress.UpdatedAt = DateTime.UtcNow;
            }

            await _db.SaveChangesAsync();
            return progress;
        }

        // ========== Quiz submission ==========

        public async Task<UserQuizAttempt> SubmitQuizAsync(SubmitQuizRequest request)
        {
            var quiz = await _db.Quizzes.FindAsync(request.QuizId)
                ?? throw new KeyNotFoundException("کوئیز یافت نشد.");

            var questions = await _db.QuizQuestions
                .Where(q => q.QuizId == request.QuizId)
                .Include(q => q.Options)
                .ToListAsync();

            var answersJson = JsonSerializer.Serialize(request.Answers);
            var attemptCount = await _db.UserQuizAttempts
                .CountAsync(a => a.UserId == request.UserId && a.QuizId == request.QuizId);

            if (attemptCount >= quiz.MaxAttempts)
                throw new InvalidOperationException("تعداد تلاش‌های مجاز به پایان رسیده است.");

            int score = 0;
            int maxScore = questions.Sum(q => q.Points);

            foreach (var question in questions)
            {
                var userAnswer = request.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
                if (userAnswer == null) continue;

                if (question.QuestionType == "multiple_choice" || question.QuestionType == "true_false")
                {
                    var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                    if (correctOption != null && userAnswer.Answer == correctOption.Id.ToString())
                        score += question.Points;
                }
                else if (question.QuestionType == "fill_blank")
                {
                    var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
                    if (correctOption != null &&
                        string.Equals(userAnswer.Answer.Trim(), correctOption.OptionText.Trim(), StringComparison.OrdinalIgnoreCase))
                        score += question.Points;
                }
            }

            var passed = score >= quiz.PassingScore;

            var attempt = new UserQuizAttempt
            {
                UserId = request.UserId,
                QuizId = request.QuizId,
                Score = score,
                MaxScore = maxScore,
                Passed = passed,
                AnswersJson = answersJson,
                AttemptNumber = attemptCount + 1,
                StartedAt = DateTime.UtcNow,
                CompletedAt = DateTime.UtcNow
            };

            _db.UserQuizAttempts.Add(attempt);
            await _db.SaveChangesAsync();

            // Update lesson progress if quiz is linked to a lesson
            var lesson = await _db.StudyLessons.FirstOrDefaultAsync(ls => ls.Quizzes.Any(q => q.Id == request.QuizId));
            if (lesson != null)
            {
                var enrollment = await _db.UserEnrollments
                    .FirstOrDefaultAsync(e => e.UserId == request.UserId && e.Status == "active");
                if (enrollment != null)
                {
                    await UpdateLessonProgressAsync(
                        enrollment.Id, lesson.Id,
                        passed ? "passed" : "failed",
                        score
                    );
                }
            }

            return attempt;
        }

        public async Task<List<UserQuizAttempt>> GetUserQuizAttemptsAsync(int userId, int quizId)
        {
            return await _db.UserQuizAttempts
                .Where(a => a.UserId == userId && a.QuizId == quizId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        // ========== Dashboard ==========

        public async Task<UserDashboardDto> GetUserDashboardAsync(int userId)
        {
            var enrollments = await _db.UserEnrollments
                .Where(e => e.UserId == userId)
                .Include(e => e.LearningPath)
                .Include(e => e.LessonProgress)
                .ToListAsync();

            var enrollmentDtos = new List<UserEnrollmentDto>();

            foreach (var enrollment in enrollments)
            {
                var totalLessons = await _db.StudyLessons
                    .CountAsync(ls => ls.StudyModule!.LearningLevel!.LearningPathId == enrollment.LearningPathId);

                var completedLessons = enrollment.LessonProgress
                    .Count(p => p.Status == "completed" || p.Status == "passed");

                var averageScore = enrollment.LessonProgress
                    .Where(p => p.Score.HasValue)
                    .Select(p => p.Score.Value)
                    .DefaultIfEmpty(0)
                    .Average();

                enrollmentDtos.Add(new UserEnrollmentDto(
                    enrollment.Id,
                    enrollment.UserId,
                    enrollment.LearningPathId,
                    enrollment.LearningPath?.Title ?? "",
                    enrollment.Status,
                    enrollment.EnrolledAt,
                    enrollment.CompletedAt,
                    completedLessons,
                    totalLessons,
                    averageScore
                ));
            }

            return new UserDashboardDto(enrollmentDtos);
        }
    }
}

using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class ArabicLiteratureService : IArabicLiteratureService
    {
        private readonly AppDbContext _db;

        public ArabicLiteratureService(AppDbContext db)
        {
            _db = db;
        }

        // ========== Poet operations ==========

        public async Task<List<ArabicPoet>> GetAllPoetsAsync(string? difficulty = null)
        {
            var query = _db.ArabicLiteraturePoets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(difficulty))
                query = query.Where(p => p.DifficultyLevel == difficulty);

            return await query.OrderBy(p => p.SortOrder).ThenBy(p => p.Name).ToListAsync();
        }

        public async Task<ArabicPoet?> FindPoetByIdAsync(int id)
        {
            return await _db.ArabicLiteraturePoets
                .Include(p => p.Poems.OrderBy(po => po.SortOrder))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        // ========== Course operations ==========

        public async Task<List<ArabicCourse>> GetAllCoursesAsync(string? level = null)
        {
            var query = _db.ArabicCourses.AsQueryable();

            if (!string.IsNullOrWhiteSpace(level))
                query = query.Where(c => c.Level == level);

            return await query.OrderBy(c => c.SortOrder).ThenBy(c => c.Title).ToListAsync();
        }

        public async Task<ArabicCourse?> FindCourseByIdAsync(int id)
        {
            return await _db.ArabicCourses
                .Include(c => c.Lessons.OrderBy(l => l.SortOrder))
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<ArabicCourse> CreateCourseAsync(CreateArabicCourseRequest request)
        {
            if (await _db.ArabicCourses.AnyAsync(c => c.Title == request.Title.Trim()))
                throw new InvalidOperationException("نام دوره تکراری است.");

            var entity = new ArabicCourse
            {
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                Level = request.Level?.Trim() ?? "beginner",
                AgeRange = request.AgeRange?.Trim(),
                SortOrder = request.SortOrder,
                Icon = request.Icon?.Trim(),
                Color = request.Color?.Trim(),
                PrerequisiteCourseIds = request.PrerequisiteCourseIds
            };

            _db.ArabicCourses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ArabicCourse> UpdateCourseAsync(int id, UpdateArabicCourseRequest request)
        {
            var existing = await _db.ArabicCourses.FindAsync(id)
                ?? throw new KeyNotFoundException("دوره یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Level != null) existing.Level = request.Level.Trim();
            if (request.AgeRange != null) existing.AgeRange = request.AgeRange.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;
            if (request.Icon != null) existing.Icon = request.Icon.Trim();
            if (request.Color != null) existing.Color = request.Color.Trim();
            if (request.PrerequisiteCourseIds != null) existing.PrerequisiteCourseIds = request.PrerequisiteCourseIds;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteCourseAsync(int id)
        {
            var entity = await _db.ArabicCourses.FindAsync(id)
                ?? throw new KeyNotFoundException("دوره یافت نشد.");
            _db.ArabicCourses.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Lesson operations ==========

        public async Task<List<ArabicLesson>> GetLessonsByCourseAsync(int courseId)
        {
            return await _db.ArabicLessons
                .Include(l => l.Poem)
                .Where(l => l.CourseId == courseId)
                .OrderBy(l => l.SortOrder)
                .ToListAsync();
        }

        public async Task<ArabicLesson?> FindLessonByIdAsync(int id)
        {
            return await _db.ArabicLessons
                .Include(l => l.Poem)
                    .ThenInclude(p => p!.Analyses)
                .Include(l => l.Course)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<ArabicLesson> CreateLessonAsync(CreateArabicLessonRequest request)
        {
            var courseExists = await _db.ArabicCourses.AnyAsync(c => c.Id == request.CourseId);
            if (!courseExists)
                throw new KeyNotFoundException("دوره یافت نشد.");

            if (request.PoemId.HasValue)
            {
                var poemExists = await _db.ArabicLiteraturePoems.AnyAsync(p => p.Id == request.PoemId.Value);
                if (!poemExists)
                    throw new KeyNotFoundException("شعر یافت نشد.");
            }

            var entity = new ArabicLesson
            {
                CourseId = request.CourseId,
                Title = request.Title.Trim(),
                Description = request.Description?.Trim(),
                Objectives = request.Objectives,
                PoemId = request.PoemId,
                Content = request.Content?.Trim(),
                ExerciseData = request.ExerciseData,
                QuizData = request.QuizData,
                DurationMinutes = request.DurationMinutes,
                SortOrder = request.SortOrder,
                PrerequisiteLessonIds = request.PrerequisiteLessonIds
            };

            _db.ArabicLessons.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ArabicLesson> UpdateLessonAsync(int id, UpdateArabicLessonRequest request)
        {
            var existing = await _db.ArabicLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Objectives != null) existing.Objectives = request.Objectives;
            if (request.PoemId.HasValue)
            {
                var poemExists = await _db.ArabicLiteraturePoems.AnyAsync(p => p.Id == request.PoemId.Value);
                if (!poemExists)
                    throw new KeyNotFoundException("شعر یافت نشد.");
                existing.PoemId = request.PoemId.Value;
            }
            if (request.Content != null) existing.Content = request.Content.Trim();
            if (request.ExerciseData != null) existing.ExerciseData = request.ExerciseData;
            if (request.QuizData != null) existing.QuizData = request.QuizData;
            if (request.DurationMinutes.HasValue) existing.DurationMinutes = request.DurationMinutes.Value;
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;
            if (request.PrerequisiteLessonIds != null) existing.PrerequisiteLessonIds = request.PrerequisiteLessonIds;

            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteLessonAsync(int id)
        {
            var entity = await _db.ArabicLessons.FindAsync(id)
                ?? throw new KeyNotFoundException("درس یافت نشد.");
            _db.ArabicLessons.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Progress operations ==========

        public async Task<List<ArabicUserProgress>> GetUserProgressAsync(int userId)
        {
            return await _db.ArabicUserProgresses
                .Include(p => p.Lesson)
                    .ThenInclude(l => l!.Course)
                .Where(p => p.UserId == userId)
                .OrderByDescending(p => p.CompletedAt)
                .ToListAsync();
        }

        public async Task<List<ArabicUserProgress>> GetUserProgressByCourseAsync(int userId, int courseId)
        {
            return await _db.ArabicUserProgresses
                .Include(p => p.Lesson)
                .Where(p => p.UserId == userId && p.Lesson!.CourseId == courseId)
                .OrderBy(p => p.Lesson!.SortOrder)
                .ToListAsync();
        }

        public async Task<ArabicUserProgress> UpdateProgressAsync(int userId, UpdateArabicProgressRequest request)
        {
            var lessonExists = await _db.ArabicLessons.AnyAsync(l => l.Id == request.LessonId);
            if (!lessonExists)
                throw new KeyNotFoundException("درس یافت نشد.");

            var existing = await _db.ArabicUserProgresses
                .FirstOrDefaultAsync(p => p.UserId == userId && p.LessonId == request.LessonId);

            if (existing != null)
            {
                existing.Status = request.Status;
                existing.Score = request.Score;
                if (request.Status == "completed")
                    existing.CompletedAt = DateTime.UtcNow;
                await _db.SaveChangesAsync();
                return existing;
            }

            var entity = new ArabicUserProgress
            {
                UserId = userId,
                LessonId = request.LessonId,
                Status = request.Status,
                Score = request.Score,
                StartedAt = DateTime.UtcNow,
                CompletedAt = request.Status == "completed" ? DateTime.UtcNow : null
            };

            _db.ArabicUserProgresses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        // ========== Poet operations ==========

        public async Task<ArabicPoet> CreatePoetAsync(CreateArabicPoetRequest request)
        {
            if (await _db.ArabicLiteraturePoets.AnyAsync(p => p.Name == request.Name.Trim()))
                throw new InvalidOperationException("نام شاعر تکراری است.");

            var entity = new ArabicPoet
            {
                Name = request.Name.Trim(),
                Nasab = request.Nasab?.Trim(),
                PenName = request.PenName?.Trim(),
                BirthDate = request.BirthDate,
                DeathDate = request.DeathDate,
                BirthPlace = request.BirthPlace?.Trim(),
                DeathPlace = request.DeathPlace?.Trim(),
                Era = request.Era?.Trim(),
                Century = request.Century,
                Biography = request.Biography?.Trim(),
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                SortOrder = request.SortOrder
            };

            _db.ArabicLiteraturePoets.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ArabicPoet> UpdatePoetAsync(int id, UpdateArabicPoetRequest request)
        {
            var existing = await _db.ArabicLiteraturePoets.FindAsync(id)
                ?? throw new KeyNotFoundException("شاعر یافت نشد.");

            if (request.Name != null) existing.Name = request.Name.Trim();
            if (request.Nasab != null) existing.Nasab = request.Nasab.Trim();
            if (request.PenName != null) existing.PenName = request.PenName.Trim();
            if (request.BirthDate.HasValue) existing.BirthDate = request.BirthDate.Value;
            if (request.DeathDate.HasValue) existing.DeathDate = request.DeathDate.Value;
            if (request.BirthPlace != null) existing.BirthPlace = request.BirthPlace.Trim();
            if (request.DeathPlace != null) existing.DeathPlace = request.DeathPlace.Trim();
            if (request.Era != null) existing.Era = request.Era.Trim();
            if (request.Century.HasValue) existing.Century = request.Century.Value;
            if (request.Biography != null) existing.Biography = request.Biography.Trim();
            if (request.DifficultyLevel != null) existing.DifficultyLevel = request.DifficultyLevel.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeletePoetAsync(int id)
        {
            var entity = await _db.ArabicLiteraturePoets.FindAsync(id)
                ?? throw new KeyNotFoundException("شاعر یافت نشد.");
            _db.ArabicLiteraturePoets.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ArabicPoet>> SearchPoetsAsync(string query, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<ArabicPoet>();

            return await _db.ArabicLiteraturePoets
                .Where(p => p.Name.Contains(query) || (p.PenName != null && p.PenName.Contains(query)))
                .OrderBy(p => p.SortOrder)
                .ThenBy(p => p.Name)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Poem operations ==========

        public async Task<List<ArabicPoem>> GetAllPoemsAsync(int? poetId = null, string? genre = null, string? difficulty = null)
        {
            var query = _db.ArabicLiteraturePoems
                .Include(p => p.Poet)
                .AsQueryable();

            if (poetId.HasValue)
                query = query.Where(p => p.PoetId == poetId.Value);

            if (!string.IsNullOrWhiteSpace(genre))
                query = query.Where(p => p.Genre == genre);

            if (!string.IsNullOrWhiteSpace(difficulty))
                query = query.Where(p => p.DifficultyLevel == difficulty);

            return await query.OrderBy(p => p.SortOrder).ThenBy(p => p.Title).ToListAsync();
        }

        public async Task<ArabicPoem?> FindPoemByIdAsync(int id)
        {
            return await _db.ArabicLiteraturePoems
                .Include(p => p.Poet)
                .Include(p => p.Analyses.OrderBy(a => a.SortOrder))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ArabicPoem> CreatePoemAsync(CreateArabicPoemRequest request)
        {
            var poetExists = await _db.ArabicLiteraturePoets.AnyAsync(p => p.Id == request.PoetId);
            if (!poetExists)
                throw new KeyNotFoundException("شاعر یافت نشد.");

            var entity = new ArabicPoem
            {
                PoetId = request.PoetId,
                Title = request.Title.Trim(),
                Bahr = request.Bahr?.Trim(),
                Qafiya = request.Qafiya?.Trim(),
                Genre = request.Genre?.Trim(),
                Content = request.Content?.Trim() ?? string.Empty,
                Translation = request.Translation?.Trim(),
                Interpretation = request.Interpretation?.Trim(),
                SourceBook = request.SourceBook?.Trim(),
                VerseCount = request.VerseCount,
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                Theme = request.Theme?.Trim(),
                SortOrder = request.SortOrder
            };

            _db.ArabicLiteraturePoems.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ArabicPoem> UpdatePoemAsync(int id, UpdateArabicPoemRequest request)
        {
            var existing = await _db.ArabicLiteraturePoems.FindAsync(id)
                ?? throw new KeyNotFoundException("شعر یافت نشد.");

            if (request.PoetId.HasValue)
            {
                var poetExists = await _db.ArabicLiteraturePoets.AnyAsync(p => p.Id == request.PoetId.Value);
                if (!poetExists)
                    throw new KeyNotFoundException("شاعر یافت نشد.");
                existing.PoetId = request.PoetId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Bahr != null) existing.Bahr = request.Bahr.Trim();
            if (request.Qafiya != null) existing.Qafiya = request.Qafiya.Trim();
            if (request.Genre != null) existing.Genre = request.Genre.Trim();
            if (request.Content != null) existing.Content = request.Content.Trim();
            if (request.Translation != null) existing.Translation = request.Translation.Trim();
            if (request.Interpretation != null) existing.Interpretation = request.Interpretation.Trim();
            if (request.SourceBook != null) existing.SourceBook = request.SourceBook.Trim();
            if (request.VerseCount.HasValue) existing.VerseCount = request.VerseCount.Value;
            if (request.DifficultyLevel != null) existing.DifficultyLevel = request.DifficultyLevel.Trim();
            if (request.Theme != null) existing.Theme = request.Theme.Trim();
            if (request.SortOrder.HasValue) existing.SortOrder = request.SortOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeletePoemAsync(int id)
        {
            var entity = await _db.ArabicLiteraturePoems.FindAsync(id)
                ?? throw new KeyNotFoundException("شعر یافت نشد.");
            _db.ArabicLiteraturePoems.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<ArabicPoem>> SearchPoemsAsync(string query, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<ArabicPoem>();

            return await _db.ArabicLiteraturePoems
                .Include(p => p.Poet)
                .Where(p => p.Title.Contains(query) || p.Content.Contains(query))
                .OrderBy(p => p.SortOrder)
                .ThenBy(p => p.Title)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Analysis operations ==========

        public async Task<List<ArabicPoemAnalysis>> GetAnalysesByPoemAsync(int poemId)
        {
            return await _db.ArabicLiteratureAnalyses
                .Where(a => a.PoemId == poemId)
                .OrderBy(a => a.SortOrder)
                .ToListAsync();
        }

        public async Task<ArabicPoemAnalysis?> FindAnalysisByIdAsync(int id)
        {
            return await _db.ArabicLiteratureAnalyses
                .Include(a => a.Poem)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<ArabicPoemAnalysis> CreateAnalysisAsync(CreateArabicAnalysisRequest request)
        {
            var poemExists = await _db.ArabicLiteraturePoems.AnyAsync(p => p.Id == request.PoemId);
            if (!poemExists)
                throw new KeyNotFoundException("شعر یافت نشد.");

            var entity = new ArabicPoemAnalysis
            {
                PoemId = request.PoemId,
                Title = request.Title.Trim(),
                Content = request.Content?.Trim() ?? string.Empty,
                AnalysisType = request.AnalysisType?.Trim() ?? "general",
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                SortOrder = request.SortOrder
            };

            _db.ArabicLiteratureAnalyses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<ArabicPoemAnalysis> UpdateAnalysisAsync(int id, UpdateArabicAnalysisRequest request)
        {
            var existing = await _db.ArabicLiteratureAnalyses.FindAsync(id)
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
            var entity = await _db.ArabicLiteratureAnalyses.FindAsync(id)
                ?? throw new KeyNotFoundException("تحلیل یافت نشد.");
            _db.ArabicLiteratureAnalyses.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Dashboard ==========

        public async Task<object> GetDashboardStatsAsync()
        {
            var poetCount = await _db.ArabicLiteraturePoets.CountAsync();
            var poemCount = await _db.ArabicLiteraturePoems.CountAsync();
            var analysisCount = await _db.ArabicLiteratureAnalyses.CountAsync();
            var genreCount = await _db.ArabicLiteraturePoems
                .Where(p => p.Genre != null)
                .Select(p => p.Genre)
                .Distinct()
                .CountAsync();
            var eraCount = await _db.ArabicLiteraturePoets
                .Where(p => p.Era != null)
                .Select(p => p.Era)
                .Distinct()
                .CountAsync();

            return new
            {
                totalPoets = poetCount,
                totalPoems = poemCount,
                totalAnalyses = analysisCount,
                distinctGenres = genreCount,
                distinctEras = eraCount
            };
        }
    }
}

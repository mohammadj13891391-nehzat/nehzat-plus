using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class QuranService : IQuranService
    {
        private readonly AppDbContext _db;

        public QuranService(AppDbContext db)
        {
            _db = db;
        }

        // Surah operations
        public async Task<List<Surah>> GetAllSurahsAsync()
        {
            var surahs = await _db.Surahs.ToListAsync();
            return surahs.OrderBy(s => int.Parse(s.Number)).ToList();
        }

        public async Task<Surah?> FindSurahByIdAsync(int id)
        {
            return await _db.Surahs
                .Include(s => s.Ayahs)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<Surah> CreateSurahAsync(CreateSurahRequest request)
        {
            if (await _db.Surahs.AnyAsync(s => s.Number == request.Number))
                throw new InvalidOperationException("شماره سوره تکراری است.");

            var entity = new Surah
            {
                Number = request.Number.Trim(),
                Name = request.Name.Trim(),
                TranslatedName = request.TranslatedName?.Trim() ?? string.Empty,
                RevelationPlace = request.RevelationPlace?.Trim() ?? string.Empty,
                RevelationOrder = request.RevelationOrder,
                TotalAyahs = request.TotalAyahs,
                Type = request.Type?.Trim() ?? string.Empty,
                Bismillah = request.Bismillah?.Trim() ?? string.Empty,
                HizbBegin = request.HizbBegin,
                HizbEnd = request.HizbEnd,
                JuzBegin = request.JuzBegin,
                JuzEnd = request.JuzEnd,
                Ruqyah = request.Ruqyah?.Trim() ?? string.Empty,
                Summary = request.Summary?.Trim() ?? string.Empty
            };

            _db.Surahs.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Surah> UpdateSurahAsync(int id, UpdateSurahRequest request)
        {
            var existing = await _db.Surahs.FindAsync(id)
                ?? throw new KeyNotFoundException("سوره یافت نشد.");

            if (request.Number != null) existing.Number = request.Number.Trim();
            if (request.Name != null) existing.Name = request.Name.Trim();
            if (request.TranslatedName != null) existing.TranslatedName = request.TranslatedName.Trim();
            if (request.RevelationPlace != null) existing.RevelationPlace = request.RevelationPlace.Trim();
            if (request.RevelationOrder.HasValue) existing.RevelationOrder = request.RevelationOrder.Value;
            if (request.TotalAyahs.HasValue) existing.TotalAyahs = request.TotalAyahs.Value;
            if (request.Type != null) existing.Type = request.Type.Trim();
            if (request.Bismillah != null) existing.Bismillah = request.Bismillah.Trim();
            if (request.HizbBegin.HasValue) existing.HizbBegin = request.HizbBegin.Value;
            if (request.HizbEnd.HasValue) existing.HizbEnd = request.HizbEnd.Value;
            if (request.JuzBegin.HasValue) existing.JuzBegin = request.JuzBegin.Value;
            if (request.JuzEnd.HasValue) existing.JuzEnd = request.JuzEnd.Value;
            if (request.Ruqyah != null) existing.Ruqyah = request.Ruqyah.Trim();
            if (request.Summary != null) existing.Summary = request.Summary.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteSurahAsync(int id)
        {
            var entity = await _db.Surahs.FindAsync(id)
                ?? throw new KeyNotFoundException("سوره یافت نشد.");
            _db.Surahs.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // Ayah operations
        public async Task<List<Ayah>> GetAllAyahsAsync()
        {
            return await _db.Ayahs
                .Include(a => a.Surah)
                .OrderBy(a => a.SurahId)
                .ThenBy(a => a.VerseNumber)
                .ToListAsync();
        }

        public async Task<List<Ayah>> GetAyahsBySurahAsync(int surahId)
        {
            return await _db.Ayahs
                .Where(a => a.SurahId == surahId)
                .OrderBy(a => a.VerseNumber)
                .ToListAsync();
        }

        public async Task<Ayah?> FindAyahByIdAsync(int id)
        {
            return await _db.Ayahs
                .Include(a => a.Surah)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<Ayah> CreateAyahAsync(CreateAyahRequest request)
        {
            var entity = new Ayah
            {
                SurahId = request.SurahId,
                VerseNumber = request.VerseNumber,
                Text = request.Text.Trim(),
                Translation = request.Translation?.Trim() ?? string.Empty,
                Transliteration = request.Transliteration?.Trim() ?? string.Empty,
                Footnote = request.Footnote?.Trim() ?? string.Empty,
                Ruku = request.Ruku?.Trim() ?? string.Empty,
                Sajda = request.Sajda?.Trim() ?? string.Empty,
                AyaNumber = request.AyaNumber,
                Juz = request.Juz?.Trim() ?? string.Empty,
                HizbQuarter = request.HizbQuarter?.Trim() ?? string.Empty
            };

            _db.Ayahs.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Ayah> UpdateAyahAsync(int id, UpdateAyahRequest request)
        {
            var existing = await _db.Ayahs.FindAsync(id)
                ?? throw new KeyNotFoundException("آیه یافت نشد.");

            if (request.SurahId.HasValue) existing.SurahId = request.SurahId.Value;
            if (request.VerseNumber.HasValue) existing.VerseNumber = request.VerseNumber.Value;
            if (request.Text != null) existing.Text = request.Text.Trim();
            if (request.Translation != null) existing.Translation = request.Translation.Trim();
            if (request.Transliteration != null) existing.Transliteration = request.Transliteration.Trim();
            if (request.Footnote != null) existing.Footnote = request.Footnote.Trim();
            if (request.Ruku != null) existing.Ruku = request.Ruku.Trim();
            if (request.Sajda != null) existing.Sajda = request.Sajda.Trim();
            if (request.AyaNumber.HasValue) existing.AyaNumber = request.AyaNumber.Value;
            if (request.Juz != null) existing.Juz = request.Juz.Trim();
            if (request.HizbQuarter != null) existing.HizbQuarter = request.HizbQuarter.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteAyahAsync(int id)
        {
            var entity = await _db.Ayahs.FindAsync(id)
                ?? throw new KeyNotFoundException("آیه یافت نشد.");
            _db.Ayahs.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // TajweedRule operations
        public async Task<List<TajweedRule>> GetAllTajweedRulesAsync()
        {
            return await _db.TajweedRules
                .Include(t => t.Surah)
                .OrderBy(t => t.RuleLevel)
                .ThenBy(t => t.Name)
                .ToListAsync();
        }

        public async Task<TajweedRule?> FindTajweedRuleByIdAsync(int id)
        {
            return await _db.TajweedRules
                .Include(t => t.Surah)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<TajweedRule> CreateTajweedRuleAsync(CreateTajweedRuleRequest request)
        {
            if (await _db.TajweedRules.AnyAsync(t => t.RuleCode == request.RuleCode))
                throw new InvalidOperationException("کد قانون تجوید تکراری است.");

            var entity = new TajweedRule
            {
                RuleCode = request.RuleCode.Trim(),
                Name = request.Name.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                ExampleText = request.ExampleText?.Trim() ?? string.Empty,
                RuleLevel = request.RuleLevel,
                AffectedRecitationType = request.AffectedRecitationType?.Trim() ?? string.Empty,
                Guidelines = request.Guidelines?.Trim() ?? string.Empty,
                SurahId = request.SurahId,
                AyahNumber = request.AyahNumber
            };

            _db.TajweedRules.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<TajweedRule> UpdateTajweedRuleAsync(int id, UpdateTajweedRuleRequest request)
        {
            var existing = await _db.TajweedRules.FindAsync(id)
                ?? throw new KeyNotFoundException("قانون تجوید یافت نشد.");

            if (request.RuleCode != null) existing.RuleCode = request.RuleCode.Trim();
            if (request.Name != null) existing.Name = request.Name.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.ExampleText != null) existing.ExampleText = request.ExampleText.Trim();
            if (request.RuleLevel.HasValue) existing.RuleLevel = request.RuleLevel.Value;
            if (request.AffectedRecitationType != null) existing.AffectedRecitationType = request.AffectedRecitationType.Trim();
            if (request.Guidelines != null) existing.Guidelines = request.Guidelines.Trim();
            if (request.SurahId.HasValue) existing.SurahId = request.SurahId.Value;
            if (request.AyahNumber.HasValue) existing.AyahNumber = request.AyahNumber.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteTajweedRuleAsync(int id)
        {
            var entity = await _db.TajweedRules.FindAsync(id)
                ?? throw new KeyNotFoundException("قانون تجوید یافت نشد.");
            _db.TajweedRules.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // QuranStudentCourse operations
        public async Task<List<QuranStudentCourse>> GetAllQuranStudentCoursesAsync()
        {
            return await _db.QuranStudentCourses
                .Include(q => q.Student)
                .Include(q => q.Course)
                .Include(q => q.Surah)
                .OrderBy(q => q.Id)
                .ToListAsync();
        }

        public async Task<QuranStudentCourse?> FindQuranStudentCourseByIdAsync(int id)
        {
            return await _db.QuranStudentCourses
                .Include(q => q.Student)
                .Include(q => q.Course)
                .Include(q => q.Surah)
                .FirstOrDefaultAsync(q => q.Id == id);
        }

        public async Task<QuranStudentCourse> CreateQuranStudentCourseAsync(CreateQuranStudentCourseRequest request)
        {
            var entity = new QuranStudentCourse
            {
                StudentId = request.StudentId,
                CourseId = request.CourseId,
                SurahId = request.SurahId,
                CurrentPage = request.CurrentPage,
                CurrentAyah = request.CurrentAyah,
                RecitationLevelId = request.RecitationLevelId,
                EnrolledDate = request.EnrolledDate ?? DateTime.UtcNow,
                Grade = request.Grade,
                Notes = request.Notes?.Trim() ?? string.Empty
            };

            _db.QuranStudentCourses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<QuranStudentCourse> UpdateQuranStudentCourseAsync(int id, UpdateQuranStudentCourseRequest request)
        {
            var existing = await _db.QuranStudentCourses.FindAsync(id)
                ?? throw new KeyNotFoundException("ثبت درس قرآن یافت نشد.");

            if (request.StudentId.HasValue) existing.StudentId = request.StudentId.Value;
            if (request.CourseId.HasValue) existing.CourseId = request.CourseId.Value;
            if (request.SurahId.HasValue) existing.SurahId = request.SurahId.Value;
            if (request.CurrentPage.HasValue) existing.CurrentPage = request.CurrentPage.Value;
            if (request.CurrentAyah.HasValue) existing.CurrentAyah = request.CurrentAyah.Value;
            if (request.RecitationLevelId.HasValue) existing.RecitationLevelId = request.RecitationLevelId.Value;
            if (request.EnrolledDate.HasValue) existing.EnrolledDate = request.EnrolledDate.Value;
            if (request.CompletionDate.HasValue) existing.CompletionDate = request.CompletionDate.Value;
            if (request.Grade.HasValue) existing.Grade = request.Grade.Value;
            if (request.Notes != null) existing.Notes = request.Notes.Trim();

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuranStudentCourseAsync(int id)
        {
            var entity = await _db.QuranStudentCourses.FindAsync(id)
                ?? throw new KeyNotFoundException("ثبت درس قرآن یافت نشد.");
            _db.QuranStudentCourses.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // RecitationLevel operations
        public async Task<List<RecitationLevel>> GetAllRecitationLevelsAsync()
        {
            return await _db.RecitationLevels
                .OrderBy(r => r.LevelNumber)
                .ToListAsync();
        }

        public async Task<RecitationLevel?> FindRecitationLevelByIdAsync(int id)
        {
            return await _db.RecitationLevels.FindAsync(id);
        }

        public async Task<RecitationLevel> CreateRecitationLevelAsync(CreateRecitationLevelRequest request)
        {
            if (await _db.RecitationLevels.AnyAsync(r => r.LevelNumber == request.LevelNumber))
                throw new InvalidOperationException("شماره سطح تکراری است.");

            var entity = new RecitationLevel
            {
                LevelNumber = request.LevelNumber,
                Name = request.Name.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                Criteria = request.Criteria?.Trim() ?? string.Empty,
                ColorCode = request.ColorCode?.Trim() ?? string.Empty,
                PointsRequired = request.PointsRequired,
                EstimatedWeeks = request.EstimatedWeeks
            };

            _db.RecitationLevels.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<RecitationLevel> UpdateRecitationLevelAsync(int id, UpdateRecitationLevelRequest request)
        {
            var existing = await _db.RecitationLevels.FindAsync(id)
                ?? throw new KeyNotFoundException("سطح تجوید یافت نشد.");

            if (request.LevelNumber.HasValue) existing.LevelNumber = request.LevelNumber.Value;
            if (request.Name != null) existing.Name = request.Name.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Criteria != null) existing.Criteria = request.Criteria.Trim();
            if (request.ColorCode != null) existing.ColorCode = request.ColorCode.Trim();
            if (request.PointsRequired.HasValue) existing.PointsRequired = request.PointsRequired.Value;
            if (request.EstimatedWeeks.HasValue) existing.EstimatedWeeks = request.EstimatedWeeks.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteRecitationLevelAsync(int id)
        {
            var entity = await _db.RecitationLevels.FindAsync(id)
                ?? throw new KeyNotFoundException("سطح تجوید یافت نشد.");
            _db.RecitationLevels.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // QuranCurriculum operations
        public async Task<List<QuranCurriculum>> GetAllQuranCurriculaAsync()
        {
            return await _db.QuranCurricula
                .Include(c => c.Teacher)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        public async Task<QuranCurriculum?> FindQuranCurriculumByIdAsync(int id)
        {
            return await _db.QuranCurricula
                .Include(c => c.Teacher)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<QuranCurriculum> CreateQuranCurriculumAsync(CreateQuranCurriculumRequest request)
        {
            var entity = new QuranCurriculum
            {
                Title = request.Title.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                Language = request.Language?.Trim() ?? "fa",
                StartSurah = request.StartSurah,
                EndSurah = request.EndSurah,
                TotalAyahs = request.TotalAyahs,
                EstimatedDays = request.EstimatedDays,
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                LearningObjectives = request.LearningObjectives?.Trim() ?? string.Empty,
                TeacherId = request.TeacherId
            };

            _db.QuranCurricula.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<QuranCurriculum> UpdateQuranCurriculumAsync(int id, UpdateQuranCurriculumRequest request)
        {
            var existing = await _db.QuranCurricula.FindAsync(id)
                ?? throw new KeyNotFoundException("برنامه قرآن یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.Language != null) existing.Language = request.Language.Trim();
            if (request.StartSurah.HasValue) existing.StartSurah = request.StartSurah.Value;
            if (request.EndSurah.HasValue) existing.EndSurah = request.EndSurah.Value;
            if (request.TotalAyahs.HasValue) existing.TotalAyahs = request.TotalAyahs.Value;
            if (request.EstimatedDays.HasValue) existing.EstimatedDays = request.EstimatedDays.Value;
            if (request.DifficultyLevel != null) existing.DifficultyLevel = request.DifficultyLevel.Trim();
            if (request.LearningObjectives != null) existing.LearningObjectives = request.LearningObjectives.Trim();
            if (request.TeacherId.HasValue) existing.TeacherId = request.TeacherId.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();
            return existing;
        }

        public async Task DeleteQuranCurriculumAsync(int id)
        {
            var entity = await _db.QuranCurricula.FindAsync(id)
                ?? throw new KeyNotFoundException("برنامه قرآن یافت نشد.");
            _db.QuranCurricula.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // QuranStudentProgress operations
        public async Task<List<QuranStudentProgress>> GetStudentProgressAsync(int studentId)
        {
            return await _db.QuranStudentProgresses
                .Include(p => p.Surah)
                .Where(p => p.StudentId == studentId)
                .OrderBy(p => p.SurahId)
                .ToListAsync();
        }

        public async Task<QuranStudentProgress?> FindProgressByIdAsync(int id)
        {
            return await _db.QuranStudentProgresses
                .Include(p => p.Surah)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<QuranStudentProgress> CreateProgressAsync(int studentId, int surahId, int ayahNumber, int percentage, string notes = "")
        {
            var entity = new QuranStudentProgress
            {
                StudentId = studentId,
                SurahId = surahId,
                AyahNumber = ayahNumber,
                Percentage = percentage,
                Notes = notes?.Trim() ?? string.Empty
            };

            _db.QuranStudentProgresses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<List<string>> GetLessonPlanFilesAsync()
        {
            var plansDir = Path.Combine("D:", "nehzat-plus", "Quran", ".omo", "plans");
            if (!Directory.Exists(plansDir))
                return new List<string>();

            return Directory.GetFiles(plansDir, "*.md")
                .Select(Path.GetFileNameWithoutExtension)
                .OrderBy(f => f)
                .ToList()!;
        }

        public async Task<string> GetLessonPlanContentAsync(string fileName)
        {
            var plansDir = Path.Combine("D:", "nehzat-plus", "Quran", ".omo", "plans");
            var filePath = Path.Combine(plansDir, fileName + ".md");

            if (!File.Exists(filePath))
                throw new FileNotFoundException("Plan file not found", fileName);

            return await File.ReadAllTextAsync(filePath);
        }

        public async Task<List<Ayah>> SearchAyahsAsync(string query, int maxResults = 50)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<Ayah>();

            return await _db.Ayahs
                .Include(a => a.Surah)
                .Where(a => a.Text.Contains(query) || a.Translation.Contains(query))
                .Take(maxResults)
                .OrderBy(a => a.SurahId)
                .ThenBy(a => a.VerseNumber)
                .ToListAsync();
        }

        public async Task<object> GetDashboardStatsAsync()
        {
            var surahCount = await _db.Surahs.CountAsync();
            var ayahCount = await _db.Ayahs.CountAsync();
            var tajweedCount = await _db.TajweedRules.CountAsync();
            var levelCount = await _db.RecitationLevels.CountAsync();
            var curriculumCount = await _db.QuranCurricula.CountAsync();

            return new
            {
                totalSurahs = surahCount,
                totalAyahs = ayahCount,
                totalTajweedRules = tajweedCount,
                totalRecitationLevels = levelCount,
                totalCurricula = curriculumCount
            };
        }
    }
}
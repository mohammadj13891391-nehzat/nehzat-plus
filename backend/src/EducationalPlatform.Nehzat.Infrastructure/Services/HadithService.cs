using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.Hadith;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class HadithService : IHadithService
    {
        private readonly AppDbContext _db;

        public HadithService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<List<HadithBookDto>> GetAllBooksAsync()
        {
            var books = await _db.Set<HadithBook>()
                .OrderBy(b => b.DisplayOrder)
                .ToListAsync();

            return books.Select(b => new HadithBookDto(
                b.Id, b.Title, b.TitleTranslation, b.Description,
                b.AuthorName, b.HadithCount, b.DisplayOrder, b.IsActive,
                b.CreatedAt, b.UpdatedAt
            )).ToList();
        }

        public async Task<HadithBookDetailDto?> FindBookByIdAsync(int id)
        {
            var book = await _db.Set<HadithBook>()
                .Include(b => b.Chapters.OrderBy(c => c.DisplayOrder))
                .FirstOrDefaultAsync(b => b.Id == id);

            if (book == null) return null;

            return new HadithBookDetailDto(
                book.Id, book.Title, book.TitleTranslation, book.Description,
                book.AuthorName, book.HadithCount, book.DisplayOrder, book.IsActive,
                book.CreatedAt, book.UpdatedAt,
                book.Chapters.Select(c => new HadithChapterDto(
                    c.Id, c.HadithBookId, c.Title, c.TitleTranslation,
                    c.Description, c.DisplayOrder, c.CreatedAt, c.UpdatedAt
                )).ToList()
            );
        }

        public async Task<HadithBookDto> CreateBookAsync(CreateHadithBookRequest request)
        {
            if (await _db.Set<HadithBook>().AnyAsync(b => b.Title == request.Title))
                throw new InvalidOperationException("کتاب حدیث با این عنوان قبلاً ثبت شده است.");

            var entity = new HadithBook
            {
                Title = request.Title.Trim(),
                TitleTranslation = request.TitleTranslation.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                AuthorName = request.AuthorName?.Trim() ?? string.Empty,
                HadithCount = request.HadithCount,
                DisplayOrder = request.DisplayOrder,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Set<HadithBook>().Add(entity);
            await _db.SaveChangesAsync();

            return new HadithBookDto(
                entity.Id, entity.Title, entity.TitleTranslation, entity.Description,
                entity.AuthorName, entity.HadithCount, entity.DisplayOrder, entity.IsActive,
                entity.CreatedAt, entity.UpdatedAt
            );
        }

        public async Task<HadithBookDto> UpdateBookAsync(int id, UpdateHadithBookRequest request)
        {
            var existing = await _db.Set<HadithBook>().FindAsync(id)
                ?? throw new KeyNotFoundException("کتاب حدیث یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.TitleTranslation != null) existing.TitleTranslation = request.TitleTranslation.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.AuthorName != null) existing.AuthorName = request.AuthorName.Trim();
            if (request.HadithCount.HasValue) existing.HadithCount = request.HadithCount.Value;
            if (request.DisplayOrder.HasValue) existing.DisplayOrder = request.DisplayOrder.Value;
            if (request.IsActive.HasValue) existing.IsActive = request.IsActive.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return new HadithBookDto(
                existing.Id, existing.Title, existing.TitleTranslation, existing.Description,
                existing.AuthorName, existing.HadithCount, existing.DisplayOrder, existing.IsActive,
                existing.CreatedAt, existing.UpdatedAt
            );
        }

        public async Task DeleteBookAsync(int id)
        {
            var entity = await _db.Set<HadithBook>().FindAsync(id)
                ?? throw new KeyNotFoundException("کتاب حدیث یافت نشد.");
            _db.Set<HadithBook>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<HadithChapterDto>> GetChaptersByBookAsync(int bookId)
        {
            var chapters = await _db.Set<HadithChapter>()
                .Where(c => c.HadithBookId == bookId)
                .OrderBy(c => c.DisplayOrder)
                .ToListAsync();

            return chapters.Select(c => new HadithChapterDto(
                c.Id, c.HadithBookId, c.Title, c.TitleTranslation,
                c.Description, c.DisplayOrder, c.CreatedAt, c.UpdatedAt
            )).ToList();
        }

        public async Task<HadithChapterDetailDto?> FindChapterByIdAsync(int id)
        {
            var chapter = await _db.Set<HadithChapter>()
                .Include(c => c.Hadiths.OrderBy(h => h.DisplayOrder))
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chapter == null) return null;

            return new HadithChapterDetailDto(
                chapter.Id, chapter.HadithBookId, chapter.Title, chapter.TitleTranslation,
                chapter.Description, chapter.DisplayOrder, chapter.CreatedAt, chapter.UpdatedAt,
                chapter.Hadiths.Select(h => new HadithDto(
                    h.Id, h.HadithChapterId, h.HadithNumber, h.MatnArabic, h.Translation,
                    h.TranslationEnglish, h.Isnad, h.Takhrij, h.GharibWords, h.Explanation,
                    h.FiqhTakeaway, h.AudioUrl, h.Grade, h.DisplayOrder, h.IsActive,
                    h.CreatedAt, h.UpdatedAt
                )).ToList()
            );
        }

        public async Task<HadithChapterDto> CreateChapterAsync(CreateHadithChapterRequest request)
        {
            if (!await _db.Set<HadithBook>().AnyAsync(b => b.Id == request.HadithBookId))
                throw new KeyNotFoundException("کتاب حدیث یافت نشد.");

            var entity = new HadithChapter
            {
                Title = request.Title.Trim(),
                TitleTranslation = request.TitleTranslation.Trim(),
                Description = request.Description?.Trim() ?? string.Empty,
                DisplayOrder = request.DisplayOrder,
                HadithBookId = request.HadithBookId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Set<HadithChapter>().Add(entity);
            await _db.SaveChangesAsync();

            return new HadithChapterDto(
                entity.Id, entity.HadithBookId, entity.Title, entity.TitleTranslation,
                entity.Description, entity.DisplayOrder, entity.CreatedAt, entity.UpdatedAt
            );
        }

        public async Task<HadithChapterDto> UpdateChapterAsync(int id, UpdateHadithChapterRequest request)
        {
            var existing = await _db.Set<HadithChapter>().FindAsync(id)
                ?? throw new KeyNotFoundException("باب حدیث یافت نشد.");

            if (request.Title != null) existing.Title = request.Title.Trim();
            if (request.TitleTranslation != null) existing.TitleTranslation = request.TitleTranslation.Trim();
            if (request.Description != null) existing.Description = request.Description.Trim();
            if (request.DisplayOrder.HasValue) existing.DisplayOrder = request.DisplayOrder.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return new HadithChapterDto(
                existing.Id, existing.HadithBookId, existing.Title, existing.TitleTranslation,
                existing.Description, existing.DisplayOrder, existing.CreatedAt, existing.UpdatedAt
            );
        }

        public async Task DeleteChapterAsync(int id)
        {
            var entity = await _db.Set<HadithChapter>().FindAsync(id)
                ?? throw new KeyNotFoundException("باب حدیث یافت نشد.");
            _db.Set<HadithChapter>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<HadithDto>> GetHadithsByChapterAsync(int chapterId)
        {
            var hadiths = await _db.Set<Hadith>()
                .Where(h => h.HadithChapterId == chapterId)
                .OrderBy(h => h.DisplayOrder)
                .ToListAsync();

            return hadiths.Select(h => new HadithDto(
                h.Id, h.HadithChapterId, h.HadithNumber, h.MatnArabic, h.Translation,
                h.TranslationEnglish, h.Isnad, h.Takhrij, h.GharibWords, h.Explanation,
                h.FiqhTakeaway, h.AudioUrl, h.Grade, h.DisplayOrder, h.IsActive,
                h.CreatedAt, h.UpdatedAt
            )).ToList();
        }

        public async Task<HadithDto?> FindHadithByIdAsync(int id)
        {
            var hadith = await _db.Set<Hadith>().FindAsync(id);
            if (hadith == null) return null;

            return new HadithDto(
                hadith.Id, hadith.HadithChapterId, hadith.HadithNumber, hadith.MatnArabic, hadith.Translation,
                hadith.TranslationEnglish, hadith.Isnad, hadith.Takhrij, hadith.GharibWords, hadith.Explanation,
                hadith.FiqhTakeaway, hadith.AudioUrl, hadith.Grade, hadith.DisplayOrder, hadith.IsActive,
                hadith.CreatedAt, hadith.UpdatedAt
            );
        }

        public async Task<HadithDto> CreateHadithAsync(CreateHadithRequest request)
        {
            if (!await _db.Set<HadithChapter>().AnyAsync(c => c.Id == request.HadithChapterId))
                throw new KeyNotFoundException("باب حدیث یافت نشد.");

            var entity = new Hadith
            {
                HadithNumber = request.HadithNumber,
                MatnArabic = request.MatnArabic.Trim(),
                Translation = request.Translation.Trim(),
                TranslationEnglish = request.TranslationEnglish?.Trim() ?? string.Empty,
                Isnad = request.Isnad?.Trim() ?? string.Empty,
                Takhrij = request.Takhrij?.Trim() ?? string.Empty,
                GharibWords = request.GharibWords?.Trim() ?? string.Empty,
                Explanation = request.Explanation?.Trim() ?? string.Empty,
                FiqhTakeaway = request.FiqhTakeaway?.Trim() ?? string.Empty,
                AudioUrl = request.AudioUrl?.Trim() ?? string.Empty,
                Grade = request.Grade?.Trim() ?? "Sahih",
                DisplayOrder = request.DisplayOrder,
                HadithChapterId = request.HadithChapterId,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Set<Hadith>().Add(entity);
            await _db.SaveChangesAsync();

            return new HadithDto(
                entity.Id, entity.HadithChapterId, entity.HadithNumber, entity.MatnArabic, entity.Translation,
                entity.TranslationEnglish, entity.Isnad, entity.Takhrij, entity.GharibWords, entity.Explanation,
                entity.FiqhTakeaway, entity.AudioUrl, entity.Grade, entity.DisplayOrder, entity.IsActive,
                entity.CreatedAt, entity.UpdatedAt
            );
        }

        public async Task<HadithDto> UpdateHadithAsync(int id, UpdateHadithRequest request)
        {
            var existing = await _db.Set<Hadith>().FindAsync(id)
                ?? throw new KeyNotFoundException("حدیث یافت نشد.");

            if (request.HadithNumber.HasValue) existing.HadithNumber = request.HadithNumber.Value;
            if (request.MatnArabic != null) existing.MatnArabic = request.MatnArabic.Trim();
            if (request.Translation != null) existing.Translation = request.Translation.Trim();
            if (request.TranslationEnglish != null) existing.TranslationEnglish = request.TranslationEnglish.Trim();
            if (request.Isnad != null) existing.Isnad = request.Isnad.Trim();
            if (request.Takhrij != null) existing.Takhrij = request.Takhrij.Trim();
            if (request.GharibWords != null) existing.GharibWords = request.GharibWords.Trim();
            if (request.Explanation != null) existing.Explanation = request.Explanation.Trim();
            if (request.FiqhTakeaway != null) existing.FiqhTakeaway = request.FiqhTakeaway.Trim();
            if (request.AudioUrl != null) existing.AudioUrl = request.AudioUrl.Trim();
            if (request.Grade != null) existing.Grade = request.Grade.Trim();
            if (request.DisplayOrder.HasValue) existing.DisplayOrder = request.DisplayOrder.Value;
            if (request.IsActive.HasValue) existing.IsActive = request.IsActive.Value;

            existing.UpdatedAt = DateTime.UtcNow;

            await _db.SaveChangesAsync();

            return new HadithDto(
                existing.Id, existing.HadithChapterId, existing.HadithNumber, existing.MatnArabic, existing.Translation,
                existing.TranslationEnglish, existing.Isnad, existing.Takhrij, existing.GharibWords, existing.Explanation,
                existing.FiqhTakeaway, existing.AudioUrl, existing.Grade, existing.DisplayOrder, existing.IsActive,
                existing.CreatedAt, existing.UpdatedAt
            );
        }

        public async Task DeleteHadithAsync(int id)
        {
            var entity = await _db.Set<Hadith>().FindAsync(id)
                ?? throw new KeyNotFoundException("حدیث یافت نشد.");
            _db.Set<Hadith>().Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<UserHadithProgressDto> GetUserProgressAsync(int userId, int hadithId)
        {
            var progress = await _db.Set<UserHadithProgress>()
                .FirstOrDefaultAsync(p => p.UserId == userId && p.HadithId == hadithId);

            if (progress == null)
                throw new KeyNotFoundException("پیشرفت حدیث یافت نشد.");

            return new UserHadithProgressDto(
                progress.Id, progress.HadithId, progress.UserId,
                progress.MasteryLevel, progress.RepetitionCount,
                progress.ConsecutiveCorrect, progress.TotalAttempts,
                progress.CorrectAttempts, progress.LastReviewedAt,
                progress.NextReviewAt, progress.CreatedAt, progress.UpdatedAt
            );
        }

        public async Task<UserHadithProgressDto> SubmitReviewAsync(int userId, SubmitReviewRequest request)
        {
            var hadith = await _db.Set<Hadith>().FindAsync(request.HadithId)
                ?? throw new KeyNotFoundException("حدیث یافت نشد.");

            var progress = await _db.Set<UserHadithProgress>()
                .FirstOrDefaultAsync(p => p.UserId == userId && p.HadithId == request.HadithId);

            if (progress == null)
            {
                progress = new UserHadithProgress
                {
                    UserId = userId,
                    HadithId = request.HadithId,
                    MasteryLevel = "New",
                    Stability = 0,
                    Difficulty = 0,
                    Retrievability = 0,
                    RepetitionCount = 0,
                    ConsecutiveCorrect = 0,
                    TotalAttempts = 0,
                    CorrectAttempts = 0,
                    NextReviewAt = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _db.Set<UserHadithProgress>().Add(progress);
            }

            progress.TotalAttempts++;
            progress.LastReviewedAt = DateTime.UtcNow;

            if (request.IsCorrect)
            {
                progress.ConsecutiveCorrect++;
                progress.RepetitionCount++;
                progress.CorrectAttempts++;
                progress.Stability = progress.Stability == 0 ? 1 : progress.Stability * 1.5f;
                progress.Difficulty = Math.Max(0, progress.Difficulty - 0.1f);
                progress.Retrievability = Math.Min(1, progress.Retrievability + 0.2f);

                var hours = Math.Pow(2, Math.Min(progress.RepetitionCount, 10));
                progress.NextReviewAt = DateTime.UtcNow.AddHours(hours);

                if (progress.ConsecutiveCorrect >= 3 && progress.MasteryLevel == "Learning")
                    progress.MasteryLevel = "Reviewing";
                else if (progress.ConsecutiveCorrect >= 7 && progress.MasteryLevel == "Reviewing")
                    progress.MasteryLevel = "Memorized";
                else if (progress.MasteryLevel == "New")
                    progress.MasteryLevel = "Learning";
            }
            else
            {
                progress.ConsecutiveCorrect = 0;
                progress.Difficulty = Math.Min(1, progress.Difficulty + 0.2f);
                progress.Retrievability = Math.Max(0, progress.Retrievability - 0.2f);
                progress.RepetitionCount = Math.Max(0, progress.RepetitionCount - 1);
                progress.NextReviewAt = DateTime.UtcNow.AddHours(1);

                if (progress.MasteryLevel == "Reviewing" || progress.MasteryLevel == "Memorized")
                    progress.MasteryLevel = "Learning";
                else if (progress.MasteryLevel == "New")
                    progress.MasteryLevel = "Learning";
            }

            progress.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return new UserHadithProgressDto(
                progress.Id, progress.HadithId, progress.UserId,
                progress.MasteryLevel, progress.RepetitionCount,
                progress.ConsecutiveCorrect, progress.TotalAttempts,
                progress.CorrectAttempts, progress.LastReviewedAt,
                progress.NextReviewAt, progress.CreatedAt, progress.UpdatedAt
            );
        }

        public async Task<List<HadithReviewDto>> GetDueForReviewAsync(int userId, int count = 10)
        {
            var now = DateTime.UtcNow;

            var dueProgress = await _db.Set<UserHadithProgress>()
                .Where(p => p.UserId == userId && p.NextReviewAt <= now)
                .OrderBy(p => p.NextReviewAt)
                .Take(count)
                .ToListAsync();

            var result = new List<HadithReviewDto>();

            foreach (var p in dueProgress)
            {
                var hadith = await _db.Set<Hadith>().FindAsync(p.HadithId);
                if (hadith == null) continue;

                result.Add(new HadithReviewDto(
                    hadith.Id,
                    hadith.Id,
                    hadith.MatnArabic,
                    hadith.Translation,
                    hadith.AudioUrl,
                    new UserHadithProgressDto(
                        p.Id, p.HadithId, p.UserId,
                        p.MasteryLevel, p.RepetitionCount,
                        p.ConsecutiveCorrect, p.TotalAttempts,
                        p.CorrectAttempts, p.LastReviewedAt,
                        p.NextReviewAt, p.CreatedAt, p.UpdatedAt
                    )
                ));
            }

            if (result.Count < count)
            {
                var seenHadithIds = dueProgress.Select(p => p.HadithId).ToHashSet();

                var unseenHadiths = await _db.Set<Hadith>()
                    .Where(h => !seenHadithIds.Contains(h.Id))
                    .Take(count - result.Count)
                    .ToListAsync();

                foreach (var hadith in unseenHadiths)
                {
                    var emptyProgress = new UserHadithProgress
                    {
                        Id = 0,
                        HadithId = hadith.Id,
                        UserId = userId,
                        MasteryLevel = "New",
                        RepetitionCount = 0,
                        ConsecutiveCorrect = 0,
                        TotalAttempts = 0,
                        CorrectAttempts = 0,
                        LastReviewedAt = null,
                        NextReviewAt = now,
                        CreatedAt = now,
                        UpdatedAt = now
                    };

                    result.Add(new HadithReviewDto(
                        hadith.Id,
                        hadith.Id,
                        hadith.MatnArabic,
                        hadith.Translation,
                        hadith.AudioUrl,
                        new UserHadithProgressDto(
                            emptyProgress.Id, emptyProgress.HadithId, emptyProgress.UserId,
                            emptyProgress.MasteryLevel, emptyProgress.RepetitionCount,
                            emptyProgress.ConsecutiveCorrect, emptyProgress.TotalAttempts,
                            emptyProgress.CorrectAttempts, emptyProgress.LastReviewedAt,
                            emptyProgress.NextReviewAt, emptyProgress.CreatedAt, emptyProgress.UpdatedAt
                        )
                    ));
                }
            }

            return result;
        }

        public async Task<Dictionary<string, int>> GetProgressSummaryAsync(int userId)
        {
            var groups = await _db.Set<UserHadithProgress>()
                .Where(p => p.UserId == userId)
                .GroupBy(p => p.MasteryLevel)
                .Select(g => new { Level = g.Key, Count = g.Count() })
                .ToListAsync();

            var summary = new Dictionary<string, int>
            {
                { "New", 0 },
                { "Learning", 0 },
                { "Reviewing", 0 },
                { "Memorized", 0 }
            };

            foreach (var g in groups)
            {
                if (summary.ContainsKey(g.Level))
                    summary[g.Level] = g.Count;
                else
                    summary[g.Level] = g.Count;
            }

            return summary;
        }

        public async Task<List<HadithAssessmentDto>> GetAssessmentsByChapterAsync(int chapterId)
        {
            var assessments = await _db.Set<HadithAssessment>()
                .Where(a => a.HadithChapterId == chapterId)
                .OrderBy(a => a.DisplayOrder)
                .ToListAsync();

            return assessments.Select(a => new HadithAssessmentDto(
                a.Id, a.Question, a.CorrectAnswer, a.OptionA, a.OptionB,
                a.OptionC, a.OptionD, a.Type, a.Difficulty, a.DisplayOrder,
                a.HadithId, a.HadithChapterId, a.CreatedAt, a.UpdatedAt
            )).ToList();
        }

        public async Task<HadithAssessmentDto> CreateAssessmentAsync(CreateHadithAssessmentRequest request)
        {
            if (request.HadithId.HasValue && !await _db.Set<Hadith>().AnyAsync(h => h.Id == request.HadithId.Value))
                throw new KeyNotFoundException("حدیث یافت نشد.");

            if (request.HadithChapterId.HasValue && !await _db.Set<HadithChapter>().AnyAsync(c => c.Id == request.HadithChapterId.Value))
                throw new KeyNotFoundException("باب حدیث یافت نشد.");

            var entity = new HadithAssessment
            {
                Question = request.Question.Trim(),
                CorrectAnswer = request.CorrectAnswer.Trim(),
                OptionA = request.OptionA?.Trim() ?? string.Empty,
                OptionB = request.OptionB?.Trim() ?? string.Empty,
                OptionC = request.OptionC?.Trim() ?? string.Empty,
                OptionD = request.OptionD?.Trim() ?? string.Empty,
                Type = request.Type?.Trim() ?? "MultipleChoice",
                Difficulty = request.Difficulty?.Trim() ?? "Medium",
                DisplayOrder = request.DisplayOrder,
                HadithId = request.HadithId,
                HadithChapterId = request.HadithChapterId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Set<HadithAssessment>().Add(entity);
            await _db.SaveChangesAsync();

            return new HadithAssessmentDto(
                entity.Id, entity.Question, entity.CorrectAnswer, entity.OptionA, entity.OptionB,
                entity.OptionC, entity.OptionD, entity.Type, entity.Difficulty, entity.DisplayOrder,
                entity.HadithId, entity.HadithChapterId, entity.CreatedAt, entity.UpdatedAt
            );
        }

        public async Task<HadithDashboardStatsDto> GetDashboardStatsAsync(int userId)
        {
            var totalBooks = await _db.Set<HadithBook>().CountAsync();
            var totalHadiths = await _db.Set<Hadith>().CountAsync();
            var totalMemorized = await _db.Set<UserHadithProgress>()
                .CountAsync(p => p.UserId == userId && p.MasteryLevel == "Memorized");

            var allProgress = await _db.Set<UserHadithProgress>()
                .Where(p => p.UserId == userId && p.LastReviewedAt != null)
                .OrderByDescending(p => p.LastReviewedAt)
                .Select(p => p.LastReviewedAt!.Value)
                .ToListAsync();

            var currentStreak = 0;
            if (allProgress.Count > 0)
            {
                var today = DateTime.UtcNow.Date;
                var reviewDates = allProgress.Select(d => d.Date).Distinct().OrderByDescending(d => d).ToList();

                for (int i = 0; i < reviewDates.Count; i++)
                {
                    var expected = today.AddDays(-i);
                    if (reviewDates[i] == expected)
                        currentStreak++;
                    else
                        break;
                }
            }

            var totalCorrect = await _db.Set<UserHadithProgress>()
                .Where(p => p.UserId == userId)
                .SumAsync(p => p.CorrectAttempts);

            var totalXp = totalCorrect * 5;

            return new HadithDashboardStatsDto(totalBooks, totalHadiths, totalMemorized, currentStreak, totalXp);
        }
    }
}

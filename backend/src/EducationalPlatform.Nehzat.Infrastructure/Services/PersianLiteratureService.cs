using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services
{
    public class PersianLiteratureService : IPersianLiteratureService
    {
        private readonly AppDbContext _db;

        public PersianLiteratureService(AppDbContext db)
        {
            _db = db;
        }

        // ========== Poet operations ==========

        public async Task<List<Poet>> GetAllPoetsAsync(string? difficulty = null)
        {
            var query = _db.PersianLiteraturePoets.AsQueryable();

            if (!string.IsNullOrWhiteSpace(difficulty))
                query = query.Where(p => p.DifficultyLevel == difficulty);

            return await query.OrderBy(p => p.SortOrder).ThenBy(p => p.Name).ToListAsync();
        }

        public async Task<Poet?> FindPoetByIdAsync(int id)
        {
            return await _db.PersianLiteraturePoets
                .Include(p => p.Poems.OrderBy(po => po.SortOrder))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Poet> CreatePoetAsync(CreatePoetRequest request)
        {
            if (await _db.PersianLiteraturePoets.AnyAsync(p => p.Name == request.Name.Trim()))
                throw new InvalidOperationException("نام شاعر تکراری است.");

            var entity = new Poet
            {
                Name = request.Name.Trim(),
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

            _db.PersianLiteraturePoets.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Poet> UpdatePoetAsync(int id, UpdatePoetRequest request)
        {
            var existing = await _db.PersianLiteraturePoets.FindAsync(id)
                ?? throw new KeyNotFoundException("شاعر یافت نشد.");

            if (request.Name != null) existing.Name = request.Name.Trim();
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
            var entity = await _db.PersianLiteraturePoets.FindAsync(id)
                ?? throw new KeyNotFoundException("شاعر یافت نشد.");
            _db.PersianLiteraturePoets.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Poet>> SearchPoetsAsync(string query, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<Poet>();

            return await _db.PersianLiteraturePoets
                .Where(p => p.Name.Contains(query) || (p.PenName != null && p.PenName.Contains(query)))
                .OrderBy(p => p.SortOrder)
                .ThenBy(p => p.Name)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Poem operations ==========

        public async Task<List<Poem>> GetAllPoemsAsync(int? poetId = null, string? genre = null, string? difficulty = null)
        {
            var query = _db.PersianLiteraturePoems
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

        public async Task<Poem?> FindPoemByIdAsync(int id)
        {
            return await _db.PersianLiteraturePoems
                .Include(p => p.Poet)
                .Include(p => p.Analyses.OrderBy(a => a.SortOrder))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Poem> CreatePoemAsync(CreatePoemRequest request)
        {
            var poetExists = await _db.PersianLiteraturePoets.AnyAsync(p => p.Id == request.PoetId);
            if (!poetExists)
                throw new KeyNotFoundException("شاعر یافت نشد.");

            var entity = new Poem
            {
                PoetId = request.PoetId,
                Title = request.Title.Trim(),
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

            _db.PersianLiteraturePoems.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<Poem> UpdatePoemAsync(int id, UpdatePoemRequest request)
        {
            var existing = await _db.PersianLiteraturePoems.FindAsync(id)
                ?? throw new KeyNotFoundException("شعر یافت نشد.");

            if (request.PoetId.HasValue)
            {
                var poetExists = await _db.PersianLiteraturePoets.AnyAsync(p => p.Id == request.PoetId.Value);
                if (!poetExists)
                    throw new KeyNotFoundException("شاعر یافت نشد.");
                existing.PoetId = request.PoetId.Value;
            }
            if (request.Title != null) existing.Title = request.Title.Trim();
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
            var entity = await _db.PersianLiteraturePoems.FindAsync(id)
                ?? throw new KeyNotFoundException("شعر یافت نشد.");
            _db.PersianLiteraturePoems.Remove(entity);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Poem>> SearchPoemsAsync(string query, int maxResults = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<Poem>();

            return await _db.PersianLiteraturePoems
                .Include(p => p.Poet)
                .Where(p => p.Title.Contains(query) || p.Content.Contains(query))
                .OrderBy(p => p.SortOrder)
                .ThenBy(p => p.Title)
                .Take(maxResults)
                .ToListAsync();
        }

        // ========== Analysis operations ==========

        public async Task<List<PoemAnalysis>> GetAnalysesByPoemAsync(int poemId)
        {
            return await _db.PersianLiteratureAnalyses
                .Where(a => a.PoemId == poemId)
                .OrderBy(a => a.SortOrder)
                .ToListAsync();
        }

        public async Task<PoemAnalysis?> FindAnalysisByIdAsync(int id)
        {
            return await _db.PersianLiteratureAnalyses
                .Include(a => a.Poem)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<PoemAnalysis> CreateAnalysisAsync(CreateAnalysisRequest request)
        {
            var poemExists = await _db.PersianLiteraturePoems.AnyAsync(p => p.Id == request.PoemId);
            if (!poemExists)
                throw new KeyNotFoundException("شعر یافت نشد.");

            var entity = new PoemAnalysis
            {
                PoemId = request.PoemId,
                Title = request.Title.Trim(),
                Content = request.Content?.Trim() ?? string.Empty,
                AnalysisType = request.AnalysisType?.Trim() ?? "general",
                DifficultyLevel = request.DifficultyLevel?.Trim() ?? "beginner",
                SortOrder = request.SortOrder
            };

            _db.PersianLiteratureAnalyses.Add(entity);
            await _db.SaveChangesAsync();
            return entity;
        }

        public async Task<PoemAnalysis> UpdateAnalysisAsync(int id, UpdateAnalysisRequest request)
        {
            var existing = await _db.PersianLiteratureAnalyses.FindAsync(id)
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
            var entity = await _db.PersianLiteratureAnalyses.FindAsync(id)
                ?? throw new KeyNotFoundException("تحلیل یافت نشد.");
            _db.PersianLiteratureAnalyses.Remove(entity);
            await _db.SaveChangesAsync();
        }

        // ========== Dashboard ==========

        public async Task<object> GetDashboardStatsAsync()
        {
            var poetCount = await _db.PersianLiteraturePoets.CountAsync();
            var poemCount = await _db.PersianLiteraturePoems.CountAsync();
            var analysisCount = await _db.PersianLiteratureAnalyses.CountAsync();
            var genreCount = await _db.PersianLiteraturePoems
                .Where(p => p.Genre != null)
                .Select(p => p.Genre)
                .Distinct()
                .CountAsync();
            var eraCount = await _db.PersianLiteraturePoets
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

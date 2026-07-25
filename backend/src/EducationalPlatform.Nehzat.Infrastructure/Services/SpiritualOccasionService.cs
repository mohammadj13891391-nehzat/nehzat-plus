using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class SpiritualOccasionService : ISpiritualOccasionService
{
    private readonly AppDbContext _db;

    public SpiritualOccasionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<UserOccasionProgress>> GetProgressForUserAsync(int userId, int? occasionId, int? hijriYear)
    {
        var query = _db.UserOccasionProgress
            .Where(p => p.UserId == userId);

        if (occasionId.HasValue)
            query = query.Where(p => p.OccasionId == occasionId.Value);

        if (hijriYear.HasValue)
            query = query.Where(p => p.HijriYear == hijriYear.Value);

        return await query
            .Include(p => p.Occasion)
            .Include(p => p.PracticeItem)
            .OrderByDescending(p => p.HijriYear)
            .ThenBy(p => p.OccasionId)
            .ThenBy(p => p.PracticeItemId)
            .ToListAsync();
    }

    public async Task<UserOccasionProgress> MarkPracticeAsync(int userId, int occasionId, int practiceItemId, int hijriYear, bool isCompleted, string? notes)
    {
        var existing = await _db.UserOccasionProgress
            .FirstOrDefaultAsync(p =>
                p.UserId == userId &&
                p.OccasionId == occasionId &&
                p.PracticeItemId == practiceItemId &&
                p.HijriYear == hijriYear);

        if (existing != null)
        {
            existing.IsCompleted = isCompleted;
            existing.CompletedAt = isCompleted ? DateTime.UtcNow : null;
            existing.Notes = notes;
            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        var progress = new UserOccasionProgress
        {
            UserId = userId,
            OccasionId = occasionId,
            PracticeItemId = practiceItemId,
            HijriYear = hijriYear,
            IsCompleted = isCompleted,
            CompletedAt = isCompleted ? DateTime.UtcNow : null,
            Notes = notes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.UserOccasionProgress.Add(progress);
        await _db.SaveChangesAsync();
        return progress;
    }
}
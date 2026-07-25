using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class SpiritualEntryService : ISpiritualEntryService
{
    private readonly AppDbContext _db;

    public SpiritualEntryService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DailySpiritualEntry> UpsertDailyEntryAsync(int userId, DateTime entryDate, int? moodScore, string? notes, string? completedSteps)
    {
        var dateOnly = entryDate.Date;

        var existing = await _db.DailySpiritualEntries
            .FirstOrDefaultAsync(e => e.UserId == userId && e.EntryDate == dateOnly);

        if (existing != null)
        {
            existing.MoodScore = moodScore;
            existing.Notes = notes;
            existing.CompletedSteps = completedSteps;
            existing.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            return existing;
        }

        var entry = new DailySpiritualEntry
        {
            UserId = userId,
            EntryDate = dateOnly,
            MoodScore = moodScore,
            Notes = notes,
            CompletedSteps = completedSteps,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.DailySpiritualEntries.Add(entry);
        await _db.SaveChangesAsync();
        return entry;
    }

    public async Task<DailySpiritualEntry?> GetDailyEntryAsync(int userId, DateTime entryDate)
    {
        var dateOnly = entryDate.Date;
        return await _db.DailySpiritualEntries
            .FirstOrDefaultAsync(e => e.UserId == userId && e.EntryDate == dateOnly);
    }

    public async Task<List<DailySpiritualEntry>> GetEntryHistoryAsync(int userId, DateTime? fromDate, DateTime? toDate)
    {
        var query = _db.DailySpiritualEntries
            .Where(e => e.UserId == userId);

        if (fromDate.HasValue)
            query = query.Where(e => e.EntryDate >= fromDate.Value.Date);

        if (toDate.HasValue)
            query = query.Where(e => e.EntryDate <= toDate.Value.Date);

        return await query
            .OrderByDescending(e => e.EntryDate)
            .ToListAsync();
    }

    public async Task<int> GetStreakAsync(int userId)
    {
        var entries = await _db.DailySpiritualEntries
            .Where(e => e.UserId == userId)
            .OrderByDescending(e => e.EntryDate)
            .Select(e => e.EntryDate.Date)
            .ToListAsync();

        if (entries.Count == 0)
            return 0;

        var today = DateTime.UtcNow.Date;
        var yesterday = today.AddDays(-1);

        if (entries[0] != today && entries[0] != yesterday)
            return 0;

        var streak = 1;
        for (var i = 1; i < entries.Count; i++)
        {
            if (entries[i] == entries[i - 1].AddDays(-1))
                streak++;
            else
                break;
        }

        return streak;
    }
}
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ISpiritualEntryService
{
    Task<DailySpiritualEntry> UpsertDailyEntryAsync(int userId, DateTime entryDate, int? moodScore, string? notes, string? completedSteps);
    Task<DailySpiritualEntry?> GetDailyEntryAsync(int userId, DateTime entryDate);
    Task<List<DailySpiritualEntry>> GetEntryHistoryAsync(int userId, DateTime? fromDate, DateTime? toDate);
    Task<int> GetStreakAsync(int userId);
}

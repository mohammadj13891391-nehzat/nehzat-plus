using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class SpiritualPathService : ISpiritualPathService
{
    private readonly AppDbContext _db;

    public SpiritualPathService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<SpiritualPath>> GetAvailablePathsAsync(int studentId)
    {
        var student = await _db.Students.FindAsync(studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد");

        var gender = student.Gender ?? "mixed";

        return await _db.SpiritualPaths
            .Where(p => p.Status == "active")
            .Where(p => p.GenderMask == "mixed" || p.GenderMask == gender)
            .OrderBy(p => p.SortOrder)
            .ThenBy(p => p.Id)
            .ToListAsync();
    }

    public async Task<StudentPathSelection> SubmitRankingAsync(int studentId, int pathId, int rankOrdinal)
    {
        var student = await _db.Students.FindAsync(studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد");

        var path = await _db.SpiritualPaths.FindAsync(pathId)
            ?? throw new KeyNotFoundException("مسیر یافت نشد");

        var selection = await GetOrCreateSelectionAsync(studentId);

        if (selection.Stage == "locked")
            throw new InvalidOperationException("مرحله انتخاب قفل شده است");

        if (selection.Stage == "finalized")
            throw new InvalidOperationException("مسیر نهایی شده است و امکان تغییر رتبه‌بندی وجود ندارد");

        var existingRanking = await _db.StudentPathRankings
            .FirstOrDefaultAsync(r => r.SelectionId == selection.Id && r.PathId == pathId);

        if (existingRanking != null)
        {
            existingRanking.RankOrdinal = rankOrdinal;
            existingRanking.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var ranking = new StudentPathRanking
            {
                SelectionId = selection.Id,
                PathId = pathId,
                RankOrdinal = rankOrdinal,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.StudentPathRankings.Add(ranking);
        }

        selection.Stage = "ranking";
        selection.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return selection;
    }

    public async Task<StudentPathSelection> FinalizePathAsync(int studentId, int pathId, string? reason)
    {
        var student = await _db.Students.FindAsync(studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد");

        var path = await _db.SpiritualPaths.FindAsync(pathId)
            ?? throw new KeyNotFoundException("مسیر یافت نشد");

        var selection = await GetOrCreateSelectionAsync(studentId);

        if (selection.Stage == "locked")
            throw new InvalidOperationException("مرحله انتخاب قفل شده است");

        var previousStage = selection.Stage;
        var previousPathId = selection.FinalizedPathId;

        selection.FinalizedPathId = pathId;
        selection.Stage = "finalized";
        selection.FinalizedAt = DateTime.UtcNow;
        selection.UpdatedAt = DateTime.UtcNow;

        await AddHistoryEntryAsync(studentId, previousStage, "finalized", previousPathId, pathId, reason);

        await _db.SaveChangesAsync();
        return selection;
    }

    public async Task<StudentPathSelection> SwitchFinalizedPathAsync(int studentId, int newPathId, string? reason)
    {
        var student = await _db.Students.FindAsync(studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد");

        var newPath = await _db.SpiritualPaths.FindAsync(newPathId)
            ?? throw new KeyNotFoundException("مسیر جدید یافت نشد");

        var selection = await _db.StudentPathSelections
            .FirstOrDefaultAsync(s => s.StudentId == studentId)
            ?? throw new KeyNotFoundException("انتخابی برای این دانش‌آموز یافت نشد");

        if (selection.Stage == "locked")
            throw new InvalidOperationException("مرحله انتخاب قفل شده است و امکان تغییر وجود ندارد");

        if (selection.Stage != "finalized")
            throw new InvalidOperationException("تنها در مرحله نهایی شده امکان تغییر مسیر وجود دارد");

        var previousPathId = selection.FinalizedPathId;

        selection.FinalizedPathId = newPathId;
        selection.Stage = "finalized";
        selection.FinalizedAt = DateTime.UtcNow;
        selection.UpdatedAt = DateTime.UtcNow;

        await AddHistoryEntryAsync(studentId, "finalized", "finalized", previousPathId, newPathId, reason);

        await _db.SaveChangesAsync();
        return selection;
    }

    public async Task<StudentPathSelection?> GetSelectionAsync(int studentId)
    {
        return await _db.StudentPathSelections
            .Include(s => s.Rankings)
            .ThenInclude(r => r.Path)
            .Include(s => s.FinalizedPath)
            .FirstOrDefaultAsync(s => s.StudentId == studentId);
    }

    public async Task<List<StudentPathHistory>> GetHistoryAsync(int studentId)
    {
        return await _db.StudentPathHistory
            .Where(h => h.StudentId == studentId)
            .OrderByDescending(h => h.ChangedAt)
            .ToListAsync();
    }

    private async Task<StudentPathSelection> GetOrCreateSelectionAsync(int studentId)
    {
        var selection = await _db.StudentPathSelections
            .FirstOrDefaultAsync(s => s.StudentId == studentId);

        if (selection != null)
            return selection;

        selection = new StudentPathSelection
        {
            StudentId = studentId,
            HijriSelectionYear = GetCurrentHijriYear(),
            Stage = "ranking",
            SelectedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.StudentPathSelections.Add(selection);
        await _db.SaveChangesAsync();
        return selection;
    }

    private async Task AddHistoryEntryAsync(int studentId, string? previousStage, string? newStage, int? previousPathId, int? newPathId, string? reason)
    {
        var history = new StudentPathHistory
        {
            StudentId = studentId,
            ChangedByUserId = 0,
            PreviousStage = previousStage,
            NewStage = newStage,
            PreviousFinalizedPathId = previousPathId,
            NewFinalizedPathId = newPathId,
            Reason = reason,
            ChangedAt = DateTime.UtcNow
        };

        _db.StudentPathHistory.Add(history);
        await Task.CompletedTask;
    }

    private static int GetCurrentHijriYear()
    {
        try
        {
            var hijri = new System.Globalization.HijriCalendar();
            return hijri.GetYear(DateTime.UtcNow);
        }
        catch
        {
            return 1446;
        }
    }
}
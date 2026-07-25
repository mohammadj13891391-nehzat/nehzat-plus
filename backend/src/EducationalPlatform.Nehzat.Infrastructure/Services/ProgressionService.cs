using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class ProgressionService : IProgressionService
{
    private readonly AppDbContext _db;

    public ProgressionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<ProgressionResultDto> CheckProgressionAsync(int studentId)
    {
        var student = await _db.Students
            .Include(s => s.Branch)
            .FirstOrDefaultAsync(s => s.Id == studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز پیدا نشد.");

        var activeRingStudent = await _db.RingStudents
            .Include(rs => rs.Ring)
                .ThenInclude(r => r!.Madrasah)
            .FirstOrDefaultAsync(rs => rs.StudentId == studentId && rs.Status == "active");

        var currentRing = activeRingStudent?.Ring;
        var currentRingName = currentRing?.Name ?? "بدون حلقه";
        var currentRingKey = currentRing?.Key ?? string.Empty;

        // Get student's skill progress
        var skillProgress = await _db.Set<StudentSkillProgress>()
            .Include(p => p.Objective)
                .ThenInclude(o => o.SubjectArea)
            .Where(p => p.StudentId == studentId)
            .ToListAsync();

        // Calculate mastery rates by subject area
        var masteryRates = skillProgress
            .Where(p => p.Objective.SubjectArea != null)
            .GroupBy(p => p.Objective.SubjectArea!)
            .Select(g => new
            {
                SubjectAreaKey = g.Key.Key,
                SubjectAreaName = g.Key.Name,
                Mastered = g.Count(p => p.ProficiencyLevel == "mastered"),
                Total = g.Count(),
                Rate = g.Count() > 0 ? (double)g.Count(p => p.ProficiencyLevel == "mastered") / g.Count() * 100 : 0
            })
            .ToDictionary(
                x => x.SubjectAreaKey,
                x => (int)Math.Round(x.Rate)
            );

        // Determine current level based on overall mastery
        var overallMastered = skillProgress.Count(p => p.ProficiencyLevel == "mastered");
        var overallTotal = skillProgress.Count;
        var overallRate = overallTotal > 0 ? (double)overallMastered / overallTotal * 100 : 0;

        var currentLevel = DetermineLevelFromRate(overallRate);

        // Check if can progress to next level
        var nextLevel = GetNextLevel(currentLevel);
        var canProgress = CanProgressToLevel(currentLevel, masteryRates, overallRate);
        var blockingReasons = GetBlockingReasons(currentLevel, masteryRates);

        return new ProgressionResultDto
        {
            StudentId = studentId,
            StudentName = $"{student.FirstName} {student.LastName}",
            CurrentLevel = currentLevel,
            CurrentRing = currentRingName,
            NextLevel = canProgress ? nextLevel : null,
            NextRing = canProgress && currentLevel.Contains("advanced") ? GetNextRingKey(currentRingKey) : null,
            CanProgress = canProgress,
            BlockingReasons = blockingReasons,
            SkillMasteryRates = masteryRates,
            CheckedAt = DateTime.UtcNow
        };
    }

    public async Task<List<ProgressionResultDto>> CheckRingProgressionAsync(int ringId)
    {
        var studentIds = await _db.RingStudents
            .Where(rs => rs.RingId == ringId && rs.Status == "active")
            .Select(rs => rs.StudentId)
            .ToListAsync();

        var results = new List<ProgressionResultDto>();
        foreach (var studentId in studentIds)
        {
            try
            {
                results.Add(await CheckProgressionAsync(studentId));
            }
            catch
            {
                // Skip students with errors
            }
        }

        return results;
    }

    public async Task<StudentPathHistory> RecordProgressionAsync(int studentId, string fromLevel, string toLevel, int? changedByUserId = null)
    {
        var student = await _db.Students.FindAsync(studentId)
            ?? throw new KeyNotFoundException("دانش‌آموز پیدا نشد.");

        var history = new StudentPathHistory
        {
            StudentId = studentId,
            ChangedByUserId = changedByUserId ?? 0,
            PreviousStage = fromLevel,
            NewStage = toLevel,
            Reason = $"پیشرفت از سطح {fromLevel} به {toLevel}",
            ChangedAt = DateTime.UtcNow
        };

        _db.Set<StudentPathHistory>().Add(history);
        await _db.SaveChangesAsync();

        return history;
    }

    private static string DetermineLevelFromRate(double rate)
    {
        return rate switch
        {
            >= 90 => "advanced",
            >= 60 => "intermediate",
            >= 30 => "beginner",
            _ => "not_started"
        };
    }

    private static string GetNextLevel(string currentLevel)
    {
        return currentLevel switch
        {
            "not_started" => "beginner",
            "beginner" => "intermediate",
            "intermediate" => "advanced",
            "advanced" => "mastered",
            _ => "beginner"
        };
    }

    private static bool CanProgressToLevel(string currentLevel, Dictionary<string, int> masteryRates, double overallRate)
    {
        if (overallRate < 60) return false; // Minimum 60% overall

        // Each subject area must have at least 40% mastery
        return masteryRates.Values.All(rate => rate >= 40);
    }

    private static List<string> GetBlockingReasons(string currentLevel, Dictionary<string, int> masteryRates)
    {
        var reasons = new List<string>();

        if (masteryRates.Values.Any(rate => rate < 40))
        {
            var weakAreas = masteryRates
                .Where(kvp => kvp.Value < 40)
                .Select(kvp => $"{kvp.Key}: {kvp.Value}%")
                .ToList();
            reasons.Add($"مسترد در حوزه‌ها: {string.Join(", ", weakAreas)}");
        }

        var overallRate = masteryRates.Values.Any() ? masteryRates.Values.Average() : 0;
        if (overallRate < 60)
        {
            reasons.Add($"نرخ تسلط کلی پایین است: {overallRate:F0}% (حداقل 60%)");
        }

        return reasons;
    }

    private static string? GetNextRingKey(string currentRingKey)
    {
        // Extract numeric part and increment
        var match = System.Text.RegularExpressions.Regex.Match(currentRingKey, @"(\d+)$");
        if (match.Success)
        {
            var num = int.Parse(match.Value) + 1;
            return System.Text.RegularExpressions.Regex.Replace(currentRingKey, @"(\d+)$", num.ToString());
        }
        return null;
    }
}
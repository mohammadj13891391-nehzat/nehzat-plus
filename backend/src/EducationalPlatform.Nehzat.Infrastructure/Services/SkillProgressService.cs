using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class SkillProgressService : ISkillProgressService
{
    private readonly AppDbContext _db;

    public SkillProgressService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// محاسبه سطح پیشرفت بر اساس نمره.
    /// قوانین: 0 → not_started, 1-59 → in_progress, 60-89 → achieved, 90+ → mastered
    /// </summary>
    public static string CalculateLevelFromScore(int score)
    {
        if (score <= 0) return "not_started";
        if (score < 60) return "in_progress";
        if (score < 90) return "achieved";
        return "mastered";
    }

    public async Task<List<AgeGroup>> GetAllAgeGroupsAsync()
    {
        return await _db.Set<AgeGroup>()
            .OrderBy(a => a.SortOrder)
            .ToListAsync();
    }

    public async Task<AgeGroup> CreateAgeGroupAsync(AgeGroup ageGroup)
    {
        if (await _db.Set<AgeGroup>().AnyAsync(a => a.Key == ageGroup.Key))
            throw new InvalidOperationException("گروه سنی با این کلید قبلاً ثبت شده است.");

        _db.Set<AgeGroup>().Add(ageGroup);
        await _db.SaveChangesAsync();
        return ageGroup;
    }

    public async Task<List<StudentSkillProgress>> GetProgressByStudentAsync(int studentId)
    {
        return await _db.Set<StudentSkillProgress>()
            .Include(p => p.Objective)
            .Where(p => p.StudentId == studentId)
            .OrderByDescending(p => p.UpdatedAt)
            .ToListAsync();
    }

    public async Task<List<StudentSkillProgress>> GetProgressByRingAsync(int ringId)
    {
        return await _db.Set<StudentSkillProgress>()
            .Include(p => p.Objective)
            .Include(p => p.Student)
            .Where(p => p.RingId == ringId)
            .OrderBy(p => p.StudentId)
            .ThenByDescending(p => p.UpdatedAt)
            .ToListAsync();
    }

    public async Task<StudentSkillProgress> UpdateProgressAsync(int id, int score, string? proficiencyLevel)
    {
        var progress = await _db.Set<StudentSkillProgress>().FindAsync(id)
            ?? throw new KeyNotFoundException("پیشرفت مهارتی یافت نشد.");

        // اعمال نمره + محاسبه خودکار سطح پیشرفت (Phase 2.3 — Level Transition)
        progress.Score = score;
        progress.ProficiencyLevel = CalculateLevelFromScore(score);
        if (!string.IsNullOrWhiteSpace(proficiencyLevel))
            progress.ProficiencyLevel = proficiencyLevel;
        progress.LastAssessedAt = DateTime.UtcNow;
        progress.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return progress;
    }

    public async Task<StudentProgressSummaryDto> GetProgressSummaryAsync(int studentId)
    {
        var records = await _db.Set<StudentSkillProgress>()
            .Include(p => p.Objective)
                .ThenInclude(o => o.SubjectArea)
            .Where(p => p.StudentId == studentId)
            .ToListAsync();

        var subjectAreas = records
            .Where(p => p.Objective.SubjectArea != null)
            .GroupBy(p => p.Objective.SubjectArea!)
            .Select(g => new SubjectAreaProgressDto(
                g.Key.Id,
                g.Key.Name,
                g.Key.Key,
                g.Average(p => p.Score),
                g.Count(p => p.ProficiencyLevel == "mastered"),
                g.Count()
            ))
            .ToList();

        var summary = new ProgressSummaryDto(
            TotalObjectives: records.Count,
            MasteredCount: records.Count(p => p.ProficiencyLevel == "mastered"),
            AchievedCount: records.Count(p => p.ProficiencyLevel == "achieved"),
            InProgressCount: records.Count(p => p.ProficiencyLevel == "in_progress"),
            NotStartedCount: records.Count(p => p.ProficiencyLevel == "not_started"),
            AverageScore: records.Any() ? (int)records.Average(p => p.Score) : 0
        );

        return new StudentProgressSummaryDto(studentId, summary, subjectAreas);
    }

    public async Task<StudentSkillProgress> SyncFromSubmissionAsync(int submissionId)
    {
        var submission = await _db.Set<AssignmentSubmission>()
            .Include(s => s.Assignment)
            .FirstOrDefaultAsync(s => s.Id == submissionId)
            ?? throw new KeyNotFoundException("ارسال یافت نشد.");

        if (submission.Assignment.ObjectiveId == null)
            throw new InvalidOperationException("این تکلیف به هیچ هدف آموزشی متصل نیست.");

            var progress = await _db.Set<StudentSkillProgress>()
            .FirstOrDefaultAsync(p =>
                p.StudentId == submission.StudentId &&
                p.ObjectiveId == submission.Assignment.ObjectiveId.Value);

        if (progress == null)
        {
            var ringStudent = await _db.Set<RingStudent>()
                .FirstOrDefaultAsync(rs => rs.StudentId == submission.StudentId && rs.Status == "active");

            progress = new StudentSkillProgress
            {
                StudentId = submission.StudentId,
                ObjectiveId = submission.Assignment.ObjectiveId.Value,
                RingId = ringStudent?.RingId,
                Score = submission.DailyScore,
                ProficiencyLevel = CalculateLevelFromScore(submission.DailyScore),
                LastAssessedAt = submission.SubmissionDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.Set<StudentSkillProgress>().Add(progress);
        }
        else
        {
            if (submission.DailyScore > progress.Score)
            {
                progress.Score = submission.DailyScore;
                progress.ProficiencyLevel = CalculateLevelFromScore(submission.DailyScore);
            }
            progress.LastAssessedAt = submission.SubmissionDate;
            progress.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return progress;
    }
}

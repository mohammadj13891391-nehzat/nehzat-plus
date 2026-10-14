using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

/// <summary>
/// سرویس حلقه‌های قرآنی (۹ حلقه مکاتب ۴گانه): مدیریت حلقه‌ها، جلسات، گام‌ها،
/// پیشرفت متربیان، دسته‌بندی سرعت، تدبر، ارزیابی دارایی، مصاحبه‌ها و داشبورد
/// </summary>
public class QuranRingService : IQuranRingService
{
    private readonly AppDbContext _db;

    public QuranRingService(AppDbContext db)
    {
        _db = db;
    }

    // ==================== Rings ====================

    public async Task<List<QuranRingDto>> GetAllRingsAsync(QuranRingFilterDto? filter = null)
    {
        var query = _db.QuranRings.AsQueryable();

        if (filter != null)
        {
            if (!string.IsNullOrWhiteSpace(filter.Search))
                query = query.Where(r => r.Name.Contains(filter.Search) || r.Code.Contains(filter.Search));
            if (!string.IsNullOrWhiteSpace(filter.AgeGroup))
                query = query.Where(r => r.AgeGroup == filter.AgeGroup);
            if (!string.IsNullOrWhiteSpace(filter.Gender))
                query = query.Where(r => r.Gender == filter.Gender);
            if (filter.IsActive.HasValue)
                query = query.Where(r => r.IsActive == filter.IsActive.Value);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 100);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var rings = await query
            .Include(r => r.Sessions)
            .Include(r => r.RingSurahs).ThenInclude(rs => rs.Surah)
            .Include(r => r.Resources)
            .OrderBy(r => r.SortOrder)
            .ToListAsync();

        return rings.Select(ToRingDto).ToList();
    }

    public async Task<QuranRingDto?> GetRingByIdAsync(int id)
    {
        var ring = await _db.QuranRings
            .Include(r => r.Sessions).ThenInclude(s => s.Steps)
            .Include(r => r.RingSurahs).ThenInclude(rs => rs.Surah)
            .Include(r => r.Resources)
            .FirstOrDefaultAsync(r => r.Id == id);
        return ring == null ? null : ToRingDto(ring);
    }

    public async Task<QuranRingDto?> GetRingByCodeAsync(string code)
    {
        var ring = await _db.QuranRings
            .Include(r => r.Sessions).ThenInclude(s => s.Steps)
            .Include(r => r.RingSurahs).ThenInclude(rs => rs.Surah)
            .Include(r => r.Resources)
            .FirstOrDefaultAsync(r => r.Code == code);
        return ring == null ? null : ToRingDto(ring);
    }

    public async Task<QuranRingDto> CreateRingAsync(CreateQuranRingRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Code))
            throw new InvalidOperationException("کد حلقه نمی‌تواند خالی باشد");
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new InvalidOperationException("نام حلقه نمی‌تواند خالی باشد");

        var codeExists = await _db.QuranRings.AnyAsync(r => r.Code == request.Code);
        if (codeExists)
            throw new InvalidOperationException($"حلقه‌ای با کد «{request.Code}» از قبل وجود دارد");

        var ring = new QuranRing
        {
            Code = request.Code.Trim(),
            Name = request.Name.Trim(),
            Description = request.Description,
            AgeGroup = request.AgeGroup,
            Gender = request.Gender,
            MinAge = request.MinAge,
            MaxAge = request.MaxAge,
            SortOrder = request.SortOrder,
            IsActive = true,
            HasSpecializedPath = request.HasSpecializedPath,
            SpecializedPeriods = request.SpecializedPeriods,
            SpecializedTimePercent = request.SpecializedTimePercent,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.QuranRings.Add(ring);
        await _db.SaveChangesAsync();
        return ToRingDto(ring);
    }

    public async Task<QuranRingDto> UpdateRingAsync(int id, UpdateQuranRingRequest request)
    {
        var ring = await _db.QuranRings.FindAsync(id)
            ?? throw new KeyNotFoundException("حلقه یافت نشد");

        if (request.Name != null) ring.Name = request.Name;
        if (request.Description != null) ring.Description = request.Description;
        if (request.AgeGroup != null) ring.AgeGroup = request.AgeGroup;
        if (request.Gender != null) ring.Gender = request.Gender;
        if (request.MinAge.HasValue) ring.MinAge = request.MinAge;
        if (request.MaxAge.HasValue) ring.MaxAge = request.MaxAge;
        if (request.SortOrder.HasValue) ring.SortOrder = request.SortOrder.Value;
        if (request.IsActive.HasValue) ring.IsActive = request.IsActive.Value;
        if (request.HasSpecializedPath.HasValue) ring.HasSpecializedPath = request.HasSpecializedPath.Value;
        if (request.SpecializedPeriods.HasValue) ring.SpecializedPeriods = request.SpecializedPeriods;
        if (request.SpecializedTimePercent.HasValue) ring.SpecializedTimePercent = request.SpecializedTimePercent;
        ring.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToRingDto(ring);
    }

    public async Task<bool> DeleteRingAsync(int id)
    {
        var ring = await _db.QuranRings.FindAsync(id);
        if (ring == null) return false;
        _db.QuranRings.Remove(ring);
        await _db.SaveChangesAsync();
        return true;
    }

    // ==================== Sessions ====================

    public async Task<List<QuranRingSessionDto>> GetSessionsAsync(SessionFilterDto? filter = null)
    {
        var query = _db.QuranRingSessions.AsQueryable();

        if (filter != null)
        {
            if (filter.RingId.HasValue) query = query.Where(s => s.RingId == filter.RingId.Value);
            if (filter.IsAssessment.HasValue) query = query.Where(s => s.IsAssessment == filter.IsAssessment.Value);
            if (filter.IsActive.HasValue) query = query.Where(s => s.IsActive == filter.IsActive.Value);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 200);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var sessions = await query
            .Include(s => s.Steps)
            .OrderBy(s => s.RingId).ThenBy(s => s.SessionNumber)
            .ToListAsync();

        return sessions.Select(ToSessionDto).ToList();
    }

    public async Task<QuranRingSessionDto?> GetSessionByIdAsync(int id)
    {
        var session = await _db.QuranRingSessions
            .Include(s => s.Steps)
            .FirstOrDefaultAsync(s => s.Id == id);
        return session == null ? null : ToSessionDto(session);
    }

    public async Task<QuranRingSessionDto> CreateSessionAsync(CreateQuranRingSessionRequest request)
    {
        var ringExists = await _db.QuranRings.AnyAsync(r => r.Id == request.RingId);
        if (!ringExists)
            throw new KeyNotFoundException("حلقه یافت نشد");

        var duplicate = await _db.QuranRingSessions
            .AnyAsync(s => s.RingId == request.RingId && s.SessionNumber == request.SessionNumber);
        if (duplicate)
            throw new InvalidOperationException($"جلسه شماره {request.SessionNumber} برای این حلقه از قبل ثبت شده است");

        var session = new QuranRingSession
        {
            RingId = request.RingId,
            SessionNumber = request.SessionNumber,
            Title = request.Title ?? $"جلسه {request.SessionNumber}",
            Description = request.Description,
            SessionType = request.SessionType ?? "REGULAR",
            StartPage = request.StartPage,
            EndPage = request.EndPage,
            StartSurahId = request.StartSurahId,
            EndSurahId = request.EndSurahId,
            StartAyah = request.StartAyah,
            EndAyah = request.EndAyah,
            Surfaces = request.Surfaces,
            EstimatedMinutes = request.EstimatedMinutes > 0 ? request.EstimatedMinutes : 30,
            PrerequisiteSessionId = request.PrerequisiteSessionId,
            IsAssessment = request.IsAssessment,
            Half = request.Half,
            SortOrder = request.SortOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.QuranRingSessions.Add(session);
        await _db.SaveChangesAsync();
        return ToSessionDto(session);
    }

    public async Task<QuranRingSessionDto> UpdateSessionAsync(int id, UpdateQuranRingSessionRequest request)
    {
        var session = await _db.QuranRingSessions.FindAsync(id)
            ?? throw new KeyNotFoundException("جلسه یافت نشد");

        if (request.Title != null) session.Title = request.Title;
        if (request.Description != null) session.Description = request.Description;
        if (request.SessionType != null) session.SessionType = request.SessionType;
        if (request.StartPage.HasValue) session.StartPage = request.StartPage;
        if (request.EndPage.HasValue) session.EndPage = request.EndPage;
        if (request.StartSurahId.HasValue) session.StartSurahId = request.StartSurahId;
        if (request.EndSurahId.HasValue) session.EndSurahId = request.EndSurahId;
        if (request.StartAyah.HasValue) session.StartAyah = request.StartAyah;
        if (request.EndAyah.HasValue) session.EndAyah = request.EndAyah;
        if (request.Surfaces.HasValue) session.Surfaces = request.Surfaces.Value;
        if (request.EstimatedMinutes.HasValue) session.EstimatedMinutes = request.EstimatedMinutes.Value;
        if (request.PrerequisiteSessionId.HasValue) session.PrerequisiteSessionId = request.PrerequisiteSessionId;
        if (request.IsAssessment.HasValue) session.IsAssessment = request.IsAssessment.Value;
        if (request.Half != null) session.Half = request.Half;
        if (request.SortOrder.HasValue) session.SortOrder = request.SortOrder.Value;
        if (request.IsActive.HasValue) session.IsActive = request.IsActive.Value;
        session.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToSessionDto(session);
    }

    public async Task<bool> DeleteSessionAsync(int id)
    {
        var session = await _db.QuranRingSessions.FindAsync(id);
        if (session == null) return false;
        _db.QuranRingSessions.Remove(session);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<QuranRingSessionDto>> GetSessionsByRingAsync(int ringId)
    {
        var sessions = await _db.QuranRingSessions
            .Where(s => s.RingId == ringId)
            .Include(s => s.Steps)
            .OrderBy(s => s.SessionNumber)
            .ToListAsync();
        return sessions.Select(ToSessionDto).ToList();
    }

    // ==================== Session Steps ====================

    public async Task<QuranSessionStepDto> CreateStepAsync(CreateQuranSessionStepRequest request)
    {
        var sessionExists = await _db.QuranRingSessions.AnyAsync(s => s.Id == request.SessionId);
        if (!sessionExists)
            throw new KeyNotFoundException("جلسه یافت نشد");

        var duplicate = await _db.QuranSessionSteps
            .AnyAsync(st => st.SessionId == request.SessionId && st.StepOrder == request.StepOrder);
        if (duplicate)
            throw new InvalidOperationException($"گام شماره {request.StepOrder} برای این جلسه از قبل ثبت شده است");

        var step = new QuranSessionStep
        {
            SessionId = request.SessionId,
            StepOrder = request.StepOrder,
            StepType = request.StepType,
            Title = request.Title ?? request.StepType,
            Description = request.Description,
            EstimatedMinutes = request.EstimatedMinutes > 0 ? request.EstimatedMinutes : 10,
            IsOptional = request.IsOptional,
            ResourcesJson = request.ResourcesJson,
            CompletionCriteria = request.CompletionCriteria,
            CreatedAt = DateTime.UtcNow
        };

        _db.QuranSessionSteps.Add(step);
        await _db.SaveChangesAsync();
        return ToStepDto(step);
    }

    public async Task<QuranSessionStepDto> UpdateStepAsync(int id, CreateQuranSessionStepRequest request)
    {
        var step = await _db.QuranSessionSteps.FindAsync(id)
            ?? throw new KeyNotFoundException("گام جلسه یافت نشد");

        step.StepOrder = request.StepOrder;
        step.StepType = request.StepType;
        step.Title = request.Title ?? step.Title;
        step.Description = request.Description;
        if (request.EstimatedMinutes > 0) step.EstimatedMinutes = request.EstimatedMinutes;
        step.IsOptional = request.IsOptional;
        step.ResourcesJson = request.ResourcesJson;
        step.CompletionCriteria = request.CompletionCriteria;

        await _db.SaveChangesAsync();
        return ToStepDto(step);
    }

    public async Task<bool> DeleteStepAsync(int id)
    {
        var step = await _db.QuranSessionSteps.FindAsync(id);
        if (step == null) return false;
        _db.QuranSessionSteps.Remove(step);
        await _db.SaveChangesAsync();
        return true;
    }

    // ==================== Student Progress ====================

    public async Task<List<StudentQuranSessionProgressDto>> GetStudentProgressAsync(StudentProgressFilterDto? filter = null)
    {
        var query = _db.StudentQuranSessionProgresses.AsQueryable();

        if (filter != null)
        {
            if (filter.StudentId.HasValue) query = query.Where(p => p.StudentId == filter.StudentId.Value);
            if (filter.RingId.HasValue) query = query.Where(p => p.Session.RingId == filter.RingId.Value);
            if (!string.IsNullOrWhiteSpace(filter.Status)) query = query.Where(p => p.Status == filter.Status);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 200);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var progresses = await query
            .Include(p => p.Student)
            .Include(p => p.Session).ThenInclude(s => s.Ring)
            .Include(p => p.StepProgress).ThenInclude(sp => sp.Step)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return progresses.Select(ToProgressDto).ToList();
    }

    public async Task<StudentQuranSessionProgressDto?> GetStudentProgressByIdAsync(int id)
    {
        var progress = await _db.StudentQuranSessionProgresses
            .Include(p => p.Student)
            .Include(p => p.Session).ThenInclude(s => s.Ring)
            .Include(p => p.StepProgress).ThenInclude(sp => sp.Step)
            .FirstOrDefaultAsync(p => p.Id == id);
        return progress == null ? null : ToProgressDto(progress);
    }

    public async Task<StudentQuranSessionProgressDto> StartSessionAsync(int studentId, int sessionId)
    {
        var session = await _db.QuranRingSessions
            .Include(s => s.Steps)
            .FirstOrDefaultAsync(s => s.Id == sessionId)
            ?? throw new KeyNotFoundException("جلسه یافت نشد");

        var existing = await _db.StudentQuranSessionProgresses
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.SessionId == sessionId);
        if (existing != null)
            throw new InvalidOperationException("پیشرفت این جلسه برای دانش‌آموز قبلاً ثبت شده است");

        var progress = new StudentQuranSessionProgress
        {
            StudentId = studentId,
            SessionId = sessionId,
            Status = "IN_PROGRESS",
            ProgressPercent = 0,
            StartedAt = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // ایجاد ردیف پیشرفت برای هر گام جلسه
        foreach (var step in session.Steps.OrderBy(st => st.StepOrder))
        {
            progress.StepProgress.Add(new StudentStepProgress
            {
                StepId = step.Id,
                Status = "NOT_STARTED",
                RepetitionCount = 0,
                CreatedAt = DateTime.UtcNow
            });
        }

        _db.StudentQuranSessionProgresses.Add(progress);
        await _db.SaveChangesAsync();

        return (await GetStudentProgressByIdAsync(progress.Id))!;
    }

    public async Task<StudentQuranSessionProgressDto> UpdateSessionProgressAsync(int id, UpdateSessionProgressRequest request)
    {
        var progress = await _db.StudentQuranSessionProgresses
            .Include(p => p.Student)
            .Include(p => p.Session).ThenInclude(s => s.Ring)
            .Include(p => p.StepProgress).ThenInclude(sp => sp.Step)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("پیشرفت جلسه یافت نشد");

        if (request.Status != null) progress.Status = request.Status;
        if (request.ProgressPercent.HasValue) progress.ProgressPercent = Math.Clamp(request.ProgressPercent.Value, 0, 100);
        if (request.LinesMemorized.HasValue) progress.LinesMemorized = request.LinesMemorized.Value;
        if (request.SurfacesCompleted.HasValue) progress.SurfacesCompleted = request.SurfacesCompleted.Value;
        if (request.AssessmentScore.HasValue) progress.AssessmentScore = request.AssessmentScore;
        if (request.CoachNotes != null) progress.CoachNotes = request.CoachNotes;
        progress.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToProgressDto(progress);
    }

    public async Task<StudentStepProgressDto> UpdateStepProgressAsync(int id, UpdateStepProgressRequest request)
    {
        var stepProgress = await _db.Set<StudentStepProgress>()
            .Include(sp => sp.Step)
            .Include(sp => sp.SessionProgress)
            .FirstOrDefaultAsync(sp => sp.Id == id)
            ?? throw new KeyNotFoundException("پیشرفت گام یافت نشد");

        if (request.Status != null)
        {
            stepProgress.Status = request.Status;
            if (request.Status == "IN_PROGRESS" && stepProgress.StartedAt == null)
                stepProgress.StartedAt = DateTime.UtcNow;
            if (request.Status == "COMPLETED")
                stepProgress.CompletedAt = DateTime.UtcNow;
        }
        if (request.Score.HasValue) stepProgress.Score = request.Score;
        if (request.RepetitionCount.HasValue) stepProgress.RepetitionCount = request.RepetitionCount.Value;
        if (request.Notes != null) stepProgress.Notes = request.Notes;

        // بازمحاسبه درصد پیشرفت جلسه بر اساس گام‌های تکمیل‌شده
        var parentId = stepProgress.SessionProgressId;
        await _db.SaveChangesAsync();

        var allSteps = await _db.Set<StudentStepProgress>()
            .Where(sp => sp.SessionProgressId == parentId)
            .ToListAsync();
        var parent = await _db.StudentQuranSessionProgresses.FindAsync(parentId);
        if (parent != null)
        {
            var completed = allSteps.Count(sp => sp.Status == "COMPLETED" || sp.Status == "SKIPPED");
            parent.ProgressPercent = allSteps.Count == 0 ? 0 : completed * 100 / allSteps.Count;
            if (parent.Status == "NOT_STARTED") parent.Status = "IN_PROGRESS";
            parent.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return ToStepProgressDto(stepProgress);
    }

    public async Task<StudentQuranSessionProgressDto> CompleteSessionAsync(int id, int? assessmentScore = null)
    {
        var progress = await _db.StudentQuranSessionProgresses
            .Include(p => p.Student)
            .Include(p => p.Session).ThenInclude(s => s.Ring)
            .Include(p => p.StepProgress).ThenInclude(sp => sp.Step)
            .FirstOrDefaultAsync(p => p.Id == id)
            ?? throw new KeyNotFoundException("پیشرفت جلسه یافت نشد");

        progress.Status = "COMPLETED";
        progress.ProgressPercent = 100;
        progress.CompletedAt = DateTime.UtcNow;
        if (assessmentScore.HasValue) progress.AssessmentScore = assessmentScore;
        progress.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToProgressDto(progress);
    }

    // ==================== Speed Categories ====================

    public async Task<StudentSpeedCategoryDto?> GetStudentSpeedCategoryAsync(int studentId, int ringId)
    {
        var category = await _db.StudentSpeedCategories
            .Include(c => c.Student)
            .Include(c => c.Ring)
            .FirstOrDefaultAsync(c => c.StudentId == studentId && c.RingId == ringId);
        return category == null ? null : ToSpeedCategoryDto(category);
    }

    public async Task<StudentSpeedCategoryDto> UpdateSpeedCategoryAsync(int studentId, int ringId, UpdateSpeedCategoryRequest request)
    {
        var category = await _db.StudentSpeedCategories
            .Include(c => c.Student)
            .Include(c => c.Ring)
            .FirstOrDefaultAsync(c => c.StudentId == studentId && c.RingId == ringId);

        if (category == null)
        {
            var studentExists = await _db.Students.AnyAsync(s => s.Id == studentId);
            if (!studentExists) throw new KeyNotFoundException("دانش‌آموز یافت نشد");
            var ringExists = await _db.QuranRings.AnyAsync(r => r.Id == ringId);
            if (!ringExists) throw new KeyNotFoundException("حلقه یافت نشد");

            category = new StudentSpeedCategory
            {
                StudentId = studentId,
                RingId = ringId,
                Category = request.Category ?? "STAMINA",
                AssignedAt = DateTime.UtcNow,
                LastEvaluationAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.StudentSpeedCategories.Add(category);
        }
        else if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != category.Category)
        {
            category.PreviousCategory = category.Category;
            category.Category = request.Category;
            category.AssignedAt = DateTime.UtcNow;
        }

        if (request.DailyLines.HasValue) category.DailyLines = request.DailyLines.Value;
        if (request.MasteryScore.HasValue) category.MasteryScore = request.MasteryScore.Value;
        if (request.ActiveDays.HasValue) category.ActiveDays = request.ActiveDays.Value;
        if (request.ActualDailyLines.HasValue) category.ActualDailyLines = request.ActualDailyLines.Value;
        if (request.IsEligibleForPromotion.HasValue) category.IsEligibleForPromotion = request.IsEligibleForPromotion.Value;
        if (request.IsAtRiskOfDemotion.HasValue) category.IsAtRiskOfDemotion = request.IsAtRiskOfDemotion.Value;
        if (request.PreviousCategory != null) category.PreviousCategory = request.PreviousCategory;
        if (request.ChangeReason != null) category.ChangeReason = request.ChangeReason;
        category.LastEvaluationAt = DateTime.UtcNow;
        category.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToSpeedCategoryDto(category);
    }

    /// <summary>
    /// محاسبه خودکار دسته سرعت بر اساس عملکرد واقعی:
    /// میانگین خطوط حفظ‌شده در روز و روزهای فعال در ۱۴ روز اخیر
    /// </summary>
    public async Task<StudentSpeedCategoryDto> CalculateSpeedCategoryAsync(int studentId, int ringId)
    {
        var since = DateTime.UtcNow.AddDays(-14);

        var progresses = await _db.StudentQuranSessionProgresses
            .Where(p => p.StudentId == studentId && p.Session.RingId == ringId && p.CreatedAt >= since)
            .ToListAsync();

        var activeDays = progresses
            .Where(p => p.StartedAt.HasValue)
            .Select(p => p.StartedAt!.Value.Date)
            .Distinct()
            .Count();

        var totalLines = progresses.Sum(p => p.LinesMemorized);
        var dayDenominator = Math.Max(1, activeDays);
        var actualDailyLines = totalLines / dayDenominator;

        // آستانه‌ها بر اساس سند طرح: استقامتی ~۲ خط/روز، نیمه‌سرعتی ۳-۴، سرعتی ۵+
        string computed;
        if (actualDailyLines >= 5) computed = "SPEED";
        else if (actualDailyLines >= 3) computed = "SEMI_SPEED";
        else computed = "STAMINA";

        var request = new UpdateSpeedCategoryRequest
        {
            Category = computed,
            ActiveDays = activeDays,
            ActualDailyLines = actualDailyLines,
            ChangeReason = $"محاسبه خودکار: {totalLines} خط در {dayDenominator} روز فعال"
        };
        return await UpdateSpeedCategoryAsync(studentId, ringId, request);
    }

    public async Task<List<StudentSpeedCategoryDto>> GetStudentsBySpeedCategoryAsync(string category, int? ringId = null)
    {
        var query = _db.StudentSpeedCategories
            .Include(c => c.Student)
            .Include(c => c.Ring)
            .Where(c => c.Category == category);

        if (ringId.HasValue) query = query.Where(c => c.RingId == ringId.Value);

        var categories = await query.OrderBy(c => c.RingId).ThenBy(c => c.StudentId).ToListAsync();
        return categories.Select(ToSpeedCategoryDto).ToList();
    }

    // ==================== Tadabbor ====================

    public async Task<List<TadabborEntryDto>> GetTadabborEntriesAsync(TadabborFilterDto? filter = null)
    {
        var query = _db.TadabborEntries.AsQueryable();

        if (filter != null)
        {
            if (filter.StudentId.HasValue) query = query.Where(t => t.StudentId == filter.StudentId.Value);
            if (filter.SurahId.HasValue) query = query.Where(t => t.SurahId == filter.SurahId.Value);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 200);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var entries = await query
            .Include(t => t.Student)
            .Include(t => t.Surah)
            .OrderByDescending(t => t.CreatedAt)
            .ToListAsync();

        return entries.Select(ToTadabborDto).ToList();
    }

    public async Task<TadabborEntryDto?> GetTadabborEntryByIdAsync(int id)
    {
        var entry = await _db.TadabborEntries
            .Include(t => t.Student)
            .Include(t => t.Surah)
            .FirstOrDefaultAsync(t => t.Id == id);
        return entry == null ? null : ToTadabborDto(entry);
    }

    public async Task<TadabborEntryDto> CreateTadabborEntryAsync(CreateTadabborEntryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Word))
            throw new InvalidOperationException("کلمه مورد تدبر نمی‌تواند خالی باشد");

        var entry = new TadabborEntry
        {
            StudentId = request.StudentId,
            AyahId = request.AyahId,
            AyahNumber = request.AyahNumber,
            SurahId = request.SurahId,
            Word = request.Word.Trim(),
            WhyThisWord = request.WhyThisWord ?? string.Empty,
            SynonymsJson = request.SynonymsJson,
            JalalainReference = request.JalalainReference,
            DifferenceFromSynonyms = request.DifferenceFromSynonyms,
            StudentNote = request.StudentNote,
            CreatedAt = DateTime.UtcNow
        };

        _db.TadabborEntries.Add(entry);
        await _db.SaveChangesAsync();
        return (await GetTadabborEntryByIdAsync(entry.Id))!;
    }

    public async Task<TadabborEntryDto> UpdateTadabborEntryAsync(int id, UpdateTadabborEntryRequest request)
    {
        var entry = await _db.TadabborEntries.FindAsync(id)
            ?? throw new KeyNotFoundException("ثبت تدبر یافت نشد");

        if (request.Word != null) entry.Word = request.Word;
        if (request.WhyThisWord != null) entry.WhyThisWord = request.WhyThisWord;
        if (request.SynonymsJson != null) entry.SynonymsJson = request.SynonymsJson;
        if (request.JalalainReference != null) entry.JalalainReference = request.JalalainReference;
        if (request.DifferenceFromSynonyms != null) entry.DifferenceFromSynonyms = request.DifferenceFromSynonyms;
        if (request.StudentNote != null) entry.StudentNote = request.StudentNote;
        if (request.CoachNote != null) entry.CoachNote = request.CoachNote;

        await _db.SaveChangesAsync();
        return (await GetTadabborEntryByIdAsync(entry.Id))!;
    }

    public async Task<bool> DeleteTadabborEntryAsync(int id)
    {
        var entry = await _db.TadabborEntries.FindAsync(id);
        if (entry == null) return false;
        _db.TadabborEntries.Remove(entry);
        await _db.SaveChangesAsync();
        return true;
    }

    // ==================== Asset Evaluation ====================

    public async Task<List<QuranAssetEvaluationDto>> GetAssetEvaluationsAsync(EvaluationFilterDto? filter = null)
    {
        var query = _db.QuranAssetEvaluations.AsQueryable();

        if (filter != null)
        {
            if (filter.StudentId.HasValue) query = query.Where(e => e.StudentId == filter.StudentId.Value);
            if (filter.RingId.HasValue) query = query.Where(e => e.RingId == filter.RingId.Value);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 200);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var evaluations = await query
            .Include(e => e.Student)
            .Include(e => e.Ring)
            .Include(e => e.Evaluator)
            .OrderByDescending(e => e.EvaluationDate)
            .ToListAsync();

        return evaluations.Select(ToAssetEvaluationDto).ToList();
    }

    public async Task<QuranAssetEvaluationDto?> GetAssetEvaluationByIdAsync(int id)
    {
        var evaluation = await _db.QuranAssetEvaluations
            .Include(e => e.Student)
            .Include(e => e.Ring)
            .Include(e => e.Evaluator)
            .FirstOrDefaultAsync(e => e.Id == id);
        return evaluation == null ? null : ToAssetEvaluationDto(evaluation);
    }

    public async Task<QuranAssetEvaluationDto> CreateAssetEvaluationAsync(CreateAssetEvaluationRequest request)
    {
        var scores = new[]
        {
            request.MemorizationScore, request.PhoneticSkillScore, request.LinguisticFoundationScore,
            request.SemanticComprehensionScore, request.TadabborWritingScore, request.DailyThroughputScore,
            request.EnvironmentalSupportScore, request.MotivationIdentityScore
        };
        var validScores = scores.Where(s => s.HasValue).Select(s => s.Value).ToList();
        var totalScore = validScores.Count == 0 ? 0 : (int)Math.Round(validScores.Average());

        var evaluation = new QuranAssetEvaluation
        {
            StudentId = request.StudentId,
            RingId = request.RingId,
            EvaluatorUserId = request.EvaluatorUserId,
            EvaluationDate = DateTime.UtcNow,
            MemorizationScore = request.MemorizationScore ?? 0,
            MemorizationNotes = request.MemorizationNotes,
            PhoneticSkillScore = request.PhoneticSkillScore ?? 0,
            PhoneticSkillNotes = request.PhoneticSkillNotes,
            LinguisticFoundationScore = request.LinguisticFoundationScore ?? 0,
            LinguisticFoundationNotes = request.LinguisticFoundationNotes,
            SemanticComprehensionScore = request.SemanticComprehensionScore ?? 0,
            SemanticComprehensionNotes = request.SemanticComprehensionNotes,
            TadabborWritingScore = request.TadabborWritingScore ?? 0,
            TadabborWritingNotes = request.TadabborWritingNotes,
            DailyThroughputScore = request.DailyThroughputScore ?? 0,
            DailyThroughputNotes = request.DailyThroughputNotes,
            EnvironmentalSupportScore = request.EnvironmentalSupportScore ?? 0,
            EnvironmentalSupportNotes = request.EnvironmentalSupportNotes,
            MotivationIdentityScore = request.MotivationIdentityScore ?? 0,
            MotivationIdentityNotes = request.MotivationIdentityNotes,
            TotalScore = totalScore,
            SuggestedSpeedCategory = request.SuggestedSpeedCategory ?? string.Empty,
            SuggestedRingId = request.SuggestedRingId,
            GeneralNotes = request.GeneralNotes,
            CreatedAt = DateTime.UtcNow
        };

        _db.QuranAssetEvaluations.Add(evaluation);
        await _db.SaveChangesAsync();
        return (await GetAssetEvaluationByIdAsync(evaluation.Id))!;
    }

    public async Task<QuranAssetEvaluationDto?> GetLatestEvaluationAsync(int studentId, int ringId)
    {
        var evaluation = await _db.QuranAssetEvaluations
            .Include(e => e.Student)
            .Include(e => e.Ring)
            .Include(e => e.Evaluator)
            .Where(e => e.StudentId == studentId && e.RingId == ringId)
            .OrderByDescending(e => e.EvaluationDate)
            .FirstOrDefaultAsync();
        return evaluation == null ? null : ToAssetEvaluationDto(evaluation);
    }

    // ==================== Coach Interview ====================

    public async Task<List<CoachInterviewDto>> GetCoachInterviewsAsync(InterviewFilterDto? filter = null)
    {
        var query = _db.CoachInterviews.AsQueryable();

        if (filter != null)
        {
            if (filter.RingId.HasValue) query = query.Where(i => i.RingId == filter.RingId.Value);
            if (filter.FromDate.HasValue) query = query.Where(i => i.InterviewDate >= filter.FromDate.Value);
            if (filter.ToDate.HasValue) query = query.Where(i => i.InterviewDate <= filter.ToDate.Value);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 200);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var interviews = await query
            .Include(i => i.Coach)
            .Include(i => i.Ring)
            .OrderByDescending(i => i.InterviewDate)
            .ToListAsync();

        return interviews.Select(ToCoachInterviewDto).ToList();
    }

    public async Task<CoachInterviewDto?> GetCoachInterviewByIdAsync(int id)
    {
        var interview = await _db.CoachInterviews
            .Include(i => i.Coach)
            .Include(i => i.Ring)
            .FirstOrDefaultAsync(i => i.Id == id);
        return interview == null ? null : ToCoachInterviewDto(interview);
    }

    public async Task<CoachInterviewDto> CreateCoachInterviewAsync(CreateCoachInterviewRequest request)
    {
        var interview = new CoachInterview
        {
            CoachUserId = request.CoachUserId,
            RingId = request.RingId,
            InterviewDate = DateTime.UtcNow,
            Q1_ProcessSteps = request.Q1_ProcessSteps,
            Q2_PhoneticLayer = request.Q2_PhoneticLayer,
            Q3_TranslationLayer = request.Q3_TranslationLayer,
            Q4_SpeedCategories = request.Q4_SpeedCategories,
            Q5_MainChallenges = request.Q5_MainChallenges,
            Q6_CurrentSolutions = request.Q6_CurrentSolutions,
            Q7_DailyListening = request.Q7_DailyListening,
            Q8_Memorization = request.Q8_Memorization,
            Q9_Tajweed = request.Q9_Tajweed,
            Q10_Vocabulary = request.Q10_Vocabulary,
            Q11_Syntax = request.Q11_Syntax,
            Q12_Tadabbor = request.Q12_Tadabbor,
            Q13_Writing = request.Q13_Writing,
            Q14_Presentations = request.Q14_Presentations,
            Q15_Discussions = request.Q15_Discussions,
            Q16_ParentReports = request.Q16_ParentReports,
            Q17_Resources = request.Q17_Resources,
            Q18_Needs = request.Q18_Needs,
            CreatedAt = DateTime.UtcNow
        };

        _db.CoachInterviews.Add(interview);
        await _db.SaveChangesAsync();
        return (await GetCoachInterviewByIdAsync(interview.Id))!;
    }

    // ==================== Student Interview ====================

    public async Task<List<StudentInterviewDto>> GetStudentInterviewsAsync(InterviewFilterDto? filter = null)
    {
        var query = _db.StudentInterviews.AsQueryable();

        if (filter != null)
        {
            if (filter.RingId.HasValue) query = query.Where(i => i.RingId == filter.RingId.Value);
            if (filter.FromDate.HasValue) query = query.Where(i => i.InterviewDate >= filter.FromDate.Value);
            if (filter.ToDate.HasValue) query = query.Where(i => i.InterviewDate <= filter.ToDate.Value);

            var page = Math.Max(1, filter.Page);
            var size = Math.Clamp(filter.PageSize, 1, 200);
            query = query.Skip((page - 1) * size).Take(size);
        }

        var interviews = await query
            .Include(i => i.Student)
            .Include(i => i.Ring)
            .Include(i => i.Interviewer)
            .OrderByDescending(i => i.InterviewDate)
            .ToListAsync();

        return interviews.Select(ToStudentInterviewDto).ToList();
    }

    public async Task<StudentInterviewDto?> GetStudentInterviewByIdAsync(int id)
    {
        var interview = await _db.StudentInterviews
            .Include(i => i.Student)
            .Include(i => i.Ring)
            .Include(i => i.Interviewer)
            .FirstOrDefaultAsync(i => i.Id == id);
        return interview == null ? null : ToStudentInterviewDto(interview);
    }

    public async Task<StudentInterviewDto> CreateStudentInterviewAsync(CreateStudentInterviewRequest request)
    {
        var interview = new StudentInterview
        {
            StudentId = request.StudentId,
            RingId = request.RingId,
            InterviewerUserId = request.InterviewerUserId,
            InterviewDate = DateTime.UtcNow,
            S1_DailyListening = request.S1_DailyListening,
            S2_FamilyListening = request.S2_FamilyListening,
            S3_MemorizedSurahs = request.S3_MemorizedSurahs,
            S4_DailyProcess = request.S4_DailyProcess,
            S5_TimeSpent = request.S5_TimeSpent,
            S6_Difficulties = request.S6_Difficulties,
            S7_EasyParts = request.S7_EasyParts,
            S8_SelfSpeedCategory = request.S8_SelfSpeedCategory,
            S9_Motivation = request.S9_Motivation,
            S10_Goal = request.S10_Goal,
            S11_Tadabbor = request.S11_Tadabbor,
            S12_Writing = request.S12_Writing,
            S13_Books = request.S13_Books,
            S14_Discussion = request.S14_Discussion,
            S15_Presentations = request.S15_Presentations,
            S16_FamilyOpinion = request.S16_FamilyOpinion,
            S17_Needs = request.S17_Needs,
            S18_Satisfaction = request.S18_Satisfaction,
            S19_Suggestion = request.S19_Suggestion,
            CreatedAt = DateTime.UtcNow
        };

        _db.StudentInterviews.Add(interview);
        await _db.SaveChangesAsync();
        return (await GetStudentInterviewByIdAsync(interview.Id))!;
    }

    // ==================== Ring Surahs ====================

    public async Task<List<QuranRingSurahDto>> GetRingSurahsAsync(int ringId)
    {
        var surahs = await _db.QuranRingSurahs
            .Where(rs => rs.RingId == ringId)
            .Include(rs => rs.Surah)
            .OrderBy(rs => rs.SortOrder)
            .ToListAsync();
        return surahs.Select(ToRingSurahDto).ToList();
    }

    public async Task<QuranRingSurahDto> CreateRingSurahAsync(CreateQuranRingSurahRequest request)
    {
        var duplicate = await _db.QuranRingSurahs
            .AnyAsync(rs => rs.RingId == request.RingId && rs.SurahId == request.SurahId);
        if (duplicate)
            throw new InvalidOperationException("این سوره از قبل به حلقه متصل شده است");

        var ringSurah = new QuranRingSurah
        {
            RingId = request.RingId,
            SurahId = request.SurahId,
            ActivityType = request.ActivityType,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
        };

        _db.QuranRingSurahs.Add(ringSurah);
        await _db.SaveChangesAsync();

        await _db.Entry(ringSurah).Reference(rs => rs.Surah).LoadAsync();
        return ToRingSurahDto(ringSurah);
    }

    public async Task<bool> DeleteRingSurahAsync(int id)
    {
        var ringSurah = await _db.QuranRingSurahs.FindAsync(id);
        if (ringSurah == null) return false;
        _db.QuranRingSurahs.Remove(ringSurah);
        await _db.SaveChangesAsync();
        return true;
    }

    // ==================== Ring Resources ====================

    public async Task<List<QuranRingResourceDto>> GetRingResourcesAsync(int ringId)
    {
        var resources = await _db.QuranRingResources
            .Where(res => res.RingId == ringId)
            .OrderBy(res => res.SortOrder)
            .ToListAsync();
        return resources.Select(ToRingResourceDto).ToList();
    }

    public async Task<QuranRingResourceDto> CreateRingResourceAsync(CreateQuranRingResourceRequest request)
    {
        var resource = new QuranRingResource
        {
            RingId = request.RingId,
            Title = request.Title,
            ResourceType = request.ResourceType,
            Description = request.Description,
            Url = request.Url,
            IsPrimary = request.IsPrimary,
            SortOrder = request.SortOrder,
            CreatedAt = DateTime.UtcNow
        };

        _db.QuranRingResources.Add(resource);
        await _db.SaveChangesAsync();
        return ToRingResourceDto(resource);
    }

    public async Task<bool> DeleteRingResourceAsync(int id)
    {
        var resource = await _db.QuranRingResources.FindAsync(id);
        if (resource == null) return false;
        _db.QuranRingResources.Remove(resource);
        await _db.SaveChangesAsync();
        return true;
    }

    // ==================== Dashboard ====================

    public async Task<QuranRingDashboardDto> GetDashboardAsync(int? ringId = null)
    {
        var ringsQuery = _db.QuranRings.AsQueryable();
        if (ringId.HasValue) ringsQuery = ringsQuery.Where(r => r.Id == ringId.Value);

        var ringIds = await ringsQuery.Select(r => r.Id).ToListAsync();

        var sessionsQuery = _db.QuranRingSessions.AsQueryable();
        if (ringId.HasValue) sessionsQuery = sessionsQuery.Where(s => s.RingId == ringId.Value);

        var progressQuery = _db.StudentQuranSessionProgresses.AsQueryable();
        if (ringId.HasValue) progressQuery = progressQuery.Where(p => p.Session.RingId == ringId.Value);

        var dashboard = new QuranRingDashboardDto
        {
            TotalRings = await ringsQuery.CountAsync(),
            ActiveRings = await ringsQuery.CountAsync(r => r.IsActive),
            TotalStudents = await _db.StudentSpeedCategories
                .Where(c => !ringId.HasValue || c.RingId == ringId.Value)
                .Select(c => c.StudentId)
                .Distinct()
                .CountAsync(),
            TotalSessions = await sessionsQuery.CountAsync(),
            CompletedSessions = await progressQuery.CountAsync(p => p.Status == "COMPLETED"),
            PendingAssessments = await sessionsQuery.CountAsync(s => s.IsAssessment && s.IsActive),
            RecentProgress = new List<StudentQuranSessionProgressDto>()
        };

        dashboard.StudentsBySpeedCategory = await _db.StudentSpeedCategories
            .Where(c => !ringId.HasValue || c.RingId == ringId.Value)
            .GroupBy(c => c.Category)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Key, x => x.Count);

        dashboard.StudentsByRing = await _db.StudentSpeedCategories
            .Where(c => !ringId.HasValue || c.RingId == ringId.Value)
            .GroupBy(c => c.Ring.Name)
            .Select(g => new { g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.Key, x => x.Count);

        var recent = await progressQuery
            .Include(p => p.Student)
            .Include(p => p.Session).ThenInclude(s => s.Ring)
            .Include(p => p.StepProgress).ThenInclude(sp => sp.Step)
            .OrderByDescending(p => p.UpdatedAt)
            .Take(10)
            .ToListAsync();
        dashboard.RecentProgress = recent.Select(ToProgressDto).ToList();

        return dashboard;
    }

    // ==================== Mappers ====================

    private static string DisplayName(User? user) =>
        user == null ? string.Empty : $"{user.FirstName} {user.LastName}".Trim() is { Length: > 0 } n ? n : user.Username;

    private static string StudentName(Student? student) =>
        student == null ? string.Empty : $"{student.FirstName} {student.LastName}".Trim();

    private static int? ParseIntOrNull(string? value) =>
        int.TryParse(value, out var result) ? result : null;

    private static QuranRingDto ToRingDto(QuranRing ring) => new()
    {
        Id = ring.Id,
        Code = ring.Code,
        Name = ring.Name,
        Description = ring.Description,
        AgeGroup = ring.AgeGroup,
        Gender = ring.Gender,
        MinAge = ring.MinAge,
        MaxAge = ring.MaxAge,
        SortOrder = ring.SortOrder,
        IsActive = ring.IsActive,
        HasSpecializedPath = ring.HasSpecializedPath,
        SpecializedPeriods = ring.SpecializedPeriods,
        SpecializedTimePercent = ring.SpecializedTimePercent,
        CreatedAt = ring.CreatedAt,
        Sessions = ring.Sessions?.OrderBy(s => s.SessionNumber).Select(ToSessionDto).ToList() ?? [],
        RingSurahs = ring.RingSurahs?.OrderBy(rs => rs.SortOrder).Select(ToRingSurahDto).ToList() ?? [],
        Resources = ring.Resources?.OrderBy(res => res.SortOrder).Select(ToRingResourceDto).ToList() ?? []
    };

    private static QuranRingSessionDto ToSessionDto(QuranRingSession session) => new()
    {
        Id = session.Id,
        RingId = session.RingId,
        SessionNumber = session.SessionNumber,
        Title = session.Title,
        Description = session.Description,
        SessionType = session.SessionType,
        StartPage = session.StartPage,
        EndPage = session.EndPage,
        StartSurahId = session.StartSurahId,
        EndSurahId = session.EndSurahId,
        StartAyah = session.StartAyah,
        EndAyah = session.EndAyah,
        Surfaces = session.Surfaces,
        EstimatedMinutes = session.EstimatedMinutes,
        PrerequisiteSessionId = session.PrerequisiteSessionId,
        IsAssessment = session.IsAssessment,
        Half = session.Half,
        SortOrder = session.SortOrder,
        IsActive = session.IsActive,
        Steps = session.Steps?.OrderBy(st => st.StepOrder).Select(ToStepDto).ToList() ?? []
    };

    private static QuranSessionStepDto ToStepDto(QuranSessionStep step) => new()
    {
        Id = step.Id,
        SessionId = step.SessionId,
        StepOrder = step.StepOrder,
        StepType = step.StepType,
        Title = step.Title,
        Description = step.Description,
        EstimatedMinutes = step.EstimatedMinutes,
        IsOptional = step.IsOptional,
        ResourcesJson = step.ResourcesJson,
        CompletionCriteria = step.CompletionCriteria
    };

    private static StudentQuranSessionProgressDto ToProgressDto(StudentQuranSessionProgress progress) => new()
    {
        Id = progress.Id,
        StudentId = progress.StudentId,
        StudentName = StudentName(progress.Student),
        SessionId = progress.SessionId,
        RingId = progress.Session?.RingId,
        RingName = progress.Session?.Ring?.Name,
        Status = progress.Status,
        ProgressPercent = progress.ProgressPercent,
        LinesMemorized = progress.LinesMemorized,
        SurfacesCompleted = progress.SurfacesCompleted,
        AssessmentScore = progress.AssessmentScore,
        CoachNotes = progress.CoachNotes,
        StartedAt = progress.StartedAt,
        CompletedAt = progress.CompletedAt,
        CreatedAt = progress.CreatedAt,
        StepProgress = progress.StepProgress?
            .OrderBy(sp => sp.Step != null ? sp.Step.StepOrder : 0)
            .Select(ToStepProgressDto).ToList() ?? []
    };

    private static StudentStepProgressDto ToStepProgressDto(StudentStepProgress stepProgress) => new()
    {
        Id = stepProgress.Id,
        SessionProgressId = stepProgress.SessionProgressId,
        StepId = stepProgress.StepId,
        StepType = stepProgress.Step?.StepType,
        Status = stepProgress.Status,
        Score = stepProgress.Score,
        RepetitionCount = stepProgress.RepetitionCount,
        Notes = stepProgress.Notes,
        CompletedAt = stepProgress.CompletedAt,
        StartedAt = stepProgress.StartedAt
    };

    private static StudentSpeedCategoryDto ToSpeedCategoryDto(StudentSpeedCategory category) => new()
    {
        Id = category.Id,
        StudentId = category.StudentId,
        StudentName = StudentName(category.Student),
        RingId = category.RingId,
        RingName = category.Ring?.Name,
        Category = category.Category,
        DailyLines = category.DailyLines,
        MasteryScore = category.MasteryScore,
        ActiveDays = category.ActiveDays,
        ActualDailyLines = category.ActualDailyLines,
        PreviousCategory = category.PreviousCategory,
        ChangeReason = category.ChangeReason,
        IsEligibleForPromotion = category.IsEligibleForPromotion,
        IsAtRiskOfDemotion = category.IsAtRiskOfDemotion,
        AssignedAt = category.AssignedAt,
        LastEvaluationAt = category.LastEvaluationAt,
        CreatedAt = category.CreatedAt
    };

    private static TadabborEntryDto ToTadabborDto(TadabborEntry entry) => new()
    {
        Id = entry.Id,
        StudentId = entry.StudentId,
        StudentName = StudentName(entry.Student),
        AyahId = entry.AyahId,
        AyahNumber = entry.AyahNumber,
        SurahId = entry.SurahId,
        SurahName = entry.Surah?.Name,
        Word = entry.Word,
        WhyThisWord = entry.WhyThisWord,
        SynonymsJson = entry.SynonymsJson,
        JalalainReference = entry.JalalainReference,
        DifferenceFromSynonyms = entry.DifferenceFromSynonyms,
        StudentNote = entry.StudentNote,
        CoachNote = entry.CoachNote,
        CreatedAt = entry.CreatedAt
    };

    private static QuranAssetEvaluationDto ToAssetEvaluationDto(QuranAssetEvaluation evaluation) => new()
    {
        Id = evaluation.Id,
        StudentId = evaluation.StudentId,
        StudentName = StudentName(evaluation.Student),
        RingId = evaluation.RingId,
        RingName = evaluation.Ring?.Name,
        EvaluatorUserId = evaluation.EvaluatorUserId,
        EvaluatorName = DisplayName(evaluation.Evaluator),
        EvaluationDate = evaluation.EvaluationDate,
        MemorizationScore = evaluation.MemorizationScore,
        MemorizationNotes = evaluation.MemorizationNotes,
        PhoneticSkillScore = evaluation.PhoneticSkillScore,
        PhoneticSkillNotes = evaluation.PhoneticSkillNotes,
        LinguisticFoundationScore = evaluation.LinguisticFoundationScore,
        LinguisticFoundationNotes = evaluation.LinguisticFoundationNotes,
        SemanticComprehensionScore = evaluation.SemanticComprehensionScore,
        SemanticComprehensionNotes = evaluation.SemanticComprehensionNotes,
        TadabborWritingScore = evaluation.TadabborWritingScore,
        TadabborWritingNotes = evaluation.TadabborWritingNotes,
        DailyThroughputScore = evaluation.DailyThroughputScore,
        DailyThroughputNotes = evaluation.DailyThroughputNotes,
        EnvironmentalSupportScore = evaluation.EnvironmentalSupportScore,
        EnvironmentalSupportNotes = evaluation.EnvironmentalSupportNotes,
        MotivationIdentityScore = evaluation.MotivationIdentityScore,
        MotivationIdentityNotes = evaluation.MotivationIdentityNotes,
        TotalScore = evaluation.TotalScore,
        SuggestedSpeedCategory = evaluation.SuggestedSpeedCategory,
        SuggestedRingId = evaluation.SuggestedRingId,
        GeneralNotes = evaluation.GeneralNotes,
        CreatedAt = evaluation.CreatedAt
    };

    private static CoachInterviewDto ToCoachInterviewDto(CoachInterview interview) => new()
    {
        Id = interview.Id,
        CoachUserId = interview.CoachUserId,
        CoachName = DisplayName(interview.Coach),
        RingId = interview.RingId,
        RingName = interview.Ring?.Name,
        InterviewDate = interview.InterviewDate,
        Q1_ProcessSteps = interview.Q1_ProcessSteps,
        Q2_PhoneticLayer = interview.Q2_PhoneticLayer,
        Q3_TranslationLayer = interview.Q3_TranslationLayer,
        Q4_SpeedCategories = interview.Q4_SpeedCategories,
        Q5_MainChallenges = interview.Q5_MainChallenges,
        Q6_CurrentSolutions = interview.Q6_CurrentSolutions,
        Q7_DailyListening = interview.Q7_DailyListening,
        Q8_Memorization = interview.Q8_Memorization,
        Q9_Tajweed = interview.Q9_Tajweed,
        Q10_Vocabulary = interview.Q10_Vocabulary,
        Q11_Syntax = interview.Q11_Syntax,
        Q12_Tadabbor = interview.Q12_Tadabbor,
        Q13_Writing = interview.Q13_Writing,
        Q14_Presentations = interview.Q14_Presentations,
        Q15_Discussions = interview.Q15_Discussions,
        Q16_ParentReports = interview.Q16_ParentReports,
        Q17_Resources = interview.Q17_Resources,
        Q18_Needs = interview.Q18_Needs,
        CreatedAt = interview.CreatedAt
    };

    private static StudentInterviewDto ToStudentInterviewDto(StudentInterview interview) => new()
    {
        Id = interview.Id,
        StudentId = interview.StudentId,
        StudentName = StudentName(interview.Student),
        RingId = interview.RingId,
        RingName = interview.Ring?.Name,
        InterviewerUserId = interview.InterviewerUserId,
        InterviewerName = DisplayName(interview.Interviewer),
        InterviewDate = interview.InterviewDate,
        S1_DailyListening = interview.S1_DailyListening,
        S2_FamilyListening = interview.S2_FamilyListening,
        S3_MemorizedSurahs = interview.S3_MemorizedSurahs,
        S4_DailyProcess = interview.S4_DailyProcess,
        S5_TimeSpent = interview.S5_TimeSpent,
        S6_Difficulties = interview.S6_Difficulties,
        S7_EasyParts = interview.S7_EasyParts,
        S8_SelfSpeedCategory = interview.S8_SelfSpeedCategory,
        S9_Motivation = interview.S9_Motivation,
        S10_Goal = interview.S10_Goal,
        S11_Tadabbor = interview.S11_Tadabbor,
        S12_Writing = interview.S12_Writing,
        S13_Books = interview.S13_Books,
        S14_Discussion = interview.S14_Discussion,
        S15_Presentations = interview.S15_Presentations,
        S16_FamilyOpinion = interview.S16_FamilyOpinion,
        S17_Needs = interview.S17_Needs,
        S18_Satisfaction = interview.S18_Satisfaction,
        S19_Suggestion = interview.S19_Suggestion,
        CreatedAt = interview.CreatedAt
    };

    private static QuranRingSurahDto ToRingSurahDto(QuranRingSurah ringSurah) => new()
    {
        Id = ringSurah.Id,
        RingId = ringSurah.RingId,
        SurahId = ringSurah.SurahId,
        SurahName = ringSurah.Surah?.Name,
        SurahNumber = ParseIntOrNull(ringSurah.Surah?.Number),
        ActivityType = ringSurah.ActivityType,
        SortOrder = ringSurah.SortOrder
    };

    private static QuranRingResourceDto ToRingResourceDto(QuranRingResource resource) => new()
    {
        Id = resource.Id,
        RingId = resource.RingId,
        Title = resource.Title,
        ResourceType = resource.ResourceType,
        Description = resource.Description,
        Url = resource.Url,
        IsPrimary = resource.IsPrimary,
        SortOrder = resource.SortOrder,
        CreatedAt = resource.CreatedAt
    };
}

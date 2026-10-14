using System.Reflection;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.API.Controllers;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using EducationalPlatform.Nehzat.Infrastructure.Services;

namespace EducationalPlatform.Nehzat.Tests;

#region Service Integration Tests (InMemory DB)

public class QuranRingServiceTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly IQuranRingService _service;

    public QuranRingServiceTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _db = new AppDbContext(options);
        _service = new QuranRingService(_db);

        foreach (var id in new[] { 1, 2, 3, 4, 5, 6 })
            _db.Students.Add(new Student { Id = id });
        foreach (var id in new[] { 10, 20, 21 })
            _db.Users.Add(new User { Id = id });
        foreach (var id in new[] { 59, 68, 71 })
            _db.Surahs.Add(new Surah { Id = id });
        _db.SaveChanges();
    }

    public void Dispose()
    {
        _db.Database.EnsureDeleted();
        _db.Dispose();
    }

    // ==================== Rings ====================

    [Fact]
    public async Task GetAllRings_EmptyDatabase_ReturnsEmptyList()
    {
        var result = await _service.GetAllRingsAsync();
        Assert.Empty(result);
    }

    [Fact]
    public async Task CreateRing_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R3",
            Name = "حلقه سوم",
            AgeGroup = "10-12",
            SortOrder = 3,
            HasSpecializedPath = true,
            SpecializedPeriods = 4,
            SpecializedTimePercent = 60
        });

        Assert.Equal("R3", ring.Code);
        Assert.Equal("حلقه سوم", ring.Name);
        Assert.Equal("10-12", ring.AgeGroup);
        Assert.True(ring.HasSpecializedPath);
        Assert.Equal(4, ring.SpecializedPeriods);
        Assert.Equal(60, ring.SpecializedTimePercent);
        Assert.True(ring.IsActive);
    }

    [Fact]
    public async Task GetRingById_Works()
    {
        var created = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R1",
            Name = "حلقه اول",
            AgeGroup = "7-9",
            SortOrder = 1
        });

        var found = await _service.GetRingByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal("R1", found.Code);
        Assert.Equal("حلقه اول", found.Name);
    }

    [Fact]
    public async Task GetRingById_NotFound_ReturnsNull()
    {
        var result = await _service.GetRingByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task GetRingByCode_Works()
    {
        await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R5",
            Name = "حلقه پنجم",
            AgeGroup = "12-14",
            SortOrder = 5
        });

        var found = await _service.GetRingByCodeAsync("R5");
        Assert.NotNull(found);
        Assert.Equal("R5", found.Code);
    }

    [Fact]
    public async Task GetRingByCode_NotFound_ReturnsNull()
    {
        var result = await _service.GetRingByCodeAsync("NONEXISTENT");
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateRing_Works()
    {
        var created = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R2",
            Name = "حلقه دوم",
            AgeGroup = "8-10",
            SortOrder = 2
        });

        var updated = await _service.UpdateRingAsync(created.Id, new UpdateQuranRingRequest
        {
            Name = "حلقه دوم (بروزرسانی شده)",
            SpecializedPeriods = 3
        });

        Assert.Equal("حلقه دوم (بروزرسانی شده)", updated.Name);
        Assert.Equal(3, updated.SpecializedPeriods);
    }

    [Fact]
    public async Task DeleteRing_Works()
    {
        var created = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "DEL",
            Name = "قابل حذف",
            AgeGroup = "7-9",
            SortOrder = 99
        });

        var deleted = await _service.DeleteRingAsync(created.Id);
        Assert.True(deleted);

        var found = await _service.GetRingByIdAsync(created.Id);
        Assert.Null(found);
    }

    [Fact]
    public async Task DeleteRing_NotFound_ReturnsFalse()
    {
        var result = await _service.DeleteRingAsync(999);
        Assert.False(result);
    }

    [Fact]
    public async Task GetAllRings_WithFilter_Works()
    {
        await _service.CreateRingAsync(new CreateQuranRingRequest { Code = "A", Name = "Alpha", AgeGroup = "7-9", SortOrder = 1, Gender = "male" });
        await _service.CreateRingAsync(new CreateQuranRingRequest { Code = "B", Name = "Beta", AgeGroup = "10-12", SortOrder = 2, Gender = "female" });

        var maleOnly = await _service.GetAllRingsAsync(new QuranRingFilterDto { Gender = "male" });
        Assert.Single(maleOnly);
        Assert.Equal("A", maleOnly[0].Code);

        var searchAlpha = await _service.GetAllRingsAsync(new QuranRingFilterDto { Search = "Alpha" });
        Assert.Single(searchAlpha);
    }

    // ==================== Sessions ====================

    [Fact]
    public async Task CreateSession_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R3", Name = "Test Ring", AgeGroup = "10-12", SortOrder = 1
        });

        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id,
            SessionNumber = 1,
            Title = "جلسه اول",
            SessionType = "REGULAR",
            StartPage = 562,
            EndPage = 565,
            Surfaces = 15,
            EstimatedMinutes = 60,
            Half = "FIRST",
            SortOrder = 1
        });

        Assert.Equal(1, session.SessionNumber);
        Assert.Equal("جلسه اول", session.Title);
        Assert.Equal("REGULAR", session.SessionType);
        Assert.Equal(562, session.StartPage);
        Assert.Equal(565, session.EndPage);
        Assert.Equal(15, session.Surfaces);
        Assert.Equal(60, session.EstimatedMinutes);
        Assert.Equal("FIRST", session.Half);
        Assert.Equal(ring.Id, session.RingId);
    }

    [Fact]
    public async Task GetSessionsByRing_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R3S", Name = "Sessions Test Ring", AgeGroup = "10-12", SortOrder = 1
        });

        await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "Session 1", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });
        await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 2, Title = "Session 2", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 2
        });

        var sessions = await _service.GetSessionsByRingAsync(ring.Id);
        Assert.Equal(2, sessions.Count);
    }

    [Fact]
    public async Task GetSessionById_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "R3G", Name = "Get Session Test", AgeGroup = "10-12", SortOrder = 1
        });

        var created = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 5, Title = "Test", Surfaces = 20, EstimatedMinutes = 75, Half = "SECOND", SortOrder = 5
        });

        var found = await _service.GetSessionByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal(5, found.SessionNumber);
        Assert.Equal("SECOND", found.Half);
    }

    [Fact]
    public async Task GetSessionById_NotFound_ReturnsNull()
    {
        var result = await _service.GetSessionByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task AssessmentSession_HasCorrectType()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RA", Name = "Assessment Ring", AgeGroup = "10-12", SortOrder = 1
        });

        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 6, Title = "ارزیابی", Surfaces = 30, EstimatedMinutes = 90,
            IsAssessment = true, SessionType = "ASSESSMENT", Half = "FIRST", SortOrder = 6
        });

        Assert.True(session.IsAssessment);
        Assert.Equal("ASSESSMENT", session.SessionType);
    }

    // ==================== Steps ====================

    [Fact]
    public async Task CreateStep_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RS", Name = "Step Test", AgeGroup = "10-12", SortOrder = 1
        });
        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "Step Session", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var step = await _service.CreateStepAsync(new CreateQuranSessionStepRequest
        {
            SessionId = session.Id,
            StepOrder = 1,
            StepType = "LISTENING",
            Title = "استماع",
            EstimatedMinutes = 10,
            IsOptional = false
        });

        Assert.Equal("LISTENING", step.StepType);
        Assert.Equal("استماع", step.Title);
        Assert.Equal(1, step.StepOrder);
        Assert.False(step.IsOptional);
    }

    [Fact]
    public async Task CreateOptionalStep_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RO", Name = "Optional Test", AgeGroup = "10-12", SortOrder = 1
        });
        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "Optional Session", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var step = await _service.CreateStepAsync(new CreateQuranSessionStepRequest
        {
            SessionId = session.Id,
            StepOrder = 7,
            StepType = "WRITING",
            Title = "کتابت",
            EstimatedMinutes = 15,
            IsOptional = true
        });

        Assert.True(step.IsOptional);
        Assert.Equal("WRITING", step.StepType);
    }

    // ==================== Student Progress ====================

    [Fact]
    public async Task StartSession_CreatesProgress()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RP", Name = "Progress Test", AgeGroup = "10-12", SortOrder = 1
        });
        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "Progress Session", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var progress = await _service.StartSessionAsync(studentId: 1, sessionId: session.Id);

        Assert.Equal(1, progress.StudentId);
        Assert.Equal(session.Id, progress.SessionId);
        Assert.Equal("IN_PROGRESS", progress.Status);
        Assert.Equal(0, progress.ProgressPercent);
        Assert.NotNull(progress.StartedAt);
    }

    [Fact]
    public async Task UpdateSessionProgress_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RU", Name = "Update Test", AgeGroup = "10-12", SortOrder = 1
        });
        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "Update Session", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var progress = await _service.StartSessionAsync(studentId: 2, sessionId: session.Id);
        var updated = await _service.UpdateSessionProgressAsync(progress.Id, new UpdateSessionProgressRequest
        {
            ProgressPercent = 50,
            LinesMemorized = 3,
            SurfacesCompleted = 7,
            CoachNotes = "خوب پیش می‌رود"
        });

        Assert.Equal(50, updated.ProgressPercent);
        Assert.Equal(3, updated.LinesMemorized);
        Assert.Equal(7, updated.SurfacesCompleted);
        Assert.Equal("خوب پیش می‌رود", updated.CoachNotes);
    }

    [Fact]
    public async Task CompleteSession_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RC", Name = "Complete Test", AgeGroup = "10-12", SortOrder = 1
        });
        var session = await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "Complete Session", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var progress = await _service.StartSessionAsync(studentId: 3, sessionId: session.Id);
        var completed = await _service.CompleteSessionAsync(progress.Id, assessmentScore: 85);

        Assert.Equal("COMPLETED", completed.Status);
        Assert.Equal(100, completed.ProgressPercent);
        Assert.NotNull(completed.CompletedAt);
        Assert.Equal(85, completed.AssessmentScore);
    }

    [Fact]
    public async Task GetStudentProgressById_NotFound_ReturnsNull()
    {
        var result = await _service.GetStudentProgressByIdAsync(999);
        Assert.Null(result);
    }

    // ==================== Speed Categories ====================

    [Fact]
    public async Task CalculateSpeedCategory_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RSC", Name = "Speed Category Test", AgeGroup = "10-12", SortOrder = 1
        });

        var category = await _service.CalculateSpeedCategoryAsync(studentId: 1, ringId: ring.Id);

        Assert.Equal("STAMINA", category.Category);
        Assert.Equal(2, category.DailyLines);
        Assert.Equal(1, category.StudentId);
        Assert.Equal(ring.Id, category.RingId);
    }

    [Fact]
    public async Task GetStudentSpeedCategory_NotFound_ReturnsNull()
    {
        var result = await _service.GetStudentSpeedCategoryAsync(studentId: 999, ringId: 999);
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateSpeedCategory_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RUSC", Name = "Update Speed", AgeGroup = "10-12", SortOrder = 1
        });

        await _service.CalculateSpeedCategoryAsync(studentId: 5, ringId: ring.Id);
        var updated = await _service.UpdateSpeedCategoryAsync(studentId: 5, ringId: ring.Id, new UpdateSpeedCategoryRequest
        {
            Category = "SEMI_SPEED",
            DailyLines = 3,
            ChangeReason = "عملکرد خوب در جلسات اخیر"
        });

        Assert.Equal("SEMI_SPEED", updated.Category);
        Assert.Equal(3, updated.DailyLines);
        Assert.Equal("عملکرد خوب در جلسات اخیر", updated.ChangeReason);
        Assert.Equal("STAMINA", updated.PreviousCategory);
    }

    // ==================== Tadabbor ====================

    [Fact]
    public async Task CreateTadabborEntry_Works()
    {
        var entry = await _service.CreateTadabborEntryAsync(new CreateTadabborEntryRequest
        {
            StudentId = 1,
            SurahId = 71,
            AyahNumber = 5,
            Word = "خَشْيَةَ",
            WhyThisWord = "怩บ boltzmann چرا این کلمه استفاده شده",
            SynonymsJson = "[\"خوف\",\"畏惧\"]",
            JalalainReference = "جلالین صفحه ۵۰۰",
            DifferenceFromSynonyms = "خشیت عمیق‌تر از خوف است",
            StudentNote = "نکته شخصی"
        });

        Assert.Equal("خَشْيَةَ", entry.Word);
        Assert.Equal(71, entry.SurahId);
        Assert.Equal(5, entry.AyahNumber);
        Assert.Equal("[\"خوف\",\"畏惧\"]", entry.SynonymsJson);
        Assert.Equal("جلالین صفحه ۵۰۰", entry.JalalainReference);
    }

    [Fact]
    public async Task GetTadabborEntryById_Works()
    {
        var created = await _service.CreateTadabborEntryAsync(new CreateTadabborEntryRequest
        {
            StudentId = 2,
            Word = "تَدْبُر",
            WhyThisWord = "تعمق در معنا"
        });

        var found = await _service.GetTadabborEntryByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal("تَدْبُر", found.Word);
    }

    [Fact]
    public async Task GetTadabborEntryById_NotFound_ReturnsNull()
    {
        var result = await _service.GetTadabborEntryByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateTadabborEntry_Works()
    {
        var created = await _service.CreateTadabborEntryAsync(new CreateTadabborEntryRequest
        {
            StudentId = 3,
            Word = "کلمه اولیه",
            StudentNote = "یادداشت اول"
        });

        var updated = await _service.UpdateTadabborEntryAsync(created.Id, new UpdateTadabborEntryRequest
        {
            Word = "کلمه بروزرسانی شده",
            CoachNote = "نظر مربی"
        });

        Assert.Equal("کلمه بروزرسانی شده", updated.Word);
        Assert.Equal("نظر مربی", updated.CoachNote);
        Assert.Equal("یادداشت اول", updated.StudentNote);
    }

    [Fact]
    public async Task DeleteTadabborEntry_Works()
    {
        var created = await _service.CreateTadabborEntryAsync(new CreateTadabborEntryRequest
        {
            StudentId = 4,
            Word = "قابل حذف"
        });

        var deleted = await _service.DeleteTadabborEntryAsync(created.Id);
        Assert.True(deleted);

        var found = await _service.GetTadabborEntryByIdAsync(created.Id);
        Assert.Null(found);
    }

    [Fact]
    public async Task DeleteTadabborEntry_NotFound_ReturnsFalse()
    {
        var result = await _service.DeleteTadabborEntryAsync(999);
        Assert.False(result);
    }

    // ==================== Asset Evaluations ====================

    [Fact]
    public async Task CreateAssetEvaluation_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RE", Name = "Eval Test", AgeGroup = "10-12", SortOrder = 1
        });

        var evaluation = await _service.CreateAssetEvaluationAsync(new CreateAssetEvaluationRequest
        {
            StudentId = 1,
            RingId = ring.Id,
            EvaluatorUserId = 10,
            MemorizationScore = 8,
            MemorizationNotes = "خوب حفظ می‌کند",
            PhoneticSkillScore = 7,
            LinguisticFoundationScore = 6,
            SemanticComprehensionScore = 8,
            TadabborWritingScore = 7,
            DailyThroughputScore = 9,
            EnvironmentalSupportScore = 8,
            MotivationIdentityScore = 10,
            SuggestedSpeedCategory = "SEMI_SPEED",
            GeneralNotes = "ارزیابی کلی خوب"
        });

        Assert.Equal(1, evaluation.StudentId);
        Assert.Equal(ring.Id, evaluation.RingId);
        Assert.Equal(8, evaluation.MemorizationScore);
        Assert.Equal("خوب حفظ می‌کند", evaluation.MemorizationNotes);
        Assert.Equal(7, evaluation.PhoneticSkillScore);
        Assert.Equal(6, evaluation.LinguisticFoundationScore);
        Assert.Equal(8, evaluation.SemanticComprehensionScore);
        Assert.Equal(7, evaluation.TadabborWritingScore);
        Assert.Equal(9, evaluation.DailyThroughputScore);
        Assert.Equal(8, evaluation.EnvironmentalSupportScore);
        Assert.Equal(10, evaluation.MotivationIdentityScore);
        Assert.Equal("SEMI_SPEED", evaluation.SuggestedSpeedCategory);
        Assert.Equal("ارزیابی کلی خوب", evaluation.GeneralNotes);
    }

    [Fact]
    public async Task GetAssetEvaluationById_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RE2", Name = "Eval Get Test", AgeGroup = "10-12", SortOrder = 1
        });

        var created = await _service.CreateAssetEvaluationAsync(new CreateAssetEvaluationRequest
        {
            StudentId = 2,
            RingId = ring.Id,
            EvaluatorUserId = 10,
            MemorizationScore = 9
        });

        var found = await _service.GetAssetEvaluationByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal(9, found.MemorizationScore);
    }

    [Fact]
    public async Task GetAssetEvaluationById_NotFound_ReturnsNull()
    {
        var result = await _service.GetAssetEvaluationByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task GetLatestEvaluation_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "REL", Name = "Latest Eval", AgeGroup = "10-12", SortOrder = 1
        });

        await _service.CreateAssetEvaluationAsync(new CreateAssetEvaluationRequest
        {
            StudentId = 3, RingId = ring.Id, EvaluatorUserId = 10, MemorizationScore = 7
        });
        var latest = await _service.CreateAssetEvaluationAsync(new CreateAssetEvaluationRequest
        {
            StudentId = 3, RingId = ring.Id, EvaluatorUserId = 10, MemorizationScore = 9
        });

        var found = await _service.GetLatestEvaluationAsync(studentId: 3, ringId: ring.Id);
        Assert.NotNull(found);
        Assert.Equal(9, found.MemorizationScore);
        Assert.Equal(latest.Id, found.Id);
    }

    [Fact]
    public async Task GetLatestEvaluation_NotFound_ReturnsNull()
    {
        var result = await _service.GetLatestEvaluationAsync(studentId: 999, ringId: 999);
        Assert.Null(result);
    }

    // ==================== Coach Interview ====================

    [Fact]
    public async Task CreateCoachInterview_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RCI", Name = "Coach Interview Test", AgeGroup = "10-12", SortOrder = 1
        });

        var interview = await _service.CreateCoachInterviewAsync(new CreateCoachInterviewRequest
        {
            CoachUserId = 20,
            RingId = ring.Id,
            Q1_ProcessSteps = "فرآیند: استماع ← لغت ← صرف ← نحو ← ترجمه ← تدبر ← کتابت",
            Q2_PhoneticLayer = "لایه لفظی: روخوانی خوب است",
            Q3_TranslationLayer = "ترجمه: نیاز به تقویت",
            Q5_MainChallenges = "حفظ برای برخی سخت است"
        });

        Assert.Equal(20, interview.CoachUserId);
        Assert.Equal(ring.Id, interview.RingId);
        Assert.Contains("استماع", interview.Q1_ProcessSteps);
        Assert.Contains("لایه لفظی", interview.Q2_PhoneticLayer);
    }

    [Fact]
    public async Task GetCoachInterviewById_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RCI2", Name = "Coach Interview Get", AgeGroup = "10-12", SortOrder = 1
        });

        var created = await _service.CreateCoachInterviewAsync(new CreateCoachInterviewRequest
        {
            CoachUserId = 21,
            RingId = ring.Id,
            Q1_ProcessSteps = "test answer"
        });

        var found = await _service.GetCoachInterviewByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal("test answer", found.Q1_ProcessSteps);
    }

    [Fact]
    public async Task GetCoachInterviewById_NotFound_ReturnsNull()
    {
        var result = await _service.GetCoachInterviewByIdAsync(999);
        Assert.Null(result);
    }

    // ==================== Student Interview ====================

    [Fact]
    public async Task CreateStudentInterview_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RSI", Name = "Student Interview Test", AgeGroup = "10-12", SortOrder = 1
        });

        var interview = await _service.CreateStudentInterviewAsync(new CreateStudentInterviewRequest
        {
            StudentId = 5,
            RingId = ring.Id,
            InterviewerUserId = 20,
            S1_DailyListening = "هر روز گوش می‌دهم",
            S2_FamilyListening = "با خانواده هم گوش می‌دهم",
            S3_MemorizedSurahs = "نوح و حشر",
            S8_SelfSpeedCategory = "نیمه‌سرعتی",
            S9_Motivation = "خیلی انگیزه دارم"
        });

        Assert.Equal(5, interview.StudentId);
        Assert.Equal("هر روز گوش می‌دهم", interview.S1_DailyListening);
        Assert.Equal("نوح و حشر", interview.S3_MemorizedSurahs);
        Assert.Equal("نیمه‌سرعتی", interview.S8_SelfSpeedCategory);
    }

    [Fact]
    public async Task GetStudentInterviewById_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RSI2", Name = "Student Interview Get", AgeGroup = "10-12", SortOrder = 1
        });

        var created = await _service.CreateStudentInterviewAsync(new CreateStudentInterviewRequest
        {
            StudentId = 6,
            RingId = ring.Id,
            InterviewerUserId = 20,
            S1_DailyListening = "test"
        });

        var found = await _service.GetStudentInterviewByIdAsync(created.Id);
        Assert.NotNull(found);
        Assert.Equal("test", found.S1_DailyListening);
    }

    [Fact]
    public async Task GetStudentInterviewById_NotFound_ReturnsNull()
    {
        var result = await _service.GetStudentInterviewByIdAsync(999);
        Assert.Null(result);
    }

    // ==================== Ring Surahs ====================

    [Fact]
    public async Task CreateRingSurah_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RRS", Name = "Ring Surah Test", AgeGroup = "10-12", SortOrder = 1
        });

        var surah = await _service.CreateRingSurahAsync(new CreateQuranRingSurahRequest
        {
            RingId = ring.Id,
            SurahId = 71,
            ActivityType = "MEMORIZATION",
            SortOrder = 1
        });

        Assert.Equal(71, surah.SurahId);
        Assert.Equal("MEMORIZATION", surah.ActivityType);
        Assert.Equal(ring.Id, surah.RingId);
    }

    [Fact]
    public async Task GetRingSurahs_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RRSG", Name = "Ring Surah Get", AgeGroup = "10-12", SortOrder = 1
        });

        await _service.CreateRingSurahAsync(new CreateQuranRingSurahRequest
        {
            RingId = ring.Id, SurahId = 71, ActivityType = "MEMORIZATION", SortOrder = 1
        });
        await _service.CreateRingSurahAsync(new CreateQuranRingSurahRequest
        {
            RingId = ring.Id, SurahId = 59, ActivityType = "LISTENING", SortOrder = 2
        });

        var surahs = await _service.GetRingSurahsAsync(ring.Id);
        Assert.Equal(2, surahs.Count);
    }

    [Fact]
    public async Task DeleteRingSurah_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RDS", Name = "Delete Surah", AgeGroup = "10-12", SortOrder = 1
        });

        var surah = await _service.CreateRingSurahAsync(new CreateQuranRingSurahRequest
        {
            RingId = ring.Id, SurahId = 68, ActivityType = "MEMORIZATION", SortOrder = 1
        });

        var deleted = await _service.DeleteRingSurahAsync(surah.Id);
        Assert.True(deleted);

        var remaining = await _service.GetRingSurahsAsync(ring.Id);
        Assert.Empty(remaining);
    }

    [Fact]
    public async Task DeleteRingSurah_NotFound_ReturnsFalse()
    {
        var result = await _service.DeleteRingSurahAsync(999);
        Assert.False(result);
    }

    // ==================== Ring Resources ====================

    [Fact]
    public async Task CreateRingResource_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RRR", Name = "Ring Resource Test", AgeGroup = "10-12", SortOrder = 1
        });

        var resource = await _service.CreateRingResourceAsync(new CreateQuranRingResourceRequest
        {
            RingId = ring.Id,
            Title = "ترجمه تحت‌اللفظی جزء سی",
            ResourceType = "BOOK",
            Description = "پیش‌فرض برای تمام حلقه‌ها",
            IsPrimary = true,
            SortOrder = 1
        });

        Assert.Equal("ترجمه تحت‌اللفظی جزء سی", resource.Title);
        Assert.Equal("BOOK", resource.ResourceType);
        Assert.True(resource.IsPrimary);
        Assert.Equal(ring.Id, resource.RingId);
    }

    [Fact]
    public async Task GetRingResources_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RRRG", Name = "Ring Resource Get", AgeGroup = "10-12", SortOrder = 1
        });

        await _service.CreateRingResourceAsync(new CreateQuranRingResourceRequest
        {
            RingId = ring.Id, Title = "Resource 1", ResourceType = "BOOK", SortOrder = 1
        });
        await _service.CreateRingResourceAsync(new CreateQuranRingResourceRequest
        {
            RingId = ring.Id, Title = "Resource 2", ResourceType = "WORKSHEET", SortOrder = 2
        });

        var resources = await _service.GetRingResourcesAsync(ring.Id);
        Assert.Equal(2, resources.Count);
    }

    [Fact]
    public async Task DeleteRingResource_Works()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RDR", Name = "Delete Resource", AgeGroup = "10-12", SortOrder = 1
        });

        var resource = await _service.CreateRingResourceAsync(new CreateQuranRingResourceRequest
        {
            RingId = ring.Id, Title = "To Delete", ResourceType = "VIDEO", SortOrder = 1
        });

        var deleted = await _service.DeleteRingResourceAsync(resource.Id);
        Assert.True(deleted);

        var remaining = await _service.GetRingResourcesAsync(ring.Id);
        Assert.Empty(remaining);
    }

    [Fact]
    public async Task DeleteRingResource_NotFound_ReturnsFalse()
    {
        var result = await _service.DeleteRingResourceAsync(999);
        Assert.False(result);
    }

    // ==================== Dashboard ====================

    [Fact]
    public async Task GetDashboard_ReturnsDashboardData()
    {
        var ring = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "RD", Name = "Dashboard Ring", AgeGroup = "10-12", SortOrder = 1
        });

        await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring.Id, SessionNumber = 1, Title = "S1", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var dashboard = await _service.GetDashboardAsync();

        Assert.Equal(1, dashboard.TotalRings);
        Assert.Equal(1, dashboard.ActiveRings);
        Assert.Equal(1, dashboard.TotalSessions);
    }

    [Fact]
    public async Task GetDashboard_WithRingFilter_Works()
    {
        var ring1 = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "D1", Name = "Dashboard 1", AgeGroup = "10-12", SortOrder = 1
        });
        var ring2 = await _service.CreateRingAsync(new CreateQuranRingRequest
        {
            Code = "D2", Name = "Dashboard 2", AgeGroup = "12-14", SortOrder = 2
        });

        await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring1.Id, SessionNumber = 1, Title = "S1", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });
        await _service.CreateSessionAsync(new CreateQuranRingSessionRequest
        {
            RingId = ring2.Id, SessionNumber = 1, Title = "S1", Surfaces = 15, EstimatedMinutes = 60, Half = "FIRST", SortOrder = 1
        });

        var filtered = await _service.GetDashboardAsync(ringId: ring1.Id);
        Assert.Equal(1, filtered.TotalSessions);
    }
}

#endregion

#region Controller Attribute/Authorization Tests

public class QuranRingControllerTests
{
    [Fact]
    public void QuranRingController_HasAuthorizeAttribute()
    {
        var controllerType = typeof(QuranRingController);
        var authorizeAttr = controllerType.GetCustomAttribute<AuthorizeAttribute>();

        Assert.NotNull(authorizeAttr);
    }

    [Fact]
    public void QuranRingController_HasCorrectRoute()
    {
        var controllerType = typeof(QuranRingController);
        var routeAttr = controllerType.GetCustomAttribute<RouteAttribute>();

        Assert.NotNull(routeAttr);
        Assert.Equal("api/quran-rings", routeAttr.Template);
    }

    [Theory]
    [InlineData("GetAllRings", "GET")]
    [InlineData("GetRingById", "GET")]
    [InlineData("GetRingByCode", "GET")]
    [InlineData("CreateRing", "POST")]
    [InlineData("UpdateRing", "PUT")]
    [InlineData("DeleteRing", "DELETE")]
    [InlineData("GetSessions", "GET")]
    [InlineData("GetSessionById", "GET")]
    [InlineData("GetSessionsByRing", "GET")]
    [InlineData("CreateSession", "POST")]
    [InlineData("UpdateSession", "PUT")]
    [InlineData("DeleteSession", "DELETE")]
    [InlineData("CreateStep", "POST")]
    [InlineData("UpdateStep", "PUT")]
    [InlineData("DeleteStep", "DELETE")]
    [InlineData("GetStudentProgress", "GET")]
    [InlineData("GetStudentProgressById", "GET")]
    [InlineData("StartSession", "POST")]
    [InlineData("UpdateSessionProgress", "PUT")]
    [InlineData("UpdateStepProgress", "PUT")]
    [InlineData("CompleteSession", "POST")]
    [InlineData("GetStudentSpeedCategory", "GET")]
    [InlineData("UpdateSpeedCategory", "PUT")]
    [InlineData("CalculateSpeedCategory", "POST")]
    [InlineData("GetStudentsBySpeedCategory", "GET")]
    [InlineData("GetTadabborEntries", "GET")]
    [InlineData("GetTadabborEntryById", "GET")]
    [InlineData("CreateTadabborEntry", "POST")]
    [InlineData("UpdateTadabborEntry", "PUT")]
    [InlineData("DeleteTadabborEntry", "DELETE")]
    [InlineData("GetAssetEvaluations", "GET")]
    [InlineData("GetAssetEvaluationById", "GET")]
    [InlineData("CreateAssetEvaluation", "POST")]
    [InlineData("GetLatestEvaluation", "GET")]
    [InlineData("GetCoachInterviews", "GET")]
    [InlineData("GetCoachInterviewById", "GET")]
    [InlineData("CreateCoachInterview", "POST")]
    [InlineData("GetStudentInterviews", "GET")]
    [InlineData("GetStudentInterviewById", "GET")]
    [InlineData("CreateStudentInterview", "POST")]
    [InlineData("GetRingSurahs", "GET")]
    [InlineData("CreateRingSurah", "POST")]
    [InlineData("DeleteRingSurah", "DELETE")]
    [InlineData("GetRingResources", "GET")]
    [InlineData("CreateRingResource", "POST")]
    [InlineData("DeleteRingResource", "DELETE")]
    [InlineData("GetDashboard", "GET")]
    public void AllEndpoints_HaveHttpVerbAttribute(string methodName, string httpMethod)
    {
        var method = typeof(QuranRingController).GetMethod(methodName);
        Assert.NotNull(method);

        var hasVerb = httpMethod switch
        {
            "GET" => method.GetCustomAttribute<HttpGetAttribute>() != null,
            "POST" => method.GetCustomAttribute<HttpPostAttribute>() != null,
            "PUT" => method.GetCustomAttribute<HttpPutAttribute>() != null,
            "DELETE" => method.GetCustomAttribute<HttpDeleteAttribute>() != null,
            _ => false
        };

        Assert.True(hasVerb, $"Method {methodName} is missing [{httpMethod}] attribute");
    }

    [Fact]
    public void QuranRingController_AllPublicMethods_HaveHttpVerb()
    {
        var controllerType = typeof(QuranRingController);
        var methods = controllerType.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.DeclaredOnly);

        foreach (var method in methods)
        {
            if (method.IsDefined(typeof(NonActionAttribute), true))
                continue;

            var hasVerb = method.GetCustomAttribute<HttpGetAttribute>() != null
                || method.GetCustomAttribute<HttpPostAttribute>() != null
                || method.GetCustomAttribute<HttpPutAttribute>() != null
                || method.GetCustomAttribute<HttpDeleteAttribute>() != null;

            Assert.True(hasVerb, $"Public method {method.Name} is missing an HTTP verb attribute");
        }
    }

    [Fact]
    public void QuranRingController_Constructor_RequiresIQuranRingService()
    {
        var ctor = typeof(QuranRingController).GetConstructors().First();
        var parameters = ctor.GetParameters();

        Assert.Single(parameters);
        Assert.Equal(typeof(IQuranRingService), parameters[0].ParameterType);
    }
}

#endregion

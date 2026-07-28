using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class MathService : IMathService
{
    private readonly AppDbContext _db;

    public MathService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<MathTopic>> GetAllTopicsAsync()
    {
        return await _db.MathTopics
            .OrderBy(t => t.DisplayOrder)
            .ToListAsync();
    }

    public async Task<MathTopic?> FindTopicByIdAsync(int id)
    {
        return await _db.MathTopics
            .Include(t => t.Lessons)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<MathTopic> CreateTopicAsync(MathTopic topic)
    {
        _db.MathTopics.Add(topic);
        await _db.SaveChangesAsync();
        return topic;
    }

    public async Task<MathTopic> UpdateTopicAsync(int id, MathTopic topic)
    {
        var existing = await _db.MathTopics.FindAsync(id)
            ?? throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");

        existing.Title = topic.Title;
        existing.Description = topic.Description;
        existing.DifficultyLevel = topic.DifficultyLevel;
        existing.IconUrl = topic.IconUrl;
        existing.DisplayOrder = topic.DisplayOrder;
        existing.IsActive = topic.IsActive;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteTopicAsync(int id)
    {
        var existing = await _db.MathTopics.FindAsync(id)
            ?? throw new KeyNotFoundException("نظام‌بندی ریاضی یافت نشد");

        _db.MathTopics.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<List<MathTopic>> SearchTopicsAsync(string query, int maxResults = 10)
    {
        return await _db.MathTopics
            .Where(t => t.Title.Contains(query))
            .Take(maxResults)
            .ToListAsync();
    }

    public async Task<List<MathLesson>> GetAllLessonsAsync(int? topicId = null)
    {
        var query = _db.MathLessons
            .Include(l => l.Topic)
            .AsQueryable();

        if (topicId.HasValue)
            query = query.Where(l => l.MathTopicId == topicId.Value);

        return await query
            .OrderBy(l => l.DisplayOrder)
            .ToListAsync();
    }

    public async Task<MathLesson?> FindLessonByIdAsync(int id)
    {
        return await _db.MathLessons
            .Include(l => l.Topic)
            .Include(l => l.Questions)
            .FirstOrDefaultAsync(l => l.Id == id);
    }

    public async Task<MathLesson> CreateLessonAsync(MathLesson lesson)
    {
        _db.MathLessons.Add(lesson);
        await _db.SaveChangesAsync();
        return lesson;
    }

    public async Task<MathLesson> UpdateLessonAsync(int id, MathLesson lesson)
    {
        var existing = await _db.MathLessons.FindAsync(id)
            ?? throw new KeyNotFoundException("درس ریاضی یافت نشد");

        existing.Title = lesson.Title;
        existing.Content = lesson.Content;
        existing.Summary = lesson.Summary;
        existing.VideoUrl = lesson.VideoUrl;
        existing.DurationMinutes = lesson.DurationMinutes;
        existing.DisplayOrder = lesson.DisplayOrder;
        existing.IsPublished = lesson.IsPublished;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteLessonAsync(int id)
    {
        var existing = await _db.MathLessons.FindAsync(id)
            ?? throw new KeyNotFoundException("درس ریاضی یافت نشد");

        _db.MathLessons.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<List<MathLesson>> SearchLessonsAsync(string query, int maxResults = 10)
    {
        return await _db.MathLessons
            .Include(l => l.Topic)
            .Where(l => l.Title.Contains(query))
            .Take(maxResults)
            .ToListAsync();
    }

    public async Task<List<MathQuestion>> GetAllQuestionsAsync(int? lessonId = null)
    {
        var query = _db.MathQuestions
            .Include(q => q.Lesson)
            .AsQueryable();

        if (lessonId.HasValue)
            query = query.Where(q => q.MathLessonId == lessonId.Value);

        return await query.ToListAsync();
    }

    public async Task<MathQuestion?> FindQuestionByIdAsync(int id)
    {
        return await _db.MathQuestions
            .Include(q => q.Lesson)
            .FirstOrDefaultAsync(q => q.Id == id);
    }

    public async Task<MathQuestion> CreateQuestionAsync(MathQuestion question)
    {
        _db.MathQuestions.Add(question);
        await _db.SaveChangesAsync();
        return question;
    }

    public async Task<MathQuestion> UpdateQuestionAsync(int id, MathQuestion question)
    {
        var existing = await _db.MathQuestions.FindAsync(id)
            ?? throw new KeyNotFoundException("سؤال ریاضی یافت نشد");

        existing.QuestionText = question.QuestionText;
        existing.OptionA = question.OptionA;
        existing.OptionB = question.OptionB;
        existing.OptionC = question.OptionC;
        existing.OptionD = question.OptionD;
        existing.CorrectOption = question.CorrectOption;
        existing.Explanation = question.Explanation;
        existing.DifficultyLevel = question.DifficultyLevel;
        existing.Points = question.Points;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteQuestionAsync(int id)
    {
        var existing = await _db.MathQuestions.FindAsync(id)
            ?? throw new KeyNotFoundException("سؤال ریاضی یافت نشد");

        _db.MathQuestions.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<List<MathProgress>> GetStudentProgressAsync(int studentId)
    {
        return await _db.MathProgresses
            .Include(p => p.Lesson)
            .Where(p => p.StudentId == studentId)
            .ToListAsync();
    }

    public async Task<MathProgress?> GetStudentLessonProgressAsync(int studentId, int lessonId)
    {
        return await _db.MathProgresses
            .Include(p => p.Lesson)
            .FirstOrDefaultAsync(p => p.StudentId == studentId && p.MathLessonId == lessonId);
    }

    public async Task<MathProgress> RecordProgressAsync(MathProgress progress)
    {
        _db.MathProgresses.Add(progress);
        await _db.SaveChangesAsync();
        return progress;
    }

    public async Task<MathProgress> UpdateProgressAsync(int id, MathProgress progress)
    {
        var existing = await _db.MathProgresses.FindAsync(id)
            ?? throw new KeyNotFoundException("پیشرفت ریاضی یافت نشد");

        existing.IsCompleted = progress.IsCompleted;
        existing.Score = progress.Score;
        existing.UpdatedAt = DateTime.UtcNow;

        if (progress.IsCompleted)
            existing.CompletedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task<List<MathScholar>> GetAllScholarsAsync()
    {
        return await _db.MathScholars.ToListAsync();
    }

    public async Task<MathScholar?> FindScholarByIdAsync(int id)
    {
        return await _db.MathScholars
            .Include(s => s.Contributions)
            .FirstOrDefaultAsync(s => s.Id == id);
    }

    public async Task<MathScholar> CreateScholarAsync(MathScholar scholar)
    {
        _db.MathScholars.Add(scholar);
        await _db.SaveChangesAsync();
        return scholar;
    }

    public async Task<MathScholar> UpdateScholarAsync(int id, MathScholar scholar)
    {
        var existing = await _db.MathScholars.FindAsync(id)
            ?? throw new KeyNotFoundException("دانشمند ریاضی یافت نشد");

        existing.Name = scholar.Name;
        existing.NameArabic = scholar.NameArabic;
        existing.BirthYear = scholar.BirthYear;
        existing.DeathYear = scholar.DeathYear;
        existing.BirthPlace = scholar.BirthPlace;
        existing.Biography = scholar.Biography;
        existing.ImageUrl = scholar.ImageUrl;
        existing.KnownFor = scholar.KnownFor;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteScholarAsync(int id)
    {
        var existing = await _db.MathScholars.FindAsync(id)
            ?? throw new KeyNotFoundException("دانشمند ریاضی یافت نشد");

        _db.MathScholars.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<List<MathScholar>> SearchScholarsAsync(string query, int maxResults = 10)
    {
        return await _db.MathScholars
            .Where(s => s.Name.Contains(query))
            .Take(maxResults)
            .ToListAsync();
    }

    public async Task<List<MathContribution>> GetContributionsByTopicAsync(int topicId)
    {
        return await _db.MathContributions
            .Include(c => c.Scholar)
            .Where(c => c.MathTopicId == topicId)
            .ToListAsync();
    }

    public async Task<List<MathContribution>> GetContributionsByScholarAsync(int scholarId)
    {
        return await _db.MathContributions
            .Include(c => c.Topic)
            .Where(c => c.MathScholarId == scholarId)
            .ToListAsync();
    }

    public async Task<MathContribution?> FindContributionByIdAsync(int id)
    {
        return await _db.MathContributions
            .Include(c => c.Scholar)
            .Include(c => c.Topic)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<MathContribution> CreateContributionAsync(MathContribution contribution)
    {
        _db.MathContributions.Add(contribution);
        await _db.SaveChangesAsync();
        return contribution;
    }

    public async Task<MathContribution> UpdateContributionAsync(int id, MathContribution contribution)
    {
        var existing = await _db.MathContributions.FindAsync(id)
            ?? throw new KeyNotFoundException("مشارکت ریاضی یافت نشد");

        existing.MathScholarId = contribution.MathScholarId;
        existing.MathTopicId = contribution.MathTopicId;
        existing.Title = contribution.Title;
        existing.Description = contribution.Description;
        existing.YearRange = contribution.YearRange;
        existing.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return existing;
    }

    public async Task DeleteContributionAsync(int id)
    {
        var existing = await _db.MathContributions.FindAsync(id)
            ?? throw new KeyNotFoundException("مشارکت ریاضی یافت نشد");

        _db.MathContributions.Remove(existing);
        await _db.SaveChangesAsync();
    }

    public async Task<Dictionary<string, object>> GetDashboardStatsAsync()
    {
        return new Dictionary<string, object>
        {
            { "totalTopics", await _db.MathTopics.CountAsync() },
            { "totalLessons", await _db.MathLessons.CountAsync() },
            { "totalQuestions", await _db.MathQuestions.CountAsync() },
            { "totalScholars", await _db.MathScholars.CountAsync() },
            { "activeStudents", await _db.MathProgresses.Select(p => p.StudentId).Distinct().CountAsync() }
        };
    }
}

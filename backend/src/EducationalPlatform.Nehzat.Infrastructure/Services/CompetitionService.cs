using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class CompetitionService : ICompetitionService
{
    private readonly AppDbContext _db;

    public CompetitionService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<CompetitionResponse>> GetAllAsync()
    {
        return await _db.Competitions
            .Include(c => c.Course)
            .Include(c => c.Participants)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CompetitionResponse(
                c.Id,
                c.Title,
                c.Description,
                c.Type,
                c.StartDate,
                c.EndDate,
                c.Status,
                c.CourseId,
                c.Course != null ? c.Course.Title : null,
                c.Participants.Count,
                c.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<CompetitionDetailResponse?> GetByIdAsync(int id)
    {
        var competition = await _db.Competitions
            .Include(c => c.Course)
            .Include(c => c.Participants)
                .ThenInclude(p => p.Student)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (competition == null) return null;

        return new CompetitionDetailResponse(
            competition.Id,
            competition.Title,
            competition.Description,
            competition.Type,
            competition.StartDate,
            competition.EndDate,
            competition.Status,
            competition.CourseId,
            competition.Course?.Title,
            competition.Participants.Select(p => new CompetitionParticipantResponse(
                p.Id,
                p.StudentId,
                p.Student != null ? $"{p.Student.FirstName} {p.Student.LastName}" : "",
                p.Score,
                p.Rank,
                p.CompletedAt
            )).ToList(),
            competition.CreatedAt
        );
    }

    public async Task<CompetitionResponse> CreateAsync(CreateCompetitionRequest request)
    {
        var competition = new Competition
        {
            Title = request.Title,
            Description = request.Description,
            Type = request.Type,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = "draft",
            CourseId = request.CourseId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Competitions.Add(competition);
        await _db.SaveChangesAsync();

        return new CompetitionResponse(
            competition.Id,
            competition.Title,
            competition.Description,
            competition.Type,
            competition.StartDate,
            competition.EndDate,
            competition.Status,
            competition.CourseId,
            null,
            0,
            competition.CreatedAt
        );
    }

    public async Task<CompetitionResponse> UpdateAsync(int id, UpdateCompetitionRequest request)
    {
        var competition = await _db.Competitions
            .Include(c => c.Course)
            .Include(c => c.Participants)
            .FirstOrDefaultAsync(c => c.Id == id)
            ?? throw new KeyNotFoundException("مسابقه یافت نشد.");

        if (request.Title != null) competition.Title = request.Title;
        if (request.Description != null) competition.Description = request.Description;
        if (request.Type != null) competition.Type = request.Type;
        if (request.StartDate != null) competition.StartDate = request.StartDate.Value;
        if (request.EndDate != null) competition.EndDate = request.EndDate.Value;
        if (request.Status != null) competition.Status = request.Status;
        if (request.CourseId != null) competition.CourseId = request.CourseId;
        competition.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new CompetitionResponse(
            competition.Id,
            competition.Title,
            competition.Description,
            competition.Type,
            competition.StartDate,
            competition.EndDate,
            competition.Status,
            competition.CourseId,
            competition.Course?.Title,
            competition.Participants.Count,
            competition.CreatedAt
        );
    }

    public async Task DeleteAsync(int id)
    {
        var competition = await _db.Competitions.FindAsync(id)
            ?? throw new KeyNotFoundException("مسابقه یافت نشد.");
        _db.Competitions.Remove(competition);
        await _db.SaveChangesAsync();
    }

    public async Task<CompetitionParticipantResponse> RegisterParticipantAsync(int competitionId, RegisterParticipantRequest request)
    {
        var competition = await _db.Competitions.FindAsync(competitionId)
            ?? throw new KeyNotFoundException("مسابقه یافت نشد.");

        if (competition.Status != "draft" && competition.Status != "published")
            throw new InvalidOperationException("امکان ثبت‌نام در مسابقه با وضعیت فعلی وجود ندارد.");

        var existing = await _db.CompetitionParticipants
            .AnyAsync(p => p.CompetitionId == competitionId && p.StudentId == request.StudentId);
        if (existing)
            throw new InvalidOperationException("دانش‌آموز قبلاً در این مسابقه ثبت‌نام کرده است.");

        var student = await _db.Students.FindAsync(request.StudentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد.");

        var participant = new CompetitionParticipant
        {
            CompetitionId = competitionId,
            StudentId = request.StudentId,
            CreatedAt = DateTime.UtcNow
        };

        _db.CompetitionParticipants.Add(participant);
        await _db.SaveChangesAsync();

        return new CompetitionParticipantResponse(
            participant.Id,
            participant.StudentId,
            $"{student.FirstName} {student.LastName}",
            null,
            null,
            null
        );
    }

    public async Task RemoveParticipantAsync(int competitionId, int studentId)
    {
        var participant = await _db.CompetitionParticipants
            .FirstOrDefaultAsync(p => p.CompetitionId == competitionId && p.StudentId == studentId)
            ?? throw new KeyNotFoundException("شرکت‌کننده یافت نشد.");
        _db.CompetitionParticipants.Remove(participant);
        await _db.SaveChangesAsync();
    }

    public async Task<CompetitionParticipantResponse> UpdateParticipantScoreAsync(int competitionId, int studentId, UpdateParticipantScoreRequest request)
    {
        var participant = await _db.CompetitionParticipants
            .Include(p => p.Student)
            .FirstOrDefaultAsync(p => p.CompetitionId == competitionId && p.StudentId == studentId)
            ?? throw new KeyNotFoundException("شرکت‌کننده یافت نشد.");

        if (request.Score != null) participant.Score = request.Score;
        if (request.Rank != null) participant.Rank = request.Rank;
        if (request.CompletedAt != null) participant.CompletedAt = request.CompletedAt;

        await _db.SaveChangesAsync();

        return new CompetitionParticipantResponse(
            participant.Id,
            participant.StudentId,
            participant.Student != null ? $"{participant.Student.FirstName} {participant.Student.LastName}" : "",
            participant.Score,
            participant.Rank,
            participant.CompletedAt
        );
    }

    public async Task<CompetitionResultResponse> GetResultsAsync(int competitionId)
    {
        var competition = await _db.Competitions
            .Include(c => c.Participants)
                .ThenInclude(p => p.Student)
            .FirstOrDefaultAsync(c => c.Id == competitionId)
            ?? throw new KeyNotFoundException("مسابقه یافت نشد.");

        var rankings = competition.Participants
            .OrderBy(p => p.Rank ?? int.MaxValue)
            .ThenByDescending(p => p.Score ?? 0)
            .Select(p => new CompetitionParticipantResponse(
                p.Id,
                p.StudentId,
                p.Student != null ? $"{p.Student.FirstName} {p.Student.LastName}" : "",
                p.Score,
                p.Rank,
                p.CompletedAt
            ))
            .ToList();

        return new CompetitionResultResponse(
            competition.Id,
            competition.Title,
            rankings
        );
    }

    public async Task<List<CompetitionResponse>> GetActiveCompetitionsAsync()
    {
        var now = DateTime.UtcNow;
        return await _db.Competitions
            .Include(c => c.Course)
            .Include(c => c.Participants)
            .Where(c => c.Status == "published" || c.Status == "in_progress")
            .OrderBy(c => c.EndDate)
            .Select(c => new CompetitionResponse(
                c.Id,
                c.Title,
                c.Description,
                c.Type,
                c.StartDate,
                c.EndDate,
                c.Status,
                c.CourseId,
                c.Course != null ? c.Course.Title : null,
                c.Participants.Count,
                c.CreatedAt
            ))
            .ToListAsync();
    }
}

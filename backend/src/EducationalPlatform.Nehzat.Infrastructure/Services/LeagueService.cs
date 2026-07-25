using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class LeagueService : ILeagueService
{
    private readonly AppDbContext _db;

    public LeagueService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<LeagueResponse>> GetAllAsync()
    {
        return await _db.Leagues
            .Include(l => l.Course)
            .Include(l => l.Rankings)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => new LeagueResponse(
                l.Id,
                l.Name,
                l.Description,
                l.Season,
                l.StartDate,
                l.EndDate,
                l.Status,
                l.CourseId,
                l.Course != null ? l.Course.Title : null,
                l.Rankings.Count,
                l.CreatedAt
            ))
            .ToListAsync();
    }

    public async Task<LeagueDetailResponse?> GetByIdAsync(int id)
    {
        var league = await _db.Leagues
            .Include(l => l.Course)
            .Include(l => l.Rankings)
                .ThenInclude(r => r.Student)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (league == null) return null;

        return new LeagueDetailResponse(
            league.Id,
            league.Name,
            league.Description,
            league.Season,
            league.StartDate,
            league.EndDate,
            league.Status,
            league.CourseId,
            league.Course?.Title,
            league.Rankings.OrderBy(r => r.Rank).Select(r => new LeagueRankingResponse(
                r.Id,
                r.StudentId,
                r.Student != null ? $"{r.Student.FirstName} {r.Student.LastName}" : "",
                r.Score,
                r.Rank,
                r.PreviousRank,
                r.Trend,
                r.LastUpdated
            )).ToList(),
            league.CreatedAt
        );
    }

    public async Task<LeagueResponse> CreateAsync(CreateLeagueRequest request)
    {
        var league = new League
        {
            Name = request.Name,
            Description = request.Description,
            Season = request.Season,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Status = "active",
            CourseId = request.CourseId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Leagues.Add(league);
        await _db.SaveChangesAsync();

        return new LeagueResponse(
            league.Id,
            league.Name,
            league.Description,
            league.Season,
            league.StartDate,
            league.EndDate,
            league.Status,
            league.CourseId,
            null,
            0,
            league.CreatedAt
        );
    }

    public async Task<LeagueResponse> UpdateAsync(int id, UpdateLeagueRequest request)
    {
        var league = await _db.Leagues
            .Include(l => l.Course)
            .Include(l => l.Rankings)
            .FirstOrDefaultAsync(l => l.Id == id)
            ?? throw new KeyNotFoundException("لیگ یافت نشد.");

        if (request.Name != null) league.Name = request.Name;
        if (request.Description != null) league.Description = request.Description;
        if (request.Season != null) league.Season = request.Season;
        if (request.StartDate != null) league.StartDate = request.StartDate.Value;
        if (request.EndDate != null) league.EndDate = request.EndDate.Value;
        if (request.Status != null) league.Status = request.Status;
        if (request.CourseId != null) league.CourseId = request.CourseId;
        league.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return new LeagueResponse(
            league.Id,
            league.Name,
            league.Description,
            league.Season,
            league.StartDate,
            league.EndDate,
            league.Status,
            league.CourseId,
            league.Course?.Title,
            league.Rankings.Count,
            league.CreatedAt
        );
    }

    public async Task DeleteAsync(int id)
    {
        var league = await _db.Leagues.FindAsync(id)
            ?? throw new KeyNotFoundException("لیگ یافت نشد.");
        _db.Leagues.Remove(league);
        await _db.SaveChangesAsync();
    }

    public async Task<LeagueRankingResponse> UpdateRankingAsync(int leagueId, UpdateLeagueRankingRequest request)
    {
        var league = await _db.Leagues.FindAsync(leagueId)
            ?? throw new KeyNotFoundException("لیگ یافت نشد.");

        if (league.Status != "active")
            throw new InvalidOperationException("لیگ فعال نیست.");

        var student = await _db.Students.FindAsync(request.StudentId)
            ?? throw new KeyNotFoundException("دانش‌آموز یافت نشد.");

        var ranking = await _db.LeagueRankings
            .FirstOrDefaultAsync(r => r.LeagueId == leagueId && r.StudentId == request.StudentId);

        if (ranking == null)
        {
            var maxRank = await _db.LeagueRankings
                .Where(r => r.LeagueId == leagueId)
                .MaxAsync(r => (int?)r.Rank) ?? 0;

            ranking = new LeagueRanking
            {
                LeagueId = leagueId,
                StudentId = request.StudentId,
                Score = request.Score,
                Rank = maxRank + 1,
                PreviousRank = request.PreviousRank,
                Trend = "stable",
                LastUpdated = DateTime.UtcNow
            };
            _db.LeagueRankings.Add(ranking);
        }
        else
        {
            ranking.PreviousRank = ranking.Rank;
            ranking.Score = request.Score;
            ranking.Trend = request.Trend ?? "stable";
            ranking.LastUpdated = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();

        return new LeagueRankingResponse(
            ranking.Id,
            ranking.StudentId,
            $"{student.FirstName} {student.LastName}",
            ranking.Score,
            ranking.Rank,
            ranking.PreviousRank,
            ranking.Trend,
            ranking.LastUpdated
        );
    }

    public async Task<List<LeagueRankingResponse>> GetRankingsAsync(int leagueId)
    {
        var rankings = await _db.LeagueRankings
            .Include(r => r.Student)
            .Where(r => r.LeagueId == leagueId)
            .OrderBy(r => r.Rank)
            .ToListAsync();

        return rankings.Select(r => new LeagueRankingResponse(
            r.Id,
            r.StudentId,
            r.Student != null ? $"{r.Student.FirstName} {r.Student.LastName}" : "",
            r.Score,
            r.Rank,
            r.PreviousRank,
            r.Trend,
            r.LastUpdated
        )).ToList();
    }

    public async Task<List<LeagueResponse>> GetActiveLeaguesAsync()
    {
        var now = DateTime.UtcNow;
        return await _db.Leagues
            .Include(l => l.Course)
            .Include(l => l.Rankings)
            .Where(l => l.Status == "active")
            .OrderBy(l => l.EndDate)
            .Select(l => new LeagueResponse(
                l.Id,
                l.Name,
                l.Description,
                l.Season,
                l.StartDate,
                l.EndDate,
                l.Status,
                l.CourseId,
                l.Course != null ? l.Course.Title : null,
                l.Rankings.Count,
                l.CreatedAt
            ))
            .ToListAsync();
    }
}

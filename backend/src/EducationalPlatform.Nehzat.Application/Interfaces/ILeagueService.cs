using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ILeagueService
{
    Task<List<LeagueResponse>> GetAllAsync();
    Task<LeagueDetailResponse?> GetByIdAsync(int id);
    Task<LeagueResponse> CreateAsync(CreateLeagueRequest request);
    Task<LeagueResponse> UpdateAsync(int id, UpdateLeagueRequest request);
    Task DeleteAsync(int id);
    Task<LeagueRankingResponse> UpdateRankingAsync(int leagueId, UpdateLeagueRankingRequest request);
    Task<List<LeagueRankingResponse>> GetRankingsAsync(int leagueId);
    Task<List<LeagueResponse>> GetActiveLeaguesAsync();
}

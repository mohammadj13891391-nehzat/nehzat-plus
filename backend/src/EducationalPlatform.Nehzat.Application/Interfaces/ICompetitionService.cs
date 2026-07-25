using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ICompetitionService
{
    Task<List<CompetitionResponse>> GetAllAsync();
    Task<CompetitionDetailResponse?> GetByIdAsync(int id);
    Task<CompetitionResponse> CreateAsync(CreateCompetitionRequest request);
    Task<CompetitionResponse> UpdateAsync(int id, UpdateCompetitionRequest request);
    Task DeleteAsync(int id);
    Task<CompetitionParticipantResponse> RegisterParticipantAsync(int competitionId, RegisterParticipantRequest request);
    Task RemoveParticipantAsync(int competitionId, int studentId);
    Task<CompetitionParticipantResponse> UpdateParticipantScoreAsync(int competitionId, int studentId, UpdateParticipantScoreRequest request);
    Task<CompetitionResultResponse> GetResultsAsync(int competitionId);
    Task<List<CompetitionResponse>> GetActiveCompetitionsAsync();
}

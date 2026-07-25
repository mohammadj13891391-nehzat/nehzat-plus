using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ISpiritualPathService
{
    Task<List<SpiritualPath>> GetAvailablePathsAsync(int studentId);
    Task<StudentPathSelection> SubmitRankingAsync(int studentId, int pathId, int rankOrdinal);
    Task<StudentPathSelection> FinalizePathAsync(int studentId, int pathId, string? reason);
    Task<StudentPathSelection> SwitchFinalizedPathAsync(int studentId, int newPathId, string? reason);
    Task<StudentPathSelection?> GetSelectionAsync(int studentId);
    Task<List<StudentPathHistory>> GetHistoryAsync(int studentId);
}

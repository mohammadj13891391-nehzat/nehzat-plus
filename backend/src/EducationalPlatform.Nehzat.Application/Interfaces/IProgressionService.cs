using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IProgressionService
{
    Task<ProgressionResultDto> CheckProgressionAsync(int studentId);
    Task<List<ProgressionResultDto>> CheckRingProgressionAsync(int ringId);
    Task<StudentPathHistory> RecordProgressionAsync(int studentId, string fromLevel, string toLevel, int? changedByUserId = null);
}

using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ICurriculumVersionService
{
    Task<List<CurriculumVersion>> GetAllAsync();
    Task<CurriculumVersion?> GetByIdAsync(int id);
    Task<CurriculumVersion> CreateAsync(CreateCurriculumVersionRequest request);
    Task<CurriculumVersion> UpdateAsync(int id, UpdateCurriculumVersionRequest request);
    Task DeleteAsync(int id);
    Task<CurriculumVersion?> GetActiveVersionAsync();
}

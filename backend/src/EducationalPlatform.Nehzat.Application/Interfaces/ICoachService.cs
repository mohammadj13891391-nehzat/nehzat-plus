using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ICoachService
{
    Task<List<Coach>> GetAllAsync();
    Task<Coach?> FindByIdAsync(int id);
    Task<Coach> CreateAsync(CreateCoachRequest request);
    Task<Coach> UpdateAsync(int id, UpdateCoachRequest request);
    Task DeleteAsync(int id);
}

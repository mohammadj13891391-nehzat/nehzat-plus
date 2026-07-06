using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IParentService
{
    Task<List<Parent>> GetAllAsync();
    Task<Parent?> FindByIdAsync(int id);
    Task<Parent> CreateAsync(CreateParentRequest request);
    Task<Parent> UpdateAsync(int id, UpdateParentRequest request);
    Task DeleteAsync(int id);
}

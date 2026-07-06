using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IBranchService
{
    Task<List<Branch>> GetAllAsync();
    Task<Branch?> FindByIdAsync(int id);
    Task<Branch> CreateAsync(string name, string province, string? description);
    Task<Branch> UpdateAsync(int id, string name, string province, string? description);
    Task DeleteAsync(int id);
}

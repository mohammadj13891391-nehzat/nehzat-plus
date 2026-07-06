using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IBranchManagerService
{
    Task<List<BranchManager>> GetAllAsync();
    Task<BranchManager?> FindByIdAsync(int id);
    Task<BranchManager?> FindByUsernameAsync(string username);
    Task<BranchManager> CreateAsync(CreateBranchManagerRequest request);
    Task<BranchManager> UpdateAsync(int id, UpdateBranchManagerRequest request);
    Task DeleteAsync(int id);
}

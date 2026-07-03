using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Services;

public interface IBranchManagerService
{
    Task<List<BranchManager>> GetAllAsync();
    Task<BranchManager?> FindByIdAsync(int id);
    Task<BranchManager?> FindByUsernameAsync(string username);
    Task<BranchManager> CreateAsync(CreateBranchManagerRequest request);
    Task<BranchManager> UpdateAsync(int id, UpdateBranchManagerRequest request);
    Task DeleteAsync(int id);
}

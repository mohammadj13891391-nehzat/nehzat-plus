using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMadrasahService
{
    Task<List<Madrasah>> GetAllAsync();
    Task<Madrasah?> FindByIdAsync(int id);
    Task<Madrasah> CreateAsync(CreateMadrasahRequest request);
    Task<Madrasah> UpdateAsync(int id, UpdateMadrasahRequest request);
    Task DeleteAsync(int id);
    Task<List<MadrasahBranch>> GetBranchesAsync(int madrasahId);
    Task<MadrasahBranch> CreateBranchAsync(CreateMadrasahBranchRequest request);
    Task DeleteBranchAsync(int madrasahId, int branchId);
}

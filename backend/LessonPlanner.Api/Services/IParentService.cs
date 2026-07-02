using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Services;

public interface IParentService
{
    Task<List<Parent>> GetAllAsync();
    Task<Parent?> FindByIdAsync(int id);
    Task<Parent> CreateAsync(CreateParentRequest request);
    Task<Parent> UpdateAsync(int id, UpdateParentRequest request);
    Task DeleteAsync(int id);
}

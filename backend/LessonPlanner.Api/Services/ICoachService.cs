using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Services;

public interface ICoachService
{
    Task<List<Coach>> GetAllAsync();
    Task<Coach?> FindByIdAsync(int id);
    Task<Coach> CreateAsync(CreateCoachRequest request);
    Task<Coach> UpdateAsync(int id, UpdateCoachRequest request);
    Task DeleteAsync(int id);
}

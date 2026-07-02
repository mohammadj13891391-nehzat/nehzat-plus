using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Models;

namespace LessonPlanner.Api.Services;

public interface IEvaluatorService
{
    Task<List<Evaluator>> GetAllAsync();
    Task<Evaluator?> FindByIdAsync(int id);
    Task<Evaluator> CreateAsync(CreateEvaluatorRequest request);
    Task<Evaluator> UpdateAsync(int id, UpdateEvaluatorRequest request);
    Task DeleteAsync(int id);
}

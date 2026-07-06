using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IEvaluatorService
{
    Task<List<Evaluator>> GetAllAsync();
    Task<Evaluator?> FindByIdAsync(int id);
    Task<Evaluator> CreateAsync(CreateEvaluatorRequest request);
    Task<Evaluator> UpdateAsync(int id, UpdateEvaluatorRequest request);
    Task DeleteAsync(int id);
}

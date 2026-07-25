using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IMonthlyBookletService
{
    Task<List<MonthlyBooklet>> GetAllAsync(int? studentId = null);
    Task<MonthlyBooklet?> GetByIdAsync(int id);
    Task<List<MonthlyBooklet>> GetByStudentAsync(int studentId);
    Task<MonthlyBooklet?> GetByStudentAndPeriodAsync(int studentId, int month, int year);
    Task<MonthlyBooklet> CreateAsync(CreateMonthlyBookletRequest request);
    Task<MonthlyBooklet> UpdateAsync(int id, UpdateMonthlyBookletRequest request);
    Task DeleteAsync(int id);
}

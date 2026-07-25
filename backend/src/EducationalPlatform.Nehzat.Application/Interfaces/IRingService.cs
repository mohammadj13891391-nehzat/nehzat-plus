using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IRingService
{
    Task<List<Ring>> GetAllAsync();
    Task<Ring?> FindByIdAsync(int id);
    Task<Ring> CreateAsync(CreateRingRequest request);
    Task<Ring> UpdateAsync(int id, UpdateRingRequest request);
    Task DeleteAsync(int id);

    Task<List<RingStudent>> GetStudentsAsync(int ringId);
    Task<RingStudent> AddStudentAsync(CreateRingStudentRequest request);
    Task RemoveStudentAsync(int ringId, int studentId);

    Task AddBookAsync(CreateRingBookRequest request);
    Task RemoveBookAsync(int ringId, int bookId);

    Task AddTeachingMethodAsync(CreateRingTeachingMethodRequest request);
    Task RemoveTeachingMethodAsync(int ringId, int teachingMethodId);
}

using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ICurriculumService
{
    Task<List<SubjectArea>> GetAllSubjectAreasAsync();
    Task<SubjectArea?> FindSubjectAreaByIdAsync(int id);
    Task<SubjectArea> CreateSubjectAreaAsync(CreateSubjectAreaRequest request);
    Task<SubjectArea> UpdateSubjectAreaAsync(int id, UpdateSubjectAreaRequest request);
    Task DeleteSubjectAreaAsync(int id);

    Task<List<TeachingMethod>> GetAllTeachingMethodsAsync();
    Task<TeachingMethod?> FindTeachingMethodByIdAsync(int id);
    Task<TeachingMethod> CreateTeachingMethodAsync(CreateTeachingMethodRequest request);
    Task<TeachingMethod> UpdateTeachingMethodAsync(int id, UpdateTeachingMethodRequest request);
    Task DeleteTeachingMethodAsync(int id);

    Task<List<CurriculumObjective>> GetAllObjectivesAsync();
    Task<CurriculumObjective?> FindObjectiveByIdAsync(int id);
    Task<CurriculumObjective> CreateObjectiveAsync(CreateCurriculumObjectiveRequest request);
    Task<CurriculumObjective> UpdateObjectiveAsync(int id, UpdateCurriculumObjectiveRequest request);
    Task DeleteObjectiveAsync(int id);

    Task<List<Book>> GetAllBooksAsync();
    Task<Book?> FindBookByIdAsync(int id);
    Task<Book> CreateBookAsync(CreateBookRequest request);
    Task<Book> UpdateBookAsync(int id, UpdateBookRequest request);
    Task DeleteBookAsync(int id);
}

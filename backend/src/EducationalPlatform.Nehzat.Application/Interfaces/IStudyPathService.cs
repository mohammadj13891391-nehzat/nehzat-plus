using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IStudyPathService
{
    // Admin: manage study paths
    Task<List<StudyPathDto>> GetAllStudyPathsAsync();
    Task<StudyPathDto> CreateStudyPathAsync(CreateStudyPathRequest request);
    Task<StudyPathDto> UpdateStudyPathAsync(int id, UpdateStudyPathRequest request);
    Task DeleteStudyPathAsync(int id);
    Task<StudyPathDto> GetStudyPathAsync(int id);

    // Admin: manage steps
    Task<StudyPathStepDto> AddStepAsync(int studyPathId, CreateStudyPathStepRequest request);
    Task<StudyPathStepDto> UpdateStepAsync(int stepId, UpdateStudyPathStepRequest request);
    Task DeleteStepAsync(int stepId);
    Task ReorderStepsAsync(int studyPathId, ReorderStepsRequest request);

    // Admin: manage accommodations
    Task<List<AccommodationDto>> GetAllAccommodationsAsync();
    Task<AccommodationDto> CreateAccommodationAsync(CreateAccommodationRequest request);

    // Admin: lookup data
    Task<List<AgeGroupDto>> GetAllAgeGroupsAsync();
    Task<List<SubjectAreaDto>> GetAllSubjectAreasAsync();

    // Student: browse + enroll
    Task<List<StudyPathDto>> GetAvailableStudyPathsAsync(string username);
    Task<StudentStudyPathDto> EnrollAsync(string username, int studyPathId);
    Task<List<StudentStudyPathDto>> GetMyStudyPathsAsync(string username);
    Task<StudentStudyPathDto> GetMyStudyPathAsync(string username, int enrollmentId);
    Task<StudentStudyPathDto> CompleteStepAsync(string username, int studyPathId, int stepId);
    Task<StudentStudyPathDto> SkipStepAsync(string username, int studyPathId, int stepId);

    // Analytics
    Task<StudyPathProgressAnalyticsDto> GetStudyPathProgressAsync(string username, int enrollmentId);
    Task<StudentOverallProgressDto> GetStudentOverallProgressAsync(string username);
    Task<List<CoachStudentProgressDto>> GetCoachStudentsProgressAsync(int branchId);
    Task<CoachBranchProgressDto> GetCoachBranchProgressAsync(int branchId);
}
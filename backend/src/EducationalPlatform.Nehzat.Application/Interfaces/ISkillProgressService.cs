using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ISkillProgressService
{
    Task<List<AgeGroup>> GetAllAgeGroupsAsync();
    Task<AgeGroup> CreateAgeGroupAsync(AgeGroup ageGroup);
    Task<List<StudentSkillProgress>> GetProgressByStudentAsync(int studentId);
    Task<List<StudentSkillProgress>> GetProgressByRingAsync(int ringId);
    Task<StudentSkillProgress> UpdateProgressAsync(int id, int score, string? proficiencyLevel);

    // Phase 2.3 — Level Transition
    Task<StudentProgressSummaryDto> GetProgressSummaryAsync(int studentId);

    // Phase 2.4 — Sync from Submission
    Task<StudentSkillProgress> SyncFromSubmissionAsync(int submissionId);
}

using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ISpiritualOccasionService
{
    Task<List<UserOccasionProgress>> GetProgressForUserAsync(int userId, int? occasionId, int? hijriYear);
    Task<UserOccasionProgress> MarkPracticeAsync(int userId, int occasionId, int practiceItemId, int hijriYear, bool isCompleted, string? notes);
}

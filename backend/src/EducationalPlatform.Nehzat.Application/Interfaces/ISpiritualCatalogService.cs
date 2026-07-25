using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ISpiritualCatalogService
{
    Task<List<SpiritualPracticeItem>> GetPracticesForUserAsync(int? userId, int? age, string? gender, string? role);
    Task<List<SpiritualPracticeItem>> GetAllPracticesAsync();
    Task<List<SpiritualOccasion>> GetAllOccasionsAsync();
    Task<SpiritualOccasion?> GetOccasionDetailAsync(int occasionId);
}

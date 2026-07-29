using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IHadithService
    {
        Task<List<HadithBookDto>> GetAllBooksAsync();
        Task<HadithBookDetailDto?> FindBookByIdAsync(int id);
        Task<HadithBookDto> CreateBookAsync(CreateHadithBookRequest request);
        Task<HadithBookDto> UpdateBookAsync(int id, UpdateHadithBookRequest request);
        Task DeleteBookAsync(int id);

        Task<List<HadithChapterDto>> GetChaptersByBookAsync(int bookId);
        Task<HadithChapterDetailDto?> FindChapterByIdAsync(int id);
        Task<HadithChapterDto> CreateChapterAsync(CreateHadithChapterRequest request);
        Task<HadithChapterDto> UpdateChapterAsync(int id, UpdateHadithChapterRequest request);
        Task DeleteChapterAsync(int id);

        Task<List<HadithDto>> GetHadithsByChapterAsync(int chapterId);
        Task<HadithDto?> FindHadithByIdAsync(int id);
        Task<HadithDto> CreateHadithAsync(CreateHadithRequest request);
        Task<HadithDto> UpdateHadithAsync(int id, UpdateHadithRequest request);
        Task DeleteHadithAsync(int id);

        Task<UserHadithProgressDto> GetUserProgressAsync(int userId, int hadithId);
        Task<UserHadithProgressDto> SubmitReviewAsync(int userId, SubmitReviewRequest request);
        Task<List<HadithReviewDto>> GetDueForReviewAsync(int userId, int count = 10);
        Task<Dictionary<string, int>> GetProgressSummaryAsync(int userId);

        Task<List<HadithAssessmentDto>> GetAssessmentsByChapterAsync(int chapterId);
        Task<HadithAssessmentDto> CreateAssessmentAsync(CreateHadithAssessmentRequest request);

        Task<HadithDashboardStatsDto> GetDashboardStatsAsync(int userId);
    }
}

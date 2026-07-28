using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IPersianLiteratureService
    {
        // Poet operations
        Task<List<Poet>> GetAllPoetsAsync(string? difficulty = null);
        Task<Poet?> FindPoetByIdAsync(int id);
        Task<Poet> CreatePoetAsync(CreatePoetRequest request);
        Task<Poet> UpdatePoetAsync(int id, UpdatePoetRequest request);
        Task DeletePoetAsync(int id);
        Task<List<Poet>> SearchPoetsAsync(string query, int maxResults = 20);

        // Poem operations
        Task<List<Poem>> GetAllPoemsAsync(int? poetId = null, string? genre = null, string? difficulty = null);
        Task<Poem?> FindPoemByIdAsync(int id);
        Task<Poem> CreatePoemAsync(CreatePoemRequest request);
        Task<Poem> UpdatePoemAsync(int id, UpdatePoemRequest request);
        Task DeletePoemAsync(int id);
        Task<List<Poem>> SearchPoemsAsync(string query, int maxResults = 20);

        // Analysis operations
        Task<List<PoemAnalysis>> GetAnalysesByPoemAsync(int poemId);
        Task<PoemAnalysis?> FindAnalysisByIdAsync(int id);
        Task<PoemAnalysis> CreateAnalysisAsync(CreateAnalysisRequest request);
        Task<PoemAnalysis> UpdateAnalysisAsync(int id, UpdateAnalysisRequest request);
        Task DeleteAnalysisAsync(int id);

        // Dashboard
        Task<object> GetDashboardStatsAsync();
    }
}

using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities.ArabicLiterature;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IArabicLiteratureService
    {
        // Poet operations
        Task<List<ArabicPoet>> GetAllPoetsAsync(string? difficulty = null);
        Task<ArabicPoet?> FindPoetByIdAsync(int id);
        Task<ArabicPoet> CreatePoetAsync(CreateArabicPoetRequest request);
        Task<ArabicPoet> UpdatePoetAsync(int id, UpdateArabicPoetRequest request);
        Task DeletePoetAsync(int id);
        Task<List<ArabicPoet>> SearchPoetsAsync(string query, int maxResults = 20);

        // Poem operations
        Task<List<ArabicPoem>> GetAllPoemsAsync(int? poetId = null, string? genre = null, string? difficulty = null);
        Task<ArabicPoem?> FindPoemByIdAsync(int id);
        Task<ArabicPoem> CreatePoemAsync(CreateArabicPoemRequest request);
        Task<ArabicPoem> UpdatePoemAsync(int id, UpdateArabicPoemRequest request);
        Task DeletePoemAsync(int id);
        Task<List<ArabicPoem>> SearchPoemsAsync(string query, int maxResults = 20);

        // Analysis operations
        Task<List<ArabicPoemAnalysis>> GetAnalysesByPoemAsync(int poemId);
        Task<ArabicPoemAnalysis?> FindAnalysisByIdAsync(int id);
        Task<ArabicPoemAnalysis> CreateAnalysisAsync(CreateArabicAnalysisRequest request);
        Task<ArabicPoemAnalysis> UpdateAnalysisAsync(int id, UpdateArabicAnalysisRequest request);
        Task DeleteAnalysisAsync(int id);

        // ===== Curriculum operations =====
        Task<List<ArabicCourse>> GetAllCoursesAsync(string? level = null);
        Task<ArabicCourse?> FindCourseByIdAsync(int id);
        Task<ArabicCourse> CreateCourseAsync(CreateArabicCourseRequest request);
        Task<ArabicCourse> UpdateCourseAsync(int id, UpdateArabicCourseRequest request);
        Task DeleteCourseAsync(int id);

        // Lesson operations
        Task<List<ArabicLesson>> GetLessonsByCourseAsync(int courseId);
        Task<ArabicLesson?> FindLessonByIdAsync(int id);
        Task<ArabicLesson> CreateLessonAsync(CreateArabicLessonRequest request);
        Task<ArabicLesson> UpdateLessonAsync(int id, UpdateArabicLessonRequest request);
        Task DeleteLessonAsync(int id);

        // Progress operations
        Task<List<ArabicUserProgress>> GetUserProgressAsync(int userId);
        Task<List<ArabicUserProgress>> GetUserProgressByCourseAsync(int userId, int courseId);
        Task<ArabicUserProgress> UpdateProgressAsync(int userId, UpdateArabicProgressRequest request);

        // Dashboard
        Task<object> GetDashboardStatsAsync();
    }
}

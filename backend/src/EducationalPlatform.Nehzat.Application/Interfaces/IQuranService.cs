using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Domain.Entities.Quran;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IQuranService
    {
        // Surah operations
        Task<List<Surah>> GetAllSurahsAsync();
        Task<Surah?> FindSurahByIdAsync(int id);
        Task<Surah> CreateSurahAsync(CreateSurahRequest request);
        Task<Surah> UpdateSurahAsync(int id, UpdateSurahRequest request);
        Task DeleteSurahAsync(int id);

        // Ayah operations
        Task<List<Ayah>> GetAllAyahsAsync();
        Task<List<Ayah>> GetAyahsBySurahAsync(int surahId);
        Task<Ayah?> FindAyahByIdAsync(int id);
        Task<Ayah> CreateAyahAsync(CreateAyahRequest request);
        Task<Ayah> UpdateAyahAsync(int id, UpdateAyahRequest request);
        Task DeleteAyahAsync(int id);

        // TajweedRule operations
        Task<List<TajweedRule>> GetAllTajweedRulesAsync();
        Task<TajweedRule?> FindTajweedRuleByIdAsync(int id);
        Task<TajweedRule> CreateTajweedRuleAsync(CreateTajweedRuleRequest request);
        Task<TajweedRule> UpdateTajweedRuleAsync(int id, UpdateTajweedRuleRequest request);
        Task DeleteTajweedRuleAsync(int id);

        // QuranStudentCourse operations
        Task<List<QuranStudentCourse>> GetAllQuranStudentCoursesAsync();
        Task<QuranStudentCourse?> FindQuranStudentCourseByIdAsync(int id);
        Task<QuranStudentCourse> CreateQuranStudentCourseAsync(CreateQuranStudentCourseRequest request);
        Task<QuranStudentCourse> UpdateQuranStudentCourseAsync(int id, UpdateQuranStudentCourseRequest request);
        Task DeleteQuranStudentCourseAsync(int id);

        // RecitationLevel operations
        Task<List<RecitationLevel>> GetAllRecitationLevelsAsync();
        Task<RecitationLevel?> FindRecitationLevelByIdAsync(int id);
        Task<RecitationLevel> CreateRecitationLevelAsync(CreateRecitationLevelRequest request);
        Task<RecitationLevel> UpdateRecitationLevelAsync(int id, UpdateRecitationLevelRequest request);
        Task DeleteRecitationLevelAsync(int id);

        // QuranCurriculum operations
        Task<List<QuranCurriculum>> GetAllQuranCurriculaAsync();
        Task<QuranCurriculum?> FindQuranCurriculumByIdAsync(int id);
        Task<QuranCurriculum> CreateQuranCurriculumAsync(CreateQuranCurriculumRequest request);
        Task<QuranCurriculum> UpdateQuranCurriculumAsync(int id, UpdateQuranCurriculumRequest request);
        Task DeleteQuranCurriculumAsync(int id);

        // QuranStudentProgress operations
        Task<List<QuranStudentProgress>> GetStudentProgressAsync(int studentId);
        Task<QuranStudentProgress?> FindProgressByIdAsync(int id);
        Task<QuranStudentProgress> CreateProgressAsync(int studentId, int surahId, int ayahNumber, int percentage, string notes = "");

        // Lesson plans
        Task<List<string>> GetLessonPlanFilesAsync();
        Task<string> GetLessonPlanContentAsync(string fileName);

        // Advanced features
        Task<List<Ayah>> SearchAyahsAsync(string query, int maxResults = 50);
        Task<object> GetDashboardStatsAsync();
    }
}
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities.PersianLiterature;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface ILearningService
    {
        // LearningPath operations
        Task<List<LearningPath>> GetAllPathsAsync();
        Task<LearningPath?> FindPathByIdAsync(int id);
        Task<LearningPath> CreatePathAsync(CreateLearningPathRequest request);
        Task<LearningPath> UpdatePathAsync(int id, UpdateLearningPathRequest request);
        Task DeletePathAsync(int id);

        // Full tree
        Task<LearningPathTreeDto> GetPathTreeAsync(int pathId);

        // LearningLevel operations
        Task<List<LearningLevel>> GetLevelsAsync(int pathId);
        Task<LearningLevel?> FindLevelByIdAsync(int id);
        Task<LearningLevel> CreateLevelAsync(CreateLearningLevelRequest request);
        Task<LearningLevel> UpdateLevelAsync(int id, UpdateLearningLevelRequest request);
        Task DeleteLevelAsync(int id);

        // StudyModule operations
        Task<List<StudyModule>> GetModulesAsync(int levelId);
        Task<StudyModule?> FindModuleByIdAsync(int id);
        Task<StudyModule> CreateModuleAsync(CreateStudyModuleRequest request);
        Task<StudyModule> UpdateModuleAsync(int id, UpdateStudyModuleRequest request);
        Task DeleteModuleAsync(int id);

        // StudyLesson operations
        Task<List<StudyLesson>> GetLessonsAsync(int moduleId);
        Task<StudyLesson?> FindLessonByIdAsync(int id);
        Task<StudyLesson> CreateLessonAsync(CreateStudyLessonRequest request);
        Task<StudyLesson> UpdateLessonAsync(int id, UpdateStudyLessonRequest request);
        Task DeleteLessonAsync(int id);

        // LessonContentBlock operations
        Task<List<LessonContentBlock>> GetContentBlocksAsync(int lessonId);
        Task<LessonContentBlock> CreateContentBlockAsync(CreateContentBlockRequest request);
        Task<LessonContentBlock> UpdateContentBlockAsync(int id, UpdateContentBlockRequest request);
        Task DeleteContentBlockAsync(int id);

        // Quiz operations
        Task<List<Quiz>> GetQuizzesAsync(int lessonId);
        Task<Quiz?> FindQuizByIdAsync(int id);
        Task<Quiz> CreateQuizAsync(CreateLearningQuizRequest request);
        Task<Quiz> UpdateQuizAsync(int id, UpdateLearningQuizRequest request);
        Task DeleteQuizAsync(int id);
        Task<List<QuizQuestion>> GetQuizQuestionsAsync(int quizId);

        // QuizQuestion operations
        Task<QuizQuestion> CreateQuestionAsync(CreateLearningQuizQuestionRequest request);
        Task<QuizQuestion> UpdateQuestionAsync(int id, UpdateLearningQuizQuestionRequest request);
        Task DeleteQuestionAsync(int id);

        // QuizOption operations
        Task<QuizOption> CreateOptionAsync(CreateQuizOptionRequest request);
        Task<QuizOption> UpdateOptionAsync(int id, UpdateQuizOptionRequest request);
        Task DeleteOptionAsync(int id);

        // User enrollment operations
        Task<UserEnrollment> EnrollUserAsync(EnrollUserRequest request);
        Task<List<UserEnrollment>> GetUserEnrollmentsAsync(int userId);
        Task<UserEnrollment> UpdateEnrollmentStatusAsync(int id, string status);

        // User lesson progress
        Task<UserLessonProgress> CompleteLessonAsync(int enrollmentId, int lessonId);
        Task<UserLessonProgress> UpdateLessonProgressAsync(int enrollmentId, int lessonId, string status, int? score = null);

        // Quiz submission
        Task<UserQuizAttempt> SubmitQuizAsync(SubmitQuizRequest request);
        Task<List<UserQuizAttempt>> GetUserQuizAttemptsAsync(int userId, int quizId);

        // Dashboard
        Task<UserDashboardDto> GetUserDashboardAsync(int userId);
    }
}

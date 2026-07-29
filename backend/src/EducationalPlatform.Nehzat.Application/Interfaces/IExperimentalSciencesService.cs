using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Domain.Entities.ExperimentalSciences;

namespace EducationalPlatform.Nehzat.Application.Interfaces
{
    public interface IExperimentalSciencesService
    {
        // Phase operations
        Task<List<Phase>> GetAllPhasesAsync();
        Task<Phase?> GetPhaseByIdAsync(int id);
        Task<Phase> CreatePhaseAsync(CreatePhaseRequest request);
        Task<Phase> UpdatePhaseAsync(int id, UpdatePhaseRequest request);
        Task DeletePhaseAsync(int id);

        // Topic operations
        Task<List<Topic>> GetAllTopicsAsync();
        Task<List<Topic>> GetTopicsByPhaseIdAsync(int phaseId);
        Task<Topic?> GetTopicByIdAsync(int id);
        Task<Topic> CreateTopicAsync(CreateTopicRequest request);
        Task<Topic> UpdateTopicAsync(int id, UpdateTopicRequest request);
        Task DeleteTopicAsync(int id);

        // Lesson operations
        Task<List<Lesson>> GetAllLessonsAsync();
        Task<List<Lesson>> GetLessonsByTopicIdAsync(int topicId);
        Task<Lesson?> GetLessonByIdAsync(int id);
        Task<Lesson> CreateLessonAsync(CreateLessonRequest request);
        Task<Lesson> UpdateLessonAsync(int id, UpdateLessonRequest request);
        Task DeleteLessonAsync(int id);

        // Experiment operations
        Task<List<Experiment>> GetAllExperimentsAsync();
        Task<List<Experiment>> GetExperimentsByLessonIdAsync(int lessonId);
        Task<Experiment?> GetExperimentByIdAsync(int id);
        Task<Experiment> CreateExperimentAsync(CreateExperimentRequest request);
        Task<Experiment> UpdateExperimentAsync(int id, UpdateExperimentRequest request);
        Task DeleteExperimentAsync(int id);

        // Quiz operations
        Task<List<Quiz>> GetAllQuizzesAsync();
        Task<Quiz?> GetQuizByLessonIdAsync(int lessonId);
        Task<Quiz?> GetQuizByIdAsync(int id);
        Task<Quiz> CreateQuizAsync(CreateExpSciQuizRequest request);
        Task<Quiz> UpdateQuizAsync(int id, UpdateExpSciQuizRequest request);
        Task DeleteQuizAsync(int id);

        // QuizQuestion operations
        Task<List<QuizQuestion>> GetAllQuizQuestionsAsync();
        Task<List<QuizQuestion>> GetQuestionsByQuizIdAsync(int quizId);
        Task<QuizQuestion?> GetQuizQuestionByIdAsync(int id);
        Task<QuizQuestion> CreateQuizQuestionAsync(CreateExpSciQuizQuestionRequest request);
        Task<QuizQuestion> UpdateQuizQuestionAsync(int id, UpdateExpSciQuizQuestionRequest request);
        Task DeleteQuizQuestionAsync(int id);

        // StudentProgress operations
        Task<List<StudentProgress>> GetAllStudentProgressAsync();
        Task<List<StudentProgress>> GetProgressByStudentIdAsync(int studentId);
        Task<List<StudentProgress>> GetProgressByTopicIdAsync(int topicId);
        Task<StudentProgress?> GetProgressByIdAsync(int id);
        Task<StudentProgress> CreateStudentProgressAsync(CreateStudentProgressRequest request);
        Task<StudentProgress> UpdateStudentProgressAsync(int id, UpdateStudentProgressRequest request);
        Task DeleteStudentProgressAsync(int id);
    }
}

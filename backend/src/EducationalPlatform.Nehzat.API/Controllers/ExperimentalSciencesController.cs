using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/experimental-sciences")]
[Authorize]
public class ExperimentalSciencesController : ControllerBase
{
    private readonly IExperimentalSciencesService _service;

    public ExperimentalSciencesController(IExperimentalSciencesService service)
    {
        _service = service;
    }

    // Phase endpoints
    [HttpGet("phases")]
    public async Task<IActionResult> GetAllPhases()
    {
        return Ok(await _service.GetAllPhasesAsync());
    }

    [HttpGet("phases/{id}")]
    public async Task<IActionResult> GetPhaseById(int id)
    {
        var result = await _service.FindPhaseByIdAsync(id);
        if (result == null) return NotFound(new { message = "فاز یافت نشد." });
        return Ok(result);
    }

    [HttpPost("phases")]
    public async Task<IActionResult> CreatePhase([FromBody] CreatePhaseRequest request)
    {
        try
        {
            var result = await _service.CreatePhaseAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("phases/{id}")]
    public async Task<IActionResult> UpdatePhase(int id, [FromBody] UpdatePhaseRequest request)
    {
        try
        {
            var result = await _service.UpdatePhaseAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("phases/{id}")]
    public async Task<IActionResult> DeletePhase(int id)
    {
        try
        {
            await _service.DeletePhaseAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Topic endpoints
    [HttpGet("topics")]
    public async Task<IActionResult> GetAllTopics()
    {
        return Ok(await _service.GetAllTopicsAsync());
    }

    [HttpGet("topics/by-phase/{phaseId}")]
    public async Task<IActionResult> GetTopicsByPhaseId(int phaseId)
    {
        return Ok(await _service.GetTopicsByPhaseIdAsync(phaseId));
    }

    [HttpGet("topics/{id}")]
    public async Task<IActionResult> GetTopicById(int id)
    {
        var result = await _service.FindTopicByIdAsync(id);
        if (result == null) return NotFound(new { message = "موضوع یافت نشد." });
        return Ok(result);
    }

    [HttpPost("topics")]
    public async Task<IActionResult> CreateTopic([FromBody] CreateTopicRequest request)
    {
        try
        {
            var result = await _service.CreateTopicAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("topics/{id}")]
    public async Task<IActionResult> UpdateTopic(int id, [FromBody] UpdateTopicRequest request)
    {
        try
        {
            var result = await _service.UpdateTopicAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("topics/{id}")]
    public async Task<IActionResult> DeleteTopic(int id)
    {
        try
        {
            await _service.DeleteTopicAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Lesson endpoints
    [HttpGet("lessons")]
    public async Task<IActionResult> GetAllLessons()
    {
        return Ok(await _service.GetAllLessonsAsync());
    }

    [HttpGet("lessons/by-topic/{topicId}")]
    public async Task<IActionResult> GetLessonsByTopicId(int topicId)
    {
        return Ok(await _service.GetLessonsByTopicIdAsync(topicId));
    }

    [HttpGet("lessons/{id}")]
    public async Task<IActionResult> GetLessonById(int id)
    {
        var result = await _service.FindLessonByIdAsync(id);
        if (result == null) return NotFound(new { message = "درس یافت نشد." });
        return Ok(result);
    }

    [HttpPost("lessons")]
    public async Task<IActionResult> CreateLesson([FromBody] CreateLessonRequest request)
    {
        try
        {
            var result = await _service.CreateLessonAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("lessons/{id}")]
    public async Task<IActionResult> UpdateLesson(int id, [FromBody] UpdateLessonRequest request)
    {
        try
        {
            var result = await _service.UpdateLessonAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("lessons/{id}")]
    public async Task<IActionResult> DeleteLesson(int id)
    {
        try
        {
            await _service.DeleteLessonAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Experiment endpoints
    [HttpGet("experiments")]
    public async Task<IActionResult> GetAllExperiments()
    {
        return Ok(await _service.GetAllExperimentsAsync());
    }

    [HttpGet("experiments/by-lesson/{lessonId}")]
    public async Task<IActionResult> GetExperimentsByLessonId(int lessonId)
    {
        return Ok(await _service.GetExperimentsByLessonIdAsync(lessonId));
    }

    [HttpGet("experiments/{id}")]
    public async Task<IActionResult> GetExperimentById(int id)
    {
        var result = await _service.FindExperimentByIdAsync(id);
        if (result == null) return NotFound(new { message = "آزمایش یافت نشد." });
        return Ok(result);
    }

    [HttpPost("experiments")]
    public async Task<IActionResult> CreateExperiment([FromBody] CreateExperimentRequest request)
    {
        try
        {
            var result = await _service.CreateExperimentAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("experiments/{id}")]
    public async Task<IActionResult> UpdateExperiment(int id, [FromBody] UpdateExperimentRequest request)
    {
        try
        {
            var result = await _service.UpdateExperimentAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("experiments/{id}")]
    public async Task<IActionResult> DeleteExperiment(int id)
    {
        try
        {
            await _service.DeleteExperimentAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Quiz endpoints
    [HttpGet("quizzes")]
    public async Task<IActionResult> GetAllQuizzes()
    {
        return Ok(await _service.GetAllQuizzesAsync());
    }

    [HttpGet("quizzes/by-lesson/{lessonId}")]
    public async Task<IActionResult> GetQuizByLessonId(int lessonId)
    {
        var result = await _service.FindQuizByLessonIdAsync(lessonId);
        if (result == null) return NotFound(new { message = "آزمون یافت نشد." });
        return Ok(result);
    }

    [HttpGet("quizzes/{id}")]
    public async Task<IActionResult> GetQuizById(int id)
    {
        var result = await _service.FindQuizByIdAsync(id);
        if (result == null) return NotFound(new { message = "آزمون یافت نشد." });
        return Ok(result);
    }

    [HttpPost("quizzes")]
    public async Task<IActionResult> CreateQuiz([FromBody] CreateExpSciQuizRequest request)
    {
        try
        {
            var result = await _service.CreateQuizAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("quizzes/{id}")]
    public async Task<IActionResult> UpdateQuiz(int id, [FromBody] UpdateExpSciQuizRequest request)
    {
        try
        {
            var result = await _service.UpdateQuizAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("quizzes/{id}")]
    public async Task<IActionResult> DeleteQuiz(int id)
    {
        try
        {
            await _service.DeleteQuizAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // QuizQuestion endpoints
    [HttpGet("quiz-questions")]
    public async Task<IActionResult> GetAllQuizQuestions()
    {
        return Ok(await _service.GetAllQuizQuestionsAsync());
    }

    [HttpGet("quiz-questions/by-quiz/{quizId}")]
    public async Task<IActionResult> GetQuestionsByQuizId(int quizId)
    {
        return Ok(await _service.GetQuestionsByQuizIdAsync(quizId));
    }

    [HttpGet("quiz-questions/{id}")]
    public async Task<IActionResult> GetQuizQuestionById(int id)
    {
        var result = await _service.FindQuizQuestionByIdAsync(id);
        if (result == null) return NotFound(new { message = "سوال یافت نشد." });
        return Ok(result);
    }

    [HttpPost("quiz-questions")]
    public async Task<IActionResult> CreateQuizQuestion([FromBody] CreateExpSciQuizQuestionRequest request)
    {
        try
        {
            var result = await _service.CreateQuizQuestionAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("quiz-questions/{id}")]
    public async Task<IActionResult> UpdateQuizQuestion(int id, [FromBody] UpdateExpSciQuizQuestionRequest request)
    {
        try
        {
            var result = await _service.UpdateQuizQuestionAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("quiz-questions/{id}")]
    public async Task<IActionResult> DeleteQuizQuestion(int id)
    {
        try
        {
            await _service.DeleteQuizQuestionAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // StudentProgress endpoints
    [HttpGet("progress")]
    public async Task<IActionResult> GetAllStudentProgress()
    {
        return Ok(await _service.GetAllStudentProgressAsync());
    }

    [HttpGet("progress/by-student/{studentId}")]
    public async Task<IActionResult> GetProgressByStudentId(int studentId)
    {
        return Ok(await _service.GetProgressByStudentIdAsync(studentId));
    }

    [HttpGet("progress/by-topic/{topicId}")]
    public async Task<IActionResult> GetProgressByTopicId(int topicId)
    {
        return Ok(await _service.GetProgressByTopicIdAsync(topicId));
    }

    [HttpGet("progress/{id}")]
    public async Task<IActionResult> GetStudentProgressById(int id)
    {
        var result = await _service.FindStudentProgressByIdAsync(id);
        if (result == null) return NotFound(new { message = "پیشرفت یافت نشد." });
        return Ok(result);
    }

    [HttpPost("progress")]
    public async Task<IActionResult> CreateStudentProgress([FromBody] CreateStudentProgressRequest request)
    {
        try
        {
            var result = await _service.CreateStudentProgressAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("progress/{id}")]
    public async Task<IActionResult> UpdateStudentProgress(int id, [FromBody] UpdateStudentProgressRequest request)
    {
        try
        {
            var result = await _service.UpdateStudentProgressAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("progress/{id}")]
    public async Task<IActionResult> DeleteStudentProgress(int id)
    {
        try
        {
            await _service.DeleteStudentProgressAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Dashboard stats (public)
    [HttpGet("dashboard-stats")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDashboardStats()
    {
        var phases = await _service.GetAllPhasesAsync();
        var topics = await _service.GetAllTopicsAsync();
        var lessons = await _service.GetAllLessonsAsync();
        var progress = await _service.GetAllStudentProgressAsync();

        return Ok(new
        {
            totalPhases = phases.Count,
            totalTopics = topics.Count,
            totalLessons = lessons.Count,
            totalStudents = progress.Select(p => p.StudentId).Distinct().Count(),
            completedTopics = progress.Count(p => p.Status == Domain.Entities.ExperimentalSciences.ProgressStatus.Completed),
            averageScore = progress.Any() ? progress.Average(p => p.Score) : 0
        });
    }
}

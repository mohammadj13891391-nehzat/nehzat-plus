using Microsoft.AspNetCore.Mvc;
using LessonPlanner.Api.Models;
using LessonPlanner.Api.Services;
using LessonPlanner.Api.DTOs;

namespace LessonPlanner.Api.Controllers;

[ApiController]
[Route("assessments")]
public class AssessmentController : ControllerBase
{
    private readonly IAssessmentService _assessmentService;

    public AssessmentController(IAssessmentService assessmentService)
    {
        _assessmentService = assessmentService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Assessment assessment)
    {
        var result = await _assessmentService.CreateAsync(assessment);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _assessmentService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _assessmentService.FindByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Assessment assessment)
    {
        try
        {
            var result = await _assessmentService.UpdateAsync(id, assessment);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _assessmentService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("course/{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId)
    {
        var result = await _assessmentService.GetByCourseAsync(courseId);
        return Ok(result);
    }

    [HttpGet("course/{courseId}/date-range")]
    public async Task<IActionResult> GetByCourseAndDateRange(int courseId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var result = await _assessmentService.GetByCourseAndDateRangeAsync(courseId, startDate, endDate);
        return Ok(result);
    }

    [HttpGet("status/{status}")]
    public async Task<IActionResult> GetByStatus(string status)
    {
        var result = await _assessmentService.GetByStatusAsync(status);
        return Ok(result);
    }

    [HttpPost("generate-weekly")]
    public async Task<IActionResult> GenerateWeekly([FromBody] GenerateWeeklyAssessmentRequest request)
    {
        try
        {
            var result = await _assessmentService.GenerateWeeklyAssessmentAsync(
                request.CourseId,
                request.GeneratedByUserId,
                request.Title,
                request.Description,
                request.DurationMinutes,
                request.MaxScore,
                request.AssessmentDate,
                request.Criteria ?? new Dictionary<string, object>());
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/questions")]
    public async Task<IActionResult> GetQuestions(int id)
    {
        var result = await _assessmentService.GetQuestionsAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/questions")]
    public async Task<IActionResult> CreateQuestion(int id, [FromBody] AssessmentQuestion question)
    {
        question.AssessmentId = id;
        var result = await _assessmentService.CreateQuestionAsync(question);
        return Ok(result);
    }

    [HttpPut("questions/{questionId}")]
    public async Task<IActionResult> UpdateQuestion(int questionId, [FromBody] AssessmentQuestion question)
    {
        try
        {
            var result = await _assessmentService.UpdateQuestionAsync(questionId, question);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("questions/{questionId}")]
    public async Task<IActionResult> DeleteQuestion(int questionId)
    {
        await _assessmentService.DeleteQuestionAsync(questionId);
        return NoContent();
    }

    [HttpPost("{id}/submit")]
    public async Task<IActionResult> SubmitResult(int id, [FromBody] SubmitAssessmentResultRequest request)
    {
        var result = new AssessmentResult
        {
            AssessmentId = id,
            StudentId = request.StudentId,
            CompletedAt = request.CompletedAt,
            Score = request.Score,
            MaxPossibleScore = request.MaxPossibleScore,
            Percentage = request.Percentage,
            Status = request.Status,
            AnswersJson = request.AnswersJson,
            Feedback = request.Feedback,
            TimeSpentMinutes = request.TimeSpentMinutes,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var created = await _assessmentService.CreateResultAsync(result);
        return Ok(created);
    }

    [HttpGet("{id}/results")]
    public async Task<IActionResult> GetResults(int id)
    {
        var result = await _assessmentService.GetResultsAsync(id);
        return Ok(result);
    }

    [HttpGet("student/{studentId}/results")]
    public async Task<IActionResult> GetResultsByStudent(int studentId)
    {
        var result = await _assessmentService.GetResultsByStudentAsync(studentId);
        return Ok(result);
    }

    [HttpGet("{id}/analytics")]
    public async Task<IActionResult> GetAnalytics(int id)
    {
        var result = await _assessmentService.GetAssessmentAnalyticsAsync(id);
        return Ok(result);
    }

    [HttpGet("student/{studentId}/course/{courseId}/history")]
    public async Task<IActionResult> GetStudentHistory(int studentId, int courseId)
    {
        var result = await _assessmentService.GetStudentAssessmentHistoryAsync(studentId, courseId);
        return Ok(result);
    }
}
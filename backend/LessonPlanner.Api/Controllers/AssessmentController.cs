using Microsoft.AspNetCore.Mvc;
using LessonPlanner.Api.Models;
using LessonPlanner.Api.Services;
using LessonPlanner.Api.DTOs;
using System.Security.Claims;
using System.Text.Json;

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
    public async Task<IActionResult> Update(int id, [FromBody] UpdateAssessmentRequest request)
    {
        try
        {
            // Map DTO to minimal Assessment object — only non-null fields are passed
            var assessmentUpdate = new Assessment();
            if (request.Title != null) assessmentUpdate.Title = request.Title;
            if (request.Description != null) assessmentUpdate.Description = request.Description;
            if (request.Type != null) assessmentUpdate.Type = request.Type;
            if (request.MaxScore.HasValue) assessmentUpdate.MaxScore = request.MaxScore.Value;
            if (request.DurationMinutes.HasValue) assessmentUpdate.DurationMinutes = request.DurationMinutes.Value;
            if (request.AssessmentDate.HasValue) assessmentUpdate.AssessmentDate = request.AssessmentDate.Value;
            if (request.Status != null) assessmentUpdate.Status = request.Status;
            if (request.Instructions != null) assessmentUpdate.Instructions = request.Instructions;
            if (request.Criteria != null) assessmentUpdate.GenerationCriteria = JsonSerializer.Serialize(request.Criteria);

            var result = await _assessmentService.UpdateAsync(id, assessmentUpdate);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Assessment not found" });
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
            // Extract user ID from JWT claims so the client doesn't need to send it
            var userIdClaim = User.FindFirstValue("userId");
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "User ID not found in token." });

            var result = await _assessmentService.GenerateWeeklyAssessmentAsync(
                request.CourseId,
                userId,
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
            var detail = ex.InnerException?.Message ?? ex.Message;
            return BadRequest(new { message = detail });
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

    [HttpPost("{id}/archive")]
    public async Task<IActionResult> Archive(int id)
    {
        try
        {
            var result = await _assessmentService.UpdateAsync(id, new Assessment { Status = "archived" });
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "Assessment not found" });
        }
    }

    [HttpPost("{id}/start/{studentId}")]
    public async Task<IActionResult> StartAssessment(int id, int studentId)
    {
        var existing = await _assessmentService.GetResultByAssessmentAndStudentAsync(id, studentId);
        if (existing != null)
        {
            return Ok(existing);
        }

        var assessment = await _assessmentService.FindByIdAsync(id);
        if (assessment == null)
            return NotFound(new { message = "Assessment not found" });

        var result = new AssessmentResult
        {
            AssessmentId = id,
            StudentId = studentId,
            Status = "in_progress",
            Score = 0,
            MaxPossibleScore = assessment.MaxScore,
            Percentage = 0,
            CompletedAt = DateTime.UtcNow,
            TimeSpentMinutes = 0,
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
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities.Math;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/math")]
[Authorize]
public class MathController : ControllerBase
{
    private readonly IMathService _service;

    public MathController(IMathService service)
    {
        _service = service;
    }

    [HttpGet("topics")]
    public async Task<IActionResult> GetAllTopics()
    {
        var result = await _service.GetAllTopicsAsync();
        return Ok(result);
    }

    [HttpGet("topics/{id}")]
    public async Task<IActionResult> GetTopicById(int id)
    {
        var result = await _service.FindTopicByIdAsync(id);
        if (result == null) return NotFound(new { message = "نظام‌بندی ریاضی یافت نشد" });
        return Ok(result);
    }

    [HttpPost("topics")]
    public async Task<IActionResult> CreateTopic([FromBody] MathTopic topic)
    {
        var result = await _service.CreateTopicAsync(topic);
        return Ok(result);
    }

    [HttpPut("topics/{id}")]
    public async Task<IActionResult> UpdateTopic(int id, [FromBody] MathTopic topic)
    {
        try
        {
            var result = await _service.UpdateTopicAsync(id, topic);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "نظام‌بندی ریاضی یافت نشد" });
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
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "نظام‌بندی ریاضی یافت نشد" });
        }
    }

    [HttpGet("topics/search")]
    public async Task<IActionResult> SearchTopics([FromQuery] string query, [FromQuery] int maxResults = 10)
    {
        var result = await _service.SearchTopicsAsync(query, maxResults);
        return Ok(result);
    }

    [HttpGet("lessons")]
    public async Task<IActionResult> GetAllLessons([FromQuery] int? topicId)
    {
        var result = await _service.GetAllLessonsAsync(topicId);
        return Ok(result);
    }

    [HttpGet("lessons/{id}")]
    public async Task<IActionResult> GetLessonById(int id)
    {
        var result = await _service.FindLessonByIdAsync(id);
        if (result == null) return NotFound(new { message = "درس ریاضی یافت نشد" });
        return Ok(result);
    }

    [HttpPost("lessons")]
    public async Task<IActionResult> CreateLesson([FromBody] MathLesson lesson)
    {
        var result = await _service.CreateLessonAsync(lesson);
        return Ok(result);
    }

    [HttpPut("lessons/{id}")]
    public async Task<IActionResult> UpdateLesson(int id, [FromBody] MathLesson lesson)
    {
        try
        {
            var result = await _service.UpdateLessonAsync(id, lesson);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "درس ریاضی یافت نشد" });
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
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "درس ریاضی یافت نشد" });
        }
    }

    [HttpGet("lessons/search")]
    public async Task<IActionResult> SearchLessons([FromQuery] string query, [FromQuery] int maxResults = 10)
    {
        var result = await _service.SearchLessonsAsync(query, maxResults);
        return Ok(result);
    }

    [HttpGet("questions")]
    public async Task<IActionResult> GetAllQuestions([FromQuery] int? lessonId)
    {
        var result = await _service.GetAllQuestionsAsync(lessonId);
        return Ok(result);
    }

    [HttpGet("questions/{id}")]
    public async Task<IActionResult> GetQuestionById(int id)
    {
        var result = await _service.FindQuestionByIdAsync(id);
        if (result == null) return NotFound(new { message = "سؤال ریاضی یافت نشد" });
        return Ok(result);
    }

    [HttpPost("questions")]
    public async Task<IActionResult> CreateQuestion([FromBody] MathQuestion question)
    {
        var result = await _service.CreateQuestionAsync(question);
        return Ok(result);
    }

    [HttpPut("questions/{id}")]
    public async Task<IActionResult> UpdateQuestion(int id, [FromBody] MathQuestion question)
    {
        try
        {
            var result = await _service.UpdateQuestionAsync(id, question);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "سؤال ریاضی یافت نشد" });
        }
    }

    [HttpDelete("questions/{id}")]
    public async Task<IActionResult> DeleteQuestion(int id)
    {
        try
        {
            await _service.DeleteQuestionAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "سؤال ریاضی یافت نشد" });
        }
    }

    [HttpGet("progress/{studentId}")]
    public async Task<IActionResult> GetStudentProgress(int studentId)
    {
        var result = await _service.GetStudentProgressAsync(studentId);
        return Ok(result);
    }

    [HttpGet("progress/{studentId}/lesson/{lessonId}")]
    public async Task<IActionResult> GetStudentLessonProgress(int studentId, int lessonId)
    {
        var result = await _service.GetStudentLessonProgressAsync(studentId, lessonId);
        if (result == null) return NotFound(new { message = "پیشرفت ریاضی یافت نشد" });
        return Ok(result);
    }

    [HttpPost("progress")]
    public async Task<IActionResult> RecordProgress([FromBody] MathProgress progress)
    {
        var result = await _service.RecordProgressAsync(progress);
        return Ok(result);
    }

    [HttpPut("progress/{id}")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] MathProgress progress)
    {
        try
        {
            var result = await _service.UpdateProgressAsync(id, progress);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "پیشرفت ریاضی یافت نشد" });
        }
    }

    [HttpGet("scholars")]
    public async Task<IActionResult> GetAllScholars()
    {
        var result = await _service.GetAllScholarsAsync();
        return Ok(result);
    }

    [HttpGet("scholars/{id}")]
    public async Task<IActionResult> GetScholarById(int id)
    {
        var result = await _service.FindScholarByIdAsync(id);
        if (result == null) return NotFound(new { message = "دانشمند ریاضی یافت نشد" });
        return Ok(result);
    }

    [HttpPost("scholars")]
    public async Task<IActionResult> CreateScholar([FromBody] MathScholar scholar)
    {
        var result = await _service.CreateScholarAsync(scholar);
        return Ok(result);
    }

    [HttpPut("scholars/{id}")]
    public async Task<IActionResult> UpdateScholar(int id, [FromBody] MathScholar scholar)
    {
        try
        {
            var result = await _service.UpdateScholarAsync(id, scholar);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "دانشمند ریاضی یافت نشد" });
        }
    }

    [HttpDelete("scholars/{id}")]
    public async Task<IActionResult> DeleteScholar(int id)
    {
        try
        {
            await _service.DeleteScholarAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "دانشمند ریاضی یافت نشد" });
        }
    }

    [HttpGet("scholars/search")]
    public async Task<IActionResult> SearchScholars([FromQuery] string query, [FromQuery] int maxResults = 10)
    {
        var result = await _service.SearchScholarsAsync(query, maxResults);
        return Ok(result);
    }

    [HttpGet("contributions/topic/{topicId}")]
    public async Task<IActionResult> GetContributionsByTopic(int topicId)
    {
        var result = await _service.GetContributionsByTopicAsync(topicId);
        return Ok(result);
    }

    [HttpGet("contributions/scholar/{scholarId}")]
    public async Task<IActionResult> GetContributionsByScholar(int scholarId)
    {
        var result = await _service.GetContributionsByScholarAsync(scholarId);
        return Ok(result);
    }

    [HttpPost("contributions")]
    public async Task<IActionResult> CreateContribution([FromBody] MathContribution contribution)
    {
        var result = await _service.CreateContributionAsync(contribution);
        return Ok(result);
    }

    [HttpPut("contributions/{id}")]
    public async Task<IActionResult> UpdateContribution(int id, [FromBody] MathContribution contribution)
    {
        try
        {
            var result = await _service.UpdateContributionAsync(id, contribution);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "مشارکت ریاضی یافت نشد" });
        }
    }

    [HttpDelete("contributions/{id}")]
    public async Task<IActionResult> DeleteContribution(int id)
    {
        try
        {
            await _service.DeleteContributionAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "مشارکت ریاضی یافت نشد" });
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var result = await _service.GetDashboardStatsAsync();
        return Ok(result);
    }
}

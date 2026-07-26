using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("issue-surveys")]
[Authorize]
public class IssueSurveyController : ControllerBase
{
    private readonly IIssueSurveyService _issueSurveyService;

    public IssueSurveyController(IIssueSurveyService issueSurveyService)
    {
        _issueSurveyService = issueSurveyService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IssueSurvey survey)
    {
        var result = await _issueSurveyService.CreateSurveyAsync(survey);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _issueSurveyService.GetAllSurveysAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _issueSurveyService.FindSurveyByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] IssueSurvey survey)
    {
        try
        {
            var result = await _issueSurveyService.UpdateSurveyAsync(id, survey);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _issueSurveyService.DeleteSurveyAsync(id);
        return NoContent();
    }

    [HttpPost("{id}/publish")]
    public async Task<IActionResult> Publish(int id)
    {
        try
        {
            var result = await _issueSurveyService.PublishSurveyAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/close")]
    public async Task<IActionResult> Close(int id)
    {
        try
        {
            var result = await _issueSurveyService.CloseSurveyAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPost("{id}/duplicate")]
    public async Task<IActionResult> Duplicate(int id)
    {
        try
        {
            var result = await _issueSurveyService.DuplicateSurveyAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("{id}/questions")]
    public async Task<IActionResult> GetQuestions(int id)
    {
        var result = await _issueSurveyService.GetQuestionsAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/questions")]
    public async Task<IActionResult> CreateQuestion(int id, [FromBody] IssueSurveyQuestion question)
    {
        question.SurveyId = id;
        var result = await _issueSurveyService.CreateQuestionAsync(question);
        return Ok(result);
    }

    [HttpPut("{id}/questions/{qid}")]
    public async Task<IActionResult> UpdateQuestion(int id, int qid, [FromBody] IssueSurveyQuestion question)
    {
        try
        {
            var result = await _issueSurveyService.UpdateQuestionAsync(qid, question);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}/questions/{qid}")]
    public async Task<IActionResult> DeleteQuestion(int id, int qid)
    {
        await _issueSurveyService.DeleteQuestionAsync(qid);
        return NoContent();
    }

    [HttpPost("{id}/questions/reorder")]
    public async Task<IActionResult> ReorderQuestions(int id, [FromBody] List<int> questionIds)
    {
        await _issueSurveyService.ReorderQuestionsAsync(id, questionIds);
        return Ok();
    }

    [HttpGet("{id}/respond")]
    public async Task<IActionResult> GetForRespond(int id)
    {
        var survey = await _issueSurveyService.FindSurveyByIdAsync(id);
        if (survey == null) return NotFound();
        if (survey.Status != "active") return BadRequest(new { message = "این نظرسنجی فعال نیست" });
        return Ok(survey);
    }

    [HttpPost("{id}/respond")]
    public async Task<IActionResult> SubmitResponses(int id, [FromBody] List<IssueSurveyResponse> responses)
    {
        var results = new List<IssueSurveyResponse>();
        foreach (var response in responses)
        {
            response.SurveyId = id;
            var result = await _issueSurveyService.SubmitResponseAsync(response);
            results.Add(result);
        }
        return Ok(results);
    }

    [HttpGet("{id}/analytics")]
    public async Task<IActionResult> GetAnalytics(int id)
    {
        try
        {
            var result = await _issueSurveyService.GetSurveyAnalyticsAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("{id}/analytics/categories")]
    public async Task<IActionResult> GetCategoryBreakdown(int id)
    {
        try
        {
            var result = await _issueSurveyService.GetCategoryBreakdownAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("{id}/analytics/trends")]
    public async Task<IActionResult> GetTrends()
    {
        var result = await _issueSurveyService.GetSurveyTrendsAsync();
        return Ok(result);
    }

    [HttpGet("{id}/export/json")]
    public async Task<IActionResult> ExportJson(int id)
    {
        try
        {
            var result = await _issueSurveyService.ExportSurveyDataAsync(id, "json");
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpGet("{id}/comments")]
    public async Task<IActionResult> GetComments(int id)
    {
        var result = await _issueSurveyService.GetSurveyCommentsAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/comments")]
    public async Task<IActionResult> AddComment(int id, [FromBody] IssueSurveyComment comment)
    {
        comment.SurveyId = id;
        var result = await _issueSurveyService.AddCommentAsync(comment);
        return Ok(result);
    }

    [HttpGet("{id}/actions")]
    public async Task<IActionResult> GetActions(int id)
    {
        var result = await _issueSurveyService.GetSurveyActionsAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/actions")]
    public async Task<IActionResult> CreateAction(int id, [FromBody] IssueAction action)
    {
        action.SurveyId = id;
        var result = await _issueSurveyService.CreateActionAsync(action);
        return Ok(result);
    }
}

[ApiController]
[Route("issue-item-pool")]
[Authorize]
public class IssueItemPoolController : ControllerBase
{
    private readonly IIssueSurveyService _issueSurveyService;

    public IssueItemPoolController(IIssueSurveyService issueSurveyService)
    {
        _issueSurveyService = issueSurveyService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var result = await _issueSurveyService.GetAllPoolItemsAsync(category);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] IssueItemPool item)
    {
        var result = await _issueSurveyService.CreatePoolItemAsync(item);
        return Ok(result);
    }

    [HttpPost("{poolItemId}/use-in-survey")]
    public async Task<IActionResult> AddToSurvey(int poolItemId, [FromQuery] int surveyId, [FromQuery] int sortOrder = 0)
    {
        try
        {
            var result = await _issueSurveyService.AddPoolItemToSurveyAsync(poolItemId, surveyId, sortOrder);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

[ApiController]
[Route("issue-actions")]
[Authorize]
public class IssueActionController : ControllerBase
{
    private readonly IIssueSurveyService _issueSurveyService;

    public IssueActionController(IIssueSurveyService issueSurveyService)
    {
        _issueSurveyService = issueSurveyService;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] IssueAction action)
    {
        try
        {
            var result = await _issueSurveyService.UpdateActionAsync(id, action);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromQuery] string status, [FromQuery] int updatedById, [FromQuery] string? note, [FromQuery] int? progressPercent)
    {
        try
        {
            var result = await _issueSurveyService.UpdateActionStatusAsync(id, status, updatedById, note ?? "", progressPercent);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}

[ApiController]
[Route("issue-dashboard")]
[Authorize]
public class IssueDashboardController : ControllerBase
{
    private readonly IIssueSurveyService _issueSurveyService;

    public IssueDashboardController(IIssueSurveyService issueSurveyService)
    {
        _issueSurveyService = issueSurveyService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var result = await _issueSurveyService.GetIssueDashboardSummaryAsync();
        return Ok(result);
    }
}

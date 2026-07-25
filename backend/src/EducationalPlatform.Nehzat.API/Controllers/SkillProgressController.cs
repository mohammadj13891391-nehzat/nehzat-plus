using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("skill-progress")]
[Authorize]
public class SkillProgressController : ControllerBase
{
    private readonly ISkillProgressService _service;

    public SkillProgressController(ISkillProgressService service)
    {
        _service = service;
    }

    [HttpGet("age-groups")]
    public async Task<IActionResult> GetAgeGroups()
    {
        var groups = await _service.GetAllAgeGroupsAsync();
        return Ok(groups);
    }

    [HttpPost("age-groups")]
    public async Task<IActionResult> CreateAgeGroup([FromBody] AgeGroup ageGroup)
    {
        try
        {
            var result = await _service.CreateAgeGroupAsync(ageGroup);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("students/{studentId}")]
    public async Task<IActionResult> GetProgressByStudent(int studentId)
    {
        var progress = await _service.GetProgressByStudentAsync(studentId);
        return Ok(progress);
    }

    [HttpGet("rings/{ringId}")]
    public async Task<IActionResult> GetProgressByRing(int ringId)
    {
        var progress = await _service.GetProgressByRingAsync(ringId);
        return Ok(progress);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProgress(int id, [FromBody] Application.DTOs.UpdateSkillProgressRequest request)
    {
        try
        {
            var result = await _service.UpdateProgressAsync(id, request.Score ?? 0, request.ProficiencyLevel);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("students/{studentId}/summary")]
    public async Task<IActionResult> GetProgressSummary(int studentId)
    {
        var summary = await _service.GetProgressSummaryAsync(studentId);
        return Ok(summary);
    }

    [HttpPost("sync-from-submission/{submissionId}")]
    public async Task<IActionResult> SyncFromSubmission(int submissionId)
    {
        try
        {
            var result = await _service.SyncFromSubmissionAsync(submissionId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/teachers")]
[Authorize(Roles = "admin,manager,headquarters,coach")]
public class TeacherController : ControllerBase
{
    private readonly ITeacherService _teacherService;

    public TeacherController(ITeacherService teacherService)
    {
        _teacherService = teacherService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _teacherService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _teacherService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "استاد پیدا نشد." });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Create([FromBody] CreateTeacherRequest request)
    {
        try
        {
            var result = await _teacherService.CreateAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTeacherRequest request)
    {
        try
        {
            var result = await _teacherService.UpdateAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _teacherService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("by-course/{courseId}")]
    public async Task<IActionResult> GetByCourse(int courseId)
    {
        return Ok(await _teacherService.GetByCourseAsync(courseId));
    }

    [HttpGet("dashboard-summary/{teacherId}")]
    [Authorize(Roles = "admin,manager,headquarters,teacher")]
    public async Task<IActionResult> GetDashboardSummary(int teacherId)
    {
        try
        {
            var result = await _teacherService.GetDashboardSummaryAsync(teacherId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("grade")]
    [Authorize(Roles = "admin,manager,headquarters,teacher")]
    public async Task<IActionResult> GradeSubmission([FromBody] GradeSubmissionRequest request)
    {
        try
        {
            var result = await _teacherService.GradeSubmissionAsync(request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("gradings/{teacherId}")]
    [Authorize(Roles = "admin,manager,headquarters,teacher")]
    public async Task<IActionResult> GetGradings(int teacherId)
    {
        return Ok(await _teacherService.GetGradingsByTeacherAsync(teacherId));
    }

    [HttpGet("pending-gradings/{teacherId}")]
    [Authorize(Roles = "admin,manager,headquarters,teacher")]
    public async Task<IActionResult> GetPendingGradings(int teacherId)
    {
        return Ok(await _teacherService.GetPendingGradingsAsync(teacherId));
    }
}
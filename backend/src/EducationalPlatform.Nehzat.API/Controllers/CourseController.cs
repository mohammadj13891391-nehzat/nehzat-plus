using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.Constants;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("courses")]
[Authorize(Roles = "admin,manager,headquarters")]
public class CourseController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        var role = User.FindFirst("role")?.Value;

        if (role != "admin" && role != "manager" && role != "headquarters")
            return Ok(new { message = "دسترسی محدود", data = (object)null });

        // For admin/manager/headquarters - would call service here
        // TODO: Uncomment and implement when stats service is ready
        return Ok(new { message = "آماده است", data = (object)null });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Course course)
    {
        var result = await _courseService.CreateAsync(course);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _courseService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var result = await _courseService.GetActiveCoursesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _courseService.FindByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("{id}/assignments")]
    public async Task<IActionResult> GetAssignments(int id)
    {
        var result = await _courseService.GetCourseAssignmentsAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/assignments")]
    public async Task<IActionResult> CreateAssignment(int id, [FromBody] Assignment assignment)
    {
        var result = await _courseService.CreateAssignmentAsync(id, assignment);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Course course)
    {
        try
        {
            var result = await _courseService.UpdateAsync(id, course);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = GenericErrorMessages.ServerError });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _courseService.DeleteAsync(id);
        return NoContent();
    }
}

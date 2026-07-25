using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("curriculum")]
[Authorize(Roles = "admin,manager,headquarters")]
public class CurriculumController : ControllerBase
{
    private readonly ICurriculumService _service;

    public CurriculumController(ICurriculumService service)
    {
        _service = service;
    }

    [HttpGet("subject-areas")]
    public async Task<IActionResult> GetAllSubjectAreas()
    {
        return Ok(await _service.GetAllSubjectAreasAsync());
    }

    [HttpGet("subject-areas/{id}")]
    public async Task<IActionResult> GetSubjectAreaById(int id)
    {
        var result = await _service.FindSubjectAreaByIdAsync(id);
        if (result == null) return NotFound(new { message = "حوزه درسی پیدا نشد." });
        return Ok(result);
    }

    [HttpPost("subject-areas")]
    public async Task<IActionResult> CreateSubjectArea([FromBody] CreateSubjectAreaRequest request)
    {
        try
        {
            var result = await _service.CreateSubjectAreaAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("subject-areas/{id}")]
    public async Task<IActionResult> UpdateSubjectArea(int id, [FromBody] UpdateSubjectAreaRequest request)
    {
        try
        {
            var result = await _service.UpdateSubjectAreaAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("subject-areas/{id}")]
    public async Task<IActionResult> DeleteSubjectArea(int id)
    {
        try
        {
            await _service.DeleteSubjectAreaAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("teaching-methods")]
    public async Task<IActionResult> GetAllTeachingMethods()
    {
        return Ok(await _service.GetAllTeachingMethodsAsync());
    }

    [HttpGet("teaching-methods/{id}")]
    public async Task<IActionResult> GetTeachingMethodById(int id)
    {
        var result = await _service.FindTeachingMethodByIdAsync(id);
        if (result == null) return NotFound(new { message = "روش تدریس پیدا نشد." });
        return Ok(result);
    }

    [HttpPost("teaching-methods")]
    public async Task<IActionResult> CreateTeachingMethod([FromBody] CreateTeachingMethodRequest request)
    {
        try
        {
            var result = await _service.CreateTeachingMethodAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("teaching-methods/{id}")]
    public async Task<IActionResult> UpdateTeachingMethod(int id, [FromBody] UpdateTeachingMethodRequest request)
    {
        try
        {
            var result = await _service.UpdateTeachingMethodAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("teaching-methods/{id}")]
    public async Task<IActionResult> DeleteTeachingMethod(int id)
    {
        try
        {
            await _service.DeleteTeachingMethodAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("objectives")]
    public async Task<IActionResult> GetAllObjectives()
    {
        return Ok(await _service.GetAllObjectivesAsync());
    }

    [HttpGet("objectives/{id}")]
    public async Task<IActionResult> GetObjectiveById(int id)
    {
        var result = await _service.FindObjectiveByIdAsync(id);
        if (result == null) return NotFound(new { message = "هدف تربیتی پیدا نشد." });
        return Ok(result);
    }

    [HttpPost("objectives")]
    public async Task<IActionResult> CreateObjective([FromBody] CreateCurriculumObjectiveRequest request)
    {
        try
        {
            var result = await _service.CreateObjectiveAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("objectives/{id}")]
    public async Task<IActionResult> UpdateObjective(int id, [FromBody] UpdateCurriculumObjectiveRequest request)
    {
        try
        {
            var result = await _service.UpdateObjectiveAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("objectives/{id}")]
    public async Task<IActionResult> DeleteObjective(int id)
    {
        try
        {
            await _service.DeleteObjectiveAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("books")]
    public async Task<IActionResult> GetAllBooks()
    {
        return Ok(await _service.GetAllBooksAsync());
    }

    [HttpGet("books/{id}")]
    public async Task<IActionResult> GetBookById(int id)
    {
        var result = await _service.FindBookByIdAsync(id);
        if (result == null) return NotFound(new { message = "کتاب پیدا نشد." });
        return Ok(result);
    }

    [HttpPost("books")]
    public async Task<IActionResult> CreateBook([FromBody] CreateBookRequest request)
    {
        try
        {
            var result = await _service.CreateBookAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("books/{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateBookRequest request)
    {
        try
        {
            var result = await _service.UpdateBookAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("books/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        try
        {
            await _service.DeleteBookAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

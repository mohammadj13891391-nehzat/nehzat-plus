using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("rings")]
[Authorize(Roles = "admin,manager,headquarters,coach")]
public class RingsController : ControllerBase
{
    private readonly IRingService _service;

    public RingsController(IRingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.FindByIdAsync(id);
        if (result == null) return NotFound(new { message = "حلقه پیدا نشد." });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateRingRequest request)
    {
        try
        {
            var result = await _service.CreateAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateRingRequest request)
    {
        try
        {
            var result = await _service.UpdateAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("{id}/students")]
    public async Task<IActionResult> GetStudents(int id)
    {
        return Ok(await _service.GetStudentsAsync(id));
    }

    [HttpPost("{id}/students")]
    public async Task<IActionResult> AddStudent(int id, [FromBody] CreateRingStudentRequest request)
    {
        if (id != request.RingId) return BadRequest(new { message = "شناسه حلقه نامعتبر است." });
        try
        {
            var result = await _service.AddStudentAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}/students/{studentId}")]
    public async Task<IActionResult> RemoveStudent(int id, int studentId)
    {
        try
        {
            await _service.RemoveStudentAsync(id, studentId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/books")]
    public async Task<IActionResult> AddBook(int id, [FromBody] CreateRingBookRequest request)
    {
        if (id != request.RingId) return BadRequest(new { message = "شناسه حلقه نامعتبر است." });
        try
        {
            await _service.AddBookAsync(request);
            return Ok(new { message = "کتاب با موفقیت اضافه شد." });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}/books/{bookId}")]
    public async Task<IActionResult> RemoveBook(int id, int bookId)
    {
        try
        {
            await _service.RemoveBookAsync(id, bookId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpPost("{id}/teaching-methods")]
    public async Task<IActionResult> AddTeachingMethod(int id, [FromBody] CreateRingTeachingMethodRequest request)
    {
        if (id != request.RingId) return BadRequest(new { message = "شناسه حلقه نامعتبر است." });
        try
        {
            await _service.AddTeachingMethodAsync(request);
            return Ok(new { message = "روش تدریس با موفقیت اضافه شد." });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}/teaching-methods/{teachingMethodId}")]
    public async Task<IActionResult> RemoveTeachingMethod(int id, int teachingMethodId)
    {
        try
        {
            await _service.RemoveTeachingMethodAsync(id, teachingMethodId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

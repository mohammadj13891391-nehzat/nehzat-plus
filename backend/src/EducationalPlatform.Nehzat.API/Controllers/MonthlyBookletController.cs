using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/monthly-booklets")]
[Authorize]
public class MonthlyBookletController : ControllerBase
{
    private readonly IMonthlyBookletService _service;

    public MonthlyBookletController(IMonthlyBookletService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] int? studentId)
    {
        return Ok(await _service.GetAllAsync(studentId));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "دفترچه ماهانه پیدا نشد." });
        return Ok(result);
    }

    [HttpGet("by-student/{studentId}")]
    public async Task<IActionResult> GetByStudent(int studentId)
    {
        return Ok(await _service.GetByStudentAsync(studentId));
    }

    [HttpGet("by-student/{studentId}/{year}/{month}")]
    public async Task<IActionResult> GetByStudentAndPeriod(int studentId, int year, int month)
    {
        var result = await _service.GetByStudentAndPeriodAsync(studentId, month, year);
        if (result == null) return NotFound(new { message = "دفترچه ماهانه برای این دوره یافت نشد." });
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = "admin,manager,coach,parent")]
    public async Task<IActionResult> Create([FromBody] CreateMonthlyBookletRequest request)
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
    [Authorize(Roles = "admin,manager,coach,parent")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMonthlyBookletRequest request)
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
    [Authorize(Roles = "admin,manager")]
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
}

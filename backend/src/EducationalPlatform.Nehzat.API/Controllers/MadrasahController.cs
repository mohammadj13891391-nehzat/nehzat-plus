using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/madrasahs")]
[Authorize(Roles = "admin,manager,headquarters")]
public class MadrasahController : ControllerBase
{
    private readonly IMadrasahService _madrasahService;

    public MadrasahController(IMadrasahService madrasahService)
    {
        _madrasahService = madrasahService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _madrasahService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _madrasahService.FindByIdAsync(id);
        if (result == null) return NotFound(new { message = "مکتب پیدا نشد." });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateMadrasahRequest request)
    {
        try
        {
            var result = await _madrasahService.CreateAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMadrasahRequest request)
    {
        try
        {
            var result = await _madrasahService.UpdateAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _madrasahService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpGet("{id}/branches")]
    public async Task<IActionResult> GetBranches(int id)
    {
        var result = await _madrasahService.GetBranchesAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/branches")]
    public async Task<IActionResult> CreateBranch(int id, [FromBody] CreateMadrasahBranchRequest request)
    {
        if (id != request.MadrasahId) return BadRequest(new { message = "شناسه مکتب نامعتبر است." });
        try
        {
            var result = await _madrasahService.CreateBranchAsync(request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpDelete("{id}/branches/{branchId}")]
    public async Task<IActionResult> DeleteBranch(int id, int branchId)
    {
        try
        {
            await _madrasahService.DeleteBranchAsync(id, branchId);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }
}

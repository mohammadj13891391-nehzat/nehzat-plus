using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("competitions")]
[Authorize]
public class CompetitionsController : ControllerBase
{
    private readonly ICompetitionService _competitionService;

    public CompetitionsController(ICompetitionService competitionService)
    {
        _competitionService = competitionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _competitionService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var result = await _competitionService.GetActiveCompetitionsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _competitionService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "مسابقه یافت نشد." });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCompetitionRequest request)
    {
        try
        {
            var result = await _competitionService.CreateAsync(request);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest(new { message = "خطا در ایجاد مسابقه. لطفا دوباره تلاش کنید." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCompetitionRequest request)
    {
        try
        {
            var result = await _competitionService.UpdateAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "مسابقه یافت نشد." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _competitionService.DeleteAsync(id);
            return Ok(new { message = "مسابقه حذف شد." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "مسابقه یافت نشد." });
        }
    }

    [HttpPost("{id}/participants")]
    public async Task<IActionResult> RegisterParticipant(int id, [FromBody] RegisterParticipantRequest request)
    {
        try
        {
            var result = await _competitionService.RegisterParticipantAsync(id, request);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest(new { message = "خطا در ثبت شرکت‌کننده. لطفا دوباره تلاش کنید." });
        }
    }

    [HttpDelete("{id}/participants/{studentId}")]
    public async Task<IActionResult> RemoveParticipant(int id, int studentId)
    {
        try
        {
            await _competitionService.RemoveParticipantAsync(id, studentId);
            return Ok(new { message = "شرکت‌کننده حذف شد." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "شرکت‌کننده یافت نشد." });
        }
    }

    [HttpPut("{id}/participants/{studentId}/score")]
    public async Task<IActionResult> UpdateParticipantScore(int id, int studentId, [FromBody] UpdateParticipantScoreRequest request)
    {
        try
        {
            var result = await _competitionService.UpdateParticipantScoreAsync(id, studentId, request);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest(new { message = "خطا در ثبت امتیاز. لطفا دوباره تلاش کنید." });
        }
    }

    [HttpGet("{id}/results")]
    public async Task<IActionResult> GetResults(int id)
    {
        try
        {
            var result = await _competitionService.GetResultsAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "مسابقه یافت نشد." });
        }
    }
}

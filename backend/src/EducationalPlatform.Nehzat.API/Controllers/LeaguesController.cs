using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("leagues")]
[Authorize]
public class LeaguesController : ControllerBase
{
    private readonly ILeagueService _leagueService;

    public LeaguesController(ILeagueService leagueService)
    {
        _leagueService = leagueService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _leagueService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var result = await _leagueService.GetActiveLeaguesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _leagueService.GetByIdAsync(id);
        if (result == null) return NotFound(new { message = "لیگ یافت نشد." });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLeagueRequest request)
    {
        try
        {
            var result = await _leagueService.CreateAsync(request);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest(new { message = "خطا در ایجاد لیگ. لطفا دوباره تلاش کنید." });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLeagueRequest request)
    {
        try
        {
            var result = await _leagueService.UpdateAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "لیگ یافت نشد." });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _leagueService.DeleteAsync(id);
            return Ok(new { message = "لیگ حذف شد." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "لیگ یافت نشد." });
        }
    }

    [HttpGet("{id}/rankings")]
    public async Task<IActionResult> GetRankings(int id)
    {
        var result = await _leagueService.GetRankingsAsync(id);
        return Ok(result);
    }

    [HttpPut("{id}/rankings")]
    public async Task<IActionResult> UpdateRanking(int id, [FromBody] UpdateLeagueRankingRequest request)
    {
        try
        {
            var result = await _leagueService.UpdateRankingAsync(id, request);
            return Ok(result);
        }
        catch (Exception)
        {
            return BadRequest(new { message = "خطا در ثبت امتیاز. لطفا دوباره تلاش کنید." });
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("spiritual/entries")]
[Authorize]
public class SpiritualEntryController : ControllerBase
{
    private readonly ISpiritualEntryService _entryService;

    public SpiritualEntryController(ISpiritualEntryService entryService)
    {
        _entryService = entryService;
    }

    [HttpPost]
    public async Task<IActionResult> UpsertEntry([FromBody] UpsertDailyEntryRequest request)
    {
        var result = await _entryService.UpsertDailyEntryAsync(
            request.UserId,
            request.EntryDate,
            request.MoodScore,
            request.Notes,
            request.CompletedSteps);
        return Ok(result);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetEntry(int userId, [FromQuery] DateTime date)
    {
        var result = await _entryService.GetDailyEntryAsync(userId, date);
        if (result == null) return NotFound(new { message = "ورودی برای این تاریخ یافت نشد" });
        return Ok(result);
    }

    [HttpGet("user/{userId}/history")]
    public async Task<IActionResult> GetHistory(int userId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
    {
        var result = await _entryService.GetEntryHistoryAsync(userId, fromDate, toDate);
        return Ok(result);
    }

    [HttpGet("user/{userId}/streak")]
    public async Task<IActionResult> GetStreak(int userId)
    {
        var streak = await _entryService.GetStreakAsync(userId);
        return Ok(new { streak });
    }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("spiritual/path")]
[Authorize]
public class SpiritualPathController : ControllerBase
{
    private readonly ISpiritualPathService _pathService;

    public SpiritualPathController(ISpiritualPathService pathService)
    {
        _pathService = pathService;
    }

    [HttpGet("available/{studentId}")]
    public async Task<IActionResult> GetAvailablePaths(int studentId)
    {
        try
        {
            var result = await _pathService.GetAvailablePathsAsync(studentId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "دانش‌آموز یافت نشد" });
        }
    }

    [HttpPost("ranking/{studentId}")]
    public async Task<IActionResult> SubmitRanking(int studentId, [FromBody] PathRankingRequest request)
    {
        try
        {
            var result = await _pathService.SubmitRankingAsync(studentId, request.PathId, request.RankOrdinal);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "دانش‌آموز یا مسیر یافت نشد" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("finalize")]
    public async Task<IActionResult> FinalizePath([FromBody] FinalizePathRequest request)
    {
        try
        {
            var result = await _pathService.FinalizePathAsync(request.StudentId, request.PathId, request.Reason);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "دانش‌آموز یا مسیر یافت نشد" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("switch")]
    public async Task<IActionResult> SwitchFinalizedPath([FromBody] FinalizePathRequest request)
    {
        try
        {
            var result = await _pathService.SwitchFinalizedPathAsync(request.StudentId, request.PathId, request.Reason);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "دانش‌آموز یا مسیر یافت نشد" });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("selection/{studentId}")]
    public async Task<IActionResult> GetSelection(int studentId)
    {
        var result = await _pathService.GetSelectionAsync(studentId);
        if (result == null) return NotFound(new { message = "انتخابی برای این دانش‌آموز یافت نشد" });
        return Ok(result);
    }

    [HttpGet("history/{studentId}")]
    public async Task<IActionResult> GetHistory(int studentId)
    {
        var result = await _pathService.GetHistoryAsync(studentId);
        return Ok(result);
    }

    }
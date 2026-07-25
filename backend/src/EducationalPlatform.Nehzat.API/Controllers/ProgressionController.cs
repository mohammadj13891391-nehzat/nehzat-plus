using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/progression")]
[Authorize]
public class ProgressionController : ControllerBase
{
    private readonly IProgressionService _service;

    public ProgressionController(IProgressionService service)
    {
        _service = service;
    }

    [HttpGet("check/{studentId}")]
    [Authorize(Roles = "admin,manager,coach,parent,headquarters")]
    public async Task<IActionResult> CheckProgression(int studentId)
    {
        try
        {
            var result = await _service.CheckProgressionAsync(studentId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("check-ring/{ringId}")]
    [Authorize(Roles = "admin,manager,coach,headquarters")]
    public async Task<IActionResult> CheckRingProgression(int ringId)
    {
        var results = await _service.CheckRingProgressionAsync(ringId);
        return Ok(results);
    }

    [HttpPost("record")]
    [Authorize(Roles = "admin,manager,coach,headquarters")]
    public async Task<IActionResult> RecordProgression([FromBody] RecordProgressionRequest request)
    {
        try
        {
            var result = await _service.RecordProgressionAsync(
                request.StudentId,
                request.FromLevel,
                request.ToLevel,
                request.ChangedByUserId);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

public class RecordProgressionRequest
{
    public int StudentId { get; set; }
    public string FromLevel { get; set; } = string.Empty;
    public string ToLevel { get; set; } = string.Empty;
    public int? ChangedByUserId { get; set; }
}
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("spiritual/occasions")]
[Authorize]
public class SpiritualOccasionController : ControllerBase
{
    private readonly ISpiritualOccasionService _occasionService;

    public SpiritualOccasionController(ISpiritualOccasionService occasionService)
    {
        _occasionService = occasionService;
    }

    [HttpGet("progress/user/{userId}")]
    public async Task<IActionResult> GetProgress(int userId, [FromQuery] int? occasionId, [FromQuery] int? hijriYear)
    {
        var result = await _occasionService.GetProgressForUserAsync(userId, occasionId, hijriYear);
        return Ok(result);
    }

    [HttpPost("progress/mark")]
    public async Task<IActionResult> MarkPractice([FromBody] MarkOccasionPracticeRequest request)
    {
        try
        {
            var result = await _occasionService.MarkPracticeAsync(
                request.UserId,
                request.OccasionId,
                request.PracticeItemId,
                request.HijriYear,
                request.IsCompleted,
                request.Notes);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "مناسبت یا عمل یافت نشد" });
        }
    }
}
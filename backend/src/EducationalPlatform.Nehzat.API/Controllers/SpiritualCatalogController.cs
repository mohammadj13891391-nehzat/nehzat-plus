using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("spiritual/catalog")]
[Authorize]
public class SpiritualCatalogController : ControllerBase
{
    private readonly ISpiritualCatalogService _catalogService;

    public SpiritualCatalogController(ISpiritualCatalogService catalogService)
    {
        _catalogService = catalogService;
    }

    [HttpGet("practices")]
    public async Task<IActionResult> GetPractices([FromQuery] SpiritualCatalogQueryDto query)
    {
        var result = await _catalogService.GetPracticesForUserAsync(query.UserId, query.Age, query.Gender, query.Role);
        return Ok(result);
    }

    [HttpGet("practices/all")]
    public async Task<IActionResult> GetAllPractices()
    {
        var result = await _catalogService.GetAllPracticesAsync();
        return Ok(result);
    }

    [HttpGet("occasions")]
    public async Task<IActionResult> GetAllOccasions()
    {
        var result = await _catalogService.GetAllOccasionsAsync();
        return Ok(result);
    }

    [HttpGet("occasions/{occasionId}")]
    public async Task<IActionResult> GetOccasionDetail(int occasionId)
    {
        var result = await _catalogService.GetOccasionDetailAsync(occasionId);
        if (result == null) return NotFound(new { message = "مناسبت یافت نشد" });
        return Ok(result);
    }
}
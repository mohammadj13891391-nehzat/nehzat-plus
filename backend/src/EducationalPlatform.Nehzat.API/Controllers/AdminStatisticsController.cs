using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/statistics")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminStatisticsController : ControllerBase
{
    private readonly ICourseService _courseService;

    public AdminStatisticsController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    [HttpGet]
    public async Task<IActionResult> GetStatistics()
    {
        return Ok(await _courseService.GetSystemStatisticsAsync());
    }
}

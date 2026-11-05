using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/internal")]
[AllowAnonymous]
public class InternalNotificationController : ControllerBase
{
    private readonly INotificationBroadcaster _broadcaster;
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public InternalNotificationController(
        INotificationBroadcaster broadcaster,
        AppDbContext db,
        IConfiguration config)
    {
        _broadcaster = broadcaster;
        _db = db;
        _config = config;
    }

    [HttpPost("notifications")]
    public async Task<IActionResult> Notify([FromBody] InternalNotificationRequest req)
    {
        var expectedKey = _config["InternalApi:Key"];
        if (string.IsNullOrWhiteSpace(expectedKey) ||
            !Request.Headers.TryGetValue("X-Internal-Key", out var provided) ||
            !string.Equals(provided.ToString(), expectedKey, StringComparison.Ordinal))
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(req.Phone) || string.IsNullOrWhiteSpace(req.Title) && string.IsNullOrWhiteSpace(req.Body))
        {
            return BadRequest();
        }

        var phoneMap = _config.GetSection("InternalApi:PhoneUserMap");
        var username = phoneMap[req.Phone];
        if (string.IsNullOrWhiteSpace(username))
        {
            return NotFound();
        }

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == username);
        if (user is null)
        {
            return NoContent();
        }

        await _broadcaster.NotifyAsync(
            user.Id,
            user.Username,
            string.IsNullOrWhiteSpace(req.Type) ? "info" : req.Type,
            req.Title ?? string.Empty,
            req.Body ?? string.Empty,
            req.Link);

        return NoContent();
    }
}

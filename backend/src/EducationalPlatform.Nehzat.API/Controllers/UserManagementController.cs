using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/users")]
[Authorize(Roles = "admin,manager,headquarters")]
public class UserManagementController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ICourseService _courseService;

    public UserManagementController(IUserService userService, ICourseService courseService)
    {
        _userService = userService;
        _courseService = courseService;
    }

    [HttpGet("pending")]
    public async Task<IActionResult> GetPendingUsers()
    {
        return Ok(await _courseService.GetPendingUsersAsync());
    }

    [HttpPost("{userId}/approve")]
    public async Task<IActionResult> ApproveUser(int userId, [FromBody] ApproveUserRequest request)
    {
        var result = await _courseService.ApproveUserAndCreateStudentAsync(
            userId,
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber,
            request.StudentId,
            request.CourseIds
        );
        return Ok(result);
    }

    [HttpPost("{userId}/reject")]
    public async Task<IActionResult> RejectUser(int userId)
    {
        return Ok(await _courseService.RejectUserAsync(userId));
    }

    // User creation is handled by OTUH2 — this endpoint is disabled in favor of centralized auth.
    [HttpPost]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult CreateUser()
    {
        return BadRequest(new { message = "ایجاد کاربر از طریق سامانه احراز هویت مرکزی (OTUH2) انجام می‌شود" });
    }
}

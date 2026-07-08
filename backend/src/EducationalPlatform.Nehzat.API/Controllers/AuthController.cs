using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IBranchManagerService _branchManagerService;

    public AuthController(IUserService userService, IBranchManagerService branchManagerService)
    {
        _userService = userService;
        _branchManagerService = branchManagerService;
    }

    // TODO: Delegate signup to OTUH2 — for now, create local pending user record.
    // Password is accepted in the request for backward compatibility but not stored locally.
    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] SignupRequest request)
    {
        try
        {
            await _userService.CreatePendingUserAsync(
                request.Username,
                request.Password,
                request.ImageUrl,
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber
            );
            return Ok(new SignupResponse(
                "ثبت نام با موفقیت انجام شد. در انتظار تایید مدیر سیستم هستید.",
                "pending"
            ));
        }
        catch (Exception)
        {
            return BadRequest(new { message = "خطا در ثبت نام. لطفاً دوباره تلاش کنید" });
        }
    }
}

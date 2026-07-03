using Microsoft.AspNetCore.Mvc;
using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Services;

namespace LessonPlanner.Api.Controllers;

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

    [HttpPost("signin")]
    public async Task<IActionResult> SignIn([FromBody] LoginRequest request)
    {
        var isValid = await _userService.ValidateUserAsync(request.Username, request.Password);
        if (!isValid)
            return BadRequest(new { message = "کاربری با این نام کاربری یا رمز عبور یافت نشد" });

        var user = await _userService.FindUserAsync(request.Username);
        if (user == null)
            return BadRequest(new { message = "کاربری با این نام کاربری یافت نشد" });

        if (user.ApprovalStatus == "pending")
            return BadRequest(new { message = "حساب کاربری شما در انتظار تایید مدیر سیستم است" });

        if (user.ApprovalStatus == "rejected")
            return BadRequest(new { message = "حساب کاربری شما رد شده است. لطفاً با مدیر سیستم تماس بگیرید" });

        if (user.UserType == "trainee" && user.Student != null)
        {
            return Ok(new AuthResponse(
                "Sign-in successful",
                user.Username,
                user.ImageUrl,
                "trainee",
                user.Student.Id,
                new StudentInfo(
                    user.Student.FirstName,
                    user.Student.LastName,
                    user.Student.Email,
                    user.Student.StudentId,
                    user.Student.PhoneNumber
                )
            ));
        }

        int? branchId = null;
        if (user.UserType == "branch_manager")
        {
            var bm = await _branchManagerService.FindByUsernameAsync(user.Username);
            branchId = bm?.BranchId;
        }

        return Ok(new AuthResponse(
            "Sign-in successful",
            user.Username,
            user.ImageUrl,
            user.UserType,
            BranchId: branchId
        ));
    }

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] SignupRequest request)
    {
        if (request.Password != request.RetryPassword)
            return BadRequest(new { message = "پسوردها یکسان نیستند" });

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
        catch (Exception ex)
        {
            return BadRequest(new { message = $"خطا در ثبت نام: {ex.Message}" });
        }
    }
}

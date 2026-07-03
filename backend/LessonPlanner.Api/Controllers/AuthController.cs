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
            return Unauthorized(new { message = "نام کاربری یا رمز عبور اشتباه است" });

        var user = await _userService.FindUserAsync(request.Username);
        if (user == null)
            return Unauthorized(new { message = "نام کاربری یا رمز عبور اشتباه است" });

        if (user.ApprovalStatus == "pending")
            return BadRequest(new { message = "حساب کاربری شما در انتظار تایید مدیر سیستم است" });

        if (user.ApprovalStatus == "rejected")
            return BadRequest(new { message = "حساب کاربری شما رد شده است. لطفاً با مدیر سیستم تماس بگیرید" });

        var token = _userService.GenerateJwtToken(user);

        int? branchId = null;
        if (user.UserType == "branch_manager")
        {
            var bm = await _branchManagerService.FindByUsernameAsync(user.Username);
            branchId = bm?.BranchId;
        }

        if (user.UserType == "trainee" && user.Student != null)
        {
            return Ok(new AuthTokenResponse(
                Token: token,
                Message: "Sign-in successful",
                Username: user.Username,
                ImageUrl: user.ImageUrl,
                UserType: "trainee",
                UserId: user.Id,
                StudentId: user.Student.Id,
                StudentInfo: new StudentInfo(
                    user.Student.FirstName,
                    user.Student.LastName,
                    user.Student.Email,
                    user.Student.StudentId,
                    user.Student.PhoneNumber
                ),
                BranchId: branchId
            ));
        }

        return Ok(new AuthTokenResponse(
            Token: token,
            Message: "Sign-in successful",
            Username: user.Username,
            ImageUrl: user.ImageUrl,
            UserType: user.UserType,
            UserId: user.Id,
            StudentId: user.StudentId,
            BranchId: branchId
        ));
    }

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

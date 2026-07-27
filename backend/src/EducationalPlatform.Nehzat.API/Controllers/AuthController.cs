using Microsoft.AspNetCore.Mvc;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    // Sign-up is handled by OTUH2 — this endpoint is disabled in favor of centralized auth.
    [HttpPost("signup")]
    [ApiExplorerSettings(IgnoreApi = true)]
    public IActionResult SignUp()
    {
        return BadRequest(new { message = "ثبت‌نام از طریق سامانه احراز هویت مرکزی (OTUH2) انجام می‌شود" });
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/coaches")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminCoachesController : ControllerBase
{
    private readonly ICoachService _coachService;
    private readonly IUserService _userService;
    private readonly AppDbContext _db;

    public AdminCoachesController(ICoachService coachService, IUserService userService, AppDbContext db)
    {
        _coachService = coachService;
        _userService = userService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCoaches()
    {
        var coaches = await _coachService.GetAllAsync();
        var result = coaches.Select(c => new
        {
            c.Id,
            c.Username,
            c.FirstName,
            c.LastName,
            c.Email,
            c.PhoneNumber,
            c.BranchId,
            c.Specialization,
            AssignedCourseIds = c.CoachCourses.Select(cc => cc.CourseId).ToArray(),
            c.NationalCode,
            c.Status,
            c.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCoachById(int id)
    {
        var coach = await _coachService.FindByIdAsync(id);
        if (coach == null) return NotFound(new { message = "مربی پیدا نشد." });
        return Ok(new
        {
            coach.Id,
            coach.Username,
            coach.FirstName,
            coach.LastName,
            coach.Email,
            coach.PhoneNumber,
            coach.BranchId,
            coach.Specialization,
            coach.NationalCode,
            AssignedCourseIds = coach.CoachCourses.Select(cc => cc.CourseId).ToArray(),
            coach.Status,
            coach.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateCoach([FromBody] CreateCoachRequest request)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var coach = await _coachService.CreateAsync(request);

            var existing = await _userService.FindUserAsync(request.Username);
            if (existing == null)
            {
                await _userService.CreateUserAsync(
                    request.Username,
                    request.Password ?? "password123",
                    null,
                    null,
                    "coach",
                    request.FirstName,
                    request.LastName,
                    request.Email,
                    request.PhoneNumber
                );
            }

            await transaction.CommitAsync();

            return Ok(new
            {
                coach.Id,
                coach.Username,
                coach.FirstName,
                coach.LastName,
                coach.Email,
                coach.PhoneNumber,
                coach.BranchId,
                coach.Specialization,
                coach.NationalCode,
                AssignedCourseIds = coach.CoachCourses.Select(cc => cc.CourseId).ToArray(),
                coach.Status,
                coach.CreatedAt
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCoach(int id, [FromBody] UpdateCoachRequest request)
    {
        try
        {
            var coach = await _coachService.UpdateAsync(id, request);
            return Ok(new
            {
                coach.Id,
                coach.Username,
                coach.FirstName,
                coach.LastName,
                coach.Email,
                coach.PhoneNumber,
                coach.BranchId,
                coach.Specialization,
                coach.NationalCode,
                AssignedCourseIds = coach.CoachCourses.Select(cc => cc.CourseId).ToArray(),
                coach.Status,
                coach.CreatedAt
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCoach(int id)
    {
        try
        {
            await _coachService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}

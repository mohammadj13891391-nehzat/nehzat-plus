using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("branch-manager")]
[Authorize(Roles = "branch_manager,admin,manager,headquarters")]
public class BranchManagerController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IBranchService _branchService;
    private readonly IBranchManagerService _branchManagerService;
    private readonly ICoachService _coachService;
    private readonly IStudentService _studentService;
    private readonly IUserService _userService;

    public BranchManagerController(
        AppDbContext db,
        IBranchService branchService,
        IBranchManagerService branchManagerService,
        ICoachService coachService,
        IStudentService studentService,
        IUserService userService)
    {
        _db = db;
        _branchService = branchService;
        _branchManagerService = branchManagerService;
        _coachService = coachService;
        _studentService = studentService;
        _userService = userService;
    }

    private int? ResolveBranchId(int? branchIdParam)
    {
        var role = User.FindFirst("role")?.Value;
        var isStaff = role is "admin" or "manager" or "headquarters";
        if (isStaff && branchIdParam.HasValue)
        {
            return branchIdParam.Value;
        }
        return int.TryParse(User.FindFirst("branchId")?.Value, out var branchId) ? branchId : null;
    }

    [HttpGet("branch")]
    public async Task<IActionResult> GetBranch([FromQuery] int? branchId)
    {
        var resolved = ResolveBranchId(branchId);
        if (resolved is null)
        {
            return NotFound(new { message = "شعبه‌ای برای این کاربر یافت نشد." });
        }
        var branch = await _db.Branches.FindAsync(resolved.Value);
        if (branch is null)
        {
            return NotFound(new { message = "شعبه یافت نشد." });
        }
        return Ok(new
        {
            branch.Id,
            branch.Name,
            branch.Province,
            branch.Description,
            branch.CreatedAt
        });
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetStudents([FromQuery] int? branchId)
    {
        var resolved = ResolveBranchId(branchId);
        if (resolved is null)
        {
            return Forbid();
        }
        var students = await _db.Students
            .GroupJoin(
                _db.Users,
                s => s.Id,
                u => u.StudentId,
                (s, users) => new { Student = s, Users = users })
            .Where(x => x.Student.BranchId == resolved.Value)
            .SelectMany(
                x => x.Users.DefaultIfEmpty(),
                (x, u) => new
                {
                    x.Student.Id,
                    Username = u != null ? u.Username : "",
                    x.Student.FirstName,
                    x.Student.LastName,
                    x.Student.Email,
                    x.Student.PhoneNumber,
                    x.Student.BranchId,
                    x.Student.StudentId,
                    x.Student.Status,
                    x.Student.DateOfBirth,
                    x.Student.Gender,
                    x.Student.CreatedAt
                })
            .ToListAsync();
        return Ok(students);
    }

    [HttpGet("coaches")]
    public async Task<IActionResult> GetCoaches([FromQuery] int? branchId)
    {
        var resolved = ResolveBranchId(branchId);
        if (resolved is null)
        {
            return Forbid();
        }
        var coaches = await _db.Coaches
            .Include(c => c.CoachCourses)
            .Where(c => c.BranchId == resolved.Value)
            .Select(c => new
            {
                c.Id,
                c.Username,
                c.FirstName,
                c.LastName,
                c.Email,
                c.PhoneNumber,
                c.BranchId,
                c.Specialization,
                c.NationalCode,
                AssignedCourseIds = c.CoachCourses.Select(cc => cc.CourseId).ToArray(),
                c.Status,
                c.CreatedAt
            })
            .ToListAsync();
        return Ok(coaches);
    }

    [HttpPost("coaches")]
    public async Task<IActionResult> CreateCoach([FromBody] CreateCoachRequest request)
    {
        var resolved = ResolveBranchId(request.BranchId);
        if (resolved is null)
        {
            return Forbid();
        }

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var coach = await _coachService.CreateAsync(request with { BranchId = resolved.Value });

            var existing = await _userService.FindUserAsync(request.Username);
            if (existing == null)
            {
                await _userService.CreateUserAsync(
                    request.Username,
                    request.Password ?? "password123",
                    null,
                    null,
                    RoleNames.Coach,
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

    [HttpPut("coaches/{id}")]
    public async Task<IActionResult> UpdateCoach(int id, [FromBody] UpdateCoachRequest request)
    {
        var resolved = ResolveBranchId(request.BranchId);
        if (resolved is null)
        {
            return Forbid();
        }

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
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpDelete("coaches/{id}")]
    public async Task<IActionResult> DeleteCoach(int id)
    {
        var coach = await _db.Coaches.FindAsync(id);
        if (coach == null)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }

        var resolved = ResolveBranchId(coach.BranchId);
        if (resolved is null || coach.BranchId != resolved.Value)
        {
            return Forbid();
        }

        try
        {
            await _coachService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpGet("branch-managers")]
    public async Task<IActionResult> GetBranchManagers([FromQuery] int? branchId)
    {
        var resolved = ResolveBranchId(branchId);
        if (resolved is null)
        {
            return Forbid();
        }
        var managers = await _db.BranchManagers
            .Where(bm => bm.BranchId == resolved.Value)
            .Select(bm => new
            {
                bm.Id,
                bm.Username,
                bm.FirstName,
                bm.LastName,
                bm.Email,
                bm.PhoneNumber,
                bm.BranchId,
                bm.Gender,
                bm.NationalCode,
                bm.Status,
                bm.CreatedAt
            })
            .ToListAsync();
        return Ok(managers);
    }

    [HttpPost("branch-managers")]
    public async Task<IActionResult> CreateBranchManager([FromBody] CreateBranchManagerRequest request)
    {
        var resolved = ResolveBranchId(request.BranchId);
        if (resolved is null)
        {
            return Forbid();
        }

        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var manager = await _branchManagerService.CreateAsync(request with { BranchId = resolved.Value });

            var existing = await _userService.FindUserAsync(request.Username);
            if (existing == null)
            {
                await _userService.CreateUserAsync(
                    request.Username,
                    request.Password ?? "password123",
                    null,
                    null,
                    RoleNames.BranchManager,
                    request.FirstName,
                    request.LastName,
                    request.Email,
                    request.PhoneNumber
                );
            }

            await transaction.CommitAsync();

            return Ok(new
            {
                manager.Id,
                manager.Username,
                manager.FirstName,
                manager.LastName,
                manager.Email,
                manager.PhoneNumber,
                manager.BranchId,
                manager.Gender,
                manager.NationalCode,
                manager.Status,
                manager.CreatedAt
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("branch-managers/{id}")]
    public async Task<IActionResult> UpdateBranchManager(int id, [FromBody] UpdateBranchManagerRequest request)
    {
        var resolved = ResolveBranchId(request.BranchId);
        if (resolved is null)
        {
            return Forbid();
        }

        try
        {
            var manager = await _branchManagerService.UpdateAsync(id, request);
            return Ok(new
            {
                manager.Id,
                manager.Username,
                manager.FirstName,
                manager.LastName,
                manager.Email,
                manager.PhoneNumber,
                manager.BranchId,
                manager.Gender,
                manager.NationalCode,
                manager.Status,
                manager.CreatedAt
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpDelete("branch-managers/{id}")]
    public async Task<IActionResult> DeleteBranchManager(int id)
    {
        var manager = await _db.BranchManagers.FindAsync(id);
        if (manager == null)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }

        var resolved = ResolveBranchId(manager.BranchId);
        if (resolved is null || manager.BranchId != resolved.Value)
        {
            return Forbid();
        }

        try
        {
            await _branchManagerService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpGet("branch-performance")]
    public async Task<IActionResult> GetBranchPerformance([FromQuery] int? branchId)
    {
        var resolved = ResolveBranchId(branchId);
        if (resolved is null)
        {
            return Forbid();
        }
        var branch = await _db.Branches.FindAsync(resolved.Value);
        if (branch is null)
        {
            return NotFound(new { message = "شعبه یافت نشد." });
        }

        var studentCount = await _db.Students.CountAsync(s => s.BranchId == resolved.Value);
        var activeStudents = await _db.Students.CountAsync(s => s.BranchId == resolved.Value && s.Status == "active");

        var submissionCount = await (from sub in _db.AssignmentSubmissions
            join s in _db.Students on sub.StudentId equals s.Id
            where s.BranchId == resolved.Value
            select sub).CountAsync();

        var avgScore = await (from sub in _db.AssignmentSubmissions
            join s in _db.Students on sub.StudentId equals s.Id
            where s.BranchId == resolved.Value && sub.DailyScore != null
            select (double)sub.DailyScore).DefaultIfEmpty().AverageAsync();

        var attendanceRate = await (from sub in _db.AssignmentSubmissions
            join s in _db.Students on sub.StudentId equals s.Id
            where s.BranchId == resolved.Value
            group sub by s.Id into g
            select (double)g.Count() / g.Count(x => x.DailyScore != null)).DefaultIfEmpty().AverageAsync();

        var evaluationCount = await (from e in _db.RandomEvaluations
            join s in _db.Students on e.StudentId equals s.Id
            where s.BranchId == resolved.Value
            select e).CountAsync();

        var avgEvalScore = await (from e in _db.RandomEvaluations
            join s in _db.Students on e.StudentId equals s.Id
            where s.BranchId == resolved.Value && e.TotalScore != null
            select (double)e.TotalScore).DefaultIfEmpty().AverageAsync();

        return Ok(new
        {
            branchId = branch.Id,
            branchName = branch.Name,
            province = branch.Province,
            madrasahName = branch.Name,
            studentCount,
            averageScore = avgScore,
            attendanceRate,
            evaluationCount,
            averageEvaluationScore = avgEvalScore,
            status = activeStudents > 0 ? "active" : "inactive"
        });
    }

    [HttpGet("coach-performance")]
    public async Task<IActionResult> GetCoachPerformance([FromQuery] int? branchId)
    {
        var resolved = ResolveBranchId(branchId);
        if (resolved is null)
        {
            return Forbid();
        }
        var coaches = await _db.Coaches
            .Include(c => c.CoachCourses)
            .Where(c => c.BranchId == resolved.Value)
            .Select(c => new
            {
                c.Id,
                c.FirstName,
                c.LastName,
                c.Specialization,
                c.BranchId,
                c.Status,
                AssignedCourseCount = c.CoachCourses.Count,
                StudentCount = _db.Students.Count(s => s.BranchId == resolved.Value),
                AverageStudentScore = (double?)_db.AssignmentSubmissions
                    .Where(sub => _db.Students.Any(s => s.Id == sub.StudentId && s.BranchId == resolved.Value) && sub.DailyScore != null)
                    .Average(sub => (double)sub.DailyScore),
                EvaluationCount = _db.RandomEvaluations.Count(e => _db.Students.Any(s => s.Id == e.StudentId && s.BranchId == resolved.Value)),
                AverageEvaluationScore = (double?)_db.RandomEvaluations
                    .Where(e => _db.Students.Any(s => s.Id == e.StudentId && s.BranchId == resolved.Value) && e.TotalScore != null)
                    .Average(e => (double)e.TotalScore)
            })
            .ToListAsync();

        var result = coaches.Select(c => new
        {
            coachId = c.Id,
            coachName = $"{c.FirstName} {c.LastName}",
            c.Specialization,
            c.AssignedCourseCount,
            c.StudentCount,
            averageStudentScore = c.AverageStudentScore ?? 0,
            c.EvaluationCount,
            averageEvaluationScore = c.AverageEvaluationScore ?? 0,
            c.Status
        });
        return Ok(result);
    }
}

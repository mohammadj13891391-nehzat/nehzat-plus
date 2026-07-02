using Microsoft.AspNetCore.Mvc;
using LessonPlanner.Api.DTOs;
using LessonPlanner.Api.Models;
using LessonPlanner.Api.Services;

namespace LessonPlanner.Api.Controllers;

[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly ICoachService _coachService;
    private readonly IUserService _userService;

    public AdminController(ICourseService courseService, ICoachService coachService, IUserService userService)
    {
        _courseService = courseService;
        _coachService = coachService;
        _userService = userService;
    }

    // ==================== Courses ====================

    [HttpGet("courses")]
    public async Task<IActionResult> GetAllCourses()
    {
        return Ok(await _courseService.GetAllAsync());
    }

    [HttpGet("courses/search")]
    public async Task<IActionResult> SearchCourses([FromQuery] string q)
    {
        return Ok(await _courseService.SearchCoursesAsync(q));
    }

    [HttpGet("courses/filter")]
    public async Task<IActionResult> FilterCourses([FromQuery] string status)
    {
        return Ok(await _courseService.FilterCoursesByStatusAsync(status));
    }

    [HttpGet("courses/{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var course = await _courseService.FindByIdAsync(id);
        if (course == null) return NotFound();
        return Ok(course);
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] Course course)
    {
        return Ok(await _courseService.CreateAsync(course));
    }

    [HttpPut("courses/{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        try
        {
            return Ok(await _courseService.UpdateAsync(id, course));
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("courses/{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        await _courseService.DeleteAsync(id);
        return NoContent();
    }

    // ==================== Assignments ====================

    [HttpGet("courses/{courseId}/assignments")]
    public async Task<IActionResult> GetCourseAssignments(int courseId)
    {
        return Ok(await _courseService.GetCourseAssignmentsAsync(courseId));
    }

    [HttpGet("assignments/{id}")]
    public async Task<IActionResult> GetAssignmentById(int id)
    {
        var assignment = await _courseService.GetAssignmentByIdAsync(id);
        if (assignment == null) return NotFound();
        return Ok(assignment);
    }

    [HttpPost("courses/{courseId}/assignments")]
    public async Task<IActionResult> CreateAssignment(int courseId, [FromBody] Assignment assignment)
    {
        return Ok(await _courseService.CreateAssignmentAsync(courseId, assignment));
    }

    [HttpPut("assignments/{id}")]
    public async Task<IActionResult> UpdateAssignment(int id, [FromBody] Assignment assignment)
    {
        try
        {
            return Ok(await _courseService.UpdateAssignmentAsync(id, assignment));
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("assignments/{id}")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        await _courseService.DeleteAssignmentAsync(id);
        return NoContent();
    }

    [HttpPost("courses/{courseId}/assignments/daily-series")]
    public async Task<IActionResult> CreateDailySeries(int courseId, [FromBody] CreateDailySeriesRequest request)
    {
        var baseTemplate = new Assignment
        {
            Title = request.TitlePrefix ?? "تکلیف روز",
            Description = request.DescriptionPrefix ?? "شرح تکلیف روز",
            Type = request.Type ?? "homework",
            MaxScore = request.MaxScore ?? 100,
            Instructions = request.Instructions ?? "طبق دستورالعمل، تکلیف روز را انجام دهید"
        };

        var startDate = DateTime.Parse(request.StartDate);
        var result = await _courseService.CreateDailyAssignmentSeriesAsync(courseId, startDate, request.Days, baseTemplate);
        return Ok(result);
    }

    // ==================== Attachments ====================

    [HttpGet("assignments/{assignmentId}/attachments")]
    public async Task<IActionResult> GetAttachments(int assignmentId)
    {
        return Ok(await _courseService.GetAssignmentAttachmentsAsync(assignmentId));
    }

    [HttpPost("assignments/{assignmentId}/attachments")]
    public async Task<IActionResult> CreateAttachment(
        int assignmentId,
        [FromForm] AttachmentData attachmentData,
        IFormFile? file)
    {
        var attachment = new AssignmentAttachment
        {
            Title = attachmentData.Title,
            Description = attachmentData.Description,
            Kind = attachmentData.Kind ?? "other",
            DisplayOrder = attachmentData.DisplayOrder ?? 0
        };

        if (file != null)
        {
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads", "attachments");
            Directory.CreateDirectory(uploadsDir);

            var ext = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            attachment.Url = $"/uploads/attachments/{fileName}";
            attachment.Kind = DetermineFileKind(file.ContentType);
        }
        else
        {
            attachment.Url = attachmentData.Url ?? string.Empty;
        }

        return Ok(await _courseService.CreateAttachmentAsync(assignmentId, attachment));
    }

    [HttpPost("attachments/{id}/upload")]
    public async Task<IActionResult> UploadAttachmentFile(int id, IFormFile file)
    {
        if (file == null)
            return BadRequest(new { message = "فایل آپلود نشده است" });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads", "attachments");
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        var fileUrl = $"/uploads/attachments/{fileName}";
        var fileKind = DetermineFileKind(file.ContentType);

        var attachment = new AssignmentAttachment { Url = fileUrl, Kind = fileKind };
        return Ok(await _courseService.UpdateAttachmentAsync(id, attachment));
    }

    [HttpPut("attachments/{id}")]
    public async Task<IActionResult> UpdateAttachment(int id, [FromBody] AssignmentAttachment attachment)
    {
        try
        {
            return Ok(await _courseService.UpdateAttachmentAsync(id, attachment));
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("attachments/{id}")]
    public async Task<IActionResult> DeleteAttachment(int id)
    {
        await _courseService.DeleteAttachmentAsync(id);
        return NoContent();
    }

    // ==================== Coaches ====================

    [HttpGet("coaches")]
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
            c.Specialization,
            AssignedCourseIds = c.CoachCourses.Select(cc => cc.CourseId).ToArray(),
            c.NationalCode,
            c.Status,
            c.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("coaches/{id}")]
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
            coach.Specialization,
            coach.NationalCode,
            AssignedCourseIds = coach.CoachCourses.Select(cc => cc.CourseId).ToArray(),
            coach.Status,
            coach.CreatedAt
        });
    }

    [HttpPost("coaches")]
    public async Task<IActionResult> CreateCoach([FromBody] CreateCoachRequest request)
    {
        var coach = await _coachService.CreateAsync(request);

        // Also create a User record so the coach can log in
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

        return Ok(new
        {
            coach.Id,
            coach.Username,
            coach.FirstName,
            coach.LastName,
            coach.Email,
            coach.PhoneNumber,
            coach.Specialization,
            coach.NationalCode,
            AssignedCourseIds = coach.CoachCourses.Select(cc => cc.CourseId).ToArray(),
            coach.Status,
            coach.CreatedAt
        });
    }

    [HttpPut("coaches/{id}")]
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

    [HttpDelete("coaches/{id}")]
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

    // ==================== Statistics ====================

    [HttpGet("statistics")]
    public async Task<IActionResult> GetStatistics()
    {
        return Ok(await _courseService.GetSystemStatisticsAsync());
    }

    [HttpGet("courses/{courseId}/statistics")]
    public async Task<IActionResult> GetCourseStatistics(int courseId)
    {
        try
        {
            return Ok(await _courseService.GetCourseStatisticsAsync(courseId));
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==================== User Management ====================

    [HttpGet("users/pending")]
    public async Task<IActionResult> GetPendingUsers()
    {
        return Ok(await _courseService.GetPendingUsersAsync());
    }

    [HttpPost("users/{userId}/approve")]
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

    [HttpPost("users/{userId}/reject")]
    public async Task<IActionResult> RejectUser(int userId)
    {
        return Ok(await _courseService.RejectUserAsync(userId));
    }

    [HttpPost("users")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest request)
    {
        var existing = await _userService.FindUserAsync(request.Username);
        if (existing != null)
        {
            return BadRequest(new { message = "نام کاربری قبلاً ثبت شده است" });
        }

        await _userService.CreateUserAsync(
            request.Username,
            request.Password,
            null,
            null,
            request.UserType,
            request.FirstName,
            request.LastName,
            request.Email,
            request.PhoneNumber
        );

        var user = await _userService.FindUserAsync(request.Username);
        return Ok(new
        {
            user!.Id,
            user.Username,
            user.UserType,
            user.FirstName,
            user.LastName,
            user.Email,
            user.PhoneNumber
        });
    }

    // ==================== Helpers ====================

    private static string DetermineFileKind(string? mimeType)
    {
        if (mimeType == null) return "other";
        if (mimeType.StartsWith("audio/")) return "audio";
        if (mimeType.StartsWith("image/")) return "image";
        if (mimeType is "application/pdf" or "application/msword"
            or "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            return "document";
        if (mimeType == "text/plain") return "text";
        return "other";
    }
}

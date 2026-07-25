using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.API.Helpers;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/courses")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminCoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly AppDbContext _db;

    public AdminCoursesController(ICourseService courseService, AppDbContext db)
    {
        _courseService = courseService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCourses()
    {
        return Ok(await _courseService.GetAllAsync());
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchCourses([FromQuery] string q)
    {
        return Ok(await _courseService.SearchCoursesAsync(q));
    }

    [HttpGet("filter")]
    public async Task<IActionResult> FilterCourses([FromQuery] string status)
    {
        return Ok(await _courseService.FilterCoursesByStatusAsync(status));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCourseById(int id)
    {
        var course = await _courseService.FindByIdAsync(id);
        if (course == null) return NotFound();
        return Ok(course);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCourse([FromBody] Course course)
    {
        return Ok(await _courseService.CreateAsync(course));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCourse(int id, [FromBody] Course course)
    {
        try
        {
            return Ok(await _courseService.UpdateAsync(id, course));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCourse(int id)
    {
        await _courseService.DeleteAsync(id);
        return NoContent();
    }

    [HttpGet("{courseId}/assignments")]
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

    [HttpPost("{courseId}/assignments")]
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
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpDelete("assignments/{id}")]
    public async Task<IActionResult> DeleteAssignment(int id)
    {
        await _courseService.DeleteAssignmentAsync(id);
        return NoContent();
    }

    [HttpPost("{courseId}/assignments/daily-series")]
    public async Task<IActionResult> CreateDailySeries(int courseId, [FromBody] CreateDailySeriesRequest request)
    {
        var baseTemplate = new Assignment
        {
            Title = request.TitlePrefix ?? "تکلیف روز",
            Description = request.DescriptionPrefix ?? "شرح تکلیف روز",
            Type = request.Type ?? "homework",
            MaxScore = request.MaxScore ?? 100,
            Instructions = "طبق دستورالعمل، تکلیف روز را انجام دهید"
        };

        if (!DateTime.TryParse(request.StartDate, out var startDate))
            return BadRequest(new { message = "فرمت تاریخ نامعتبر است" });

        var result = await _courseService.CreateDailyAssignmentSeriesAsync(courseId, startDate, request.Days, baseTemplate);
        return Ok(result);
    }

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
            if (!FileUploadValidator.IsValidFile(file, out var validationError))
                return BadRequest(new { message = validationError });

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

        if (!FileUploadValidator.IsValidFile(file, out var validationError))
            return BadRequest(new { message = validationError });

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
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

    [HttpDelete("attachments/{id}")]
    public async Task<IActionResult> DeleteAttachment(int id)
    {
        await _courseService.DeleteAttachmentAsync(id);
        return NoContent();
    }

    [HttpGet("{courseId}/statistics")]
    public async Task<IActionResult> GetCourseStatistics(int courseId)
    {
        try
        {
            return Ok(await _courseService.GetCourseStatisticsAsync(courseId));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "خطای داخلی سرور" });
        }
    }

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

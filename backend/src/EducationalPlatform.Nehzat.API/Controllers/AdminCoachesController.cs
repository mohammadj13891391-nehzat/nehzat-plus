using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using EducationalPlatform.Nehzat.API.Helpers;
using Microsoft.EntityFrameworkCore;

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
        if (coach == null) return NotFound(GenericErrorMessages.NotFound);
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
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCoach(int id)
    {
        try
        {
            var files = await _db.CoachFiles.Where(f => f.CoachId == id).ToListAsync();
            await _coachService.DeleteAsync(id);
            foreach (var f in files)
            {
                try
                {
                    var p = Path.Combine(Directory.GetCurrentDirectory(), "public", f.StoredPath);
                    if (System.IO.File.Exists(p)) System.IO.File.Delete(p);
                }
                catch { }
            }
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpGet("{id}/files")]
    public async Task<IActionResult> GetCoachFiles(int id)
    {
        var coach = await _coachService.FindByIdAsync(id);
        if (coach == null) return NotFound(GenericErrorMessages.NotFound);

        var files = await _db.CoachFiles
            .Where(f => f.CoachId == id)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new { f.Id, f.Title, f.FileName, f.StoredPath, f.ContentType, f.Kind, f.SizeBytes, f.CreatedAt })
            .ToListAsync();
        return Ok(files);
    }

    [HttpPost("{id}/files")]
    public async Task<IActionResult> UploadCoachFile(int id, [FromForm] string? title, IFormFile? file)
    {
        var coach = await _coachService.FindByIdAsync(id);
        if (coach == null) return NotFound(GenericErrorMessages.NotFound);

        if (file == null) return BadRequest(GenericErrorMessages.BadRequest);

        if (!FileUploadValidator.IsValidFile(file, out var validationError))
            return BadRequest(validationError ?? GenericErrorMessages.BadRequest);

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads", "coach-files");
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var coachFile = new CoachFile
        {
            CoachId = id,
            Title = string.IsNullOrWhiteSpace(title) ? file.FileName : title!,
            FileName = fileName,
            StoredPath = $"/uploads/coach-files/{fileName}",
            ContentType = file.ContentType ?? "application/octet-stream",
            Kind = DetermineFileKind(file.ContentType),
            SizeBytes = file.Length,
            CreatedAt = DateTime.UtcNow
        };

        _db.CoachFiles.Add(coachFile);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            coachFile.Id,
            coachFile.Title,
            coachFile.FileName,
            coachFile.StoredPath,
            coachFile.ContentType,
            coachFile.Kind,
            coachFile.SizeBytes,
            coachFile.CreatedAt
        });
    }

    [HttpDelete("{id}/files/{fileId}")]
    public async Task<IActionResult> DeleteCoachFile(int id, int fileId)
    {
        var coachFile = await _db.CoachFiles.FirstOrDefaultAsync(f => f.Id == fileId && f.CoachId == id);
        if (coachFile == null) return NotFound(GenericErrorMessages.NotFound);

        try
        {
            var physicalPath = Path.Combine(Directory.GetCurrentDirectory(), "public", coachFile.StoredPath);
            if (System.IO.File.Exists(physicalPath)) System.IO.File.Delete(physicalPath);
        }
        catch
        {
            // file removal is best-effort
        }

        _db.CoachFiles.Remove(coachFile);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static string DetermineFileKind(string? mimeType)
    {
        if (mimeType == null) return "other";
        if (mimeType.StartsWith("audio/")) return "audio";
        if (mimeType.StartsWith("image/")) return "image";
        if (mimeType.StartsWith("video/")) return "video";
        if (mimeType is "application/pdf" or "application/msword"
            or "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            return "document";
        if (mimeType is "text/plain" or "text/markdown") return "text";
        if (mimeType is "application/json" or "application/xml") return "mindmap";
        return "other";
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.API.Helpers;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.Exceptions;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("students")]
[Authorize]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly IAssignmentSubmissionService _submissionService;

    public StudentController(IStudentService studentService, IAssignmentSubmissionService submissionService)
    {
        _studentService = studentService;
        _submissionService = submissionService;
    }

    private static readonly string[] StaffRoles = { "admin", "manager", "headquarters", "branch_manager", "coach" };

    private bool IsStaff()
    {
        var role = User.FindFirst("role")?.Value;
        return role != null && StaffRoles.Contains(role, StringComparer.OrdinalIgnoreCase);
    }

    private bool CanAccessStudent(int id)
    {
        if (IsStaff()) return true;
        var studentIdClaim = User.FindFirst("studentId")?.Value;
        return int.TryParse(studentIdClaim, out var sid) && sid == id;
    }

    [HttpPost]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
    public async Task<IActionResult> Create([FromBody] Student student)
    {
        var result = await _studentService.CreateAsync(student);
        return Ok(result);
    }

    [HttpGet]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _studentService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost("findByEmail_Phone")]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
    public async Task<IActionResult> FindByEmailPhone([FromBody] FindByEmailPhoneRequest request)
    {
        var student = await _studentService.FindByEmailAsync(request.Email);
        if (student == null) return Ok(null);
        if (student.PhoneNumber == request.PhoneNumber) return Ok(student);
        return Ok(null);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (!CanAccessStudent(id)) return Forbid();
        var result = await _studentService.FindByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

[HttpGet("me/profile")]
        [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
        public async Task<IActionResult> GetCurrentProfile([FromBody] string username)
        {
            try
            {
                var result = await _studentService.FindByUsernameAsync(username);
                if (result == null) return NotFound(GenericErrorMessages.NotFound);
                return Ok(result);
            }
            catch (Exception)
            {
                return StatusCode(500, GenericErrorMessages.ServerError);
            }
        }

[HttpGet("{id}/progress")]
        public async Task<IActionResult> GetProgress(int id)
        {
            try
            {
                if (!CanAccessStudent(id)) return Forbid();
                var result = await _studentService.GetStudentProgressAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
            catch (Exception)
            {
                return StatusCode(500, GenericErrorMessages.ServerError);
            }
        }

[HttpGet("{id}/progress/biweekly")]
        public async Task<IActionResult> GetBiweeklyProgress(int id)
        {
            try
            {
                if (!CanAccessStudent(id)) return Forbid();
                var result = await _studentService.GetBiweeklyProgressAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
            catch (Exception)
            {
                return StatusCode(500, GenericErrorMessages.ServerError);
            }
        }

[HttpGet("{id}/assignments/{assignmentId}/progress")]
        public async Task<IActionResult> GetAssignmentProgress(int id, int assignmentId)
        {
            try
            {
                if (!CanAccessStudent(id)) return Forbid();
                var result = await _submissionService.GetStudentProgressAsync(id, assignmentId);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
            catch (Exception)
            {
                return StatusCode(500, GenericErrorMessages.ServerError);
            }
        }

    [HttpGet("{id}/submissions")]
    public async Task<IActionResult> GetSubmissions(int id, [FromQuery] int? assignmentId)
    {
        if (!CanAccessStudent(id)) return Forbid();
        var result = await _submissionService.GetStudentSubmissionsAsync(id, assignmentId);
        return Ok(result);
    }

    [HttpPost("{id}/assignments/{assignmentId}/submit")]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
    public async Task<IActionResult> SubmitDailyWork(
        int id,
        int assignmentId,
        [FromForm] SubmissionData submissionData,
        IFormFile? audioFile)
    {
        if (audioFile != null)
        {
            if (!FileUploadValidator.IsValidFile(audioFile, out var validationError))
                return BadRequest(new { message = validationError });
        }

        var submission = new AssignmentSubmission
        {
            DailyScore = submissionData.DailyScore ?? 0,
            CumulativeScore = submissionData.CumulativeScore ?? 0,
            Status = submissionData.Status ?? "pending",
            Notes = submissionData.Notes,
            IsCompleted = submissionData.IsCompleted ?? false,
            TimeSpent = submissionData.TimeSpent,
        };

        if (audioFile != null)
        {
            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads", "submissions");
            Directory.CreateDirectory(uploadsDir);

            var ext = Path.GetExtension(audioFile.FileName);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var filePath = Path.Combine(uploadsDir, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await audioFile.CopyToAsync(stream);

            submission.AudioFileUrl = $"/uploads/submissions/{fileName}";
        }

        var result = await _submissionService.SubmitDailyWorkAsync(id, assignmentId, submission);
        return Ok(result);
    }

    [HttpPost("{id}/submissions/{submissionId}/upload")]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
    public async Task<IActionResult> UploadSubmissionFile(int id, int submissionId, IFormFile audioFile)
    {
        if (audioFile == null)
            return BadRequest(new { message = "فایل آپلود نشده است" });

        if (!FileUploadValidator.IsValidFile(audioFile, out var validationError))
            return BadRequest(new { message = validationError });

        var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "public", "uploads", "submissions");
        Directory.CreateDirectory(uploadsDir);

        var ext = Path.GetExtension(audioFile.FileName);
        var fileName = $"{Guid.NewGuid():N}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using var stream = new FileStream(filePath, FileMode.Create);
        await audioFile.CopyToAsync(stream);

        var fileUrl = $"/uploads/submissions/{fileName}";
        var result = await _submissionService.UpdateSubmissionFileAsync(submissionId, fileUrl);
        return Ok(result);
    }

[HttpPut("{id}")]
        [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
        public async Task<IActionResult> Update(int id, [FromBody] Student student)
        {
            try
            {
                var result = await _studentService.UpdateAsync(id, student);
                return Ok(result);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(GenericErrorMessages.NotFound);
            }
            catch (Exception)
            {
                return StatusCode(500, GenericErrorMessages.ServerError);
            }
        }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager,coach")]
    public async Task<IActionResult> Delete(int id)
    {
        await _studentService.DeleteAsync(id);
        return NoContent();
    }
}

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
    private readonly IBranchManagerService _branchManagerService;
    private readonly IParentService _parentService;
    private readonly IEvaluatorService _evaluatorService;
    private readonly IStudentService _studentService;
    private readonly IBranchService _branchService;

    public AdminController(ICourseService courseService, ICoachService coachService, IUserService userService, IBranchManagerService branchManagerService, IParentService parentService, IEvaluatorService evaluatorService, IStudentService studentService, IBranchService branchService)
    {
        _courseService = courseService;
        _coachService = coachService;
        _userService = userService;
        _branchManagerService = branchManagerService;
        _parentService = parentService;
        _evaluatorService = evaluatorService;
        _studentService = studentService;
        _branchService = branchService;
    }

    // ==================== Branches ====================

    [HttpGet("branches")]
    public async Task<IActionResult> GetAllBranches()
    {
        return Ok(await _branchService.GetAllAsync());
    }

    [HttpPost("branches")]
    public async Task<IActionResult> CreateBranch([FromBody] CreateBranchRequest request)
    {
        var branch = await _branchService.CreateAsync(request.Name, request.Province, request.Description);
        return Ok(branch);
    }

    [HttpPut("branches/{id}")]
    public async Task<IActionResult> UpdateBranch(int id, [FromBody] UpdateBranchRequest request)
    {
        try
        {
            return Ok(await _branchService.UpdateAsync(id, request.Name, request.Province, request.Description));
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("branches/{id}")]
    public async Task<IActionResult> DeleteBranch(int id)
    {
        try
        {
            await _branchService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
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
            c.BranchId,
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
            coach.BranchId,
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
            coach.BranchId,
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

    // ==================== Branch Managers ====================

    [HttpGet("branch-managers")]
    public async Task<IActionResult> GetAllBranchManagers()
    {
        var managers = await _branchManagerService.GetAllAsync();
        var result = managers.Select(bm => new
        {
            bm.Id,
            bm.Username,
            bm.FirstName,
            bm.LastName,
            bm.Email,
            bm.PhoneNumber,
            bm.BranchId,
            BranchName = bm.Branch?.Name,
            bm.Gender,
            bm.NationalCode,
            bm.Status,
            bm.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("branch-managers/{id}")]
    public async Task<IActionResult> GetBranchManagerById(int id)
    {
        var bm = await _branchManagerService.FindByIdAsync(id);
        if (bm == null) return NotFound(new { message = "مسئول شعبه پیدا نشد." });
        return Ok(new
        {
            bm.Id,
            bm.Username,
            bm.FirstName,
            bm.LastName,
            bm.Email,
            bm.PhoneNumber,
            bm.BranchId,
            BranchName = bm.Branch?.Name,
            bm.Gender,
            bm.NationalCode,
            bm.Status,
            bm.CreatedAt
        });
    }

    [HttpPost("branch-managers")]
    public async Task<IActionResult> CreateBranchManager([FromBody] CreateBranchManagerRequest request)
    {
        var bm = await _branchManagerService.CreateAsync(request);

        var existing = await _userService.FindUserAsync(request.Username);
        if (existing == null)
        {
            await _userService.CreateUserAsync(
                request.Username,
                request.Password,
                null,
                null,
                "branch_manager",
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber
            );
        }

        return Ok(new
        {
            bm.Id,
            bm.Username,
            bm.FirstName,
            bm.LastName,
            bm.Email,
            bm.PhoneNumber,
            bm.BranchId,
            BranchName = bm.Branch?.Name,
            bm.Gender,
            bm.NationalCode,
            bm.Status,
            bm.CreatedAt
        });
    }

    [HttpPut("branch-managers/{id}")]
    public async Task<IActionResult> UpdateBranchManager(int id, [FromBody] UpdateBranchManagerRequest request)
    {
        try
        {
            var bm = await _branchManagerService.UpdateAsync(id, request);
            return Ok(new
            {
                bm.Id,
                bm.Username,
                bm.FirstName,
                bm.LastName,
                bm.Email,
                bm.PhoneNumber,
                bm.BranchId,
                BranchName = bm.Branch?.Name,
                bm.Gender,
                bm.NationalCode,
                bm.Status,
                bm.CreatedAt
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("branch-managers/{id}")]
    public async Task<IActionResult> DeleteBranchManager(int id)
    {
        try
        {
            await _branchManagerService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==================== Parents ====================

    [HttpGet("parents")]
    public async Task<IActionResult> GetAllParents()
    {
        var parents = await _parentService.GetAllAsync();
        var result = parents.Select(p => new
        {
            p.Id,
            p.Username,
            p.FirstName,
            p.LastName,
            p.Email,
            p.PhoneNumber,
            p.Address,
            p.NationalCode,
            p.BranchId,
            StudentIds = p.StudentIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(int.Parse)
                .ToArray(),
            p.Status,
            p.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("parents/{id}")]
    public async Task<IActionResult> GetParentById(int id)
    {
        var parent = await _parentService.FindByIdAsync(id);
        if (parent == null) return NotFound(new { message = "والد پیدا نشد." });
        return Ok(new
        {
            parent.Id,
            parent.Username,
            parent.FirstName,
            parent.LastName,
            parent.Email,
            parent.PhoneNumber,
            parent.Address,
            parent.NationalCode,
            parent.BranchId,
            StudentIds = parent.StudentIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(int.Parse)
                .ToArray(),
            parent.Status,
            parent.CreatedAt
        });
    }

    [HttpPost("parents")]
    public async Task<IActionResult> CreateParent([FromBody] CreateParentRequest request)
    {
        var parent = await _parentService.CreateAsync(request);

        var existing = await _userService.FindUserAsync(request.Username);
        if (existing == null)
        {
            await _userService.CreateUserAsync(
                request.Username,
                request.Password,
                null,
                null,
                "parent",
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber
            );
        }

        return Ok(new
        {
            parent.Id,
            parent.Username,
            parent.FirstName,
            parent.LastName,
            parent.Email,
            parent.PhoneNumber,
            parent.Address,
            parent.NationalCode,
            parent.BranchId,
            StudentIds = parent.StudentIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(int.Parse)
                .ToArray(),
            parent.Status,
            parent.CreatedAt
        });
    }

    [HttpPut("parents/{id}")]
    public async Task<IActionResult> UpdateParent(int id, [FromBody] UpdateParentRequest request)
    {
        try
        {
            var parent = await _parentService.UpdateAsync(id, request);
            return Ok(new
            {
                parent.Id,
                parent.Username,
                parent.FirstName,
                parent.LastName,
                parent.Email,
                parent.PhoneNumber,
                parent.Address,
                parent.NationalCode,
                StudentIds = parent.StudentIds
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(int.Parse)
                    .ToArray(),
                parent.Status,
                parent.CreatedAt
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("parents/{id}")]
    public async Task<IActionResult> DeleteParent(int id)
    {
        try
        {
            await _parentService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpGet("parents/{id}/students")]
    public async Task<IActionResult> GetParentStudents(int id)
    {
        var parent = await _parentService.FindByIdAsync(id);
        if (parent == null) return NotFound(new { message = "والد پیدا نشد." });

        var studentIds = parent.StudentIds
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Select(int.Parse)
            .ToArray();

        var students = await _courseService.GetStudentsByIdsAsync(studentIds);
        return Ok(students);
    }

    // ==================== Evaluators ====================

    [HttpGet("evaluators")]
    public async Task<IActionResult> GetAllEvaluators()
    {
        var evaluators = await _evaluatorService.GetAllAsync();
        var result = evaluators.Select(e => new
        {
            e.Id,
            e.Username,
            e.FirstName,
            e.LastName,
            e.Email,
            e.PhoneNumber,
            e.BranchId,
            e.Expertise,
            AssignedMadrasahIds = e.AssignedMadrasahIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(int.Parse)
                .ToArray(),
            e.NationalCode,
            e.Status,
            e.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("evaluators/{id}")]
    public async Task<IActionResult> GetEvaluatorById(int id)
    {
        var evaluator = await _evaluatorService.FindByIdAsync(id);
        if (evaluator == null) return NotFound(new { message = "ارزیاب پیدا نشد." });
        return Ok(new
        {
            evaluator.Id,
            evaluator.Username,
            evaluator.FirstName,
            evaluator.LastName,
            evaluator.Email,
            evaluator.PhoneNumber,
            evaluator.BranchId,
            evaluator.Expertise,
            AssignedMadrasahIds = evaluator.AssignedMadrasahIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(int.Parse)
                .ToArray(),
            evaluator.NationalCode,
            evaluator.Status,
            evaluator.CreatedAt
        });
    }

    [HttpPost("evaluators")]
    public async Task<IActionResult> CreateEvaluator([FromBody] CreateEvaluatorRequest request)
    {
        var evaluator = await _evaluatorService.CreateAsync(request);

        var existing = await _userService.FindUserAsync(request.Username);
        if (existing == null)
        {
            await _userService.CreateUserAsync(
                request.Username,
                request.Password,
                null,
                null,
                "evaluator",
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber
            );
        }

        return Ok(new
        {
            evaluator.Id,
            evaluator.Username,
            evaluator.FirstName,
            evaluator.LastName,
            evaluator.Email,
            evaluator.PhoneNumber,
            evaluator.BranchId,
            evaluator.Expertise,
            AssignedMadrasahIds = evaluator.AssignedMadrasahIds
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(int.Parse)
                .ToArray(),
            evaluator.NationalCode,
            evaluator.Status,
            evaluator.CreatedAt
        });
    }

    [HttpPut("evaluators/{id}")]
    public async Task<IActionResult> UpdateEvaluator(int id, [FromBody] UpdateEvaluatorRequest request)
    {
        try
        {
            var evaluator = await _evaluatorService.UpdateAsync(id, request);
            return Ok(new
            {
                evaluator.Id,
                evaluator.Username,
                evaluator.FirstName,
                evaluator.LastName,
                evaluator.Email,
                evaluator.PhoneNumber,
                evaluator.Expertise,
                AssignedMadrasahIds = evaluator.AssignedMadrasahIds
                    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                    .Select(int.Parse)
                    .ToArray(),
                evaluator.NationalCode,
                evaluator.Status,
                evaluator.CreatedAt
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("evaluators/{id}")]
    public async Task<IActionResult> DeleteEvaluator(int id)
    {
        try
        {
            await _evaluatorService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // ==================== Students ====================

    [HttpGet("students")]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _studentService.GetAllAsync();
        var result = students.Select(s =>
        {
            var user = _userService.FindUserByStudentIdAsync(s.Id).Result;
            return new
            {
                s.Id,
                Username = user?.Username ?? "",
                s.FirstName,
                s.LastName,
                s.Email,
                s.PhoneNumber,
                s.BranchId,
                s.StudentId,
                s.Status,
                s.CreatedAt
            };
        });
        return Ok(result);
    }

    [HttpGet("students/{id}")]
    public async Task<IActionResult> GetStudentById(int id)
    {
        var student = await _studentService.FindByIdAsync(id);
        if (student == null) return NotFound(new { message = "متربی پیدا نشد." });
        var user = await _userService.FindUserByStudentIdAsync(student.Id);
        return Ok(new
        {
            student.Id,
            Username = user?.Username ?? "",
            student.FirstName,
            student.LastName,
            student.Email,
            student.PhoneNumber,
            student.BranchId,
            student.StudentId,
            student.Status,
            student.CreatedAt
        });
    }

    [HttpPost("students")]
    public async Task<IActionResult> CreateStudent([FromBody] AdminCreateStudentRequest request)
    {
        var student = await _studentService.CreateAsync(
            request.FirstName.Trim(),
            request.LastName.Trim(),
            request.Email.Trim(),
            request.PhoneNumber?.Trim() ?? "",
            request.StudentId?.Trim() ?? $"S-{DateTime.UtcNow.Ticks % 100000}"
        );

        // Assign branch if provided
        if (request.BranchId.HasValue)
        {
            student.BranchId = request.BranchId;
            await _studentService.UpdateAsync(student.Id, student);
        }

        var existing = await _userService.FindUserAsync(request.Username);
        if (existing == null)
        {
            await _userService.CreateUserAsync(
                request.Username,
                request.Password,
                null,
                student.Id,
                "trainee",
                request.FirstName,
                request.LastName,
                request.Email,
                request.PhoneNumber
            );
        }

        var user = await _userService.FindUserByStudentIdAsync(student.Id);
        return Ok(new
        {
            student.Id,
            Username = user?.Username ?? request.Username,
            student.FirstName,
            student.LastName,
            student.Email,
            student.PhoneNumber,
            student.BranchId,
            student.StudentId,
            student.Status,
            student.CreatedAt
        });
    }

    [HttpPut("students/{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] AdminUpdateStudentRequest request)
    {
        try
        {
            var existing = await _studentService.FindByIdAsync(id)
                ?? throw new KeyNotFoundException("متربی پیدا نشد.");

            if (request.FirstName != null) existing.FirstName = request.FirstName.Trim();
            if (request.LastName != null) existing.LastName = request.LastName.Trim();
            if (request.Email != null) existing.Email = request.Email.Trim();
            if (request.PhoneNumber != null) existing.PhoneNumber = request.PhoneNumber.Trim();
            if (request.StudentId != null) existing.StudentId = request.StudentId.Trim();
            if (request.BranchId != null) existing.BranchId = request.BranchId;
            if (request.Status != null) existing.Status = request.Status;
            existing.UpdatedAt = DateTime.UtcNow;

            await _studentService.UpdateAsync(id, existing);

            // Update user record if username changed
            var user = await _userService.FindUserByStudentIdAsync(id);
            if (user != null && request.Username != null && request.Username.Trim() != user.Username)
            {
                // Username change would need special handling - skip for now
            }

            var updated = await _studentService.FindByIdAsync(id);
            var updatedUser = await _userService.FindUserByStudentIdAsync(id);
            return Ok(new
            {
                updated!.Id,
                Username = updatedUser?.Username ?? "",
                updated.FirstName,
                updated.LastName,
                updated.Email,
                updated.PhoneNumber,
                updated.BranchId,
                updated.StudentId,
                updated.Status,
                updated.CreatedAt
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("students/{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        try
        {
            await _studentService.DeleteAsync(id);
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

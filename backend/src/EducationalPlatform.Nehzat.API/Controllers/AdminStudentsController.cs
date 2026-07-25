using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/students")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminStudentsController : ControllerBase
{
    private readonly IStudentService _studentService;
    private readonly IUserService _userService;
    private readonly AppDbContext _db;

    public AdminStudentsController(IStudentService studentService, IUserService userService, AppDbContext db)
    {
        _studentService = studentService;
        _userService = userService;
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllStudents()
    {
        var students = await _db.Students
            .GroupJoin(_db.Users, s => s.Id, u => u.StudentId, (s, users) => new { Student = s, Users = users })
            .SelectMany(x => x.Users.DefaultIfEmpty(), (x, u) => new
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
                x.Student.CreatedAt
            })
            .ToListAsync();
        return Ok(students);
    }

    [HttpGet("{id}")]
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

    [HttpPost]
    public async Task<IActionResult> CreateStudent([FromBody] AdminCreateStudentRequest request)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
        {
            var student = await _studentService.CreateAsync(
                request.FirstName.Trim(),
                request.LastName.Trim(),
                request.Email.Trim(),
                request.PhoneNumber?.Trim() ?? "",
                request.StudentId?.Trim() ?? $"S-{DateTime.UtcNow.Ticks % 100000}"
            );

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

            await transaction.CommitAsync();

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
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
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

            var user = await _userService.FindUserByStudentIdAsync(id);
            if (user != null && request.Username != null && request.Username.Trim() != user.Username)
            {
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

    [HttpDelete("{id}")]
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
}

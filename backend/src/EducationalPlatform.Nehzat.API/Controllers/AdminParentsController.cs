using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/parents")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminParentsController : ControllerBase
{
    private readonly IParentService _parentService;
    private readonly IUserService _userService;
    private readonly AppDbContext _db;

    public AdminParentsController(IParentService parentService, IUserService userService, AppDbContext db)
    {
        _parentService = parentService;
        _userService = userService;
        _db = db;
    }

    [HttpGet]
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
            StudentIds = Array.Empty<int>(),
            p.Status,
            p.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetParentById(int id)
    {
        var parent = await _parentService.FindByIdAsync(id);
        if (parent == null) return NotFound(GenericErrorMessages.NotFound);
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
            StudentIds = Array.Empty<int>(),
            parent.Status,
            parent.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateParent([FromBody] CreateParentRequest request)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
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
                    RoleNames.Parent,
                    request.FirstName,
                    request.LastName,
                    request.Email,
                    request.PhoneNumber
                );
            }

            await transaction.CommitAsync();

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
                StudentIds = Array.Empty<int>(),
                parent.Status,
                parent.CreatedAt
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
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
                StudentIds = Array.Empty<int>(),
                parent.Status,
                parent.CreatedAt
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteParent(int id)
    {
        try
        {
            await _parentService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpGet("{id}/students")]
    public async Task<IActionResult> GetParentStudents(int id)
    {
        var parent = await _parentService.FindByIdAsync(id);
        if (parent == null) return NotFound(GenericErrorMessages.NotFound);

        var students = await _parentService.GetStudentsInfoAsync(id);
        return Ok(students);
    }
}

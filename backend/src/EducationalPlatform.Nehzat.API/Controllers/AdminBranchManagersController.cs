using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/branch-managers")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminBranchManagersController : ControllerBase
{
    private readonly IBranchManagerService _branchManagerService;
    private readonly IUserService _userService;
    private readonly AppDbContext _db;

    public AdminBranchManagersController(IBranchManagerService branchManagerService, IUserService userService, AppDbContext db)
    {
        _branchManagerService = branchManagerService;
        _userService = userService;
        _db = db;
    }

    [HttpGet]
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

    [HttpGet("{id}")]
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

    [HttpPost]
    public async Task<IActionResult> CreateBranchManager([FromBody] CreateBranchManagerRequest request)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
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

            await transaction.CommitAsync();

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
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
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

    [HttpDelete("{id}")]
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
}

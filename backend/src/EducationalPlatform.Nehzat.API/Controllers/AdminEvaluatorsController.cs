using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("admin/evaluators")]
[Authorize(Roles = "admin,manager,headquarters")]
public class AdminEvaluatorsController : ControllerBase
{
    private readonly IEvaluatorService _evaluatorService;
    private readonly IUserService _userService;
    private readonly AppDbContext _db;

    public AdminEvaluatorsController(IEvaluatorService evaluatorService, IUserService userService, AppDbContext db)
    {
        _evaluatorService = evaluatorService;
        _userService = userService;
        _db = db;
    }

    [HttpGet]
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
            AssignedMadrasahIds = Array.Empty<int>(),
            e.NationalCode,
            e.Status,
            e.CreatedAt
        });
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetEvaluatorById(int id)
    {
        var evaluator = await _evaluatorService.FindByIdAsync(id);
        if (evaluator == null) return NotFound(GenericErrorMessages.NotFound);
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
            AssignedMadrasahIds = Array.Empty<int>(),
            evaluator.NationalCode,
            evaluator.Status,
            evaluator.CreatedAt
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateEvaluator([FromBody] CreateEvaluatorRequest request)
    {
        using var transaction = await _db.Database.BeginTransactionAsync();
        try
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
                    RoleNames.Evaluator,
                    request.FirstName,
                    request.LastName,
                    request.Email,
                    request.PhoneNumber
                );
            }

            await transaction.CommitAsync();

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
                AssignedMadrasahIds = Array.Empty<int>(),
                evaluator.NationalCode,
                evaluator.Status,
                evaluator.CreatedAt
            });
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    [HttpPut("{id}")]
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
                AssignedMadrasahIds = Array.Empty<int>(),
                evaluator.NationalCode,
                evaluator.Status,
                evaluator.CreatedAt
            });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvaluator(int id)
    {
        try
        {
            await _evaluatorService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(GenericErrorMessages.NotFound);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("study-path")]
[Authorize(Roles = "admin,manager,headquarters,branch_manager,coach,student")]
public class StudyPathController : ControllerBase
{
    private readonly IStudyPathService _studyPathService;

    public StudyPathController(IStudyPathService studyPathService)
    {
        _studyPathService = studyPathService;
    }

    #region Admin: Study Paths CRUD
    [HttpGet]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _studyPathService.GetAllStudyPathsAsync();
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    [Authorize(Roles = "admin,manager,headquarters,branch_manager")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var result = await _studyPathService.GetStudyPathAsync(id);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpPost]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Create([FromBody] CreateStudyPathRequest request)
    {
        var result = await _studyPathService.CreateStudyPathAsync(request);
        return Ok(result);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateStudyPathRequest request)
    {
        try
        {
            var result = await _studyPathService.UpdateStudyPathAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _studyPathService.DeleteStudyPathAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }
    #endregion

    #region Admin: Steps CRUD
    [HttpPost("{id:int}/steps")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> AddStep(int id, [FromBody] CreateStudyPathStepRequest request)
    {
        try
        {
            var result = await _studyPathService.AddStepAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpPut("steps/{stepId:int}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> UpdateStep(int stepId, [FromBody] UpdateStudyPathStepRequest request)
    {
        try
        {
            var result = await _studyPathService.UpdateStepAsync(stepId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpDelete("steps/{stepId:int}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> DeleteStep(int stepId)
    {
        try
        {
            await _studyPathService.DeleteStepAsync(stepId);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpPost("{id:int}/steps/reorder")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> ReorderSteps(int id, [FromBody] ReorderStepsRequest request)
    {
        try
        {
            await _studyPathService.ReorderStepsAsync(id, request);
            return Ok(new { message = "مراحل با موفقیت جدیداً مرتب شدند." });
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }
    #endregion

    #region Admin: Accommodations CRUD
    [HttpGet("accommodations")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> GetAllAccommodations()
    {
        var result = await _studyPathService.GetAllAccommodationsAsync();
        return Ok(result);
    }

    [HttpPost("accommodations")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> CreateAccommodation([FromBody] CreateAccommodationRequest request)
    {
        var result = await _studyPathService.CreateAccommodationAsync(request);
        return Ok(result);
    }
    #endregion

    #region Admin: Lookup Data
    [HttpGet("lookup/age-groups")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> GetAgeGroups()
    {
        var result = await _studyPathService.GetAllAgeGroupsAsync();
        return Ok(result);
    }

    [HttpGet("lookup/subject-areas")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> GetSubjectAreas()
    {
        var result = await _studyPathService.GetAllSubjectAreasAsync();
        return Ok(result);
    }
    #endregion

    #region Student: Browse + Enroll + Progress
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailable()
    {
        var username = User?.Identity?.Name ?? string.Empty;
        var result = await _studyPathService.GetAvailableStudyPathsAsync(username);
        return Ok(result);
    }

    [HttpPost("enroll/{studyPathId:int}")]
    public async Task<IActionResult> Enroll(int studyPathId)
    {
        try
        {
            var username = User?.Identity?.Name ?? string.Empty;
            var result = await _studyPathService.EnrollAsync(username, studyPathId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
        catch (InvalidOperationException)
        {
            return Conflict(new { message = GenericErrorMessages.Conflict });
        }
    }

    [HttpGet("my-paths")]
    public async Task<IActionResult> GetMyStudyPaths()
    {
        var username = User?.Identity?.Name ?? string.Empty;
        var result = await _studyPathService.GetMyStudyPathsAsync(username);
        return Ok(result);
    }

    [HttpGet("my-paths/{enrollmentId:int}")]
    public async Task<IActionResult> GetMyStudyPath(int enrollmentId)
    {
        try
        {
            var username = User?.Identity?.Name ?? string.Empty;
            var result = await _studyPathService.GetMyStudyPathAsync(username, enrollmentId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpPost("{studyPathId:int}/steps/{stepId:int}/complete")]
    public async Task<IActionResult> CompleteStep(int studyPathId, int stepId)
    {
        try
        {
            var username = User?.Identity?.Name ?? string.Empty;
            var result = await _studyPathService.CompleteStepAsync(username, studyPathId, stepId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpPost("{studyPathId:int}/steps/{stepId:int}/skip")]
    public async Task<IActionResult> SkipStep(int studyPathId, int stepId)
    {
        try
        {
            var username = User?.Identity?.Name ?? string.Empty;
            var result = await _studyPathService.SkipStepAsync(username, studyPathId, stepId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }
    #endregion

    #region Analytics
    [HttpGet("my-paths/{enrollmentId:int}/analytics")]
    public async Task<IActionResult> GetStudyPathAnalytics(int enrollmentId)
    {
        try
        {
            var username = User?.Identity?.Name ?? string.Empty;
            var result = await _studyPathService.GetStudyPathProgressAsync(username, enrollmentId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpGet("my-progress")]
    public async Task<IActionResult> GetMyOverallProgress()
    {
        var username = User?.Identity?.Name ?? string.Empty;
        var result = await _studyPathService.GetStudentOverallProgressAsync(username);
        return Ok(result);
    }

    [HttpGet("coach/branch/{branchId:int}/progress")]
    [Authorize(Roles = "coach,branch_manager,admin,manager,headquarters")]
    public async Task<IActionResult> GetCoachBranchProgress(int branchId)
    {
        try
        {
            var result = await _studyPathService.GetCoachBranchProgressAsync(branchId);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = GenericErrorMessages.NotFound });
        }
    }

    [HttpGet("coach/branch/{branchId:int}/students-progress")]
    [Authorize(Roles = "coach,branch_manager,admin,manager,headquarters")]
    public async Task<IActionResult> GetCoachStudentsProgress(int branchId)
    {
        var result = await _studyPathService.GetCoachStudentsProgressAsync(branchId);
        return Ok(result);
    }
    #endregion
}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/quran")]
[Authorize(Roles = "admin,manager,headquarters")]
public class QuranController : ControllerBase
{
    private readonly IQuranService _service;

    public QuranController(IQuranService service)
    {
        _service = service;
    }

    // Surah endpoints
    [HttpGet("surahs")]
    public async Task<IActionResult> GetAllSurahs()
    {
        return Ok(await _service.GetAllSurahsAsync());
    }

    [HttpGet("surahs/{id}")]
    public async Task<IActionResult> GetSurahById(int id)
    {
        var result = await _service.FindSurahByIdAsync(id);
        if (result == null) return NotFound(new { message = "سوره یافت نشد." });
        return Ok(result);
    }

    [HttpPost("surahs")]
    public async Task<IActionResult> CreateSurah([FromBody] CreateSurahRequest request)
    {
        try
        {
            var result = await _service.CreateSurahAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("surahs/{id}")]
    public async Task<IActionResult> UpdateSurah(int id, [FromBody] UpdateSurahRequest request)
    {
        try
        {
            var result = await _service.UpdateSurahAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("surahs/{id}")]
    public async Task<IActionResult> DeleteSurah(int id)
    {
        try
        {
            await _service.DeleteSurahAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Ayah endpoints
    [HttpGet("ayahs")]
    public async Task<IActionResult> GetAllAyahs()
    {
        return Ok(await _service.GetAllAyahsAsync());
    }

    [HttpGet("ayahs/surah/{surahId}")]
    public async Task<IActionResult> GetAyahsBySurah(int surahId)
    {
        return Ok(await _service.GetAyahsBySurahAsync(surahId));
    }

    [HttpGet("ayahs/{id}")]
    public async Task<IActionResult> GetAyahById(int id)
    {
        var result = await _service.FindAyahByIdAsync(id);
        if (result == null) return NotFound(new { message = "آیه یافت نشد." });
        return Ok(result);
    }

    [HttpPost("ayahs")]
    public async Task<IActionResult> CreateAyah([FromBody] CreateAyahRequest request)
    {
        var result = await _service.CreateAyahAsync(request);
        return Ok(result);
    }

    [HttpPut("ayahs/{id}")]
    public async Task<IActionResult> UpdateAyah(int id, [FromBody] UpdateAyahRequest request)
    {
        try
        {
            var result = await _service.UpdateAyahAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("ayahs/{id}")]
    public async Task<IActionResult> DeleteAyah(int id)
    {
        try
        {
            await _service.DeleteAyahAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // TajweedRule endpoints
    [HttpGet("tajweed-rules")]
    public async Task<IActionResult> GetAllTajweedRules()
    {
        return Ok(await _service.GetAllTajweedRulesAsync());
    }

    [HttpGet("tajweed-rules/{id}")]
    public async Task<IActionResult> GetTajweedRuleById(int id)
    {
        var result = await _service.FindTajweedRuleByIdAsync(id);
        if (result == null) return NotFound(new { message = "قانون تجوید یافت نشد." });
        return Ok(result);
    }

    [HttpPost("tajweed-rules")]
    public async Task<IActionResult> CreateTajweedRule([FromBody] CreateTajweedRuleRequest request)
    {
        try
        {
            var result = await _service.CreateTajweedRuleAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("tajweed-rules/{id}")]
    public async Task<IActionResult> UpdateTajweedRule(int id, [FromBody] UpdateTajweedRuleRequest request)
    {
        try
        {
            var result = await _service.UpdateTajweedRuleAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("tajweed-rules/{id}")]
    public async Task<IActionResult> DeleteTajweedRule(int id)
    {
        try
        {
            await _service.DeleteTajweedRuleAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // QuranStudentCourse endpoints
    [HttpGet("student-courses")]
    public async Task<IActionResult> GetAllQuranStudentCourses()
    {
        return Ok(await _service.GetAllQuranStudentCoursesAsync());
    }

    [HttpGet("student-courses/{id}")]
    public async Task<IActionResult> GetQuranStudentCourseById(int id)
    {
        var result = await _service.FindQuranStudentCourseByIdAsync(id);
        if (result == null) return NotFound(new { message = "ثبت درس قرآن یافت نشد." });
        return Ok(result);
    }

    [HttpPost("student-courses")]
    public async Task<IActionResult> CreateQuranStudentCourse([FromBody] CreateQuranStudentCourseRequest request)
    {
        try
        {
            var result = await _service.CreateQuranStudentCourseAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("student-courses/{id}")]
    public async Task<IActionResult> UpdateQuranStudentCourse(int id, [FromBody] UpdateQuranStudentCourseRequest request)
    {
        try
        {
            var result = await _service.UpdateQuranStudentCourseAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("student-courses/{id}")]
    public async Task<IActionResult> DeleteQuranStudentCourse(int id)
    {
        try
        {
            await _service.DeleteQuranStudentCourseAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // RecitationLevel endpoints
    [HttpGet("recitation-levels")]
    public async Task<IActionResult> GetAllRecitationLevels()
    {
        return Ok(await _service.GetAllRecitationLevelsAsync());
    }

    [HttpGet("recitation-levels/{id}")]
    public async Task<IActionResult> GetRecitationLevelById(int id)
    {
        var result = await _service.FindRecitationLevelByIdAsync(id);
        if (result == null) return NotFound(new { message = "سطح تجوید یافت نشد." });
        return Ok(result);
    }

    [HttpPost("recitation-levels")]
    public async Task<IActionResult> CreateRecitationLevel([FromBody] CreateRecitationLevelRequest request)
    {
        try
        {
            var result = await _service.CreateRecitationLevelAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("recitation-levels/{id}")]
    public async Task<IActionResult> UpdateRecitationLevel(int id, [FromBody] UpdateRecitationLevelRequest request)
    {
        try
        {
            var result = await _service.UpdateRecitationLevelAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("recitation-levels/{id}")]
    public async Task<IActionResult> DeleteRecitationLevel(int id)
    {
        try
        {
            await _service.DeleteRecitationLevelAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // QuranCurriculum endpoints
    [HttpGet("curricula")]
    public async Task<IActionResult> GetAllQuranCurricula()
    {
        return Ok(await _service.GetAllQuranCurriculaAsync());
    }

    [HttpGet("curricula/{id}")]
    public async Task<IActionResult> GetQuranCurriculumById(int id)
    {
        var result = await _service.FindQuranCurriculumByIdAsync(id);
        if (result == null) return NotFound(new { message = "برنامه قرآن یافت نشد." });
        return Ok(result);
    }

    [HttpPost("curricula")]
    public async Task<IActionResult> CreateQuranCurriculum([FromBody] CreateQuranCurriculumRequest request)
    {
        var result = await _service.CreateQuranCurriculumAsync(request);
        return Ok(result);
    }

    [HttpPut("curricula/{id}")]
    public async Task<IActionResult> UpdateQuranCurriculum(int id, [FromBody] UpdateQuranCurriculumRequest request)
    {
        try
        {
            var result = await _service.UpdateQuranCurriculumAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("curricula/{id}")]
    public async Task<IActionResult> DeleteQuranCurriculum(int id)
    {
        try
        {
            await _service.DeleteQuranCurriculumAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // QuranStudentProgress endpoints
    [HttpGet("progress/student/{studentId}")]
    public async Task<IActionResult> GetStudentProgress(int studentId)
    {
        return Ok(await _service.GetStudentProgressAsync(studentId));
    }

    [HttpGet("progress/{id}")]
    public async Task<IActionResult> GetProgressById(int id)
    {
        var result = await _service.FindProgressByIdAsync(id);
        if (result == null) return NotFound(new { message = "پیشرفت یافت نشد." });
        return Ok(result);
    }

    [HttpPost("progress")]
    public async Task<IActionResult> CreateProgress([FromBody] CreateProgressRequest request)
    {
        var result = await _service.CreateProgressAsync(request.StudentId, request.SurahId, request.AyahNumber, request.Percentage, request.Notes);
        return Ok(result);
    }
}

public record CreateProgressRequest(
    int StudentId,
    int SurahId,
    int AyahNumber,
    int Percentage,
    string Notes = ""
);
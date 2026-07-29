using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/hadith")]
[Authorize]
public class HadithController : ControllerBase
{
    private readonly IHadithService _service;

    public HadithController(IHadithService service)
    {
        _service = service;
    }

    // Books
    [HttpGet("books")]
    public async Task<IActionResult> GetAllBooks()
    {
        return Ok(await _service.GetAllBooksAsync());
    }

    [HttpGet("books/{id}")]
    public async Task<IActionResult> GetBookById(int id)
    {
        var result = await _service.FindBookByIdAsync(id);
        if (result == null) return NotFound(new { message = "کتاب حدیث یافت نشد." });
        return Ok(result);
    }

    [HttpPost("books")]
    public async Task<IActionResult> CreateBook([FromBody] CreateHadithBookRequest request)
    {
        try
        {
            var result = await _service.CreateBookAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("books/{id}")]
    public async Task<IActionResult> UpdateBook(int id, [FromBody] UpdateHadithBookRequest request)
    {
        try
        {
            var result = await _service.UpdateBookAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("books/{id}")]
    public async Task<IActionResult> DeleteBook(int id)
    {
        try
        {
            await _service.DeleteBookAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Chapters
    [HttpGet("books/{bookId}/chapters")]
    public async Task<IActionResult> GetChaptersByBook(int bookId)
    {
        return Ok(await _service.GetChaptersByBookAsync(bookId));
    }

    [HttpGet("chapters/{id}")]
    public async Task<IActionResult> GetChapterById(int id)
    {
        var result = await _service.FindChapterByIdAsync(id);
        if (result == null) return NotFound(new { message = "باب حدیث یافت نشد." });
        return Ok(result);
    }

    [HttpPost("chapters")]
    public async Task<IActionResult> CreateChapter([FromBody] CreateHadithChapterRequest request)
    {
        try
        {
            var result = await _service.CreateChapterAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("chapters/{id}")]
    public async Task<IActionResult> UpdateChapter(int id, [FromBody] UpdateHadithChapterRequest request)
    {
        try
        {
            var result = await _service.UpdateChapterAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("chapters/{id}")]
    public async Task<IActionResult> DeleteChapter(int id)
    {
        try
        {
            await _service.DeleteChapterAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Hadiths
    [HttpGet("chapters/{chapterId}/hadiths")]
    public async Task<IActionResult> GetHadithsByChapter(int chapterId)
    {
        return Ok(await _service.GetHadithsByChapterAsync(chapterId));
    }

    [HttpGet("hadith/{id}")]
    public async Task<IActionResult> GetHadithById(int id)
    {
        var result = await _service.FindHadithByIdAsync(id);
        if (result == null) return NotFound(new { message = "حدیث یافت نشد." });
        return Ok(result);
    }

    [HttpPost("hadith")]
    public async Task<IActionResult> CreateHadith([FromBody] CreateHadithRequest request)
    {
        try
        {
            var result = await _service.CreateHadithAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpPut("hadith/{id}")]
    public async Task<IActionResult> UpdateHadith(int id, [FromBody] UpdateHadithRequest request)
    {
        try
        {
            var result = await _service.UpdateHadithAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("hadith/{id}")]
    public async Task<IActionResult> DeleteHadith(int id)
    {
        try
        {
            await _service.DeleteHadithAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // Progress & Review
    [HttpGet("review/due")]
    public async Task<IActionResult> GetDueForReview([FromQuery] int count = 10)
    {
        // TODO: userId extraction from claims should be implemented
        return Ok(await _service.GetDueForReviewAsync(count));
    }

    [HttpPost("review")]
    public async Task<IActionResult> SubmitReview([FromBody] SubmitReviewRequest request)
    {
        try
        {
            var result = await _service.SubmitReviewAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    [HttpGet("progress/summary")]
    public async Task<IActionResult> GetProgressSummary()
    {
        // TODO: userId extraction from claims should be implemented
        return Ok(await _service.GetProgressSummaryAsync());
    }

    [HttpGet("progress/{hadithId}")]
    public async Task<IActionResult> GetUserProgress(int hadithId)
    {
        // TODO: userId extraction from claims should be implemented
        var result = await _service.GetUserProgressAsync(hadithId);
        if (result == null) return NotFound(new { message = "پیشرفت حدیث یافت نشد." });
        return Ok(result);
    }

    // Assessments
    [HttpGet("chapters/{chapterId}/assessments")]
    public async Task<IActionResult> GetAssessmentsByChapter(int chapterId)
    {
        return Ok(await _service.GetAssessmentsByChapterAsync(chapterId));
    }

    [HttpPost("assessments")]
    public async Task<IActionResult> CreateAssessment([FromBody] CreateHadithAssessmentRequest request)
    {
        try
        {
            var result = await _service.CreateAssessmentAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }

    // Dashboard
    [HttpGet("dashboard-stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        return Ok(await _service.GetDashboardStatsAsync());
    }
}

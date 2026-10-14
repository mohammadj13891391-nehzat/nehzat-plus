using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/vocabulary")]
[Authorize(Roles = "admin,manager,headquarters,parent,student,branch_manager,coach,evaluator")]
public class VocabularyController : ControllerBase
{
    private readonly IVocabularyService _vocabularyService;
    private readonly AppDbContext _db;

    public VocabularyController(IVocabularyService vocabularyService, AppDbContext db)
    {
        _vocabularyService = vocabularyService;
        _db = db;
    }

    #region Vocabulary Text Endpoints

    [HttpPost("texts")]
    public async Task<IActionResult> CreateText([FromBody] VocabularyTextCreateRequest request)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var text = await _vocabularyService.CreateTextAsync(request, userId);
        return Ok(text);
    }

    [HttpPut("texts/{textId}")]
    public async Task<IActionResult> UpdateText(int textId, [FromBody] VocabularyTextUpdateRequest request)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var text = await _vocabularyService.UpdateTextAsync(textId, request, userId);
        return Ok(text);
    }

    [HttpDelete("texts/{textId}")]
    public async Task<IActionResult> DeleteText(int textId)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        await _vocabularyService.DeleteTextAsync(textId, userId);
        return NoContent();
    }

    [HttpGet("texts")]
    public async Task<IActionResult> GetTexts([FromQuery] string? language, [FromQuery] bool? isPublished)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var texts = await _vocabularyService.GetTextsAsync(language, isPublished, userId);
        return Ok(texts);
    }

    [HttpGet("texts/{textId}")]
    public async Task<IActionResult> GetTextById(int textId)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var text = await _vocabularyService.GetTextByIdAsync(textId, userId);
        return Ok(text);
    }

    #endregion

    #region Vocabulary Word Endpoints

    [HttpPost("texts/{textId}/words")]
    public async Task<IActionResult> CreateWord(int textId, [FromBody] VocabularyWordCreateRequest request)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        // Ensure the text belongs to the user or they have admin rights
        var text = await _db.VocabularyTexts.FindAsync(textId);
        if (text == null) return NotFound("متن vocab یافت نشد");

        var word = await _vocabularyService.CreateWordAsync(request, userId);
        return Ok(word);
    }

    [HttpPut("words/{wordId}")]
    public async Task<IActionResult> UpdateWord(int wordId, [FromBody] VocabularyWordUpdateRequest request)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var word = await _vocabularyService.UpdateWordAsync(wordId, request, userId);
        return Ok(word);
    }

    [HttpDelete("words/{wordId}")]
    public async Task<IActionResult> DeleteWord(int wordId)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        await _vocabularyService.DeleteWordAsync(wordId, userId);
        return NoContent();
    }

    [HttpGet("words/text/{textId}")]
    public async Task<IActionResult> GetWordsByText(int textId)
    {
        var words = await _vocabularyService.GetWordsByTextAsync(textId, string.Empty);
        return Ok(words);
    }

    [HttpGet("words/{wordId}")]
    public async Task<IActionResult> GetWordById(int wordId)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var word = await _vocabularyService.GetWordByIdAsync(wordId, userId);
        return Ok(word);
    }

    #endregion

    #region User Vocabulary Card Endpoints

    [HttpGet("cards/due")]
    public async Task<IActionResult> GetDueCards()
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var cards = await _vocabularyService.GetDueCardsAsync(int.Parse(userId));
        return Ok(cards);
    }

    [HttpGet("cards/learning")]
    public async Task<IActionResult> GetLearningCards()
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var cards = await _vocabularyService.GetLearningCardsAsync(int.Parse(userId));
        return Ok(cards);
    }

    [HttpGet("cards/review")]
    public async Task<IActionResult> GetReviewCards()
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var cards = await _vocabularyService.GetReviewCardsAsync(int.Parse(userId));
        return Ok(cards);
    }

    [HttpPost("cards/{cardId}/review")]
    public async Task<IActionResult> ReviewCard(int cardId, [FromBody] UserVocabularyReviewRequest request)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var card = await _vocabularyService.ReviewCardAsync(int.Parse(userId), cardId, request.Quality);
        return Ok(card);
    }

    #endregion

    #region Search Endpoints

    [HttpPost("search")]
    public async Task<IActionResult> SearchCards([FromBody] VocabularySearchDto searchDto)
    {
        var userId = User.FindFirst("userId")?.Value 
                     ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                     ?? string.Empty;

        var result = await _vocabularyService.SearchCardsAsync(searchDto, int.Parse(userId));
        return Ok(result);
    }

    #endregion
}
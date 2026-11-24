using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers;

[ApiController]
[Route("api/ai")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiService _aiService;

    public AiController(IAiService aiService)
    {
        _aiService = aiService;
    }

    private bool TryGetUserId(out int userId)
    {
        return int.TryParse(User.FindFirst("userId")?.Value, out userId);
    }

    [HttpPost("transcribe")]
    [RequestSizeLimit(15 * 1024 * 1024)]
    public async Task<IActionResult> Transcribe(IFormFile? file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("فایل صوتی ارسال نشده است.");

        try
        {
            using var stream = file.OpenReadStream();
            var text = await _aiService.TranscribeAudioAsync(stream, file.FileName);
            return Ok(new { text });
        }
        catch (InvalidOperationException)
        {
            return BadRequest("سرویس تبدیل صوت به متن در دسترس نیست (کلید هوش مصنوعی تنظیم نشده است).");
        }
    }

    [HttpPost("chat")]
    public async Task<IActionResult> Chat([FromBody] AiChatRequest request)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var result = await _aiService.AskAsync(userId, request);
        return Ok(result);
    }

    [HttpPost("chat/stream")]
    public async Task StreamChat([FromBody] AiChatRequest request)
    {
        if (!TryGetUserId(out var userId))
        {
            Response.StatusCode = StatusCodes.Status401Unauthorized;
            return;
        }
        Response.Headers.Append("Content-Type", "text/event-stream");
        Response.Headers.Append("Cache-Control", "no-cache");
        Response.Headers.Append("Connection", "keep-alive");

        await _aiService.StreamAskAsync(userId, request, async (token) =>
        {
            await Response.WriteAsync($"data: {JsonSerializer.Serialize(new { token })}\n\n");
            await Response.Body.FlushAsync();
        });

        await Response.WriteAsync("data: [DONE]\n\n");
        await Response.Body.FlushAsync();
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var conversations = await _aiService.GetConversationsAsync(userId);
        return Ok(conversations);
    }

    [HttpGet("conversations/{id}")]
    public async Task<IActionResult> GetConversation(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        var conversation = await _aiService.GetConversationAsync(id, userId);
        if (conversation == null)
            return NotFound();
        return Ok(conversation);
    }

    [HttpDelete("conversations/{id}")]
    public async Task<IActionResult> DeleteConversation(int id)
    {
        if (!TryGetUserId(out var userId))
            return Unauthorized();
        await _aiService.DeleteConversationAsync(id, userId);
        return NoContent();
    }

    [HttpGet("knowledge")]
    [Authorize(Roles = "admin,manager,headquarters,coach")]
    public async Task<IActionResult> GetKnowledgeDocuments([FromQuery] int? maktabId)
    {
        var documents = await _aiService.GetKnowledgeDocumentsAsync(maktabId);
        return Ok(documents);
    }

    [HttpPost("knowledge")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> CreateKnowledgeDocument([FromBody] CreateKnowledgeDocumentRequest request)
    {
        var document = await _aiService.CreateKnowledgeDocumentAsync(request);
        return CreatedAtAction(nameof(GetKnowledgeDocuments), new { id = document.Id }, document);
    }

    [HttpDelete("knowledge/{id}")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> DeleteKnowledgeDocument(int id)
    {
        await _aiService.DeleteKnowledgeDocumentAsync(id);
        return NoContent();
    }

    [HttpPost("knowledge/reindex")]
    [Authorize(Roles = "admin,manager,headquarters")]
    public async Task<IActionResult> ReindexKnowledge()
    {
        await _aiService.GenerateAllEmbeddingsAsync();
        return Ok(new { message = "بازنمایه‌سازی با موفقیت آغاز شد" });
    }
}

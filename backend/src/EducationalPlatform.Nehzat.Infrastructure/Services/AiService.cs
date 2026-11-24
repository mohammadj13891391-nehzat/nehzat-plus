using System.IO;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class AiService : IAiService
{
    private readonly AppDbContext _dbContext;
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AiService> _logger;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly string _apiKey;
    private readonly string _model;
    private readonly string _embeddingModel;
    private readonly int _maxTokens;
    private readonly double _temperature;
    private readonly string _transcribeUrl;

    public AiService(
        AppDbContext dbContext,
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<AiService> logger,
        IServiceScopeFactory scopeFactory)
    {
        _dbContext = dbContext;
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        _scopeFactory = scopeFactory;

        _apiKey = configuration["AI:ApiKey"] ?? "";
        _model = configuration["AI:Model"] ?? "gpt-4o-mini";
        _embeddingModel = configuration["AI:EmbeddingModel"] ?? "text-embedding-3-small";
        _maxTokens = int.Parse(configuration["AI:MaxTokens"] ?? "2048");
        _temperature = double.Parse(configuration["AI:Temperature"] ?? "0.3");
        _transcribeUrl = configuration["AI:TranscribeUrl"] ?? "";
    }

    public async Task<AiChatResponse> AskAsync(int userId, AiChatRequest request)
    {
        var conversation = await GetOrCreateConversationAsync(userId, request);

        var userMessage = new AiMessage
        {
            ConversationId = conversation.Id,
            Role = "user",
            Content = request.Message,
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.AiMessages.Add(userMessage);
        await _dbContext.SaveChangesAsync();

        var relevantDocs = await SearchRelevantDocumentsAsync(request.Message, request.MaktabId, request.SubjectId);
        var context = BuildContext(relevantDocs);
        var systemPrompt = BuildSystemPrompt(context, request.MaktabId);
        var history = await GetConversationHistoryAsync(conversation.Id);
        var response = await CallLlmAsync(systemPrompt, history, request.Message);

        var assistantMessage = new AiMessage
        {
            ConversationId = conversation.Id,
            Role = "assistant",
            Content = response,
            SourcesJson = JsonSerializer.Serialize(relevantDocs.Select(d => new
            {
                d.Id,
                d.Title,
                d.DocumentType,
                RelevanceScore = 0.85
            })),
            CreatedAt = DateTime.UtcNow
        };
        _dbContext.AiMessages.Add(assistantMessage);

        if (conversation.Title == null)
        {
            conversation.Title = request.Message.Length > 50
                ? request.Message[..50] + "..."
                : request.Message;
        }

        await _dbContext.SaveChangesAsync();

        return new AiChatResponse
        {
            ConversationId = conversation.Id,
            Response = response,
            Sources = relevantDocs.Select(d => new SourceDto
            {
                DocumentId = d.Id,
                Title = d.Title,
                DocumentType = d.DocumentType,
                RelevanceScore = 0.85
            }).ToList(),
            CreatedAt = assistantMessage.CreatedAt
        };
    }

    public async Task<AiChatResponse> StreamAskAsync(int userId, AiChatRequest request,
        Func<string, Task> onTokenReceived)
    {
        var result = await AskAsync(userId, request);
        await onTokenReceived(result.Response);
        return result;
    }

    public async Task<string> TranscribeAudioAsync(Stream audioStream, string fileName)
    {
        // Local (keyless) transcription server takes priority when configured.
        if (!string.IsNullOrEmpty(_transcribeUrl))
        {
            using var localForm = new MultipartFormDataContent();
            var localFile = new StreamContent(audioStream);
            localFile.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            localForm.Add(localFile, "file", fileName);
            localForm.Add(new StringContent("fa"), "language");

            using var localRequest = new HttpRequestMessage(HttpMethod.Post, _transcribeUrl)
            {
                Content = localForm
            };

            try
            {
                using var localResponse = await _httpClient.SendAsync(localRequest);
                var localJson = await localResponse.Content.ReadAsStringAsync();

                if (!localResponse.IsSuccessStatusCode)
                {
                    _logger.LogError("Local transcription failed with status {StatusCode}: {Body}",
                        localResponse.StatusCode,
                        localJson.Length > 500 ? localJson[..500] : localJson);
                    throw new InvalidOperationException("Local transcription request failed.");
                }

                var localResult = JsonSerializer.Deserialize<TranscribeResponse>(localJson);
                return localResult?.Text ?? string.Empty;
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError("Local transcription server unreachable at {Url}: {Msg}", _transcribeUrl, ex.Message);
                throw new InvalidOperationException("Local transcription server is not reachable.");
            }
        }

        // Fallback: OpenAI (requires API key).
        if (string.IsNullOrEmpty(_apiKey))
            throw new InvalidOperationException("AI key is not configured.");

        using var form = new MultipartFormDataContent();
        var fileContent = new StreamContent(audioStream);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("audio/mpeg");
        form.Add(fileContent, "file", fileName);
        form.Add(new StringContent("whisper-1"), "model");
        form.Add(new StringContent("fa"), "language");

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/audio/transcriptions")
        {
            Content = form
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        using var response = await _httpClient.SendAsync(request);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Transcription failed with status {StatusCode}: {Body}",
                response.StatusCode,
                responseJson.Length > 500 ? responseJson[..500] : responseJson);
            throw new InvalidOperationException("Transcription request failed.");
        }

        var result = JsonSerializer.Deserialize<TranscribeResponse>(responseJson);
        return result?.Text ?? string.Empty;
    }

    public async Task<List<ConversationDto>> GetConversationsAsync(int userId)
    {
        return await _dbContext.AiConversations
            .Where(c => c.UserId == userId)
            .Select(c => new ConversationDto
            {
                Id = c.Id,
                Title = c.Title,
                MessageCount = c.Messages.Count,
                LastMessage = c.Messages
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => m.Content.Length > 100 ? m.Content.Substring(0, 100) + "..." : m.Content)
                    .FirstOrDefault(),
                CreatedAt = c.CreatedAt
            })
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<ConversationDetailDto?> GetConversationAsync(int conversationId, int userId)
    {
        var conversation = await _dbContext.AiConversations
            .Include(c => c.Messages.OrderBy(m => m.CreatedAt))
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId);

        if (conversation == null) return null;

        return new ConversationDetailDto
        {
            Id = conversation.Id,
            Title = conversation.Title,
            Messages = conversation.Messages.Select(m => new MessageDto
            {
                Id = m.Id,
                Role = m.Role,
                Content = m.Content,
                Sources = m.SourcesJson != null
                    ? JsonSerializer.Deserialize<List<SourceDto>>(m.SourcesJson)
                    : null,
                CreatedAt = m.CreatedAt
            }).ToList(),
            CreatedAt = conversation.CreatedAt
        };
    }

    public async Task DeleteConversationAsync(int conversationId, int userId)
    {
        var conversation = await _dbContext.AiConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId && c.UserId == userId);

        if (conversation != null)
        {
            _dbContext.AiConversations.Remove(conversation);
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<List<KnowledgeDocumentDto>> GetKnowledgeDocumentsAsync(int? maktabId = null)
    {
        var query = _dbContext.KnowledgeDocuments
            .Where(d => d.IsActive);

        if (maktabId.HasValue)
            query = query.Where(d => d.MaktabId == null || d.MaktabId == maktabId.Value);

        return await query
            .Select(d => new KnowledgeDocumentDto
            {
                Id = d.Id,
                Title = d.Title,
                Content = d.Content.Length > 200 ? d.Content.Substring(0, 200) + "..." : d.Content,
                DocumentType = d.DocumentType,
                SubjectId = d.SubjectId,
                MaktabId = d.MaktabId,
                IsActive = d.IsActive,
                CreatedAt = d.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<KnowledgeDocumentDto> CreateKnowledgeDocumentAsync(CreateKnowledgeDocumentRequest request)
    {
        var document = new KnowledgeDocument
        {
            Title = request.Title,
            Content = request.Content,
            DocumentType = request.DocumentType,
            SubjectId = request.SubjectId,
            MaktabId = request.MaktabId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _dbContext.KnowledgeDocuments.Add(document);
        await _dbContext.SaveChangesAsync();

        var documentId = document.Id;

        _ = Task.Run(async () =>
        {
            using var scope = _scopeFactory.CreateScope();
            var aiService = scope.ServiceProvider.GetRequiredService<IAiService>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<AiService>>();

            try
            {
                await aiService.GenerateEmbeddingsAsync(documentId);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to generate embedding for document {DocumentId}", documentId);
            }
        });

        return new KnowledgeDocumentDto
        {
            Id = document.Id,
            Title = document.Title,
            Content = document.Content,
            DocumentType = document.DocumentType,
            SubjectId = document.SubjectId,
            MaktabId = document.MaktabId,
            IsActive = document.IsActive,
            CreatedAt = document.CreatedAt
        };
    }

    public async Task DeleteKnowledgeDocumentAsync(int id)
    {
        var document = await _dbContext.KnowledgeDocuments.FindAsync(id);
        if (document != null)
        {
            document.IsActive = false;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task GenerateEmbeddingsAsync(int documentId)
    {
        var document = await _dbContext.KnowledgeDocuments.FindAsync(documentId);
        if (document == null || string.IsNullOrEmpty(document.Content)) return;

        var embedding = await GetEmbeddingAsync(document.Content);
        document.EmbeddingJson = JsonSerializer.Serialize(embedding);
        document.UpdatedAt = DateTime.UtcNow;
        await _dbContext.SaveChangesAsync();
    }

    public async Task GenerateAllEmbeddingsAsync()
    {
        var documents = await _dbContext.KnowledgeDocuments
            .Where(d => d.IsActive && (d.EmbeddingJson == null || d.EmbeddingJson == ""))
            .ToListAsync();

        foreach (var document in documents)
        {
            await GenerateEmbeddingsAsync(document.Id);
        }
    }

    private async Task<AiConversation> GetOrCreateConversationAsync(int userId, AiChatRequest request)
    {
        if (request.ConversationId.HasValue)
        {
            var conversation = await _dbContext.AiConversations
                .FirstOrDefaultAsync(c => c.Id == request.ConversationId && c.UserId == userId);

            if (conversation != null)
                return conversation;
        }

        var newConversation = new AiConversation
        {
            UserId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.AiConversations.Add(newConversation);
        await _dbContext.SaveChangesAsync();

        return newConversation;
    }

    private async Task<List<KnowledgeDocument>> SearchRelevantDocumentsAsync(
        string query, int? maktabId, int? subjectId)
    {
        var searchTerms = query.Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Select(t => t.Trim())
            .Where(t => t.Length > 2)
            .ToList();

        var documentsQuery = _dbContext.KnowledgeDocuments
            .Where(d => d.IsActive);

        if (maktabId.HasValue)
            documentsQuery = documentsQuery.Where(d => d.MaktabId == null || d.MaktabId == maktabId);

        if (subjectId.HasValue)
            documentsQuery = documentsQuery.Where(d => d.SubjectId == null || d.SubjectId == subjectId);

        var documents = await documentsQuery.ToListAsync();

        var scored = documents.Select(d => new
        {
            Document = d,
            Score = searchTerms.Sum(t =>
                d.Title.Contains(t, StringComparison.OrdinalIgnoreCase) ? 3 :
                d.Content.Contains(t, StringComparison.OrdinalIgnoreCase) ? 1 : 0)
        })
        .Where(x => x.Score > 0)
        .OrderByDescending(x => x.Score)
        .Take(5)
        .Select(x => x.Document)
        .ToList();

        return scored;
    }

    private string BuildContext(List<KnowledgeDocument> documents)
    {
        if (documents.Count == 0) return "";

        var sb = new StringBuilder();
        sb.AppendLine("--- اسناد مرجع ---");

        foreach (var doc in documents)
        {
            sb.AppendLine($"منبع: {doc.Title} ({doc.DocumentType})");
            sb.AppendLine(doc.Content.Length > 1000 ? doc.Content[..1000] + "..." : doc.Content);
            sb.AppendLine();
        }

        sb.AppendLine("--- پایان اسناد مرجع ---");
        return sb.ToString();
    }

    private string BuildSystemPrompt(string context, int? maktabId)
    {
        return $@"شما یک دستیار هوشمند آموزشی برای پلتفرم «نهضت پلاس» هستید.

وظایف شما:
1. پاسخ به سوالات آموزشی دانش‌آموزان و مربیان
2. توضیح مفاهیم درسی با زبان ساده
3. ارائه منابع و ارجاعات معتبر
4. کمک به برنامه‌ریزی تحصیلی

دستورالعمل‌ها:
- به زبان فارسی روان پاسخ دهید
- از منابع ارائه شده در context استفاده کنید
- اگر پاسخ را نمی‌دانید، صادقانه بگویید «اطلاع کافی ندارم»
- پاسخ‌ها را مختصر و مفید بدهید (حداکثر ۳ پاراگراف)
- در صورت نیاز به منابع بیشتر، از کاربر بخواهید به مربی خود مراجعه کند

{(string.IsNullOrEmpty(context) ? "" : context)}

{(maktabId.HasValue ? "زمینه پاسخگویی: مطالب مرتبط با مکتب جاری" : "")}

لطفاً به سوال کاربر پاسخ دهید:";
    }

    private async Task<List<AiMessage>> GetConversationHistoryAsync(int conversationId)
    {
        return await _dbContext.AiMessages
            .Where(m => m.ConversationId == conversationId)
            .OrderByDescending(m => m.CreatedAt)
            .Take(10)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
    }

    private async Task<string> CallLlmAsync(string systemPrompt, List<AiMessage> history, string userMessage)
    {
        var messages = new List<object>
        {
            new { role = "system", content = systemPrompt }
        };

        foreach (var msg in history)
        {
            messages.Add(new { role = msg.Role, content = msg.Content });
        }

        messages.Add(new { role = "user", content = userMessage });

        var requestBody = new
        {
            model = _model,
            messages,
            max_tokens = _maxTokens,
            temperature = _temperature
        };

        var json = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
        {
            Content = content
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

        using var response = await _httpClient.SendAsync(request);

        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("LLM call failed with status {StatusCode}: {ResponseBody}",
                response.StatusCode,
                responseJson.Length > 500 ? responseJson[..500] : responseJson);
            throw new InvalidOperationException("LLM request failed.");
        }

        var result = JsonSerializer.Deserialize<OpenAiResponse>(responseJson);
        var answer = result?.Choices?.FirstOrDefault()?.Message?.Content;

        if (string.IsNullOrWhiteSpace(answer))
        {
            _logger.LogError("LLM returned no content: {ResponseBody}",
                responseJson.Length > 500 ? responseJson[..500] : responseJson);
            throw new InvalidOperationException("LLM request returned no content.");
        }

        return answer;
    }

    private async Task<float[]> GetEmbeddingAsync(string text)
    {
        try
        {
            var requestBody = new
            {
                model = _embeddingModel,
                input = text.Length > 8000 ? text[..8000] : text
            };

            var json = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/embeddings")
            {
                Content = content
            };
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            using var response = await _httpClient.SendAsync(request);

            response.EnsureSuccessStatusCode();

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<EmbeddingResponse>(responseJson);

            return result?.Data?.FirstOrDefault()?.Embedding ?? Array.Empty<float>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Embedding generation failed");
            return Array.Empty<float>();
        }
    }

    private class TranscribeResponse
    {
        [JsonPropertyName("text")]
        public string? Text { get; set; }
    }

    private class OpenAiResponse
    {
        [JsonPropertyName("choices")]
        public List<Choice>? Choices { get; set; }
    }

    private class Choice
    {
        [JsonPropertyName("message")]
        public OpenAiMessage? Message { get; set; }
    }

    private class OpenAiMessage
    {
        [JsonPropertyName("content")]
        public string? Content { get; set; }
    }

    private class EmbeddingResponse
    {
        [JsonPropertyName("data")]
        public List<EmbeddingData>? Data { get; set; }
    }

    private class EmbeddingData
    {
        [JsonPropertyName("embedding")]
        public float[]? Embedding { get; set; }
    }
}

using System.IO;
using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IAiService
{
    Task<AiChatResponse> AskAsync(int userId, AiChatRequest request);
    Task<string> TranscribeAudioAsync(Stream audioStream, string fileName);
    Task<AiChatResponse> StreamAskAsync(int userId, AiChatRequest request, Func<string, Task> onTokenReceived);
    Task<List<ConversationDto>> GetConversationsAsync(int userId);
    Task<ConversationDetailDto?> GetConversationAsync(int conversationId, int userId);
    Task DeleteConversationAsync(int conversationId, int userId);
    Task<List<KnowledgeDocumentDto>> GetKnowledgeDocumentsAsync(int? maktabId = null);
    Task<KnowledgeDocumentDto> CreateKnowledgeDocumentAsync(CreateKnowledgeDocumentRequest request);
    Task DeleteKnowledgeDocumentAsync(int id);
    Task GenerateEmbeddingsAsync(int documentId);
    Task GenerateAllEmbeddingsAsync();
}

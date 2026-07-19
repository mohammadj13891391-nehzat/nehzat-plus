namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface ILogService
{
    Task LogErrorAsync(string source, Exception exception, string? userId = null, string? ipAddress = null, string? traceId = null);
    Task LogAsync(string level, string source, string message, string? userId = null, string? ipAddress = null, string? traceId = null, string? exceptionDetails = null);
}

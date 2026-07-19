using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class LogService : ILogService
{
    private readonly AppDbContext _db;

    public LogService(AppDbContext db)
    {
        _db = db;
    }

    public async Task LogErrorAsync(string source, Exception exception, string? userId = null, string? ipAddress = null, string? traceId = null)
    {
        await LogAsync("Error", source, exception.Message, userId, ipAddress, traceId, exception.ToString());
    }

    public async Task LogAsync(string level, string source, string message, string? userId = null, string? ipAddress = null, string? traceId = null, string? exceptionDetails = null)
    {
        try
        {
            _db.LogEntries.Add(new LogEntry
            {
                Timestamp = DateTime.UtcNow,
                Level = level,
                Source = source,
                UserId = userId,
                IpAddress = ipAddress,
                TraceId = traceId,
                Message = message,
                ExceptionDetails = exceptionDetails
            });
            await _db.SaveChangesAsync();
        }
        catch
        {
            // Logging must never throw — swallow to avoid cascading failures.
        }
    }
}

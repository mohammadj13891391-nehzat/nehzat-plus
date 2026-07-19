using System.Net;
using System.Text.Json;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Middleware;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ILogService logService)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var userId = context.User?.FindFirst("sub")?.Value
                         ?? context.User?.FindFirst("userId")?.Value;
            var ip = context.Connection?.RemoteIpAddress?.ToString();
            var traceId = context.TraceIdentifier;

            await logService.LogErrorAsync("GlobalExceptionMiddleware", ex, userId, ip, traceId);

            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsync(JsonSerializer.Serialize(new
            {
                message = "خطای داخلی سرور. لطفاً بعداً دوباره تلاش کنید"
            }));
        }
    }
}

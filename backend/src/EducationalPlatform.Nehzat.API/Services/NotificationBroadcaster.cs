using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using EducationalPlatform.Nehzat.API.Hubs;

namespace EducationalPlatform.Nehzat.API.Services;

public sealed class NotificationBroadcaster : INotificationBroadcaster
{
    private readonly IHubContext<NotificationHub> _hub;
    private readonly INotificationService _notifications;

    public NotificationBroadcaster(IHubContext<NotificationHub> hub, INotificationService notifications)
    {
        _hub = hub;
        _notifications = notifications;
    }

    public async Task NotifyAsync(int userId, string username, string type, string title, string body, string? link = null)
    {
        var dto = await _notifications.NotifyAsync(userId, type, title, body, link);

        await _hub.Clients.Group($"user-{username}").SendAsync("ReceiveNotification", new
        {
            dto.Id,
            dto.Type,
            dto.Title,
            dto.Body,
            dto.Link,
            ts = dto.CreatedAt
        });
    }
}

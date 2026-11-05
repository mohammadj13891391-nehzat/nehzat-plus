using EducationalPlatform.Nehzat.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using EducationalPlatform.Nehzat.API.Hubs;

namespace EducationalPlatform.Nehzat.API.Services;

public sealed class NotificationBroadcaster : INotificationBroadcaster
{
    private readonly IHubContext<NotificationHub> _hub;

    public NotificationBroadcaster(IHubContext<NotificationHub> hub)
    {
        _hub = hub;
    }

    public Task BroadcastAsync(string username, string title, string body)
    {
        return _hub.Clients.Group($"user-{username}").SendAsync("ReceiveNotification", new { title, body, ts = DateTime.UtcNow });
    }
}

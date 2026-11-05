namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface INotificationBroadcaster
{
    Task NotifyAsync(int userId, string username, string type, string title, string body, string? link = null);
}

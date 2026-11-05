namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface INotificationBroadcaster
{
    Task BroadcastAsync(string username, string title, string body);
}

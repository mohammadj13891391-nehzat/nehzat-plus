namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface IFcmPushService
{
    bool IsEnabled { get; }

    Task PushAsync(
        IReadOnlyList<string> deviceTokens,
        string type,
        string title,
        string body,
        string? link = null,
        int? notificationId = null);
}

using EducationalPlatform.Nehzat.Application.DTOs;

namespace EducationalPlatform.Nehzat.Application.Interfaces;

public interface INotificationService
{
    Task<NotificationSummaryDto> GetSummaryAsync(int userId, int limit = 20);
    Task<NotificationDto> MarkReadAsync(int userId, int notificationId);
    Task<int> MarkAllReadAsync(int userId);
    Task DeleteAsync(int userId, int notificationId);
    Task<NotificationDto> SendAsync(int senderUserId, SendNotificationRequest req);
    Task<NotificationDto> NotifyAsync(int recipientUserId, string type, string title, string body, string? link = null);
    Task RegisterDeviceAsync(int userId, RegisterDeviceRequest req);
    Task<int> GetUnreadCountAsync(int userId);
}

public interface ICourierReportService
{
    Task<CourierStatsDto> GetCourierStatsAsync(int userId, int courierUserId, DateTime from, DateTime to);
    Task<CourierLeaderboardDto> GetLeaderboardAsync(int userId, DateTime from, DateTime to, int limit = 10);
}

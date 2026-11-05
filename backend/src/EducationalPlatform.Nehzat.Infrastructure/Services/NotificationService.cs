using EducationalPlatform.Nehzat.Application.Constants;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Exceptions;
using EducationalPlatform.Nehzat.Application.Interfaces;
using EducationalPlatform.Nehzat.Domain.Entities;
using EducationalPlatform.Nehzat.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EducationalPlatform.Nehzat.Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly AppDbContext _db;
    private readonly IFcmPushService _fcm;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(AppDbContext db, IFcmPushService fcm, ILogger<NotificationService> logger)
    {
        _db = db;
        _fcm = fcm;
        _logger = logger;
    }

    public async Task<NotificationSummaryDto> GetSummaryAsync(int userId, int limit = 20)
    {
        var today = DateTime.UtcNow.Date;
        var totalCount = await _db.UserNotifications.CountAsync(un => un.UserId == userId);
        var unreadCount = await _db.UserNotifications.CountAsync(un => un.UserId == userId && !un.IsRead);
        var todayCount = await _db.UserNotifications.CountAsync(un => un.UserId == userId && un.CreatedAt >= today);

        var recentRows = await _db.UserNotifications
            .Where(un => un.UserId == userId)
            .Include(un => un.Notification)
            .OrderByDescending(un => un.Notification.CreatedAt)
            .Take(limit)
            .ToListAsync();

        return new NotificationSummaryDto
        {
            TotalCount = totalCount,
            UnreadCount = unreadCount,
            TodayCount = todayCount,
            Recent = recentRows.Select(un => ToDto(un.Notification, un)).ToList()
        };
    }

    public async Task<NotificationDto> MarkReadAsync(int userId, int notificationId)
    {
        var userNotification = await _db.UserNotifications
            .Include(un => un.Notification)
            .FirstOrDefaultAsync(un => un.UserId == userId && un.NotificationId == notificationId)
            ?? throw new KeyNotFoundException("اعلان یافت نشد");

        if (!userNotification.IsRead)
        {
            userNotification.IsRead = true;
            userNotification.ReadAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return ToDto(userNotification.Notification, userNotification);
    }

    public async Task<int> MarkAllReadAsync(int userId)
    {
        var unread = await _db.UserNotifications
            .Where(un => un.UserId == userId && !un.IsRead)
            .ToListAsync();

        var now = DateTime.UtcNow;
        foreach (var item in unread)
        {
            item.IsRead = true;
            item.ReadAt = now;
        }

        if (unread.Count > 0)
        {
            await _db.SaveChangesAsync();
        }

        return unread.Count;
    }

    public async Task DeleteAsync(int userId, int notificationId)
    {
        var userNotification = await _db.UserNotifications
            .FirstOrDefaultAsync(un => un.UserId == userId && un.NotificationId == notificationId);

        if (userNotification is null)
        {
            return;
        }

        _db.UserNotifications.Remove(userNotification);

        var remainingRecipients = await _db.UserNotifications
            .AnyAsync(un => un.NotificationId == notificationId);

        if (!remainingRecipients)
        {
            var notification = await _db.Notifications.FindAsync(notificationId);
            if (notification is not null)
            {
                _db.Notifications.Remove(notification);
            }
        }

        await _db.SaveChangesAsync();
    }

    public async Task<NotificationDto> SendAsync(int senderUserId, SendNotificationRequest req)
    {
        if (req.UserIds.Length == 0)
        {
            throw new InvalidOperationException("حداقل یک دریافت‌کننده انتخاب کنید");
        }

        var sender = await _db.Users.FirstOrDefaultAsync(u => u.Id == senderUserId)
            ?? throw new KeyNotFoundException("فرستنده یافت نشد");

        var isPrivileged = sender.UserType == RoleNames.Admin || sender.UserType == RoleNames.Manager || sender.UserType == RoleNames.Headquarters;

        if (!isPrivileged && req.UserIds.Any(uid => uid != senderUserId))
        {
            throw new ForbiddenException(GenericErrorMessages.Forbidden);
        }

        var uniqueUserIds = req.UserIds.Distinct().ToList();
        var notification = new Notification
        {
            Type = req.Type,
            Title = req.Title,
            Body = req.Body,
            Link = req.Link,
            SenderUserId = senderUserId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();

        _db.UserNotifications.AddRange(uniqueUserIds.Select(uid => new UserNotification
        {
            NotificationId = notification.Id,
            UserId = uid,
            CreatedAt = DateTime.UtcNow
        }));
        await _db.SaveChangesAsync();

        await PushToUsersAsync(uniqueUserIds, notification.Type, notification.Title, notification.Body, notification.Link, notification.Id);

        return ToDto(notification, new UserNotification { NotificationId = notification.Id, UserId = senderUserId });
    }

    private async Task PushToUsersAsync(IReadOnlyList<int> userIds, string type, string title, string body, string? link, int notificationId)
    {
        try
        {
            var tokens = await _db.UserDevices
                .Where(d => userIds.Contains(d.UserId) && d.Platform == "android")
                .Select(d => d.DeviceToken)
                .ToListAsync();

            if (tokens.Count > 0)
            {
                await _fcm.PushAsync(tokens, type, title, body, link, notificationId);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Notification push fan-out failed");
        }
    }

    public async Task<NotificationDto> NotifyAsync(int recipientUserId, string type, string title, string body, string? link = null)
    {
        var notification = new Notification
        {
            Type = type,
            Title = title,
            Body = body,
            Link = link,
            CreatedAt = DateTime.UtcNow
        };

        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();

        var userNotification = new UserNotification
        {
            NotificationId = notification.Id,
            UserId = recipientUserId,
            CreatedAt = DateTime.UtcNow
        };
        _db.UserNotifications.Add(userNotification);
        await _db.SaveChangesAsync();

        await PushToUsersAsync(new[] { recipientUserId }, type, title, body, link, notification.Id);

        return ToDto(notification, userNotification);
    }

    public async Task RegisterDeviceAsync(int userId, RegisterDeviceRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.DeviceToken))
        {
            throw new InvalidOperationException("شناسه دستگاه الزامی است");
        }

        var existing = await _db.UserDevices
            .FirstOrDefaultAsync(d => d.DeviceToken == req.DeviceToken);

        if (existing is null)
        {
            _db.UserDevices.Add(new UserDevice
            {
                UserId = userId,
                DeviceToken = req.DeviceToken,
                Platform = req.Platform,
                DeviceName = req.DeviceName,
                RegisteredAt = DateTime.UtcNow,
                LastSeenAt = DateTime.UtcNow
            });
        }
        else
        {
            existing.UserId = userId;
            existing.Platform = req.Platform;
            existing.DeviceName = req.DeviceName;
            existing.LastSeenAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _db.UserNotifications.CountAsync(un => un.UserId == userId && !un.IsRead);
    }

    private static NotificationDto ToDto(Notification n, UserNotification un) => new()
    {
        Id = n.Id,
        Type = n.Type,
        Title = n.Title,
        Body = n.Body,
        Link = n.Link,
        IconUrl = n.IconUrl,
        SenderUserId = n.SenderUserId,
        CreatedAt = n.CreatedAt,
        IsRead = un.IsRead,
        ReadAt = un.ReadAt
    };
}

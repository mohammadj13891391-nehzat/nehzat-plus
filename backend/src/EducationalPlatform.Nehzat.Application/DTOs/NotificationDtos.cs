namespace EducationalPlatform.Nehzat.Application.DTOs;

public class NotificationDto
{
    public int Id { get; set; }
    public string Type { get; set; } = "info";
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? Link { get; set; }
    public string? IconUrl { get; set; }
    public int? SenderUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
}

public class SendNotificationRequest
{
    public int[] UserIds { get; set; } = Array.Empty<int>();
    public string Type { get; set; } = "info";
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? Link { get; set; }
}

public class NotificationSummaryDto
{
    public int TotalCount { get; set; }
    public int UnreadCount { get; set; }
    public int TodayCount { get; set; }
    public List<NotificationDto> Recent { get; set; } = new();
}

public class RegisterDeviceRequest
{
    public string DeviceToken { get; set; } = string.Empty;
    public string Platform { get; set; } = "web";
    public string? DeviceName { get; set; }
}

public class InternalNotificationRequest
{
    public string Phone { get; set; } = string.Empty;
    public string Type { get; set; } = "info";
    public string Title { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? Link { get; set; }
}

public class CourierStatsDto
{
    public int CourierUserId { get; set; }
    public string CourierName { get; set; } = string.Empty;
    public DateTime PeriodStart { get; set; }
    public DateTime PeriodEnd { get; set; }
    public int TotalDeliveries { get; set; }
    public decimal TotalDistance { get; set; }
    public decimal TotalEarnings { get; set; }
    public decimal DailyAverage { get; set; }
    public List<CourierDailyStatDto> DailyBreakdown { get; set; } = new();
}

public class CourierDailyStatDto
{
    public DateTime Date { get; set; }
    public int DeliveredCount { get; set; }
    public decimal DistanceKm { get; set; }
    public decimal EarningsAmount { get; set; }
    public int AverageDeliveryMinutes { get; set; }
}

public class CourierLeaderboardDto
{
    public List<CourierLeaderboardEntryDto> Entries { get; set; } = new();
}

public class CourierLeaderboardEntryDto
{
    public int Rank { get; set; }
    public int CourierUserId { get; set; }
    public string CourierName { get; set; } = string.Empty;
    public int TotalDeliveries { get; set; }
    public decimal TotalEarnings { get; set; }
}

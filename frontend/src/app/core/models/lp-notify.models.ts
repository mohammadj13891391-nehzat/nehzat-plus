export interface NotificationDto {
  id: number;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  body: string;
  link?: string;
  iconUrl?: string;
  senderUserId?: number;
  createdAt: string;
  isRead: boolean;
  readAt?: string;
}

export interface SendNotificationRequest {
  userIds: number[];
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  body: string;
  link?: string;
}

export interface NotificationSummaryDto {
  totalCount: number;
  unreadCount: number;
  todayCount: number;
  recent: NotificationDto[];
}

export interface RegisterDeviceRequest {
  deviceToken: string;
  platform: 'web' | 'android' | 'ios';
  deviceName?: string;
}



import { AttachmentDto } from './lp-core.models';

export interface ProfileDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email?: string;
  phoneNumber: string;
  nationalCode: string;
  imageUrl?: string;
  biography?: string;
  userType: string;
  maktabName: string;
  maktabNameEn?: string;
  phase?: string;
  ageCluster?: string;
  ringNumber?: number;
  age?: number;
  approvalStatus: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  biography?: string;
  imageUrl?: string;
}

export interface NotificationSettingsDto {
  newAssignment: boolean;
  submissionReviewed: boolean;
  newMember: boolean;
  sessionReminder: boolean;
  systemAnnouncement: boolean;
}

export interface UpdateNotificationSettingsRequest {
  newAssignment: boolean;
  submissionReviewed: boolean;
  newMember: boolean;
  sessionReminder: boolean;
  systemAnnouncement: boolean;
}

export interface MessagingConversationListDto {
  id: number;
  title?: string;
  type: string;
  unreadCount: number;
  lastMessage?: MessagingMessageDto;
  members: MemberBriefDto[];
  createdAt: string;
  updatedAt: string;
}

export interface MessagingConversationDetailDto {
  id: number;
  title?: string;
  type: string;
  maktabId?: number;
  createdBy: number;
  members: MemberDetailDto[];
  createdAt: string;
}

export interface CreateConversationRequest {
  title?: string;
  type: string;
  maktabId?: number;
  memberIds: number[];
}

export interface AddMemberRequest {
  userId: number;
  role: string;
}

export interface MemberBriefDto {
  userId: number;
  fullName: string;
  avatarUrl?: string;
  role: string;
}

export interface MemberDetailDto extends MemberBriefDto {
  lastReadAt?: string;
  joinedAt: string;
}

export interface MessagingMessageDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  content: string;
  messageType: string;
  replyToId?: number;
  replyTo?: MessagingMessageDto;
  isEdited: boolean;
  isDeleted: boolean;
  attachments: AttachmentDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
  messageType: string;
  replyToId?: number;
}

export interface MessagePagedResponse {
  messages: MessagingMessageDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface MarkReadRequest {
  messageIds: number[];
}

export interface UnreadCountDto {
  totalUnread: number;
  perConversation: Record<number, number>;
}

// === Phase 16: Map & Geo ===



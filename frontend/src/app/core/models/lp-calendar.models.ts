export type CalendarEventType = 'personal' | 'work' | 'holiday' | 'session' | 'exam';
export type CalendarResponseStatus = 'accepted' | 'declined' | 'tentative' | 'pending';

export interface CalendarAttendeeDto {
  userId: number;
  fullName: string;
  responseStatus: CalendarResponseStatus;
}

export interface CalendarEventDto {
  id: number;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  type: CalendarEventType;
  color: string;
  location?: string;
  creatorUserId?: number;
  isPublic: boolean;
  attendees: CalendarAttendeeDto[];
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  type: CalendarEventType;
  color: string;
  location?: string;
  isPublic: boolean;
  attendeeUserIds?: number[];
}

export type UpdateCalendarEventRequest = CreateCalendarEventRequest;

// ===== Educational Process Module =====


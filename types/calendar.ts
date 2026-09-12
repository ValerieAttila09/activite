export type ViewMode = 'day' | 'week' | 'month';

export interface CalendarFilter {
  id: string;
  name: string;
  colorHex: string;
  provider: 'PRIMARY' | 'GOOGLE' | 'OUTLOOK' | 'ICLOUD';
  isVisible: boolean;
  isOverlay: boolean;
}

export interface CalendarEvent {
  id: string;
  calendarId: string;
  taskId?: string | null;
  title: string;
  description?: string | null;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  isAllDay: boolean;
}

export interface ActiveFocusSession {
  eventId?: string;
  taskId?: string;
  title: string;
  elapsedSeconds: number;
  isRunning: boolean;
}
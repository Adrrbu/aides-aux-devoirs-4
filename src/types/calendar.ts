export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  event_type: 'task' | 'course' | 'revision';
  start_time: string;
  end_time: string;
  color?: string;
  attachment_url?: string;
  exam_id?: string;
}
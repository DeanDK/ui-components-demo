export type EventStatus = 'pending' | 'completed' | 'cancelled';
export type EventPriority = 'low' | 'medium' | 'high';

export interface Event {
  id: string;
  title: string;
  date: Date;
  description?: string;
  status: EventStatus;
  priority: EventPriority;
  category?: string;
}

export interface TimelineGroup {
  date: string;
  events: Event[];
}

import { format, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns';

import type { Event } from '@/types';

export const formatEventDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  if (isTomorrow(date)) {
    return 'Tomorrow';
  }

  return format(date, 'EEEE, MMMM d, yyyy');
};

export const formatEventTime = (date: Date): string => {
  return format(date, 'h:mm a');
};

export const groupEventsByDay = (events: Event[]): Map<string, Event[]> => {
  const grouped = new Map<string, Event[]>();

  events.forEach((event) => {
    const dayKey = startOfDay(event.date).toISOString();
    if (!grouped.has(dayKey)) {
      grouped.set(dayKey, []);
    }
    grouped.get(dayKey)!.push(event);
  });

  // Sort events within each day
  grouped.forEach((dayEvents) => {
    dayEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  return grouped;
};

export { format };

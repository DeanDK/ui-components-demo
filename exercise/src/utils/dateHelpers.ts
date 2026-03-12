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
  const groupedEventsWithinEachDay = new Map<string, Event[]>();

  events.forEach((event) => {
    const dayKey = startOfDay(event.date).toISOString();
    if (!groupedEventsWithinEachDay.has(dayKey)) {
      groupedEventsWithinEachDay.set(dayKey, []);
    }
    groupedEventsWithinEachDay.get(dayKey)!.push(event);
  });

  groupedEventsWithinEachDay.forEach((dayEvents) => {
    dayEvents.sort((a, b) => a.date.getTime() - b.date.getTime());
  });

  return groupedEventsWithinEachDay;
};

export { format };

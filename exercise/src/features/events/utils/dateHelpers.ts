import { format, isToday, isTomorrow, isYesterday, startOfDay } from 'date-fns';

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

export const groupItems = <T>(
  items: T[],
  getKey: (item: T) => string,
): Map<string, T[]> => {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    const key = getKey(item);

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(item);
  });

  return grouped;
};

export const groupItemsByDay = <T extends { date: Date }>(items: T[]) => {
  return groupItems(items, (item) => startOfDay(item.date).toISOString());
};

export { format };

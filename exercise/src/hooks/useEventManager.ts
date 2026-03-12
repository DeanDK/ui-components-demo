import { useCallback, useMemo, useState } from 'react';

import type { Event } from '@/types';
import { generateMockEvents } from '@/utils/mockData';

interface UseEventManagerOptions {
  initialCount?: number;
  timelineLimit?: number;
}

export const useEventManager = (options: UseEventManagerOptions = {}) => {
  const { initialCount = 250, timelineLimit = 50 } = options;

  const [events, setEvents] = useState<Event[]>(() =>
    generateMockEvents(initialCount),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const timelineEvents = useMemo(
    () =>
      events
        .slice()
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, timelineLimit),
    [events, timelineLimit],
  );

  const showSuccessMessage = useCallback((message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  }, []);

  const handleSaveEvent = useCallback(
    (eventData: Event) => {
      if (editingEvent) {
        setEvents((prev) =>
          prev.map((evt) => (evt.id === eventData.id ? eventData : evt)),
        );
        setEditingEvent(null);
        setIsFormOpen(false);
        showSuccessMessage('✓ Event updated successfully!');
      } else {
        const newEvent: Event = {
          ...eventData,
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        setEvents((prev) => [newEvent, ...prev]);
        setIsFormOpen(false);
        showSuccessMessage('✓ Event created successfully!');
      }
    },
    [editingEvent, showSuccessMessage],
  );

  const handleEventClick = useCallback((event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingEvent(null);
  }, []);

  const handleNewEvent = useCallback(() => {
    setEditingEvent(null);
    setIsFormOpen(true);
  }, []);

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
      showSuccessMessage('✓ Event deleted successfully!');
    },
    [showSuccessMessage],
  );

  const refreshEvents = useCallback(
    (count?: number) => {
      setEvents(generateMockEvents(count || initialCount));
      showSuccessMessage('✓ Events refreshed!');
    },
    [initialCount, showSuccessMessage],
  );

  return {
    events,
    timelineEvents,
    isFormOpen,
    editingEvent,
    successMessage,

    handleSaveEvent,
    handleEventClick,
    handleCloseForm,
    handleNewEvent,
    handleDeleteEvent,
    refreshEvents,

    setEvents,
  };
};

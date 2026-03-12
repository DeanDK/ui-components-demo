import { useCallback, useMemo, useState } from 'react';

import type { EventFormData } from '@/features/events/config/eventFormFields.tsx';
import type { Event } from '@/features/events/types';
import { generateMockEvents } from '@/features/events/utils/mockData.ts';

import type { UseEventManagerOptions } from './useEventManager.types.ts';

export const useEventManager = (options: UseEventManagerOptions = {}) => {
  const { initialCount = 250, timelineLimit = 50 } = options;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [events, setEvents] = useState<Event[]>(() =>
    generateMockEvents(initialCount),
  );

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
    (eventData: EventFormData) => {
      const newEvent: Event = {
        ...eventData,
        id: `event-${Date.now()}-${Math.random().toString(36)}`,
      };
      setEvents((prev) => [newEvent, ...prev]);
      setIsFormOpen(false);
      showSuccessMessage('Event created successfully!');
    },
    [showSuccessMessage],
  );

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingEvent(null);
  }, []);

  const handleNewEvent = useCallback(() => {
    setEditingEvent(null);
    setIsFormOpen(true);
  }, []);

  return {
    events,
    timelineEvents,
    isFormOpen,
    editingEvent,
    successMessage,

    handleSaveEvent,
    handleCloseForm,
    handleNewEvent,

    setEvents,
  };
};

import type * as React from 'react';
import { useCallback, useRef, useState } from 'react';

import type { Event } from '@/types';

interface NavigationPosition {
  groupIndex: number;
  eventIndex: number;
}

export const useTimelineNavigation = (
  groupedEvents: [string, Event[]][],
  onEventClick?: (event: Event) => void,
) => {
  const [focusedPosition, setFocusedPosition] = useState<NavigationPosition>({
    groupIndex: 0,
    eventIndex: 0,
  });
  const [announcement, setAnnouncement] = useState<string>('');
  const timelineRef = useRef<HTMLDivElement>(null);

  const totalGroups = groupedEvents.length;

  // Announce navigation for screen readers
  const announceNavigation = useCallback(
    (event: Event, position: NavigationPosition) => {
      const totalInGroup = groupedEvents[position.groupIndex]?.[1]?.length || 0;
      const dateStr = event.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      setAnnouncement(
        `${event.title}, ${dateStr} at ${event.date.toLocaleTimeString(
          'en-US',
          {
            hour: 'numeric',
            minute: '2-digit',
          },
        )}. ` +
          `Event ${position.eventIndex + 1} of ${totalInGroup} on this day. ` +
          `Day ${position.groupIndex + 1} of ${totalGroups}.`,
      );
    },
    [groupedEvents, totalGroups],
  );

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (groupedEvents.length === 0) return;

      const { groupIndex, eventIndex } = focusedPosition;
      const currentGroup = groupedEvents[groupIndex];

      if (!currentGroup) return;

      const eventsInGroup = currentGroup[1].length;
      let newPosition = { ...focusedPosition };
      let handled = false;

      switch (e.key) {
        case 'ArrowDown':
          // Next event in same group
          if (eventIndex < eventsInGroup - 1) {
            newPosition.eventIndex++;
            handled = true;
          } else if (groupIndex < totalGroups - 1) {
            // First event of next group
            newPosition.groupIndex++;
            newPosition.eventIndex = 0;
            handled = true;
          }
          break;

        case 'ArrowUp':
          // Previous event in same group
          if (eventIndex > 0) {
            newPosition.eventIndex--;
            handled = true;
          } else if (groupIndex > 0) {
            // Last event of previous group
            newPosition.groupIndex--;
            newPosition.eventIndex =
              groupedEvents[newPosition.groupIndex][1].length - 1;
            handled = true;
          }
          break;

        case 'ArrowRight':
          // Next group (day)
          if (groupIndex < totalGroups - 1) {
            newPosition.groupIndex++;
            newPosition.eventIndex = 0;
            handled = true;
          }
          break;

        case 'ArrowLeft':
          // Previous group (day)
          if (groupIndex > 0) {
            newPosition.groupIndex--;
            newPosition.eventIndex = 0;
            handled = true;
          }
          break;

        case 'Home':
          // First event of timeline
          newPosition = { groupIndex: 0, eventIndex: 0 };
          handled = true;
          break;

        case 'End':
          // Last event of timeline
          newPosition.groupIndex = totalGroups - 1;
          newPosition.eventIndex = groupedEvents[totalGroups - 1][1].length - 1;
          handled = true;
          break;

        case 'Enter':
        case ' ':
          // Activate current event
          if (onEventClick) {
            const event = groupedEvents[groupIndex][1][eventIndex];
            onEventClick(event);
            handled = true;
          }
          break;

        default:
          return;
      }

      if (handled) {
        e.preventDefault();
        setFocusedPosition(newPosition);

        const event =
          groupedEvents[newPosition.groupIndex][1][newPosition.eventIndex];
        announceNavigation(event, newPosition);

        // Focus the element
        requestAnimationFrame(() => {
          const element = timelineRef.current?.querySelector(
            `[data-group-index="${newPosition.groupIndex}"][data-event-index="${newPosition.eventIndex}"]`,
          ) as HTMLElement;
          element?.focus();
        });
      }
    },
    [
      focusedPosition,
      groupedEvents,
      totalGroups,
      onEventClick,
      announceNavigation,
    ],
  );

  return {
    focusedPosition,
    announcement,
    handleKeyDown,
    timelineRef,
  };
};

import clsx from 'clsx';
import { useMemo } from 'react';

import { groupEventsByDay } from '@/utils/dateHelpers';

import { TimelineGroup } from './components/TimelineGroup';
import { useTimelineNavigation } from './hooks/useTimelineNavigation';
import styles from './Timeline.module.css';
import type { TimelineProps } from './Timeline.types';

export function Timeline({ events, onEventClick, className }: TimelineProps) {
  const groupedEventsByDayInDescOrder = useMemo(() => {
    const grouped = groupEventsByDay(events);
    return Array.from(grouped.entries()).sort((a, b) => {
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [events]);

  const { focusedPosition, announcement, handleKeyDown, timelineRef } =
    useTimelineNavigation(groupedEventsByDayInDescOrder, onEventClick);

  if (events.length === 0) {
    return (
      <div className={clsx(styles.container, className)}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            📭
          </span>
          <p>No events to display</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(styles.container, className)}
      ref={timelineRef}
      onKeyDown={handleKeyDown}
      role="feed"
      aria-label="Event timeline"
    >
      <div
        className={styles.srOnly}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>

      <div
        className={styles.instructions}
        aria-label="Keyboard navigation instructions"
      >
        <p>
          <strong>Navigation:</strong> Use arrow keys to move between events.
          Left/Right for days, Up/Down for events. Press Enter to select.
        </p>
      </div>

      <div className={styles.timeline}>
        {groupedEventsByDayInDescOrder.map(
          ([date, groupEvents], groupIndex) => (
            <TimelineGroup
              key={date}
              date={date}
              events={groupEvents}
              onEventClick={onEventClick}
              groupIndex={groupIndex}
              isActive={focusedPosition.groupIndex === groupIndex}
            />
          ),
        )}
      </div>

      <div className={styles.summary} aria-live="polite">
        Showing {events.length} events across{' '}
        {groupedEventsByDayInDescOrder.length} days
      </div>
    </div>
  );
}

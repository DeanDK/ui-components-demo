import clsx from 'clsx';
import * as React from 'react';

import { formatEventTime } from '@/utils/dateHelpers';

import styles from '../Timeline.module.css';
import type { TimelineEventProps } from '../Timeline.types';

export function TimelineEvent({
  event,
  onEventClick,
  eventIndex,
  groupIndex,
  isFocused,
}: TimelineEventProps) {
  const priorityClass =
    styles[
      `priority${event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}`
    ];

  const statusClass =
    styles[
      `status${event.status.charAt(0).toUpperCase() + event.status.slice(1)}`
    ];

  const handleClick = () => {
    onEventClick?.(event);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onEventClick) {
      e.stopPropagation();
    }
  };

  return (
    <article
      className={clsx(styles.event, priorityClass, isFocused && styles.focused)}
      data-group-index={groupIndex}
      data-event-index={eventIndex}
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      aria-label={`${event.title} at ${formatEventTime(event.date)}, ${event.status}, ${event.priority} priority`}
    >
      <div className={styles.eventIndicator} aria-hidden="true" />

      <time className={styles.eventTime} dateTime={event.date.toISOString()}>
        {formatEventTime(event.date)}
      </time>

      <div className={styles.eventContent}>
        <h3 className={styles.eventTitle}>{event.title}</h3>

        {event.description && (
          <p className={styles.eventDescription}>{event.description}</p>
        )}

        <div className={styles.eventMeta}>
          <span className={clsx(styles.badge, statusClass)}>
            {event.status}
          </span>
          <span className={clsx(styles.badge, priorityClass)}>
            {event.priority}
          </span>
          {event.category && (
            <span className={styles.badge}>{event.category}</span>
          )}
        </div>
      </div>
    </article>
  );
}

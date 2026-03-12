import clsx from 'clsx';
import { useMemo } from 'react';
import * as React from 'react';

import {
  formatEventDate,
  formatEventTime,
  groupEventsByDay,
} from '@/utils/dateHelpers';

import { useTimelineNavigation } from './hooks/useTimelineNavigation';
import styles from './Timeline.module.css';
import type {
  TimelineEventProps,
  TimelineGroupProps,
  TimelineProps,
} from './Timeline.types';

function TimelineEvent({
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

function TimelineGroup({
  date,
  events,
  onEventClick,
  groupIndex,
}: TimelineGroupProps) {
  return (
    <section
      className={styles.group}
      aria-label={`Events for ${formatEventDate(new Date(date))}`}
    >
      <div className={styles.groupHeader}>
        <h2 className={styles.groupDate}>
          <time dateTime={date}>{formatEventDate(new Date(date))}</time>
        </h2>
        <span
          className={styles.groupCount}
          aria-label={`${events.length} events`}
        >
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      <div className={styles.groupEvents}>
        {events.map((event, eventIndex) => (
          <TimelineEvent
            key={event.id}
            event={event}
            onEventClick={onEventClick}
            eventIndex={eventIndex}
            groupIndex={groupIndex}
            isFocused={false}
          />
        ))}
      </div>
    </section>
  );
}

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

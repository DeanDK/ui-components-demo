import { formatEventDate } from '@/utils/dateHelpers';

import styles from '../Timeline.module.css';
import type { TimelineGroupProps } from '../Timeline.types';
import { TimelineEvent } from './TimelineEvent';

export function TimelineGroup({
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

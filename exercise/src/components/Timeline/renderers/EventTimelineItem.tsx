import clsx from 'clsx';

import { formatEventTime } from '@/features/events/utils/dateHelpers';

import styles from './EventTimelineItem.module.css';
import type { EventTimelineItemProps } from './EventTimelineItem.types.ts';

export function EventTimelineItem({ event }: EventTimelineItemProps) {
  return (
    <div className={styles.eventItem}>
      <time className={styles.time} dateTime={event.date.toISOString()}>
        {formatEventTime(event.date)}
      </time>

      <div className={styles.content}>
        <h3 className={styles.title}>{event.title}</h3>

        {event.description && (
          <p className={styles.description}>{event.description}</p>
        )}

        <div className={styles.meta}>
          <span
            className={clsx(styles.badge, styles[`status-${event.status}`])}
          >
            {event.status}
          </span>
          <span
            className={clsx(styles.badge, styles[`priority-${event.priority}`])}
          >
            {event.priority}
          </span>
          {event.category && (
            <span className={styles.badge}>{event.category}</span>
          )}
        </div>
      </div>
    </div>
  );
}

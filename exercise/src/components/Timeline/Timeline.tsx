import clsx from 'clsx';
import { useMemo } from 'react';
import * as React from 'react';

import {
  formatEventDate,
  groupItems,
  groupItemsByDay,
} from '@/utils/dateHelpers';

import { useTimelineNavigation } from './hooks/useTimelineNavigation';
import styles from './Timeline.module.css';
import type {
  TimelineGroupProps,
  TimelineItem,
  TimelineItemWrapperProps,
  TimelineProps,
} from './Timeline.types';

export function TimelineItemWrapper<T extends TimelineItem>({
  item,
  onItemClick,
  renderItem,
  itemIndex,
  groupIndex,
  isFocused,
}: TimelineItemWrapperProps<T>) {
  const handleClick = () => {
    onItemClick?.(item);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onItemClick) {
      e.stopPropagation();
    }
  };

  return (
    <article
      className={clsx(styles.item, isFocused && styles.focused)}
      data-group-index={groupIndex}
      data-item-index={itemIndex}
      tabIndex={0}
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      aria-label={`Item ${itemIndex + 1}`}
    >
      <div className={styles.itemIndicator} aria-hidden="true" />
      <div className={styles.itemContent}>{renderItem(item)}</div>
    </article>
  );
}

export function TimelineGroup<T extends TimelineItem>({
  date,
  items,
  onItemClick,
  renderItem,
  groupIndex,
  renderGroupHeader,
}: TimelineGroupProps<T>) {
  return (
    <section className={styles.group} aria-label={`Group ${groupIndex + 1}`}>
      <div className={styles.groupHeader}>
        {renderGroupHeader?.(new Date(date), items.length)}
      </div>

      <div className={styles.groupEvents}>
        {items.map((item, itemIndex) => (
          <TimelineItemWrapper
            key={item.id}
            item={item}
            onItemClick={onItemClick}
            renderItem={renderItem}
            itemIndex={itemIndex}
            groupIndex={groupIndex}
            isFocused={false}
          />
        ))}
      </div>
    </section>
  );
}

export function Timeline<T extends TimelineItem>({
  items,
  onItemClick,
  renderItem,
  renderGroupHeader,
  groupBy,
  className,
}: TimelineProps<T>) {
  const groupedItems = useMemo(() => {
    const grouped = groupBy
      ? groupItems(items, (item) => groupBy(item.date))
      : groupItemsByDay(items);

    return Array.from(grouped.entries()).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
    );
  }, [items, groupBy]);

  const { announcement, handleKeyDown, timelineRef } = useTimelineNavigation(
    groupedItems,
    onItemClick,
  );

  if (items.length === 0) {
    return (
      <div className={clsx(styles.container, className)}>
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon} aria-hidden="true">
            📭
          </span>
          <p>No items to display</p>
        </div>
      </div>
    );
  }

  const defaultGroupHeader = (date: Date, count: number) => (
    <>
      <h2 className={styles.groupDate}>
        <time dateTime={date.toISOString()}>{formatEventDate(date)}</time>
      </h2>
      <span className={styles.groupCount} aria-label={`${count} items`}>
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </>
  );

  return (
    <div
      className={clsx(styles.container, className)}
      ref={timelineRef}
      onKeyDown={handleKeyDown}
      role="feed"
      aria-label="Timeline"
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
          <strong>Navigation:</strong> Use arrow keys to move between items.
          Left/Right for groups, Up/Down for items. Press Enter to select.
        </p>
      </div>

      <div className={styles.timeline}>
        {groupedItems.map(([dateKey, groupItems], groupIndex) => (
          <TimelineGroup
            key={dateKey}
            date={dateKey}
            items={groupItems}
            onItemClick={onItemClick}
            renderItem={renderItem}
            groupIndex={groupIndex}
            renderGroupHeader={renderGroupHeader || defaultGroupHeader}
          />
        ))}
      </div>

      <div className={styles.summary} aria-live="polite">
        Showing {items.length} items across {groupedItems.length} groups
      </div>
    </div>
  );
}

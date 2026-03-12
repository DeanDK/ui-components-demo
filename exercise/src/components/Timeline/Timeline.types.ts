import type * as React from 'react';

/**
 * Base interface for timeline items.
 * Any item rendered in the timeline must at least provide an id and date.
 */
export interface TimelineItem {
  /** Unique identifier for the timeline item */
  id: string;

  /** Date associated with the timeline item (used for grouping and ordering) */
  date: Date;
}

/**
 * Generic props for the Timeline component.
 * Allows rendering any data type that extends TimelineItem.
 */
export interface TimelineProps<T extends TimelineItem> {
  /** Array of items to render in the timeline */
  items: T[];

  /** Optional callback triggered when a timeline item is clicked */
  onItemClick?: (item: T) => void;

  /** Function responsible for rendering the content of each timeline item */
  renderItem: (item: T) => React.ReactNode;

  /** Optional function to render a custom group header */
  renderGroupHeader?: (date: Date, count: number) => React.ReactNode;

  /** Optional custom grouping function (e.g., group by day, month, etc.) */
  groupBy?: (date: Date) => string;

  /** Optional CSS class applied to the timeline container */
  className?: string;
}

/**
 * Props for an internal timeline group component.
 * Represents a collection of items belonging to the same group (e.g., same day).
 */
export interface TimelineGroupProps<T extends TimelineItem> {
  /** Group identifier (usually a formatted date string) */
  date: string;

  /** Items belonging to this group */
  items: T[];

  /** Optional callback triggered when an item is clicked */
  onItemClick?: (item: T) => void;

  /** Render function used to display each item */
  renderItem: (item: T) => React.ReactNode;

  /** Index of the group within the timeline */
  groupIndex: number;

  /** Optional custom renderer for the group header */
  renderGroupHeader?: (date: Date, count: number) => React.ReactNode;
}

/**
 * Props for the internal wrapper around each timeline item.
 * Handles focus state and keyboard navigation logic.
 */
export interface TimelineItemWrapperProps<T extends TimelineItem> {
  /** The item data being rendered */
  item: T;

  /** Optional callback triggered when the item is clicked */
  onItemClick?: (item: T) => void;

  /** Render function used to display the item content */
  renderItem: (item: T) => React.ReactNode;

  /** Index of the item within its group */
  itemIndex: number;

  /** Index of the parent group containing the item */
  groupIndex: number;

  /** Indicates whether the item is currently focused for keyboard navigation */
  isFocused: boolean;
}

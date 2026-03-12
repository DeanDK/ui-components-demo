import type { Event } from '@/types';

export interface TimelineProps {
  /** List of timeline events to render */
  events: Event[];

  /** Optional callback triggered when an event item is clicked */
  onEventClick?: (event: Event) => void;

  /** Optional custom CSS class applied to the timeline container */
  className?: string;
}

export interface TimelineGroupProps {
  /** Date label used as the group heading (e.g., "Today", "March 12, 2026") */
  date: string;

  /** Events belonging to this date group */
  events: Event[];

  /** Optional callback triggered when an event inside the group is clicked */
  onEventClick?: (event: Event) => void;

  /** Index of the group within the timeline (used for ordering or focus management) */
  groupIndex: number;

  /** Indicates whether this group is currently active or focused */
  isActive: boolean;
}

export interface TimelineEventProps {
  /** Event data object used to render the timeline item */
  event: Event;

  /** Optional callback triggered when the event is clicked */
  onEventClick?: (event: Event) => void;

  /** Index of the event within its group */
  eventIndex: number;

  /** Index of the parent group containing this event */
  groupIndex: number;

  /** Indicates whether this specific event item is currently focused */
  isFocused: boolean;
}

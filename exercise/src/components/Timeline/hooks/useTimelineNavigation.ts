import type * as React from 'react';
import { useCallback, useRef, useState } from 'react';

import type { TimelineItem } from '../Timeline.types';

interface NavigationPosition {
  groupIndex: number;
  itemIndex: number;
}

export const useTimelineNavigation = <T extends TimelineItem>(
  groupedItems: [string, T[]][],
  onItemClick?: (item: T) => void,
) => {
  const [focusedPosition, setFocusedPosition] = useState<NavigationPosition>({
    groupIndex: 0,
    itemIndex: 0,
  });
  const [announcement, setAnnouncement] = useState<string>('');
  const timelineRef = useRef<HTMLDivElement>(null);

  const totalGroups = groupedItems.length;

  const announceNavigation = useCallback(
    (item: T, position: NavigationPosition) => {
      const totalInGroup = groupedItems[position.groupIndex]?.[1]?.length || 0;
      const dateStr = item.date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });

      setAnnouncement(
        `Item at ${dateStr}. ` +
          `Item ${position.itemIndex + 1} of ${totalInGroup} in this group. ` +
          `Group ${position.groupIndex + 1} of ${totalGroups}.`,
      );
    },
    [groupedItems, totalGroups],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (groupedItems.length === 0) return;

      const { groupIndex, itemIndex } = focusedPosition;
      const currentGroup = groupedItems[groupIndex];

      if (!currentGroup) return;

      const itemsInGroup = currentGroup[1].length;
      let newPosition = { ...focusedPosition };
      let handled = false;

      switch (e.key) {
        case 'ArrowDown':
          if (itemIndex < itemsInGroup - 1) {
            newPosition.itemIndex++;
            handled = true;
          } else if (groupIndex < totalGroups - 1) {
            newPosition.groupIndex++;
            newPosition.itemIndex = 0;
            handled = true;
          }
          break;

        case 'ArrowUp':
          if (itemIndex > 0) {
            newPosition.itemIndex--;
            handled = true;
          } else if (groupIndex > 0) {
            newPosition.groupIndex--;
            newPosition.itemIndex =
              groupedItems[newPosition.groupIndex][1].length - 1;
            handled = true;
          }
          break;

        case 'ArrowRight':
          if (groupIndex < totalGroups - 1) {
            newPosition.groupIndex++;
            newPosition.itemIndex = 0;
            handled = true;
          }
          break;

        case 'ArrowLeft':
          if (groupIndex > 0) {
            newPosition.groupIndex--;
            newPosition.itemIndex = 0;
            handled = true;
          }
          break;

        case 'Home':
          newPosition = { groupIndex: 0, itemIndex: 0 };
          handled = true;
          break;

        case 'End':
          newPosition.groupIndex = totalGroups - 1;
          newPosition.itemIndex = groupedItems[totalGroups - 1][1].length - 1;
          handled = true;
          break;

        case 'Enter':
        case ' ':
          if (onItemClick) {
            const item = groupedItems[groupIndex][1][itemIndex];
            onItemClick(item);
            handled = true;
          }
          break;

        default:
          return;
      }

      if (handled) {
        e.preventDefault();
        setFocusedPosition(newPosition);

        const item =
          groupedItems[newPosition.groupIndex][1][newPosition.itemIndex];
        announceNavigation(item, newPosition);

        requestAnimationFrame(() => {
          const element = timelineRef.current?.querySelector(
            `[data-group-index="${newPosition.groupIndex}"][data-item-index="${newPosition.itemIndex}"]`,
          ) as HTMLElement;
          element?.focus();
        });
      }
    },
    [
      focusedPosition,
      groupedItems,
      totalGroups,
      onItemClick,
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

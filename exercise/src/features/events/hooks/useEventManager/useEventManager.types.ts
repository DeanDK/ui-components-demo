import type { z } from 'zod';

import type { eventSchema } from '@/features/events/config/eventFormFields.tsx';

export interface UseEventManagerOptions {
  initialCount?: number;
  timelineLimit?: number;
}

export type EventFormData = z.output<typeof eventSchema>;

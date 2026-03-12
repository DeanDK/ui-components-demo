import type { Event } from '@/types';

export interface EventFormProps {
  /** Existing event being edited. If undefined or null, the form creates a new event. */
  event?: Event | null;

  /** Callback triggered when the form is successfully submitted */
  onSave: (event: Event) => void;

  /** Callback triggered when the user cancels the form */
  onCancel: () => void;
}

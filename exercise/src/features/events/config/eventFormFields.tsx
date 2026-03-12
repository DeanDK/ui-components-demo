import { z } from 'zod';

import type { FormField } from '@/components/Form/Form.types.ts';

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  date: z.date({
    error: 'Please enter a valid date',
  }),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['pending', 'completed', 'cancelled'], {
    error: 'Status is required',
  }),
  priority: z.enum(['low', 'medium', 'high'], {
    error: 'Priority is required',
  }),
  category: z
    .string()
    .max(50, 'Category must be less than 50 characters')
    .optional()
    .or(z.literal('')),
});

export type EventFormData = z.infer<typeof eventSchema>;

export const eventFormFields: FormField<EventFormData>[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'text',
    required: true,
    placeholder: 'e.g., Team Meeting',
    defaultValue: '',
  },
  {
    name: 'date',
    label: 'Date & Time',
    type: 'datetime-local',
    required: true,
    defaultValue: new Date(),
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    defaultValue: 'pending',
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'Completed', value: 'completed' },
      { label: 'Cancelled', value: 'cancelled' },
    ],
  },
  {
    name: 'priority',
    label: 'Priority',
    type: 'select',
    required: true,
    defaultValue: 'medium',
    options: [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ],
  },
  {
    name: 'category',
    label: 'Category',
    type: 'text',
    required: false,
    placeholder: 'e.g., Development, Design, Meeting',
    defaultValue: '',
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: false,
    placeholder: 'Add any additional details...',
    rows: 4,
    defaultValue: '',
  },
];

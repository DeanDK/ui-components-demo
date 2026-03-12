import { z } from 'zod';

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  date: z.date({
    error: 'Date is required',
    message: 'Please enter a valid date',
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

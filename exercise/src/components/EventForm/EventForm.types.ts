import type * as React from 'react';
import type { useForm } from 'react-hook-form';

import type { EventFormData } from '@/components/EventForm/schema.ts';
import type { Event } from '@/types';

export interface EventFormProps {
  /** Existing event being edited. If undefined or null, the form creates a new event. */
  event?: Event | null;

  /** Callback triggered when the form is successfully submitted */
  onSave: (event: Event) => void;

  /** Callback triggered when the user cancels the form */
  onCancel: () => void;
}

export interface ModalProps {
  /** Content rendered inside the modal */
  children: React.ReactNode;

  /** Reference to the modal DOM element used for focus management */
  modalRef: React.RefObject<HTMLDivElement | null>;

  /** Callback triggered when the modal should close */
  onClose: () => void;

  /** Indicates whether the form is in edit mode */
  isEditMode: boolean;
}

export interface FieldProps {
  /** Child elements rendered inside the field wrapper */
  children: React.ReactNode;
}

export interface FieldLabelProps {
  /** The id of the input element this label is associated with */
  htmlFor: string;

  /** The visible text label for the field */
  label: string;

  /** Indicates whether the field is required */
  required?: boolean;
}

export interface FieldErrorProps {
  /** ID used to associate the error with an input via aria-describedby */
  id: string;

  /** Validation error message text */
  message?: string;
}

export interface TitleFieldProps {
  /** React Hook Form register function used to connect the input to the form */
  register: ReturnType<typeof useForm<EventFormData>>['register'];

  /** Validation error message for the title field */
  error?: string;
}

export interface DateFieldProps {
  /** React Hook Form control object used by the Controller component */
  control: ReturnType<typeof useForm<EventFormData>>['control'];

  /** Validation error message for the date field */
  error?: string;
}

export interface StatusFieldProps {
  /** React Hook Form register function used to bind the select element */
  register: ReturnType<typeof useForm<EventFormData>>['register'];

  /** Validation error message for the status field */
  error?: string;
}

export interface PriorityFieldProps {
  /** React Hook Form register function used to bind the select element */
  register: ReturnType<typeof useForm<EventFormData>>['register'];

  /** Validation error message for the priority field */
  error?: string;
}

export interface CategoryFieldProps {
  /** React Hook Form register function used to bind the input element */
  register: ReturnType<typeof useForm<EventFormData>>['register'];

  /** Validation error message for the category field */
  error?: string;
}

export interface DescriptionFieldProps {
  /** React Hook Form register function used to bind the textarea element */
  register: ReturnType<typeof useForm<EventFormData>>['register'];

  /** Validation error message for the description field */
  error?: string;
}

export interface FormActionsProps {
  /** Indicates whether the form is currently submitting */
  isSubmitting: boolean;

  /** Indicates whether the form is editing an existing event */
  isEditMode: boolean;

  /** Callback triggered when the user cancels the form */
  onCancel: () => void;
}

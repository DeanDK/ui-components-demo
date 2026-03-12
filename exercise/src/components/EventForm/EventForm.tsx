import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';

import styles from './EventForm.module.css';
import type { EventFormProps } from './EventForm.types';
import type { EventFormData } from './schema';
import { eventSchema } from './schema';

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const isEditMode = !!event;
  const modalRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    setFocus,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          title: event.title,
          date: event.date,
          description: event.description || '',
          status: event.status,
          priority: event.priority,
          category: event.category || '',
        }
      : {
          title: '',
          date: new Date(),
          description: '',
          status: 'pending' as const,
          priority: 'medium' as const,
          category: '',
        },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      if (isEditMode && event) {
        onSave({
          ...event,
          title: data.title,
          date: data.date,
          description: data.description || undefined,
          status: data.status,
          priority: data.priority,
          category: data.category || undefined,
        });
      } else {
        onSave({
          id: '',
          title: data.title,
          date: data.date,
          description: data.description || undefined,
          status: data.status,
          priority: data.priority,
          category: data.category || undefined,
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to cancel?',
      );
      if (!confirmed) return;
    }
    onCancel();
  };

  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0] as keyof EventFormData;
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  }, [errors, setFocus]);

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="form-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 id="form-title" className={styles.title}>
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.closeButton}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          {/* Title Field */}
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>
              Title{' '}
              <span className={styles.required} aria-label="required">
                *
              </span>
            </label>
            <input
              id="title"
              type="text"
              className={clsx(styles.input, errors.title && styles.inputError)}
              aria-invalid={errors.title ? 'true' : 'false'}
              aria-describedby={errors.title ? 'title-error' : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p id="title-error" className={styles.error} role="alert">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Date Field */}
          <div className={styles.field}>
            <label htmlFor="date" className={styles.label}>
              Date & Time{' '}
              <span className={styles.required} aria-label="required">
                *
              </span>
            </label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <input
                  id="date"
                  type="datetime-local"
                  className={clsx(
                    styles.input,
                    errors.date && styles.inputError,
                  )}
                  aria-invalid={errors.date ? 'true' : 'false'}
                  aria-describedby={errors.date ? 'date-error' : undefined}
                  value={
                    field.value instanceof Date
                      ? field.value.toISOString().slice(0, 16)
                      : ''
                  }
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : new Date();
                    field.onChange(date);
                  }}
                />
              )}
            />
            {errors.date && (
              <p id="date-error" className={styles.error} role="alert">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Status Field */}
          <div className={styles.field}>
            <label htmlFor="status" className={styles.label}>
              Status{' '}
              <span className={styles.required} aria-label="required">
                *
              </span>
            </label>
            <select
              id="status"
              className={clsx(
                styles.select,
                errors.status && styles.inputError,
              )}
              aria-invalid={errors.status ? 'true' : 'false'}
              aria-describedby={errors.status ? 'status-error' : undefined}
              {...register('status')}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p id="status-error" className={styles.error} role="alert">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Priority Field */}
          <div className={styles.field}>
            <label htmlFor="priority" className={styles.label}>
              Priority{' '}
              <span className={styles.required} aria-label="required">
                *
              </span>
            </label>
            <select
              id="priority"
              className={clsx(
                styles.select,
                errors.priority && styles.inputError,
              )}
              aria-invalid={errors.priority ? 'true' : 'false'}
              aria-describedby={errors.priority ? 'priority-error' : undefined}
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && (
              <p id="priority-error" className={styles.error} role="alert">
                {errors.priority.message}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div className={styles.field}>
            <label htmlFor="category" className={styles.label}>
              Category
            </label>
            <input
              id="category"
              type="text"
              className={clsx(
                styles.input,
                errors.category && styles.inputError,
              )}
              aria-invalid={errors.category ? 'true' : 'false'}
              aria-describedby={errors.category ? 'category-error' : undefined}
              placeholder="e.g., Development, Design, Meeting"
              {...register('category')}
            />
            {errors.category && (
              <p id="category-error" className={styles.error} role="alert">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              className={clsx(
                styles.textarea,
                errors.description && styles.inputError,
              )}
              aria-invalid={errors.description ? 'true' : 'false'}
              aria-describedby={
                errors.description ? 'description-error' : undefined
              }
              placeholder="Add any additional details..."
              {...register('description')}
            />
            {errors.description && (
              <p id="description-error" className={styles.error} role="alert">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Success Message Region */}
          <div
            className={styles.successRegion}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          />

          {/* Form Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleCancel}
              className={clsx(styles.button, styles.buttonSecondary)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={clsx(styles.button, styles.buttonPrimary)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Saving...
                </>
              ) : (
                <>{isEditMode ? 'Update Event' : 'Create Event'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

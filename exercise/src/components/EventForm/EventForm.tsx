import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';

import styles from './EventForm.module.css';
import type {
  CategoryFieldProps,
  DateFieldProps,
  DescriptionFieldProps,
  EventFormProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldProps,
  FormActionsProps,
  ModalProps,
  PriorityFieldProps,
  StatusFieldProps,
  TitleFieldProps,
} from './EventForm.types';
import type { EventFormData } from './schema';
import { eventSchema } from './schema';

function Modal({ children, modalRef, onClose, isEditMode }: ModalProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="form-title"
        aria-modal="true"
      >
        <div className={styles.header}>
          <h2 id="form-title" className={styles.title}>
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function Field({ children }: FieldProps) {
  return <div className={styles.field}>{children}</div>;
}

function FieldLabel({ htmlFor, label, required = false }: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={styles.label}>
      {label}{' '}
      {required && (
        <span className={styles.required} aria-label="required">
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <p id={id} className={styles.error} role="alert">
      {message}
    </p>
  );
}

function TitleField({ register, error }: TitleFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="title" label="Title" required />
      <input
        id="title"
        type="text"
        className={clsx(styles.input, error && styles.inputError)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'title-error' : undefined}
        {...register('title')}
      />
      <FieldError id="title-error" message={error} />
    </Field>
  );
}

function DateField({ control, error }: DateFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="date" label="Date & Time" required />
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <input
            id="date"
            type="datetime-local"
            className={clsx(styles.input, error && styles.inputError)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'date-error' : undefined}
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
      <FieldError id="date-error" message={error} />
    </Field>
  );
}

function StatusField({ register, error }: StatusFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="status" label="Status" required />
      <select
        id="status"
        className={clsx(styles.select, error && styles.inputError)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'status-error' : undefined}
        {...register('status')}
      >
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <FieldError id="status-error" message={error} />
    </Field>
  );
}

function PriorityField({ register, error }: PriorityFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="priority" label="Priority" required />
      <select
        id="priority"
        className={clsx(styles.select, error && styles.inputError)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'priority-error' : undefined}
        {...register('priority')}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <FieldError id="priority-error" message={error} />
    </Field>
  );
}

function CategoryField({ register, error }: CategoryFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="category" label="Category" />
      <input
        id="category"
        type="text"
        className={clsx(styles.input, error && styles.inputError)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'category-error' : undefined}
        placeholder="e.g., Development, Design, Meeting"
        {...register('category')}
      />
      <FieldError id="category-error" message={error} />
    </Field>
  );
}

function DescriptionField({ register, error }: DescriptionFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor="description" label="Description" />
      <textarea
        id="description"
        rows={4}
        className={clsx(styles.textarea, error && styles.inputError)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? 'description-error' : undefined}
        placeholder="Add any additional details..."
        {...register('description')}
      />
      <FieldError id="description-error" message={error} />
    </Field>
  );
}

function SuccessRegion() {
  return (
    <div
      className={styles.successRegion}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    />
  );
}

function FormActions({ isSubmitting, isEditMode, onCancel }: FormActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        onClick={onCancel}
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
  );
}

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
    <Modal modalRef={modalRef} onClose={handleCancel} isEditMode={isEditMode}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles.form}
        noValidate
      >
        <TitleField register={register} error={errors.title?.message} />
        <DateField control={control} error={errors.date?.message} />
        <StatusField register={register} error={errors.status?.message} />
        <PriorityField register={register} error={errors.priority?.message} />
        <CategoryField register={register} error={errors.category?.message} />
        <DescriptionField
          register={register}
          error={errors.description?.message}
        />
        <SuccessRegion />
        <FormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
          onCancel={handleCancel}
        />
      </form>
    </Modal>
  );
}

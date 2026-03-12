import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import type { Path } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import styles from './Form.module.css';
import type { FormField, FormProps } from './Form.types';

export function Form<TSchema extends z.ZodObject<z.ZodRawShape>>({
  title,
  fields,
  schema,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
}: FormProps<TSchema>) {
  type FormData = z.infer<TSchema>;

  const modalRef = useRef<HTMLDivElement>(null);

  const defaultValues = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? '';
    return acc;
  }, {} as Partial<FormData>);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaultValues as never,
  });

  useEffect(() => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      setFocus(firstErrorField as Path<FormData>);
    }
  }, [errors, setFocus]);

  const renderField = (field: FormField<FormData>) => {
    const error = errors[field.name];
    const fieldId = `field-${String(field.name)}`;
    const errorId = `${fieldId}-error`;

    // For date/datetime fields, use Controller
    if (field.type === 'date' || field.type === 'datetime-local') {
      return (
        <Controller
          name={field.name}
          control={control}
          render={({ field: controllerField }) => (
            <input
              id={fieldId}
              type={field.type}
              className={clsx(styles.input, error && styles.inputError)}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? errorId : undefined}
              value={
                controllerField.value instanceof Date
                  ? controllerField.value
                      .toISOString()
                      .slice(0, field.type === 'date' ? 10 : 16)
                  : ''
              }
              onChange={(e) => {
                const date = e.target.value
                  ? new Date(e.target.value)
                  : new Date();
                controllerField.onChange(date);
              }}
            />
          )}
        />
      );
    }

    // Select field
    if (field.type === 'select' && field.options) {
      return (
        <select
          id={fieldId}
          className={clsx(styles.select, error && styles.inputError)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...register(field.name)}
        >
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Textarea field
    if (field.type === 'textarea') {
      return (
        <textarea
          id={fieldId}
          rows={field.rows || 4}
          className={clsx(styles.textarea, error && styles.inputError)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          placeholder={field.placeholder}
          {...register(field.name)}
        />
      );
    }

    // Default text input
    return (
      <input
        id={fieldId}
        type={field.type}
        className={clsx(styles.input, error && styles.inputError)}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        placeholder={field.placeholder}
        {...register(field.name)}
      />
    );
  };

  return (
    <div className={styles.overlay}>
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
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className={styles.closeButton}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
          noValidate
        >
          {fields.map((field) => {
            const error = errors[field.name];
            const fieldId = `field-${String(field.name)}`;
            const errorId = `${fieldId}-error`;

            return (
              <div key={String(field.name)} className={styles.field}>
                <label htmlFor={fieldId} className={styles.label}>
                  {field.label}
                  {field.required && (
                    <span className={styles.required} aria-label="required">
                      *
                    </span>
                  )}
                </label>

                {renderField(field)}

                {error && (
                  <p id={errorId} className={styles.error} role="alert">
                    {error.message as string}
                  </p>
                )}
              </div>
            );
          })}

          <div
            className={styles.successRegion}
            role="status"
            aria-live="polite"
            aria-atomic="true"
          />

          <div className={styles.actions}>
            <button
              type="submit"
              className={clsx(styles.button, styles.buttonPrimary)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  Submitting...
                </>
              ) : (
                submitLabel
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

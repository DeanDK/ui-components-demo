import type { FieldValues, Path } from 'react-hook-form';
import type { z } from 'zod';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'date'
  | 'datetime-local'
  | 'number'
  | 'email';

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface FormField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  rows?: number;
  defaultValue?: any;
}

export interface FormProps<TSchema extends z.ZodObject<z.ZodRawShape>> {
  /**
   * Title displayed at the top of the form modal/dialog.
   */
  title: string;

  /**
   * Array describing the fields rendered by the form.
   * Field types and names are inferred from the provided Zod schema.
   */
  fields: FormField<z.infer<TSchema>>[];

  /**
   * Zod validation schema used to:
   * - validate form input
   * - infer the form data type
   */
  schema: TSchema;

  /**
   * Callback triggered when the form is successfully submitted.
   * Receives validated form data inferred from the schema.
   */
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;

  /**
   * Callback triggered when the user cancels or closes the form.
   */
  onCancel: () => void;

  /**
   * Label text for the submit button.
   * Defaults to "Submit" if not provided.
   */
  submitLabel?: string;

  /**
   * Label text for the cancel button.
   * Defaults to "Cancel" if not provided.
   */
  cancelLabel?: string;
}

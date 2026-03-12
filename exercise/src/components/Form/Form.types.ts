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
  title: string;
  fields: FormField<z.infer<TSchema>>[];
  schema: TSchema;
  onSubmit: (data: z.infer<TSchema>) => void | Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

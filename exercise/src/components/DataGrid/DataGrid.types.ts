import type { ColumnDef } from '@tanstack/react-table';
import type * as React from 'react';

import type { useDataGrid } from '@/components/DataGrid/hooks/useDataGrid.ts';

export interface DataGridProps<T> {
  /** Array of data objects to be displayed in the table */
  data: T[];

  /** Column definitions describing how each column should render and behave */
  columns: ColumnDef<T>[];

  /** Indicates whether the table data is currently loading */
  isLoading?: boolean;

  /** Error object returned when data fetching fails */
  error?: Error | null;

  /** Number of rows displayed per page */
  pageSize?: number;

  /** Enables column-level filtering functionality */
  enableColumnFilters?: boolean;

  /** Enables sorting functionality for table columns */
  enableSorting?: boolean;

  /** Optional custom CSS class applied to the table container */
  className?: string;
}

export interface StateViewProps {
  /** Optional CSS class applied to the container */
  className?: string;

  /** Content rendered inside the state view */
  children: React.ReactNode;
}

export interface ToolbarProps<T> {
  /** TanStack table instance returned from the useDataGrid hook */
  table: ReturnType<typeof useDataGrid<T>>['table'];

  /** Derived table statistics such as total rows, filtered rows, and pages */
  stats: ReturnType<typeof useDataGrid<T>>['stats'];
}

export interface DataGridTableProps<T> {
  /** TanStack table instance used to render headers and rows */
  table: ReturnType<typeof useDataGrid<T>>['table'];

  /** Enables or disables column filtering inputs in the header */
  enableColumnFilters: boolean;
}

export interface PaginationProps<T> {
  /** TanStack table instance used to control pagination state */
  table: ReturnType<typeof useDataGrid<T>>['table'];

  /** Table statistics used for displaying page information */
  stats: ReturnType<typeof useDataGrid<T>>['stats'];

  /** Full dataset currently loaded in the grid */
  data: T[];

  /** Initial page size used to determine rows per page */
  pageSize: number;
}

export interface DataGridState {
  columnVisibility: Record<string, boolean>;
}

export interface UseDataGridProps<T> {
  /**
   * Array of data objects to display in the grid.
   * Each object represents one row.
   */
  data: T[];

  /**
   * Column definitions describing how each field of the row
   * should be rendered, sorted, or filtered.
   */
  columns: ColumnDef<T>[];

  /**
   * Number of rows displayed per page.
   * Defaults to the component's internal value if not provided.
   */
  pageSize?: number;

  /**
   * Enables sorting functionality on column headers.
   * When true, users can click headers to sort ascending/descending.
   */
  enableSorting?: boolean;

  /**
   * Enables filtering controls for each column.
   * When true, the grid will allow users to filter rows by column values.
   */
  enableColumnFilters?: boolean;
}

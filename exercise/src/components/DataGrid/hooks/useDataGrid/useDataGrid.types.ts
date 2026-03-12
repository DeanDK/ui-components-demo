import type { ColumnDef } from '@tanstack/react-table';

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

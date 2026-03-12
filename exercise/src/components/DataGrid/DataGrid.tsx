import { flexRender } from '@tanstack/react-table';
import clsx from 'clsx';

import { useDataGrid } from '@/components/DataGrid/hooks/useDataGrid.ts';

import styles from './DataGrid.module.css';
import type {
  DataGridProps,
  DataGridTableProps,
  PaginationProps,
  StateViewProps,
  ToolbarProps,
} from './DataGrid.types';

function StateView({ className, children }: StateViewProps) {
  return <div className={clsx(styles.container, className)}>{children}</div>;
}

function LoadingState({ className }: { className?: string }) {
  return (
    <StateView className={className}>
      <div className={styles.stateMessage} role="status" aria-live="polite">
        <div className={styles.spinner} aria-hidden="true" />
        <p>Loading data...</p>
      </div>
    </StateView>
  );
}

function ErrorState({
  className,
  error,
}: {
  className?: string;
  error: Error;
}) {
  return (
    <StateView className={className}>
      <div className={styles.stateMessage} role="alert">
        <span className={styles.errorIcon} aria-hidden="true">
          ⚠️
        </span>
        <p>Error: {error.message}</p>
      </div>
    </StateView>
  );
}

function EmptyState({ className }: { className?: string }) {
  return (
    <StateView className={className}>
      <div className={styles.stateMessage}>
        <span className={styles.emptyIcon} aria-hidden="true">
          📭
        </span>
        <p>No data available</p>
      </div>
    </StateView>
  );
}

function DataGridToolbar<T>({ table, stats }: ToolbarProps<T>) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.columnToggle}>
        <span className={styles.toolbarLabel}>Toggle Columns:</span>
        {table.getAllLeafColumns().map((column) => {
          if (!column.id || column.id === 'actions') {
            return null;
          }

          return (
            <label key={column.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={column.getToggleVisibilityHandler()}
                className={styles.checkbox}
              />
              {typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id}
            </label>
          );
        })}
      </div>

      <div className={styles.stats} aria-live="polite">
        Showing {table.getRowModel().rows.length} of {stats.filteredRows} events
      </div>
    </div>
  );
}

function DataGridTable<T>({
  table,
  enableColumnFilters,
}: DataGridTableProps<T>) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table} role="grid">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={styles.th}
                  style={{ width: header.getSize() }}
                >
                  {header.isPlaceholder ? null : (
                    <div className={styles.headerContent}>
                      {header.column.getCanSort() ? (
                        <button
                          onClick={header.column.getToggleSortingHandler()}
                          className={styles.sortButton}
                          aria-label={`Sort by ${header.id}`}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          <span
                            className={styles.sortIndicator}
                            aria-hidden="true"
                          >
                            {{
                              asc: ' ↑',
                              desc: ' ↓',
                            }[header.column.getIsSorted() as string] ?? ' ⇅'}
                          </span>
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}

                      {header.column.getCanFilter() && enableColumnFilters && (
                        <input
                          type="text"
                          value={
                            (header.column.getFilterValue() ?? '') as string
                          }
                          onChange={(e) =>
                            header.column.setFilterValue(e.target.value)
                          }
                          placeholder="Filter..."
                          className={styles.filterInput}
                          aria-label={`Filter ${header.id}`}
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={styles.tr}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DataGridPagination<T>({
  table,
  stats,
  data,
  pageSize,
}: PaginationProps<T>) {
  return (
    <div className={styles.pagination}>
      <button
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
        className={styles.paginationButton}
        aria-label="First page"
      >
        {'<<'}
      </button>

      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className={styles.paginationButton}
        aria-label="Previous page"
      >
        {'<'}
      </button>

      <span className={styles.pageInfo}>
        Page {stats.currentPage} of {stats.totalPages}
      </span>

      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className={styles.paginationButton}
        aria-label="Next page"
      >
        {'>'}
      </button>

      <button
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
        className={styles.paginationButton}
        aria-label="Last page"
      >
        {'>>'}
      </button>

      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
        className={styles.pageSizeSelect}
        aria-label="Rows per page"
      >
        {[pageSize, data.length].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  );
}

export function DataGrid<T>({
  data,
  columns,
  isLoading = false,
  error = null,
  pageSize = 10,
  enableColumnFilters = true,
  enableSorting = true,
  className,
}: DataGridProps<T>) {
  const { table, stats } = useDataGrid({
    data,
    columns,
    pageSize,
    enableSorting,
    enableColumnFilters,
  });

  if (isLoading) {
    return <LoadingState className={className} />;
  }

  if (error) {
    return <ErrorState className={className} error={error} />;
  }

  if (data.length === 0) {
    return <EmptyState className={className} />;
  }

  return (
    <div className={clsx(styles.container, className)}>
      <DataGridToolbar table={table} stats={stats} />
      <DataGridTable table={table} enableColumnFilters={enableColumnFilters} />
      <DataGridPagination
        table={table}
        stats={stats}
        data={data}
        pageSize={pageSize}
      />
    </div>
  );
}

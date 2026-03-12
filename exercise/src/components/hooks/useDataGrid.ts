import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

interface UseDataGridProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  enableSorting?: boolean;
  enableColumnFilters?: boolean;
}

export const useDataGrid = <T>({
  data,
  columns,
  pageSize = 10,
  enableSorting = true,
  enableColumnFilters = true,
}: UseDataGridProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableColumnFilters
      ? getFilteredRowModel()
      : undefined,
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const stats = {
    totalRows: data.length,
    filteredRows: table.getFilteredRowModel().rows.length,
    currentPage: table.getState().pagination.pageIndex + 1,
    totalPages: table.getPageCount(),
  };

  return {
    table,
    stats,
  };
};

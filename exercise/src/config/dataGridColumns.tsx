import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import type { Event } from '@/types';

export const eventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ getValue }) => format(getValue() as Date, 'MMM d, yyyy h:mm a'),
    sortingFn: (a, b) =>
      (a.getValue('date') as Date).getTime() -
      (b.getValue('date') as Date).getTime(),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => (
      <span style={{ textTransform: 'capitalize' }}>
        {getValue() as string}
      </span>
    ),
    enableColumnFilter: true,
  },
  {
    accessorKey: 'priority',
    header: 'Priority',
    enableColumnFilter: true,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    enableColumnFilter: true,
  },
];

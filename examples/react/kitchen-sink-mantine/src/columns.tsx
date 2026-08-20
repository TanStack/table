import type { Person } from '@/lib/make-data'
import { createAppColumnHelper } from '@/hooks/table'
import {
  AgeAggregatedCell,
  JoinDateAggregatedCell,
} from '@/components/data-table/cell-components'
import { toSentenceCase } from '@/components/data-table/shared'
import { departments, statuses } from '@/lib/make-data'

const columnHelper = createAppColumnHelper<Person>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ header }) => <header.SelectAllHeader />,
    cell: ({ cell }) => <cell.SelectCell />,
    maxSize: 48,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  }),
  columnHelper.accessor('firstName', {
    id: 'firstName',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.TextCell />,
    meta: {
      label: 'First Name',
      variant: 'text',
    },
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.TextCell />,
    meta: {
      label: 'Last Name',
      variant: 'text',
    },
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.AgeCell />,
    aggregationFn: 'mean',
    aggregatedCell: () => <AgeAggregatedCell />,
    meta: {
      label: 'Age',
      variant: 'number',
    },
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.TextCell />,
    meta: {
      label: 'Email',
      variant: 'text',
    },
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.StatusCell />,
    aggregatedCell: () => null,
    meta: {
      label: 'Status',
      variant: 'select',
      options: statuses.map((status) => ({
        label: toSentenceCase(status),
        value: status,
      })),
    },
  }),
  columnHelper.accessor('department', {
    id: 'department',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.DepartmentCell />,
    aggregatedCell: () => null,
    meta: {
      label: 'Department',
      variant: 'multi-select',
      options: departments.map((department) => ({
        label: toSentenceCase(department),
        value: department,
      })),
    },
  }),
  columnHelper.accessor('joinDate', {
    id: 'joinDate',
    header: ({ header }) => <header.ColumnHeader />,
    cell: ({ cell }) => <cell.DateCell />,
    aggregationFn: 'min',
    aggregatedCell: () => <JoinDateAggregatedCell />,
    meta: {
      label: 'Join Date',
      variant: 'date',
    },
  }),
  columnHelper.display({
    id: 'actions',
    enableHiding: false,
    cell: ({ cell }) => <cell.ActionsCell />,
    maxSize: 44,
    enableResizing: false,
  }),
])

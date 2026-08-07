import { h } from 'vue'
import type { Person } from '@/lib/make-data'
import { createAppColumnHelper } from '@/hooks/table'
import {
  AgeAggregatedCell,
  JoinDateAggregatedCell,
} from '@/components/data-table/cell-components'
import { toSentenceCase } from '@/lib/utils'
import { departments, statuses } from '@/lib/make-data'

const columnHelper = createAppColumnHelper<Person>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ header }) => h(header.SelectAllHeader),
    cell: ({ cell }) => h(cell.SelectCell),
    maxSize: 40,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  }),
  columnHelper.accessor('firstName', {
    id: 'firstName',
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.TextCell),
    meta: {
      label: 'First Name',
      variant: 'text',
    },
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.TextCell),
    meta: {
      label: 'Last Name',
      variant: 'text',
    },
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.AgeCell),
    aggregationFn: 'mean',
    aggregatedCell: () => h(AgeAggregatedCell),
    size: 80,
    meta: {
      label: 'Age',
      variant: 'number',
    },
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.TextCell),
    size: 200,
    meta: {
      label: 'Email',
      variant: 'text',
    },
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.StatusCell),
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
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.DepartmentCell),
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
    header: ({ header }) => h(header.ColumnHeader),
    cell: ({ cell }) => h(cell.DateCell),
    aggregationFn: 'min',
    aggregatedCell: () => h(JoinDateAggregatedCell),
    meta: {
      label: 'Join Date',
      variant: 'date',
    },
  }),
  columnHelper.display({
    id: 'actions',
    enableHiding: false,
    cell: ({ cell }) => h(cell.ActionsCell),
    maxSize: 40,
    enableResizing: false,
  }),
])

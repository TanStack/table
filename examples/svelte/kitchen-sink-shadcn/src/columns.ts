import { renderComponent } from '@tanstack/svelte-table'
import type { Person } from '@/lib/make-data'
import { createAppColumnHelper } from '@/hooks/table.svelte'
import AgeAggregatedCell from '@/components/data-table/AgeAggregatedCell.svelte'
import JoinDateAggregatedCell from '@/components/data-table/JoinDateAggregatedCell.svelte'
import { toSentenceCase } from '@/lib/utils'
import { departments, statuses } from '@/lib/make-data'

const columnHelper = createAppColumnHelper<Person>()

export const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ header }) => renderComponent(header.SelectAllHeader),
    cell: ({ cell }) => renderComponent(cell.SelectCell),
    maxSize: 40,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  }),
  columnHelper.accessor('firstName', {
    id: 'firstName',
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.TextCell),
    meta: {
      label: 'First Name',
      variant: 'text',
    },
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.TextCell),
    meta: {
      label: 'Last Name',
      variant: 'text',
    },
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.AgeCell),
    aggregationFn: 'mean',
    aggregatedCell: () => renderComponent(AgeAggregatedCell),
    size: 80,
    meta: {
      label: 'Age',
      variant: 'number',
    },
  }),
  columnHelper.accessor('email', {
    id: 'email',
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.TextCell),
    size: 200,
    meta: {
      label: 'Email',
      variant: 'text',
    },
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.StatusCell),
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
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.DepartmentCell),
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
    header: ({ header }) => renderComponent(header.ColumnHeader),
    cell: ({ cell }) => renderComponent(cell.DateCell),
    aggregationFn: 'min',
    aggregatedCell: () => renderComponent(JoinDateAggregatedCell),
    meta: {
      label: 'Join Date',
      variant: 'date',
    },
  }),
  columnHelper.display({
    id: 'actions',
    enableHiding: false,
    cell: ({ cell }) => renderComponent(cell.ActionsCell),
    maxSize: 40,
    enableResizing: false,
  }),
])

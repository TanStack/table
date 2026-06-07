import { createColumnHelper } from '@tanstack/react-table'
import type { CellData, RowData, TableFeatures } from '@tanstack/react-table'
import type { User } from '../api/user'
import type { features } from '../components/table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterKey?: keyof TData
    filterVariant?: 'text' | 'number'
  }
}

const columnHelper = createColumnHelper<typeof features, User>()

export const USER_COLUMNS = columnHelper.columns([
  columnHelper.accessor('id', {
    header: () => <span>ID</span>,
    meta: { filterKey: 'id', filterVariant: 'number' },
  }),
  columnHelper.accessor('firstName', {
    header: () => <span>First Name</span>,
    meta: { filterKey: 'firstName' },
  }),
  columnHelper.accessor('lastName', {
    header: () => <span>Last Name</span>,
    meta: { filterKey: 'lastName' },
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    meta: { filterKey: 'age', filterVariant: 'number' },
  }),
])

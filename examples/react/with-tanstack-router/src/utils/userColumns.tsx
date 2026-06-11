import { createColumnHelper } from '@tanstack/react-table'
import type { User } from '../api/user'
import type { features } from '../components/table'

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

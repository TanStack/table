import { Headers } from '../core/Headers'
import { ColumnSizing } from '../features/ColumnSizing'
import { Expanding } from '../features/Expanding'
import { Filters } from '../features/Filters'
import { Grouping } from '../features/Grouping'
import { Ordering } from '../features/Ordering'
import { Pagination } from '../features/Pagination'
import { Pinning } from '../features/Pinning'
import { RowSelection } from '../features/RowSelection'
import { Sorting } from '../features/Sorting'
import { Visibility } from '../features/Visibility'
import { InitialTableState } from '../types'

export type TableFeature = {
  getDefaultOptions?: (instance: any) => any
  getInitialState?: (initialState?: InitialTableState) => any
  createInstance?: (instance: any) => any
  getDefaultColumnDef?: () => any
  createColumn?: (column: any, instance: any) => any
  createHeader?: (column: any, instance: any) => any
  createCell?: (cell: any, column: any, row: any, instance: any) => any
  createRow?: (row: any, instance: any) => any
}

export const features = [
  Headers,
  Visibility,
  Ordering,
  Pinning,
  Filters,
  Sorting,
  Grouping,
  Expanding,
  Pagination,
  RowSelection,
  ColumnSizing,
] as const

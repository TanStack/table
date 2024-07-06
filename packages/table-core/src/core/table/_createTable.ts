import { Headers } from '../headers/Headers'
import { Rows } from '../rows/Rows'
import { Cells } from '../cells/Cells'
import { Columns } from '../columns/Columns'

import { ColumnFaceting } from '../../features/column-faceting/ColumnFaceting'
import { ColumnFiltering } from '../../features/column-filtering/ColumnFiltering'
import { ColumnGrouping } from '../../features/column-grouping/ColumnGrouping'
import { ColumnOrdering } from '../../features/column-ordering/ColumnOrdering'
import { ColumnPinning } from '../../features/column-pinning/ColumnPinning'
import { ColumnResizing } from '../../features/column-resizing/ColumnResizing'
import { ColumnSizing } from '../../features/column-sizing/ColumnSizing'
import { ColumnVisibility } from '../../features/column-visibility/ColumnVisibility'
import { GlobalFaceting } from '../../features/global-faceting/GlobalFaceting'
import { GlobalFiltering } from '../../features/global-filtering/GlobalFiltering'
import { RowExpanding } from '../../features/row-expanding/RowExpanding'
import { RowPagination } from '../../features/row-pagination/RowPagination'
import { RowPinning } from '../../features/row-pinning/RowPinning'
import { RowSelection } from '../../features/row-selection/RowSelection'
import { RowSorting } from '../../features/row-sorting/RowSorting'
import { Tables } from './Tables'
import type { Table_CoreProperties } from './Tables.types'
import type {
  RowData,
  Table,
  TableOptionsResolved,
  TableState,
} from '../../types'

const coreFeatures = [Tables, Rows, Headers, Columns, Cells]

const builtInFeatures = [
  ColumnFaceting,
  ColumnFiltering,
  ColumnGrouping,
  ColumnOrdering,
  ColumnPinning,
  ColumnResizing,
  ColumnSizing,
  ColumnVisibility,
  GlobalFaceting,
  GlobalFiltering,
  RowExpanding,
  RowPagination,
  RowPinning,
  RowSelection,
  RowSorting,
]

export function getInitialTableState(
  initialState: Partial<TableState> | undefined = {},
): TableState {
  builtInFeatures.forEach((feature) => {
    initialState = feature._getInitialState?.(initialState) ?? initialState
  })
  return initialState as TableState
}

export function _createTable<TData extends RowData>(
  options: TableOptionsResolved<TData>,
): Table<TData> {
  if (
    process.env.NODE_ENV !== 'production' &&
    (options.debugAll || options.debugTable)
  ) {
    console.info('Creating Table Instance...')
  }

  const _features = [
    ...coreFeatures,
    ...builtInFeatures,
    ...(options._features ?? []),
  ]

  const table = { _features } as unknown as Table<TData>

  const defaultOptions = _features.reduce((obj, feature) => {
    return Object.assign(obj, feature._getDefaultOptions?.(table))
  }, {}) as TableOptionsResolved<TData>

  const initialState = getInitialTableState(options.initialState)

  const coreInstance: Table_CoreProperties<TData> = {
    _features,
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
  }

  Object.assign(table, coreInstance)

  const queued: Array<() => void> = []
  let queuedTimeout = false

  table._queue = (cb) => {
    queued.push(cb)

    if (!queuedTimeout) {
      queuedTimeout = true

      // Schedule a microtask to run the queued callbacks after
      // the current call stack (render, etc) has finished.
      Promise.resolve()
        .then(() => {
          while (queued.length) {
            queued.shift()!()
          }
          queuedTimeout = false
        })
        .catch((error) =>
          setTimeout(() => {
            throw error
          }),
        )
    }
  }

  for (const feature of table._features) {
    feature._createTable?.(table)
  }

  return table
}

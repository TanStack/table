import { functionalUpdate, RequiredKeys } from '../../utils'

import {
  Updater,
  TableOptionsResolved,
  TableState,
  Table,
  RowData,
} from '../../types'

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
import { Table_Core } from './Table.types'

const coreFeatures = [Cells, Columns, Rows, Headers] as const

const builtInFeatures = [
  ColumnVisibility,
  ColumnOrdering,
  ColumnPinning,
  ColumnFaceting,
  ColumnFiltering,
  GlobalFaceting, //depends on ColumnFaceting
  GlobalFiltering, //depends on ColumnFiltering
  RowSorting,
  ColumnGrouping, //depends on RowSorting
  RowExpanding,
  RowPagination,
  RowPinning,
  RowSelection,
  ColumnSizing,
  ColumnResizing,
] as const

export function _createTable<TData extends RowData>(
  options: TableOptionsResolved<TData>
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

  let table = { _features } as unknown as Table<TData>

  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature._getDefaultOptions?.(table))
  }, {}) as TableOptionsResolved<TData>

  const mergeOptions = (options: TableOptionsResolved<TData>) => {
    if (table.options.mergeOptions) {
      return table.options.mergeOptions(defaultOptions, options)
    }

    return {
      ...defaultOptions,
      ...options,
    }
  }

  let initialState = (options.initialState ?? {}) as TableState

  table._features.forEach(feature => {
    initialState = (feature._getInitialState?.(initialState) ??
      initialState) as TableState
  })

  const queued: (() => void)[] = []
  let queuedTimeout = false

  const coreInstance: Table_Core<TData> = {
    _features,
    options: {
      ...defaultOptions,
      ...options,
    },
    initialState,
    _queue: cb => {
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
          .catch(error =>
            setTimeout(() => {
              throw error
            })
          )
      }
    },
    reset: () => {
      table.setState(table.initialState)
    },
    setOptions: updater => {
      const newOptions = functionalUpdate(updater, table.options)
      table.options = mergeOptions(newOptions) as RequiredKeys<
        TableOptionsResolved<TData>,
        'state'
      >
    },

    getState: () => {
      return table.options.state as TableState
    },

    setState: (updater: Updater<TableState>) => {
      table.options.onStateChange?.(updater)
    },

    getCoreRowModel: () => {
      if (!table._getCoreRowModel) {
        table._getCoreRowModel = table.options.getCoreRowModel(table)
      }

      return table._getCoreRowModel!()
    },

    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up

    getRowModel: () => {
      return table.getPaginationRowModel()
    },
  }

  Object.assign(table, coreInstance)

  for (let index = 0; index < table._features.length; index++) {
    const feature = table._features[index]
    feature?._createTable?.(table)
  }

  return table
}

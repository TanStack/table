import { flattenBy, functionalUpdate, memo, RequiredKeys } from '../utils'

import {
  Updater,
  TableOptionsResolved,
  TableState,
  Table,
  ColumnDefTemplate,
  InitialTableState,
  Row,
  Column,
  RowModel,
  ColumnDef,
  TableOptions,
  RowData,
} from '../types'

//
import { createColumn } from './column'
import { Headers } from './headers'
//

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

export type TableFeature = {
  getDefaultOptions?: (table: any) => any
  getInitialState?: (initialState?: InitialTableState) => any
  createTable?: (table: any) => any
  getDefaultColumnDef?: () => any
  createColumn?: (column: any, table: any) => any
  createHeader?: (column: any, table: any) => any
  createCell?: (cell: any, column: any, row: any, table: any) => any
  createRow?: (row: any, table: any) => any
}

const features = [
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

//

export type CoreTableState = {}

export type CoreOptions<TData extends RowData> = {
  data: TData[]
  state: Partial<TableState>
  onStateChange: (updater: Updater<TableState>) => void
  debugAll?: boolean
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  debugRows?: boolean
  initialState?: InitialTableState
  autoResetAll?: boolean
  mergeOptions?: (
    defaultOptions: TableOptions<TData>,
    options: Partial<TableOptions<TData>>
  ) => TableOptions<TData>
  meta?: unknown
  getCoreRowModel: (table: Table<any>) => () => RowModel<any>
  getSubRows?: (originalRow: TData, index: number) => undefined | TData[]
  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  columns: ColumnDef<TData>[]
  defaultColumn?: Partial<ColumnDef<TData>>
  renderFallbackValue: any
}

export type CoreInstance<TData extends RowData> = {
  initialState: TableState
  reset: () => void
  options: RequiredKeys<TableOptionsResolved<TData>, 'state'>
  setOptions: (newOptions: Updater<TableOptionsResolved<TData>>) => void
  getState: () => TableState
  setState: (updater: Updater<TableState>) => void
  _features: readonly TableFeature[]
  _queue: (cb: () => void) => void
  _getRowId: (_: TData, index: number, parent?: Row<TData>) => string
  getCoreRowModel: () => RowModel<TData>
  _getCoreRowModel?: () => RowModel<TData>
  getRowModel: () => RowModel<TData>
  getRow: (id: string) => Row<TData>
  _getDefaultColumnDef: () => Partial<ColumnDef<TData>>
  _getColumnDefs: () => ColumnDef<TData>[]
  _getAllFlatColumnsById: () => Record<string, Column<TData>>
  getAllColumns: () => Column<TData>[]
  getAllFlatColumns: () => Column<TData>[]
  getAllLeafColumns: () => Column<TData>[]
  getColumn: (columnId: string) => Column<TData>
}

export function createTable<TData extends RowData>(
  options: TableOptionsResolved<TData>
): Table<TData> {
  if (options.debugAll || options.debugTable) {
    console.info('Creating Table Instance...')
  }

  let table = { _features: features } as unknown as Table<TData>

  const defaultOptions = table._features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(table))
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

  const coreInitialState: CoreTableState = {}

  let initialState = {
    ...coreInitialState,
    ...(options.initialState ?? {}),
  } as TableState

  table._features.forEach(feature => {
    initialState = feature.getInitialState?.(initialState) ?? initialState
  })

  const queued: (() => void)[] = []
  let queuedTimeout = false

  const coreInstance: CoreInstance<TData> = {
    _features: features,
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

    _getRowId: (row: TData, index: number, parent?: Row<TData>) =>
      table.options.getRowId?.(row, index, parent) ??
      `${parent ? [parent.id, index].join('.') : index}`,

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
    getRow: (id: string) => {
      const row = table.getRowModel().rowsById[id]

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`getRow expected an ID, but got ${id}`)
        }
        throw new Error()
      }

      return row
    },
    _getDefaultColumnDef: memo(
      () => [table.options.defaultColumn],
      defaultColumn => {
        defaultColumn = (defaultColumn ?? {}) as Partial<ColumnDef<TData>>

        return {
          header: props => props.header.column.id,
          footer: props => props.header.column.id,
          cell: props => (props.renderValue() as any)?.toString?.() ?? null,
          ...table._features.reduce((obj, feature) => {
            return Object.assign(obj, feature.getDefaultColumnDef?.())
          }, {}),
          ...defaultColumn,
        } as Partial<ColumnDef<TData>>
      },
      {
        debug: () => table.options.debugAll ?? table.options.debugColumns,
        key: process.env.NODE_ENV === 'development' && 'getDefaultColumnDef',
      }
    ),

    _getColumnDefs: () => table.options.columns,

    getAllColumns: memo(
      () => [table._getColumnDefs()],
      columnDefs => {
        const recurseColumns = (
          columnDefs: ColumnDef<TData>[],
          parent?: Column<TData>,
          depth = 0
        ): Column<TData>[] => {
          return columnDefs.map(columnDef => {
            const column = createColumn(table, columnDef, depth, parent)

            column.columns = columnDef.columns
              ? recurseColumns(columnDef.columns, column, depth + 1)
              : []

            return column
          })
        }

        return recurseColumns(columnDefs)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    ),

    getAllFlatColumns: memo(
      () => [table.getAllColumns()],
      allColumns => {
        return allColumns.flatMap(column => {
          return column.getFlatColumns()
        })
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllFlatColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    ),

    _getAllFlatColumnsById: memo(
      () => [table.getAllFlatColumns()],
      flatColumns => {
        return flatColumns.reduce((acc, column) => {
          acc[column.id] = column
          return acc
        }, {} as Record<string, Column<TData>>)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllFlatColumnsById',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    ),

    getAllLeafColumns: memo(
      () => [table.getAllColumns(), table._getOrderColumnsFn()],
      (allColumns, orderColumns) => {
        let leafColumns = allColumns.flatMap(column => column.getLeafColumns())
        return orderColumns(leafColumns)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllLeafColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    ),

    getColumn: columnId => {
      const column = table._getAllFlatColumnsById()[columnId]

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[Table] Column with id ${columnId} does not exist.`)
        }
        throw new Error()
      }

      return column
    },
  }

  Object.assign(table, coreInstance)

  table._features.forEach(feature => {
    return Object.assign(table, feature.createTable?.(table))
  })

  return table
}

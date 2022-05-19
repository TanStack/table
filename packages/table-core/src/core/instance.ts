import { flattenBy, functionalUpdate, memo, RequiredKeys } from '../utils'

import {
  Updater,
  TableOptionsResolved,
  TableState,
  TableInstance,
  Renderable,
  TableGenerics,
  InitialTableState,
  Row,
  Column,
  RowModel,
  ColumnDef,
} from '../types'

//
import { createColumn } from './column'
import { Headers } from './headers'
import { createRow } from './Rows'
import { createCell } from './cell'
import { features } from './features'
//

export type CoreTableState = {}

export type CoreOptions<TGenerics extends TableGenerics> = {
  data: TGenerics['Row'][]
  state: Partial<TableState>
  onStateChange: (updater: Updater<TableState>) => void
  render: TGenerics['Renderer']
  debugAll?: boolean
  debugTable?: boolean
  debugHeaders?: boolean
  debugColumns?: boolean
  debugRows?: boolean
  initialState?: InitialTableState
  autoResetAll?: boolean
  mergeOptions?: <T>(defaultOptions: T, options: Partial<T>) => T
  meta?: TGenerics['TableMeta']
  getCoreRowModel: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>
  getSubRows?: (
    originalRow: TGenerics['Row'],
    index: number
  ) => undefined | TGenerics['Row'][]
  getRowId?: (
    originalRow: TGenerics['Row'],
    index: number,
    parent?: Row<TGenerics>
  ) => string
  columns: ColumnDef<TGenerics>[]
  defaultColumn?: Partial<ColumnDef<TGenerics>>
}

export type CoreInstance<TGenerics extends TableGenerics> = {
  initialState: TableState
  reset: () => void
  options: RequiredKeys<TableOptionsResolved<TGenerics>, 'state'>
  setOptions: (newOptions: Updater<TableOptionsResolved<TGenerics>>) => void
  getState: () => TableState
  setState: (updater: Updater<TableState>) => void
  _queue: (cb: () => void) => void
  _render: <TProps>(
    template: Renderable<TGenerics, TProps>,
    props: TProps
  ) => string | null | TGenerics['Rendered']
  _getRowId: (
    _: TGenerics['Row'],
    index: number,
    parent?: Row<TGenerics>
  ) => string
  getCoreRowModel: () => RowModel<TGenerics>
  _getCoreRowModel?: () => RowModel<TGenerics>
  getRowModel: () => RowModel<TGenerics>
  getRow: (id: string) => Row<TGenerics>
  _getDefaultColumnDef: () => Partial<ColumnDef<TGenerics>>
  _getColumnDefs: () => ColumnDef<TGenerics>[]
  _getAllFlatColumnsById: () => Record<string, Column<TGenerics>>
  getAllColumns: () => Column<TGenerics>[]
  getAllFlatColumns: () => Column<TGenerics>[]
  getAllLeafColumns: () => Column<TGenerics>[]
  getColumn: (columnId: string) => Column<TGenerics>
}

export function createTableInstance<TGenerics extends TableGenerics>(
  options: TableOptionsResolved<TGenerics>
): TableInstance<TGenerics> {
  if (options.debugAll || options.debugTable) {
    console.info('Creating Table Instance...')
  }

  let instance = {} as unknown as TableInstance<TGenerics>

  const defaultOptions = features.reduce((obj, feature) => {
    return Object.assign(obj, feature.getDefaultOptions?.(instance))
  }, {}) as TableOptionsResolved<TGenerics>

  const mergeOptions = (options: TableOptionsResolved<TGenerics>) => {
    if (instance.options.mergeOptions) {
      return instance.options.mergeOptions(defaultOptions, options)
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

  features.forEach(feature => {
    initialState = feature.getInitialState?.(initialState) ?? initialState
  })

  const queued: (() => void)[] = []
  let queuedTimeout = false

  const coreInstance: CoreInstance<TGenerics> = {
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
      instance.setState(instance.initialState)
    },
    setOptions: updater => {
      const newOptions = functionalUpdate(updater, instance.options)
      instance.options = mergeOptions(newOptions)
    },
    _render: (template, props) => {
      if (typeof instance.options.render === 'function') {
        return instance.options.render(template, props)
      }

      if (typeof template === 'function') {
        return (template as Function)(props)
      }

      return template
    },

    getState: () => {
      return instance.options.state as TableState
    },

    setState: (updater: Updater<TableState>) => {
      instance.options.onStateChange?.(updater)
    },

    _getRowId: (
      row: TGenerics['Row'],
      index: number,
      parent?: Row<TGenerics>
    ) =>
      instance.options.getRowId?.(row, index, parent) ??
      `${parent ? [parent.id, index].join('.') : index}`,

    getCoreRowModel: () => {
      if (!instance._getCoreRowModel) {
        instance._getCoreRowModel = instance.options.getCoreRowModel(instance)
      }

      return instance._getCoreRowModel()
    },

    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up

    getRowModel: () => {
      return instance.getPaginationRowModel()
    },
    getRow: (id: string) => {
      const row = instance.getRowModel().rowsById[id]

      if (!row) {
        if (process.env.NODE_ENV !== 'production') {
          throw new Error(`getRow expected an ID, but got ${id}`)
        }
        throw new Error()
      }

      return row
    },
    _getDefaultColumnDef: memo(
      () => [instance.options.defaultColumn],
      defaultColumn => {
        defaultColumn = (defaultColumn ?? {}) as Partial<ColumnDef<TGenerics>>

        return {
          header: props => props.header.column.id,
          footer: props => props.header.column.id,
          cell: props => props.getValue().toString?.() ?? null,
          ...features.reduce((obj, feature) => {
            return Object.assign(obj, feature.getDefaultColumnDef?.())
          }, {}),
          ...defaultColumn,
        } as Partial<ColumnDef<TGenerics>>
      },
      {
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
        key: process.env.NODE_ENV === 'development' && 'getDefaultColumnDef',
      }
    ),

    _getColumnDefs: () => instance.options.columns,

    getAllColumns: memo(
      () => [instance._getColumnDefs()],
      columnDefs => {
        const recurseColumns = (
          columnDefs: ColumnDef<TGenerics>[],
          parent?: Column<TGenerics>,
          depth = 0
        ): Column<TGenerics>[] => {
          return columnDefs.map(columnDef => {
            const column = createColumn(instance, columnDef, depth, parent)

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
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getAllFlatColumns: memo(
      () => [instance.getAllColumns()],
      allColumns => {
        return allColumns.flatMap(column => {
          return column.getFlatColumns()
        })
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllFlatColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    _getAllFlatColumnsById: memo(
      () => [instance.getAllFlatColumns()],
      flatColumns => {
        return flatColumns.reduce((acc, column) => {
          acc[column.id] = column
          return acc
        }, {} as Record<string, Column<TGenerics>>)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllFlatColumnsById',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getAllLeafColumns: memo(
      () => [instance.getAllColumns(), instance._getOrderColumnsFn()],
      (allColumns, orderColumns) => {
        let leafColumns = allColumns.flatMap(column => column.getLeafColumns())
        return orderColumns(leafColumns)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getAllLeafColumns',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    ),

    getColumn: columnId => {
      const column = instance._getAllFlatColumnsById()[columnId]

      if (!column) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[Table] Column with id ${columnId} does not exist.`)
        }
        throw new Error()
      }

      return column
    },
  }

  Object.assign(instance, coreInstance)

  features.forEach(feature => {
    return Object.assign(instance, feature.createInstance?.(instance))
  })

  return instance
}

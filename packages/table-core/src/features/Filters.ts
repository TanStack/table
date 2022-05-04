import { RowModel } from '..'
import { BuiltInFilterFn, filterFns } from '../filterFns'
import {
  Column,
  OnChangeFn,
  TableGenerics,
  TableInstance,
  Row,
  Updater,
  TableFeature,
} from '../types'
import {
  functionalUpdate,
  isFunction,
  makeStateUpdater,
  memo,
  Overwrite,
} from '../utils'

export type FiltersTableState = {
  columnFilters: ColumnFiltersState
  globalFilter: any
  columnFiltersProgress: number
  globalFilterProgress: number
}

export type ColumnFiltersState = ColumnFilter[]

export type ColumnFilter = {
  id: string
  value: unknown
}

/*
A filter function is any function that takes an array of rows and returns an array of rows. Because filter functions can be used for both column and global filters, they are passed an array of columnIds to filter on. 
*/

export type FilterFn<TGenerics extends TableGenerics> = {
  (rows: Row<TGenerics>[], columnIds: string[], filterValue: any): any
  autoRemove?: ColumnFilterAutoRemoveTestFn<TGenerics>
}

export type ColumnFilterAutoRemoveTestFn<TGenerics extends TableGenerics> = (
  value: unknown,
  column?: Column<TGenerics>
) => boolean

export type CustomFilterFns<TGenerics extends TableGenerics> = Record<
  string,
  FilterFn<TGenerics>
>

export type FilterFnOption<TGenerics extends TableGenerics> =
  | 'auto'
  | BuiltInFilterFn
  | keyof TGenerics['FilterFns']
  | FilterFn<TGenerics>

export type FiltersColumnDef<TGenerics extends TableGenerics> = {
  filterFn?: FilterFnOption<Overwrite<TGenerics, { Value: any }>>
  enableColumnFilter?: boolean
  enableGlobalFilter?: boolean
}

export type FiltersColumn<TGenerics extends TableGenerics> = {
  filterFn: FilterFnOption<Overwrite<TGenerics, { Value: any }>>
  getCanColumnFilter: () => boolean
  getCanGlobalFilter: () => boolean
  getColumnFilterIndex: () => number
  getColumnIsFiltered: () => boolean
  getColumnFilterValue: () => unknown
  setColumnFilterValue: (updater: Updater<any>) => void
  getPreFilteredRows: () => Row<TGenerics>[] | undefined
  getPreFilteredUniqueValues: () => Map<any, number>
  getPreFilteredMinMaxValues: () => [any, any]
}

export type FiltersOptions<TGenerics extends TableGenerics> = {
  filterFromLeafRows?: boolean
  filterFns?: TGenerics['FilterFns']

  // Column
  manualColumnFiltering?: boolean
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  enableColumnFilters?: boolean
  getColumnFilteredRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>

  // Global
  manualGlobalFiltering?: boolean
  globalFilterFn?: FilterFnOption<TGenerics>
  onGlobalFilterChange?: OnChangeFn<any>
  enableGlobalFilter?: boolean
  getGlobalFilteredRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>
  getColumnCanGlobalFilter?: (column: Column<TGenerics>) => boolean
}

export type FiltersInstance<TGenerics extends TableGenerics> = {
  getColumnAutoFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined

  getColumnFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined

  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  setColumnFilterValue: (columnId: string, updater: Updater<any>) => void
  resetColumnFilters: () => void
  getColumnCanColumnFilter: (columnId: string) => boolean

  getColumnIsFiltered: (columnId: string) => boolean
  getColumnFilterValue: (columnId: string) => unknown
  getColumnFilterIndex: (columnId: string) => number

  // Column Filters
  getPreColumnFilteredRowModel: () => RowModel<TGenerics>
  getColumnFilteredRowModel: () => RowModel<TGenerics>
  _getColumnFilteredRowModel?: () => RowModel<TGenerics>

  // Global Filters
  setGlobalFilter: (updater: Updater<any>) => void
  resetGlobalFilter: () => void
  getGlobalAutoFilterFn: () => FilterFn<TGenerics> | undefined
  getGlobalFilterFn: () => FilterFn<TGenerics> | undefined
  getColumnCanGlobalFilter: (columnId: string) => boolean
  getPreGlobalFilteredRowModel: () => RowModel<TGenerics>
  getGlobalFilteredRowModel: () => RowModel<TGenerics>
  _getGlobalFilteredRowModel?: () => RowModel<TGenerics>
}

//

export const Filters: TableFeature = {
  getDefaultColumn: <
    TGenerics extends TableGenerics
  >(): FiltersColumnDef<TGenerics> => {
    return {
      filterFn: 'auto',
    }
  },

  getInitialState: (state): FiltersTableState => {
    return {
      columnFilters: [],
      globalFilter: undefined,
      columnFiltersProgress: 1,
      globalFilterProgress: 1,
      ...state,
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): FiltersOptions<TGenerics> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', instance),
      onGlobalFilterChange: makeStateUpdater('globalFilter', instance),
      filterFromLeafRows: true,
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: column => {
        const value = instance
          .getCoreRowModel()
          .flatRows[0]?.getAllCellsByColumnId()[column.id]?.value

        return typeof value === 'string'
      },
    }
  },

  createColumn: <TGenerics extends TableGenerics>(
    column: Column<TGenerics>,
    instance: TableInstance<TGenerics>
  ): FiltersColumn<TGenerics> => {
    const getFacetInfo = memo(
      () => [column.getPreFilteredRows()],
      (rows = []) => {
        let preFilteredUniqueValues = new Map<any, number>()

        let preFilteredMinMaxValues: [any, any] = [
          rows[0]?.values[column.id] ?? null,
          rows[0]?.values[column.id] ?? null,
        ]

        for (let i = 0; i < rows.length; i++) {
          const value = rows[i]?.values[column.id]

          if (preFilteredUniqueValues.has(value)) {
            preFilteredUniqueValues.set(
              value,
              (preFilteredUniqueValues.get(value) ?? 0) + 1
            )
          } else {
            preFilteredUniqueValues.set(value, 1)
          }

          if (value < preFilteredMinMaxValues[0]) {
            preFilteredMinMaxValues[0] = value
          } else if (value > preFilteredMinMaxValues[1]) {
            preFilteredMinMaxValues[1] = value
          }
        }

        return {
          preFilteredUniqueValues,
          preFilteredMinMaxValues,
        }
      },
      {
        key: 'column.getFacetInfo',
        debug: () => instance.options.debugAll ?? instance.options.debugColumns,
      }
    )

    return {
      filterFn: column.filterFn,
      getCanColumnFilter: () => instance.getColumnCanColumnFilter(column.id),
      getCanGlobalFilter: () => instance.getColumnCanGlobalFilter(column.id),
      getColumnFilterIndex: () => instance.getColumnFilterIndex(column.id),
      getColumnIsFiltered: () => instance.getColumnIsFiltered(column.id),
      getColumnFilterValue: () => instance.getColumnFilterValue(column.id),
      setColumnFilterValue: val =>
        instance.setColumnFilterValue(column.id, val),
      getPreFilteredUniqueValues: () => getFacetInfo().preFilteredUniqueValues,
      getPreFilteredMinMaxValues: () => getFacetInfo().preFilteredMinMaxValues,
      getPreFilteredRows: () => undefined,
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): FiltersInstance<TGenerics> => {
    return {
      getColumnAutoFilterFn: columnId => {
        const firstRow = instance.getCoreRowModel().flatRows[0]

        const value = firstRow?.values[columnId]

        if (typeof value === 'string') {
          return filterFns.includesString
        }

        if (typeof value === 'number') {
          return filterFns.betweenNumberRange
        }

        if (value !== null && typeof value === 'object') {
          return filterFns.equals
        }

        if (Array.isArray(value)) {
          return filterFns.arrIncludes
        }

        return filterFns.weakEquals
      },
      getGlobalAutoFilterFn: () => {
        return filterFns.includesString
      },
      getColumnFilterFn: columnId => {
        const column = instance.getColumn(columnId)
        const userFilterFns = instance.options.filterFns

        if (!column) {
          throw new Error()
        }

        return isFunction(column.filterFn)
          ? column.filterFn
          : column.filterFn === 'auto'
          ? instance.getColumnAutoFilterFn(columnId)
          : (userFilterFns as Record<string, any>)?.[
              column.filterFn as string
            ] ??
            (filterFns[
              column.filterFn as BuiltInFilterFn
            ] as FilterFn<TGenerics>)
      },

      getGlobalFilterFn: () => {
        const { filterFns: userFilterFns, globalFilterFn: globalFilterFn } =
          instance.options

        debugger

        return isFunction(globalFilterFn)
          ? globalFilterFn
          : globalFilterFn === 'auto'
          ? instance.getGlobalAutoFilterFn()
          : (userFilterFns as Record<string, any>)?.[
              globalFilterFn as string
            ] ??
            (filterFns[
              globalFilterFn as BuiltInFilterFn
            ] as FilterFn<TGenerics>)
      },

      setColumnFilters: (updater: Updater<ColumnFiltersState>) => {
        const leafColumns = instance.getAllLeafColumns()

        const updateFn = (old: ColumnFiltersState) => {
          return functionalUpdate(updater, old)?.filter(filter => {
            const column = leafColumns.find(d => d.id === filter.id)

            if (column) {
              const filterFn = instance.getColumnFilterFn(column.id)

              if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
                return false
              }
            }

            return true
          })
        }

        instance.options.onColumnFiltersChange?.(updateFn)
      },

      setGlobalFilter: updater => {
        instance.options.onGlobalFilterChange?.(updater)
      },

      resetGlobalFilter: () => {
        instance.setGlobalFilter(instance.initialState.globalFilter)
      },

      getColumnCanColumnFilter: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        return (
          (column.enableColumnFilter ?? true) &&
          (instance.options.enableColumnFilters ?? true) &&
          !!column.accessorFn
        )
      },

      getColumnCanGlobalFilter: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        return (
          (column.enableGlobalFilter ?? true) &&
          (instance.options.enableGlobalFilter ?? true) &&
          (instance.options.getColumnCanGlobalFilter?.(column) ?? true) &&
          !!column.accessorFn
        )
      },

      getColumnIsFiltered: columnId =>
        instance.getColumnFilterIndex(columnId) > -1,

      getColumnFilterValue: columnId =>
        instance.getState().columnFilters?.find(d => d.id === columnId)?.value,

      getColumnFilterIndex: columnId =>
        instance.getState().columnFilters?.findIndex(d => d.id === columnId) ??
        -1,

      setColumnFilterValue: (columnId, value) => {
        if (!columnId) return

        instance.setColumnFilters(old => {
          const column = instance.getColumn(columnId)

          if (!column) {
            if (process.env.NODE_ENV !== 'production') {
              console.warn(
                `Table: Could not find a column with id: ${columnId}`
              )
            }
            throw new Error()
          }

          const filterFn = instance.getColumnFilterFn(column.id)
          const previousfilter = old?.find(d => d.id === columnId)

          const newFilter = functionalUpdate(
            value,
            previousfilter ? previousfilter.value : undefined
          )

          //
          if (
            shouldAutoRemoveFilter(
              filterFn as FilterFn<TGenerics>,
              newFilter,
              column
            )
          ) {
            return old?.filter(d => d.id !== columnId) ?? []
          }

          const newFilterObj = { id: columnId, value: newFilter }

          if (previousfilter) {
            return (
              old?.map(d => {
                if (d.id === columnId) {
                  return newFilterObj
                }
                return d
              }) ?? []
            )
          }

          if (old?.length) {
            return [...old, newFilterObj]
          }

          return [newFilterObj]
        })
      },

      resetColumnFilters: () => {
        instance.setColumnFilters(instance.initialState?.columnFilters ?? [])
      },

      getPreColumnFilteredRowModel: () => instance.getCoreRowModel(),
      getColumnFilteredRowModel: () => {
        if (
          !instance._getColumnFilteredRowModel &&
          instance.options.getColumnFilteredRowModel
        ) {
          instance._getColumnFilteredRowModel =
            instance.options.getColumnFilteredRowModel(instance)
        }

        if (
          instance.options.manualColumnFiltering ||
          !instance._getColumnFilteredRowModel
        ) {
          return instance.getPreColumnFilteredRowModel()
        }

        return instance._getColumnFilteredRowModel()
      },
      getPreGlobalFilteredRowModel: () => instance.getColumnFilteredRowModel(),
      getGlobalFilteredRowModel: () => {
        if (
          !instance._getGlobalFilteredRowModel &&
          instance.options.getGlobalFilteredRowModel
        ) {
          instance._getGlobalFilteredRowModel =
            instance.options.getGlobalFilteredRowModel(instance)
        }

        if (
          instance.options.manualGlobalFiltering ||
          !instance._getGlobalFilteredRowModel
        ) {
          return instance.getPreGlobalFilteredRowModel()
        }

        return instance._getGlobalFilteredRowModel()
      },
    }
  },
}

export function shouldAutoRemoveFilter<TGenerics extends TableGenerics>(
  filterFn?: FilterFn<TGenerics>,
  value?: any,
  column?: Column<TGenerics>
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}

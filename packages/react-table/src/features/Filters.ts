import { RowModel } from '..'
import { BuiltInFilterType, filterTypes } from '../filterTypes'
import {
  Column,
  Listener,
  OnChangeFn,
  ReactTable,
  Row,
  Updater,
} from '../types'
import { functionalUpdate, isFunction, makeStateUpdater, memo } from '../utils'

export type ColumnFilter = {
  id: string
  value: unknown
}

export type ColumnFiltersState = ColumnFilter[]

export type FilterFn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> =
  {
    (
      rows: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[],
      columnIds: string[],
      filterValue: any
    ): any
    autoRemove?: ColumnFilterAutoRemoveTestFn<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >
  }

export type ColumnFilterAutoRemoveTestFn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = (
  value: unknown,
  column?: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
) => boolean

export type CustomFilterTypes<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = Record<
  string,
  FilterFn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
>

export type FiltersTableState = {
  columnFilters: ColumnFiltersState
  globalFilter: any
}

export type FilterType<TFilterFns> =
  | 'auto'
  | BuiltInFilterType
  | keyof TFilterFns
  | FilterFn<unknown, unknown, TFilterFns, any, any>

export type FiltersColumnDef<TFilterFns> = {
  filterType?: FilterType<TFilterFns>
  enableAllFilters?: boolean
  enableColumnFilter?: boolean
  enableGlobalFilter?: boolean
  defaultCanFilter?: boolean
  defaultCanColumnFilter?: boolean
  defaultCanGlobalFilter?: boolean
}

export type FiltersColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  filterType: FilterType<TFilterFns>
  getCanColumnFilter: () => boolean
  getCanGlobalFilter: () => boolean
  getColumnFilterIndex: () => number
  getIsColumnFiltered: () => boolean
  getColumnFilterValue: () => unknown
  setColumnFilterValue: (value: any) => void
  getPreFilteredRows: () =>
    | Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>[]
    | undefined
  getPreFilteredUniqueValues: () => Map<any, number>
  getPreFilteredMinMaxValues: () => [any, any]
}

export type FiltersOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  filterFromChildrenUp?: boolean
  filterTypes?: TFilterFns
  enableFilters?: boolean
  // Column
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  autoResetColumnFilters?: boolean
  enableColumnFilters?: boolean
  columnFilterRowsFn?: (
    instance: ReactTable<any, any, any, any, any>,
    coreRowModel: RowModel<any, any, any, any, any>
  ) => RowModel<any, any, any, any, any>
  // Global
  globalFilterType?: FilterType<TFilterFns>
  onGlobalFilterChange?: OnChangeFn<any>
  enableGlobalFilters?: boolean
  autoResetGlobalFilter?: boolean
  enableGlobalFilter?: boolean
  globalFilterRowsFn?: (
    instance: ReactTable<any, any, any, any, any>,
    rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  getColumnCanGlobalFilterFn?: (
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => boolean
}

export type FiltersInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  _notifyFiltersReset: () => void
  getColumnAutoFilterFn: (
    columnId: string
  ) => FilterFn<any, any, any, any, any> | undefined

  getColumnFilterFn: (
    columnId: string
  ) => FilterFn<any, any, any, any, any> | undefined

  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  setColumnFilterValue: (columnId: string, value: any) => void
  resetColumnFilters: () => void
  getColumnCanColumnFilter: (columnId: string) => boolean
  getColumnCanGlobalFilterFn?: (
    column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => boolean

  getColumnIsFiltered: (columnId: string) => boolean
  getColumnFilterValue: (columnId: string) => unknown
  getColumnFilterIndex: (columnId: string) => number
  getColumnFilteredRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getPreFilteredRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getPreFilteredRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreFilteredFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreFilteredRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  getPreColumnFilteredRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreColumnFilteredFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreColumnFilteredRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  getColumnFilteredRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getColumnFilteredFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getColumnFilteredRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >

  // Global
  setGlobalFilter: (updater: Updater<any>) => void
  resetGlobalFilter: () => void
  getGlobalAutoFilterFn: () => FilterFn<any, any, any, any, any> | undefined
  getGlobalFilterFn: () => FilterFn<any, any, any, any, any> | undefined
  getColumnCanGlobalFilter: (columnId: string) => boolean
  getGlobalFilteredRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getPreGlobalFilteredRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreGlobalFilteredFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreGlobalFilteredRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  getGlobalFilteredRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getGlobalFilteredFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getGlobalFilteredRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
}

//

export function getDefaultColumn<TFilterFns>(): FiltersColumnDef<TFilterFns> {
  return {
    filterType: 'auto',
  }
}

export function getInitialState(): FiltersTableState {
  return {
    columnFilters: [],
    globalFilter: undefined,
  }
}

export function getDefaultOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): FiltersOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    onColumnFiltersChange: makeStateUpdater('columnFilters', instance),
    onGlobalFilterChange: makeStateUpdater('globalFilter', instance),
    autoResetColumnFilters: true,
    filterFromChildrenUp: true,
    autoResetGlobalFilter: true,
    globalFilterType: 'auto',
    getColumnCanGlobalFilterFn: column => {
      const value = instance.getCoreFlatRows()[0]?.getAllCellsByColumnId()[
        column.id
      ]?.value

      return typeof value === 'string'
    },
  }
}

export function createColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): FiltersColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
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
    { key: 'column.getFacetInfo', debug: instance.options.debug }
  )

  return {
    filterType: column.filterType,
    getCanColumnFilter: () => instance.getColumnCanColumnFilter(column.id),
    getCanGlobalFilter: () => instance.getColumnCanGlobalFilter(column.id),
    getColumnFilterIndex: () => instance.getColumnFilterIndex(column.id),
    getIsColumnFiltered: () => instance.getColumnIsFiltered(column.id),
    getColumnFilterValue: () => instance.getColumnFilterValue(column.id),
    setColumnFilterValue: val => instance.setColumnFilterValue(column.id, val),
    getPreFilteredUniqueValues: () => getFacetInfo().preFilteredUniqueValues,
    getPreFilteredMinMaxValues: () => getFacetInfo().preFilteredMinMaxValues,
    getPreFilteredRows: () => undefined,
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): FiltersInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  let registered = false

  return {
    _notifyFiltersReset: () => {
      if (!registered) {
        registered = true
        return
      }

      if (instance.options.autoResetAll === false) {
        return
      }

      if (instance.options.autoResetAll === true) {
        instance.resetSorting()
      } else {
        if (instance.options.autoResetColumnFilters) {
          instance.resetColumnFilters()
        }
        if (instance.options.autoResetGlobalFilter) {
          instance.resetGlobalFilter()
        }
      }
    },
    getColumnAutoFilterFn: columnId => {
      const firstRow = instance.getCoreFlatRows()[0]

      const value = firstRow?.values[columnId]

      if (typeof value === 'string') {
        return filterTypes.includesString
      }

      if (typeof value === 'number') {
        return filterTypes.betweenNumberRange
      }

      if (value !== null && typeof value === 'object') {
        return filterTypes.equals
      }

      if (Array.isArray(value)) {
        return filterTypes.arrIncludes
      }

      return filterTypes.weakEquals
    },
    getGlobalAutoFilterFn: () => {
      return filterTypes.includesString
    },
    getColumnFilterFn: columnId => {
      const column = instance.getColumn(columnId)
      const userFilterTypes = instance.options.filterTypes

      if (!column) {
        throw new Error()
      }

      return isFunction(column.filterType)
        ? column.filterType
        : column.filterType === 'auto'
        ? instance.getColumnAutoFilterFn(columnId)
        : (userFilterTypes as Record<string, any>)?.[
            column.filterType as string
          ] ??
          (filterTypes[column.filterType as BuiltInFilterType] as FilterFn<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >)
    },

    getGlobalFilterFn: () => {
      const { filterTypes: userFilterTypes, globalFilterType } =
        instance.options

      return isFunction(globalFilterType)
        ? globalFilterType
        : globalFilterType === 'auto'
        ? instance.getGlobalAutoFilterFn()
        : (userFilterTypes as Record<string, any>)?.[
            globalFilterType as string
          ] ??
          (filterTypes[globalFilterType as BuiltInFilterType] as FilterFn<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >)
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

      instance.options.onColumnFiltersChange?.(
        updateFn,
        updateFn(instance.getState().columnFilters)
      )
    },

    setGlobalFilter: updater => {
      instance.options.onGlobalFilterChange?.(
        updater,
        functionalUpdate(updater, instance.getState().globalFilter)
      )
    },

    resetGlobalFilter: () => {
      instance.setGlobalFilter(undefined)
    },

    getColumnCanColumnFilter: columnId => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      return (
        column.enableAllFilters ??
        column.enableColumnFilter ??
        instance.options.enableFilters ??
        instance.options.enableColumnFilters ??
        column.defaultCanFilter ??
        column.defaultCanColumnFilter ??
        !!column.accessorFn
      )
    },

    getColumnCanGlobalFilter: columnId => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      return (
        ((instance.options.enableFilters ??
          instance.options.enableGlobalFilter ??
          column.enableAllFilters ??
          column.enableGlobalFilter ??
          column.defaultCanFilter ??
          column.defaultCanGlobalFilter ??
          !!column.accessorFn) &&
          instance.options.getColumnCanGlobalFilterFn?.(column)) ??
        true
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
              `React-Table: Could not find a column with id: ${columnId}`
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
            filterFn as FilterFn<
              TData,
              TValue,
              TFilterFns,
              TSortingFns,
              TAggregationFns
            >,
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
      instance.setColumnFilters(
        instance.options?.initialState?.columnFilters ?? []
      )
    },

    getColumnFilteredRowModel: memo(
      () => [
        instance.getState().columnFilters,
        instance.getCoreRowModel(),
        instance.options.columnFilterRowsFn,
      ],
      (columnFilters, rowModel, columnFiltersFn) => {
        const columnFilteredRowModel = (() => {
          if (!columnFilters?.length || !columnFiltersFn) {
            return rowModel
          }

          if (process.env.NODE_ENV !== 'production' && instance.options.debug)
            console.info('Column Filtering...')

          return columnFiltersFn(instance as any, rowModel)
        })()

        // Now that each filtered column has it's partially filtered rows,
        // lets assign the final filtered rows to all of the other columns
        const nonFilteredColumns = instance
          .getAllLeafColumns()
          .filter(
            column =>
              !instance.getState().columnFilters?.find(d => d.id === column.id)
          )

        // This essentially enables faceted filter options to be built easily
        // using every column's preFilteredRows value

        nonFilteredColumns.forEach(column => {
          column.getPreFilteredRows = () => columnFilteredRowModel.rows
        })

        return columnFilteredRowModel
      },
      { key: 'getColumnFilteredRowModel', debug: instance.options.debug }
    ),

    // These might be easier to remember than "column" filtered rows
    getPreFilteredRowModel: () => instance.getCoreRowModel(),
    getPreFilteredRows: () => instance.getCoreRowModel().rows,
    getPreFilteredFlatRows: () => instance.getCoreRowModel().flatRows,
    getPreFilteredRowsById: () => instance.getCoreRowModel().rowsById,

    // Pre Column Filter
    getPreColumnFilteredRows: () => instance.getCoreRowModel().rows,
    getPreColumnFilteredFlatRows: () => instance.getCoreRowModel().flatRows,
    getPreColumnFilteredRowsById: () => instance.getCoreRowModel().rowsById,
    getColumnFilteredRows: () => instance.getColumnFilteredRowModel().rows,

    getColumnFilteredFlatRows: () =>
      instance.getColumnFilteredRowModel().flatRows,
    getColumnFilteredRowsById: () =>
      instance.getColumnFilteredRowModel().rowsById,
    getGlobalFilteredRowModel: memo(
      () => [
        instance.getState().globalFilter,
        instance.getColumnFilteredRowModel(),
        instance.options.globalFilterRowsFn,
      ],
      (globalFilterValue, columnFilteredRowModel, globalFiltersFn) => {
        const globalFilteredRowModel = (() => {
          if (!globalFiltersFn || !globalFilterValue) {
            return columnFilteredRowModel
          }

          if (process.env.NODE_ENV !== 'production' && instance.options.debug)
            console.info('Global Filtering...')

          return globalFiltersFn(
            instance as ReactTable<any, any, any, any, any>,
            columnFilteredRowModel
          )
        })()

        // Now that each filtered column has it's partially filtered rows,
        // lets assign the final filtered rows to all of the other columns
        const nonFilteredColumns = instance
          .getAllLeafColumns()
          .filter(
            column =>
              !instance.getState().columnFilters?.find(d => d.id === column.id)
          )

        // This essentially enables faceted filter options to be built easily
        // using every column's preFilteredRows value

        nonFilteredColumns.forEach(column => {
          column.getPreFilteredRows = () => globalFilteredRowModel.rows
        })

        return globalFilteredRowModel
      },
      {
        key: 'getGlobalFilteredRowModel',
        debug: instance.options.debug,
        onChange: () => instance._notifySortingReset(),
      }
    ),

    getPreGlobalFilteredRows: () => instance.getColumnFilteredRowModel().rows,
    getPreGlobalFilteredFlatRows: () =>
      instance.getColumnFilteredRowModel().flatRows,
    getPreGlobalFilteredRowsById: () =>
      instance.getColumnFilteredRowModel().rowsById,
    getGlobalFilteredRows: () => instance.getGlobalFilteredRowModel().rows,
    getGlobalFilteredFlatRows: () =>
      instance.getGlobalFilteredRowModel().flatRows,
    getGlobalFilteredRowsById: () =>
      instance.getGlobalFilteredRowModel().rowsById,
  }
}

export function shouldAutoRemoveFilter(
  filterFn?: FilterFn<any, any, any, any, any>,
  value?: any,
  column?: Column<any, any, any, any, any>
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}

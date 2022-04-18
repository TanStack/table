import { RowModel } from '..'
import { BuiltInFilterType, filterTypes } from '../filterTypes'
import {
  Column,
  OnChangeFn,
  AnyGenerics,
  PartialGenerics,
  TableInstance,
  Row,
  Updater,
} from '../types'
import {
  functionalUpdate,
  isFunction,
  makeStateUpdater,
  memo,
  Overwrite,
} from '../utils'

export type ColumnFilter = {
  id: string
  value: unknown
}

export type ColumnFiltersState = ColumnFilter[]

export type FilterFn<TGenerics extends AnyGenerics> = {
  (rows: Row<TGenerics>[], columnIds: string[], filterValue: any): any
  autoRemove?: ColumnFilterAutoRemoveTestFn<TGenerics>
}

export type ColumnFilterAutoRemoveTestFn<TGenerics extends AnyGenerics> = (
  value: unknown,
  column?: Column<TGenerics>
) => boolean

export type CustomFilterTypes<TGenerics extends AnyGenerics> = Record<
  string,
  FilterFn<TGenerics>
>

export type FiltersTableState = {
  columnFilters: ColumnFiltersState
  globalFilter: any
}

export type FilterType<TGenerics extends AnyGenerics> =
  | 'auto'
  | BuiltInFilterType
  | TGenerics['FilterFns']
  | FilterFn<TGenerics>

export type FiltersColumnDef<TGenerics extends AnyGenerics> = {
  filterType?: FilterType<Overwrite<TGenerics, { Value: any }>>
  enableAllFilters?: boolean
  enableColumnFilter?: boolean
  enableGlobalFilter?: boolean
  defaultCanFilter?: boolean
  defaultCanColumnFilter?: boolean
  defaultCanGlobalFilter?: boolean
}

export type FiltersColumn<TGenerics extends AnyGenerics> = {
  filterType: FilterType<Overwrite<TGenerics, { Value: any }>>
  getCanColumnFilter: () => boolean
  getCanGlobalFilter: () => boolean
  getColumnFilterIndex: () => number
  getIsColumnFiltered: () => boolean
  getColumnFilterValue: () => unknown
  setColumnFilterValue: (value: any) => void
  getPreFilteredRows: () => Row<TGenerics>[] | undefined
  getPreFilteredUniqueValues: () => Map<any, number>
  getPreFilteredMinMaxValues: () => [any, any]
}

export type FiltersOptions<TGenerics extends AnyGenerics> = {
  filterFromLeafRows?: boolean
  filterTypes?: TGenerics['FilterFns']
  enableFilters?: boolean
  // Column
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  autoResetColumnFilters?: boolean
  enableColumnFilters?: boolean
  columnFilterRowsFn?: (
    instance: TableInstance<TGenerics>,
    coreRowModel: RowModel<TGenerics>
  ) => RowModel<TGenerics>
  // Global
  globalFilterType?: FilterType<TGenerics>
  onGlobalFilterChange?: OnChangeFn<any>
  enableGlobalFilters?: boolean
  autoResetGlobalFilter?: boolean
  enableGlobalFilter?: boolean
  globalFilterRowsFn?: (
    instance: TableInstance<TGenerics>,
    rowModel: RowModel<TGenerics>
  ) => RowModel<TGenerics>
  getColumnCanGlobalFilterFn?: (column: Column<TGenerics>) => boolean
}

export type FiltersInstance<TGenerics extends AnyGenerics> = {
  _notifyFiltersReset: () => void
  getColumnAutoFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined

  getColumnFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined

  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  setColumnFilterValue: (columnId: string, value: any) => void
  resetColumnFilters: () => void
  getColumnCanColumnFilter: (columnId: string) => boolean
  getColumnCanGlobalFilterFn?: (column: Column<TGenerics>) => boolean

  getColumnIsFiltered: (columnId: string) => boolean
  getColumnFilterValue: (columnId: string) => unknown
  getColumnFilterIndex: (columnId: string) => number

  // All
  getPreFilteredRowModel: () => RowModel<TGenerics>

  // Column Filters
  getPreColumnFilteredRowModel: () => RowModel<TGenerics>
  getColumnFilteredRowModel: () => RowModel<TGenerics>

  // Global Filters
  setGlobalFilter: (updater: Updater<any>) => void
  resetGlobalFilter: () => void
  getGlobalAutoFilterFn: () => FilterFn<TGenerics> | undefined
  getGlobalFilterFn: () => FilterFn<TGenerics> | undefined
  getColumnCanGlobalFilter: (columnId: string) => boolean
  getPreGlobalFilteredRowModel: () => RowModel<TGenerics>
  getGlobalFilteredRowModel: () => RowModel<TGenerics>
}

//

export const Filters = {
  getDefaultColumn: <
    TGenerics extends AnyGenerics
  >(): FiltersColumnDef<TGenerics> => {
    return {
      filterType: 'auto',
    }
  },

  getInitialState: (): FiltersTableState => {
    return {
      columnFilters: [],
      globalFilter: undefined,
    }
  },

  getDefaultOptions: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): FiltersOptions<TGenerics> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', instance),
      onGlobalFilterChange: makeStateUpdater('globalFilter', instance),
      autoResetColumnFilters: true,
      filterFromLeafRows: true,
      autoResetGlobalFilter: true,
      globalFilterType: 'auto',
      getColumnCanGlobalFilterFn: column => {
        const value = instance
          .getCoreRowModel()
          .flatRows[0]?.getAllCellsByColumnId()[column.id]?.value

        return typeof value === 'string'
      },
    }
  },

  createColumn: <TGenerics extends AnyGenerics>(
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
      filterType: column.filterType,
      getCanColumnFilter: () => instance.getColumnCanColumnFilter(column.id),
      getCanGlobalFilter: () => instance.getColumnCanGlobalFilter(column.id),
      getColumnFilterIndex: () => instance.getColumnFilterIndex(column.id),
      getIsColumnFiltered: () => instance.getColumnIsFiltered(column.id),
      getColumnFilterValue: () => instance.getColumnFilterValue(column.id),
      setColumnFilterValue: val =>
        instance.setColumnFilterValue(column.id, val),
      getPreFilteredUniqueValues: () => getFacetInfo().preFilteredUniqueValues,
      getPreFilteredMinMaxValues: () => getFacetInfo().preFilteredMinMaxValues,
      getPreFilteredRows: () => undefined,
    }
  },

  getInstance: <TGenerics extends AnyGenerics>(
    instance: TableInstance<TGenerics>
  ): FiltersInstance<TGenerics> => {
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
        const firstRow = instance.getCoreRowModel().flatRows[0]

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
            (filterTypes[
              column.filterType as BuiltInFilterType
            ] as FilterFn<TGenerics>)
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
            (filterTypes[
              globalFilterType as BuiltInFilterType
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
        instance.setGlobalFilter(instance.initialState.globalFilter)
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

      getPreFilteredRowModel: () => instance.getCoreRowModel(),
      getPreColumnFilteredRowModel: () => instance.getCoreRowModel(),
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

            return columnFiltersFn(instance as any, rowModel)
          })()

          // Now that each filtered column has it's partially filtered rows,
          // lets assign the final filtered rows to all of the other columns
          const nonFilteredColumns = instance
            .getAllLeafColumns()
            .filter(
              column =>
                !instance
                  .getState()
                  .columnFilters?.find(d => d.id === column.id)
            )

          // This essentially enables faceted filter options to be built easily
          // using every column's preFilteredRows value

          nonFilteredColumns.forEach(column => {
            column.getPreFilteredRows = () => columnFilteredRowModel.rows
          })

          return columnFilteredRowModel
        },
        {
          key: 'getColumnFilteredRowModel',
          debug: () => instance.options.debugAll ?? instance.options.debugTable,
        }
      ),
      getPreGlobalFilteredRowModel: () => instance.getColumnFilteredRowModel(),
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

            return globalFiltersFn(
              instance as TableInstance<TGenerics>,
              columnFilteredRowModel
            )
          })()

          // Now that each filtered column has it's partially filtered rows,
          // lets assign the final filtered rows to all of the other columns
          const nonFilteredColumns = instance
            .getAllLeafColumns()
            .filter(
              column =>
                !instance
                  .getState()
                  .columnFilters?.find(d => d.id === column.id)
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
          debug: () => instance.options.debugAll ?? instance.options.debugTable,
          onChange: () => {
            instance._notifySortingReset()
          },
        }
      ),
    }
  },
}

export function shouldAutoRemoveFilter<TGenerics extends AnyGenerics>(
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

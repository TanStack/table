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
import { filterRows } from '../utils/filterRowsUtils'

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

export type FilterFn<TGenerics extends TableGenerics> = {
  (row: Row<TGenerics>, columnId: string, filterValue: any): boolean
  resolveFilterValue?: TransformFilterValueFn<TGenerics>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TGenerics>
}

export type TransformFilterValueFn<TGenerics extends TableGenerics> = (
  value: any,
  column?: Column<TGenerics>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TGenerics extends TableGenerics> = (
  value: any,
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
  enableFaceting?: boolean
}

export type FiltersColumn<TGenerics extends TableGenerics> = {
  filterFn: FilterFnOption<Overwrite<TGenerics, { Value: any }>>
  getCanColumnFilter: () => boolean
  getCanGlobalFilter: () => boolean
  getColumnFilterIndex: () => number
  getColumnIsFiltered: () => boolean
  getColumnFilterValue: () => unknown
  setColumnFilterValue: (updater: Updater<any>) => void
  getFacetedRowModel: () => RowModel<TGenerics>
  getFacetedUniqueValues: () => Map<any, number>
  getFacetedMinMaxValues: () => [any, any]
}

export type FiltersRow<TGenerics extends TableGenerics> = {
  columnFilterMap: Record<string, boolean>
  subRowsByFacetId: Record<string, Row<TGenerics>[]>
}

export type FiltersOptions<TGenerics extends TableGenerics> = {
  enableFilters?: boolean
  manualFiltering?: boolean
  filterFromLeafRows?: boolean
  filterFns?: TGenerics['FilterFns']

  // Column
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  enableColumnFilters?: boolean
  getFilteredRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>

  // Global
  globalFilterFn?: FilterFnOption<TGenerics>
  onGlobalFilterChange?: OnChangeFn<any>
  enableGlobalFilter?: boolean
  getColumnCanGlobalFilter?: (column: Column<TGenerics>) => boolean
}

export type FiltersInstance<TGenerics extends TableGenerics> = {
  getColumnAutoFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined

  getColumnFilterFn: (columnId: string) => FilterFn<TGenerics> | undefined

  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  setColumnFilterValue: (columnId: string, updater: Updater<any>) => void
  resetColumnFilters: () => void
  getColumnCanColumnFilter: (columnId: string) => boolean
  getColumnFacetedRowModel: (columnId: string) => RowModel<TGenerics>

  getColumnIsFiltered: (columnId: string) => boolean
  getColumnFilterValue: (columnId: string) => unknown
  getColumnFilterIndex: (columnId: string) => number

  // Column Filters
  getPreFilteredRowModel: () => RowModel<TGenerics>
  getFilteredRowModel: () => RowModel<TGenerics>
  _getFilteredRowModel?: () => RowModel<TGenerics>

  // Global Filters
  setGlobalFilter: (updater: Updater<any>) => void
  resetGlobalFilter: () => void
  getGlobalAutoFilterFn: () => FilterFn<TGenerics> | undefined
  getGlobalFilterFn: () => FilterFn<TGenerics> | undefined
  getColumnCanGlobalFilter: (columnId: string) => boolean
  getGlobalFacetedRowModel: () => RowModel<TGenerics>
  getGlobalFacetedUniqueValues: () => Map<any, number>
  getGlobalFacetedMinMaxValues: () => [number, number]
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
    return {
      filterFn: column.filterFn,
      getCanColumnFilter: () => instance.getColumnCanColumnFilter(column.id),
      getCanGlobalFilter: () => instance.getColumnCanGlobalFilter(column.id),
      getColumnFilterIndex: () => instance.getColumnFilterIndex(column.id),
      getColumnIsFiltered: () => instance.getColumnIsFiltered(column.id),
      getColumnFilterValue: () => instance.getColumnFilterValue(column.id),
      setColumnFilterValue: val =>
        instance.setColumnFilterValue(column.id, val),
      getFacetedRowModel: memo(
        () => [
          instance.getPreFilteredRowModel(),
          instance.getState().columnFilters,
          instance.getState().globalFilter,
          // Include this to force the filtered facet info to be calculated
          instance.getFilteredRowModel(),
        ],
        (rowModel, columnFilters, globalFilter, _) => {
          if (!columnFilters?.length && !globalFilter) {
            return rowModel
          }

          return filterRows(
            rowModel.rows,
            [
              ...columnFilters.map(d => d.id).filter(d => d !== column.id),
              globalFilter ? '__global__' : undefined,
            ].filter(Boolean) as string[],
            instance
          )
        },
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getFacetedRowModel_' + column.id,
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
      getFacetedUniqueValues: memo(
        () => [column.getFacetedRowModel()],
        facetedRowModel => getRowModelUniqueValues(facetedRowModel, column.id),
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'column.getFacetedUniqueValues',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
      getFacetedMinMaxValues: memo(
        () => [column.getFacetedRowModel()],
        facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'column.getFacetedMinMaxValues',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
    }
  },

  createRow: <TGenerics extends TableGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): FiltersRow<TGenerics> => {
    return {
      columnFilterMap: {},
      subRowsByFacetId: {},
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
          return filterFns.inNumberRange
        }

        if (value !== null && typeof value === 'object') {
          return filterFns.equals
        }

        if (Array.isArray(value)) {
          return filterFns.arrIncludes
        }

        return filterFns.weakEquals
      },
      getColumnFacetedRowModel: columnId => {
        const column = instance.getColumn(columnId)

        if (!column) {
          throw new Error()
        }

        return column.getFacetedRowModel()
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
          (instance.options.enableFilters ?? true) &&
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
          (instance.options.enableFilters ?? true) &&
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

      getPreFilteredRowModel: () => instance.getCoreRowModel(),
      getFilteredRowModel: () => {
        if (
          !instance._getFilteredRowModel &&
          instance.options.getFilteredRowModel
        ) {
          instance._getFilteredRowModel =
            instance.options.getFilteredRowModel(instance)
        }

        if (
          instance.options.manualFiltering ||
          !instance._getFilteredRowModel
        ) {
          return instance.getPreFilteredRowModel()
        }

        return instance._getFilteredRowModel()
      },

      getGlobalFacetedRowModel: memo(
        () => [
          instance.getPreFilteredRowModel(),
          instance.getState().columnFilters,
          instance.getState().globalFilter,
          // Include this to force the filtered facet info to be calculated
          instance.getFilteredRowModel(),
        ],
        (rowModel, columnFilters, globalFilter, _) => {
          if (!columnFilters?.length && !globalFilter) {
            return rowModel
          }

          return filterRows(
            rowModel.rows,
            columnFilters.map(d => d.id),
            instance
          )
        },
        {
          key:
            process.env.NODE_ENV === 'production' && 'getGlobalFacetedRowModel',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
      getGlobalFacetedUniqueValues: memo(
        () => [instance.getGlobalFacetedRowModel()],
        facetedRowModel =>
          getRowModelUniqueValues(facetedRowModel, '__global__'),
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getGlobalFacetedUniqueValues',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
      getGlobalFacetedMinMaxValues: memo(
        () => [instance.getGlobalFacetedRowModel()],
        facetedRowModel =>
          getRowModelMinMaxValues(facetedRowModel, '__global__'),
        {
          key:
            process.env.NODE_ENV === 'production' &&
            'getGlobalFacetedMinMaxValues',
          debug: () =>
            instance.options.debugAll ?? instance.options.debugColumns,
        }
      ),
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

export function getRowModelMinMaxValues<TGenerics extends TableGenerics>(
  rowModel: RowModel<TGenerics>,
  columnId: string
) {
  let facetedMinMaxValues: [any, any] = [
    rowModel.flatRows[0]?.values[columnId] ?? null,
    rowModel.flatRows[0]?.values[columnId] ?? null,
  ]

  for (let i = 0; i < rowModel.flatRows.length; i++) {
    const value = rowModel.flatRows[i]?.values[columnId]

    if (value < facetedMinMaxValues[0]) {
      facetedMinMaxValues[0] = value
    } else if (value > facetedMinMaxValues[1]) {
      facetedMinMaxValues[1] = value
    }
  }

  return facetedMinMaxValues
}

export function getRowModelUniqueValues<TGenerics extends TableGenerics>(
  rowModel: RowModel<TGenerics>,
  columnId: string
) {
  let facetedUniqueValues = new Map<any, number>()

  for (let i = 0; i < rowModel.flatRows.length; i++) {
    const value = rowModel.flatRows[i]?.values[columnId]

    if (facetedUniqueValues.has(value)) {
      facetedUniqueValues.set(value, (facetedUniqueValues.get(value) ?? 0) + 1)
    } else {
      facetedUniqueValues.set(value, 1)
    }
  }

  return facetedUniqueValues
}

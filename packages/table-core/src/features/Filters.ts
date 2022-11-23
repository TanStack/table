import { RowModel } from '..'
import { TableFeature } from '../core/table'
import { BuiltInFilterFn, filterFns } from '../filterFns'
import {
  Column,
  OnChangeFn,
  Table,
  Row,
  Updater,
  RowData,
  FilterMeta,
  FilterFns,
} from '../types'
import { functionalUpdate, isFunction, makeStateUpdater } from '../utils'

export interface FiltersTableState {
  columnFilters: ColumnFiltersState
  globalFilter: any
}

export type ColumnFiltersState = ColumnFilter[]

export interface ColumnFilter {
  id: string
  value: unknown
}

export interface ResolvedColumnFilter<TData extends RowData> {
  id: string
  resolvedValue: unknown
  filterFn: FilterFn<TData>
}

export interface FilterFn<TData extends RowData> {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: FilterMeta) => void
  ): boolean

  resolveFilterValue?: TransformFilterValueFn<TData>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>
}

export type TransformFilterValueFn<TData extends RowData> = (
  value: any,
  column?: Column<TData, unknown>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TData extends RowData> = (
  value: any,
  column?: Column<TData, unknown>
) => boolean

export type CustomFilterFns<TData extends RowData> = Record<
  string,
  FilterFn<TData>
>

export type FilterFnOption<TData extends RowData> =
  | 'auto'
  | BuiltInFilterFn
  | keyof FilterFns
  | FilterFn<TData>

export interface FiltersColumnDef<TData extends RowData> {
  filterFn?: FilterFnOption<TData>
  enableColumnFilter?: boolean
  enableGlobalFilter?: boolean
}

export interface FiltersColumn<TData extends RowData> {
  getAutoFilterFn: () => FilterFn<TData> | undefined
  getFilterFn: () => FilterFn<TData> | undefined
  setFilterValue: (updater: Updater<any>) => void
  getCanFilter: () => boolean
  getCanGlobalFilter: () => boolean
  getFacetedRowModel: () => RowModel<TData>
  _getFacetedRowModel?: () => RowModel<TData>
  getIsFiltered: () => boolean
  getFilterValue: () => unknown
  getFilterIndex: () => number
  getFacetedUniqueValues: () => Map<any, number>
  _getFacetedUniqueValues?: () => Map<any, number>
  getFacetedMinMaxValues: () => undefined | [number, number]
  _getFacetedMinMaxValues?: () => undefined | [number, number]
}

export interface FiltersRow<TData extends RowData> {
  columnFilters: Record<string, boolean>
  columnFiltersMeta: Record<string, FilterMeta>
}

interface FiltersOptionsBase<TData extends RowData> {
  enableFilters?: boolean
  manualFiltering?: boolean
  filterFromLeafRows?: boolean
  maxLeafRowFilterDepth?: number
  getFilteredRowModel?: (table: Table<any>) => () => RowModel<any>

  // Column
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  enableColumnFilters?: boolean

  // Global
  globalFilterFn?: FilterFnOption<TData>
  onGlobalFilterChange?: OnChangeFn<any>
  enableGlobalFilter?: boolean
  getColumnCanGlobalFilter?: (column: Column<TData, unknown>) => boolean

  // Faceting
  getFacetedRowModel?: (
    table: Table<TData>,
    columnId: string
  ) => () => RowModel<TData>
  getFacetedUniqueValues?: (
    table: Table<TData>,
    columnId: string
  ) => () => Map<any, number>
  getFacetedMinMaxValues?: (
    table: Table<TData>,
    columnId: string
  ) => () => undefined | [number, number]
}

type ResolvedFilterFns = keyof FilterFns extends never
  ? {
      filterFns?: Record<string, FilterFn<any>>
    }
  : {
      filterFns: Record<keyof FilterFns, FilterFn<any>>
    }

export interface FiltersOptions<TData extends RowData>
  extends FiltersOptionsBase<TData>,
    ResolvedFilterFns {}

export interface FiltersInstance<TData extends RowData> {
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void

  resetColumnFilters: (defaultState?: boolean) => void

  // Column Filters
  getPreFilteredRowModel: () => RowModel<TData>
  getFilteredRowModel: () => RowModel<TData>
  _getFilteredRowModel?: () => RowModel<TData>

  // Global Filters
  setGlobalFilter: (updater: Updater<any>) => void
  resetGlobalFilter: (defaultState?: boolean) => void
  getGlobalAutoFilterFn: () => FilterFn<TData> | undefined
  getGlobalFilterFn: () => FilterFn<TData> | undefined
  getGlobalFacetedRowModel: () => RowModel<TData>
  _getGlobalFacetedRowModel?: () => RowModel<TData>
  getGlobalFacetedUniqueValues: () => Map<any, number>
  _getGlobalFacetedUniqueValues?: () => Map<any, number>
  getGlobalFacetedMinMaxValues: () => undefined | [number, number]
  _getGlobalFacetedMinMaxValues?: () => undefined | [number, number]
}

//

export const Filters: TableFeature = {
  getDefaultColumnDef: <TData extends RowData>(): FiltersColumnDef<TData> => {
    return {
      filterFn: 'auto',
    }
  },

  getInitialState: (state): FiltersTableState => {
    return {
      columnFilters: [],
      globalFilter: undefined,
      // filtersProgress: 1,
      // facetProgress: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): FiltersOptions<TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', table),
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      filterFromLeafRows: false,
      maxLeafRowFilterDepth: 100,
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: column => {
        const value = table
          .getCoreRowModel()
          .flatRows[0]?._getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    } as FiltersOptions<TData>
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): FiltersColumn<TData> => {
    return {
      getAutoFilterFn: () => {
        const firstRow = table.getCoreRowModel().flatRows[0]

        const value = firstRow?.getValue(column.id)

        if (typeof value === 'string') {
          return filterFns.includesString
        }

        if (typeof value === 'number') {
          return filterFns.inNumberRange
        }

        if (typeof value === 'boolean') {
          return filterFns.equals
        }

        if (value !== null && typeof value === 'object') {
          return filterFns.equals
        }

        if (Array.isArray(value)) {
          return filterFns.arrIncludes
        }

        return filterFns.weakEquals
      },
      getFilterFn: () => {
        return isFunction(column.columnDef.filterFn)
          ? column.columnDef.filterFn
          : column.columnDef.filterFn === 'auto'
          ? column.getAutoFilterFn()
          // @ts-ignore
          : table.options.filterFns?.[column.columnDef.filterFn as string] ??
            filterFns[column.columnDef.filterFn as BuiltInFilterFn]
      },
      getCanFilter: () => {
        return (
          (column.columnDef.enableColumnFilter ?? true) &&
          (table.options.enableColumnFilters ?? true) &&
          (table.options.enableFilters ?? true) &&
          !!column.accessorFn
        )
      },

      getCanGlobalFilter: () => {
        return (
          (column.columnDef.enableGlobalFilter ?? true) &&
          (table.options.enableGlobalFilter ?? true) &&
          (table.options.enableFilters ?? true) &&
          (table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
          !!column.accessorFn
        )
      },

      getIsFiltered: () => column.getFilterIndex() > -1,

      getFilterValue: () =>
        table.getState().columnFilters?.find(d => d.id === column.id)?.value,

      getFilterIndex: () =>
        table.getState().columnFilters?.findIndex(d => d.id === column.id) ??
        -1,

      setFilterValue: value => {
        table.setColumnFilters(old => {
          const filterFn = column.getFilterFn()
          const previousfilter = old?.find(d => d.id === column.id)

          const newFilter = functionalUpdate(
            value,
            previousfilter ? previousfilter.value : undefined
          )

          //
          if (
            shouldAutoRemoveFilter(
              filterFn as FilterFn<TData>,
              newFilter,
              column
            )
          ) {
            return old?.filter(d => d.id !== column.id) ?? []
          }

          const newFilterObj = { id: column.id, value: newFilter }

          if (previousfilter) {
            return (
              old?.map(d => {
                if (d.id === column.id) {
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
      _getFacetedRowModel:
        table.options.getFacetedRowModel &&
        table.options.getFacetedRowModel(table, column.id),
      getFacetedRowModel: () => {
        if (!column._getFacetedRowModel) {
          return table.getPreFilteredRowModel()
        }

        return column._getFacetedRowModel()
      },
      _getFacetedUniqueValues:
        table.options.getFacetedUniqueValues &&
        table.options.getFacetedUniqueValues(table, column.id),
      getFacetedUniqueValues: () => {
        if (!column._getFacetedUniqueValues) {
          return new Map()
        }

        return column._getFacetedUniqueValues()
      },
      _getFacetedMinMaxValues:
        table.options.getFacetedMinMaxValues &&
        table.options.getFacetedMinMaxValues(table, column.id),
      getFacetedMinMaxValues: () => {
        if (!column._getFacetedMinMaxValues) {
          return undefined
        }

        return column._getFacetedMinMaxValues()
      },
      // () => [column.getFacetedRowModel()],
      // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): FiltersRow<TData> => {
    return {
      columnFilters: {},
      columnFiltersMeta: {},
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): FiltersInstance<TData> => {
    return {
      getGlobalAutoFilterFn: () => {
        return filterFns.includesString
      },

      getGlobalFilterFn: () => {
        const { globalFilterFn: globalFilterFn } = table.options

        return isFunction(globalFilterFn)
          ? globalFilterFn
          : globalFilterFn === 'auto'
          ? table.getGlobalAutoFilterFn()
          // @ts-ignore
          : table.options.filterFns?.[globalFilterFn as string] ??
            filterFns[globalFilterFn as BuiltInFilterFn]
      },

      setColumnFilters: (updater: Updater<ColumnFiltersState>) => {
        const leafColumns = table.getAllLeafColumns()

        const updateFn = (old: ColumnFiltersState) => {
          return functionalUpdate(updater, old)?.filter(filter => {
            const column = leafColumns.find(d => d.id === filter.id)

            if (column) {
              const filterFn = column.getFilterFn()

              if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
                return false
              }
            }

            return true
          })
        }

        table.options.onColumnFiltersChange?.(updateFn)
      },

      setGlobalFilter: updater => {
        table.options.onGlobalFilterChange?.(updater)
      },

      resetGlobalFilter: defaultState => {
        table.setGlobalFilter(
          defaultState ? undefined : table.initialState.globalFilter
        )
      },

      resetColumnFilters: defaultState => {
        table.setColumnFilters(
          defaultState ? [] : table.initialState?.columnFilters ?? []
        )
      },

      getPreFilteredRowModel: () => table.getCoreRowModel(),
      getFilteredRowModel: () => {
        if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
          table._getFilteredRowModel = table.options.getFilteredRowModel(table)
        }

        if (table.options.manualFiltering || !table._getFilteredRowModel) {
          return table.getPreFilteredRowModel()
        }

        return table._getFilteredRowModel()
      },

      _getGlobalFacetedRowModel:
        table.options.getFacetedRowModel &&
        table.options.getFacetedRowModel(table, '__global__'),

      getGlobalFacetedRowModel: () => {
        if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
          return table.getPreFilteredRowModel()
        }

        return table._getGlobalFacetedRowModel()
      },

      _getGlobalFacetedUniqueValues:
        table.options.getFacetedUniqueValues &&
        table.options.getFacetedUniqueValues(table, '__global__'),
      getGlobalFacetedUniqueValues: () => {
        if (!table._getGlobalFacetedUniqueValues) {
          return new Map()
        }

        return table._getGlobalFacetedUniqueValues()
      },

      _getGlobalFacetedMinMaxValues:
        table.options.getFacetedMinMaxValues &&
        table.options.getFacetedMinMaxValues(table, '__global__'),
      getGlobalFacetedMinMaxValues: () => {
        if (!table._getGlobalFacetedMinMaxValues) {
          return
        }

        return table._getGlobalFacetedMinMaxValues()
      },
    }
  },
}

export function shouldAutoRemoveFilter<TData extends RowData>(
  filterFn?: FilterFn<TData>,
  value?: any,
  column?: Column<TData, unknown>
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}

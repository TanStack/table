import { RowModel } from '..'
import { TableFeature } from '../core/instance'
import { BuiltInFilterFn, filterFns } from '../filterFns'
import {
  Column,
  OnChangeFn,
  TableGenerics,
  Table,
  Row,
  Updater,
  RowData,
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
}

export type ColumnFiltersState = ColumnFilter[]

export type ColumnFilter = {
  id: string
  value: unknown
}

export type ResolvedColumnFilter<TData extends RowData> = {
  id: string
  resolvedValue: unknown
  filterFn: FilterFn<TData>
}

export type FilterFn<TData extends RowData> = {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: any) => void
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
  | FilterFn<TData>

export type FiltersColumnDef<TData extends RowData> = {
  filterFn?: FilterFnOption<TData>
  enableColumnFilter?: boolean
  enableGlobalFilter?: boolean
}

export type FiltersColumn<TData extends RowData> = {
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

export type FiltersRow<TData extends RowData> = {
  columnFilters: Record<string, boolean>
  columnFiltersMeta: Record<string, any>
}

export type FiltersOptions<TData extends RowData> = {
  enableFilters?: boolean
  manualFiltering?: boolean
  filterFromLeafRows?: boolean
  getFilteredRowModel?: (instance: Table<any>) => () => RowModel<any>

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
    instance: Table<TData>,
    columnId: string
  ) => () => RowModel<TData>
  getFacetedUniqueValues?: (
    instance: Table<TData>,
    columnId: string
  ) => () => Map<any, number>
  getFacetedMinMaxValues?: (
    instance: Table<TData>,
    columnId: string
  ) => () => undefined | [number, number]
}

export type FiltersInstance<TData extends RowData> = {
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
    instance: Table<TData>
  ): FiltersOptions<TData> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', instance),
      onGlobalFilterChange: makeStateUpdater('globalFilter', instance),
      filterFromLeafRows: false,
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: column => {
        const value = instance
          .getCoreRowModel()
          .flatRows[0]?._getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string'
      },
    }
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    instance: Table<TData>
  ): FiltersColumn<TData> => {
    return {
      getAutoFilterFn: () => {
        const firstRow = instance.getCoreRowModel().flatRows[0]

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
          : (filterFns[
              column.columnDef.filterFn as BuiltInFilterFn
            ] as FilterFn<TData>)
      },
      getCanFilter: () => {
        return (
          (column.columnDef.enableColumnFilter ?? true) &&
          (instance.options.enableColumnFilters ?? true) &&
          (instance.options.enableFilters ?? true) &&
          !!column.accessorFn
        )
      },

      getCanGlobalFilter: () => {
        return (
          (column.columnDef.enableGlobalFilter ?? true) &&
          (instance.options.enableGlobalFilter ?? true) &&
          (instance.options.enableFilters ?? true) &&
          (instance.options.getColumnCanGlobalFilter?.(column) ?? true) &&
          !!column.accessorFn
        )
      },

      getIsFiltered: () => column.getFilterIndex() > -1,

      getFilterValue: () =>
        instance.getState().columnFilters?.find(d => d.id === column.id)?.value,

      getFilterIndex: () =>
        instance.getState().columnFilters?.findIndex(d => d.id === column.id) ??
        -1,

      setFilterValue: value => {
        instance.setColumnFilters(old => {
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
        instance.options.getFacetedRowModel &&
        instance.options.getFacetedRowModel(instance, column.id),
      getFacetedRowModel: () => {
        if (!column._getFacetedRowModel) {
          return instance.getPreFilteredRowModel()
        }

        return column._getFacetedRowModel()
      },
      _getFacetedUniqueValues:
        instance.options.getFacetedUniqueValues &&
        instance.options.getFacetedUniqueValues(instance, column.id),
      getFacetedUniqueValues: () => {
        if (!column._getFacetedUniqueValues) {
          return new Map()
        }

        return column._getFacetedUniqueValues()
      },
      _getFacetedMinMaxValues:
        instance.options.getFacetedMinMaxValues &&
        instance.options.getFacetedMinMaxValues(instance, column.id),
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
    instance: Table<TData>
  ): FiltersRow<TData> => {
    return {
      columnFilters: {},
      columnFiltersMeta: {},
    }
  },

  createTable: <TData extends RowData>(
    instance: Table<TData>
  ): FiltersInstance<TData> => {
    return {
      getGlobalAutoFilterFn: () => {
        return filterFns.includesString
      },

      getGlobalFilterFn: () => {
        const { globalFilterFn: globalFilterFn } = instance.options

        return isFunction(globalFilterFn)
          ? globalFilterFn
          : globalFilterFn === 'auto'
          ? instance.getGlobalAutoFilterFn()
          : (filterFns[globalFilterFn as BuiltInFilterFn] as FilterFn<TData>)
      },

      setColumnFilters: (updater: Updater<ColumnFiltersState>) => {
        const leafColumns = instance.getAllLeafColumns()

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

        instance.options.onColumnFiltersChange?.(updateFn)
      },

      setGlobalFilter: updater => {
        instance.options.onGlobalFilterChange?.(updater)
      },

      resetGlobalFilter: defaultState => {
        instance.setGlobalFilter(
          defaultState ? undefined : instance.initialState.globalFilter
        )
      },

      resetColumnFilters: defaultState => {
        instance.setColumnFilters(
          defaultState ? [] : instance.initialState?.columnFilters ?? []
        )
      },

      getPreFilteredRowModel: () => instance.getCoreRowModel(),
      _getFilteredRowModel:
        instance.options.getFilteredRowModel &&
        instance.options.getFilteredRowModel(instance),
      getFilteredRowModel: () => {
        if (
          instance.options.manualFiltering ||
          !instance._getFilteredRowModel
        ) {
          return instance.getPreFilteredRowModel()
        }

        return instance._getFilteredRowModel()
      },

      _getGlobalFacetedRowModel:
        instance.options.getFacetedRowModel &&
        instance.options.getFacetedRowModel(instance, '__global__'),

      getGlobalFacetedRowModel: () => {
        if (
          instance.options.manualFiltering ||
          !instance._getGlobalFacetedRowModel
        ) {
          return instance.getPreFilteredRowModel()
        }

        return instance._getGlobalFacetedRowModel()
      },

      _getGlobalFacetedUniqueValues:
        instance.options.getFacetedUniqueValues &&
        instance.options.getFacetedUniqueValues(instance, '__global__'),
      getGlobalFacetedUniqueValues: () => {
        if (!instance._getGlobalFacetedUniqueValues) {
          return new Map()
        }

        return instance._getGlobalFacetedUniqueValues()
      },

      _getGlobalFacetedMinMaxValues:
        instance.options.getFacetedMinMaxValues &&
        instance.options.getFacetedMinMaxValues(instance, '__global__'),
      getGlobalFacetedMinMaxValues: () => {
        if (!instance._getGlobalFacetedMinMaxValues) {
          return
        }

        return instance._getGlobalFacetedMinMaxValues()
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

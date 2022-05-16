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
  // filtersProgress: number
  // facetProgress: Record<string, number>
}

export type ColumnFiltersState = ColumnFilter[]

export type ColumnFilter = {
  id: string
  value: unknown
}

export type ResolvedColumnFilter<TGenerics extends TableGenerics> = {
  id: string
  resolvedValue: unknown
  filterFn: FilterFn<TGenerics>
}

export type FilterFn<TGenerics extends TableGenerics> = {
  (
    row: Row<TGenerics>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: TGenerics['FilterMeta']) => void
  ): boolean

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
  getAutoFilterFn: () => FilterFn<TGenerics> | undefined
  getFilterFn: () => FilterFn<TGenerics> | undefined
  setFilterValue: (updater: Updater<any>) => void
  getCanFilter: () => boolean
  getCanGlobalFilter: () => boolean
  getFacetedRowModel: () => RowModel<TGenerics>
  _getFacetedRowModel?: () => RowModel<TGenerics>
  getIsFiltered: () => boolean
  getFilterValue: () => unknown
  getFilterIndex: () => number
  getFacetedUniqueValues: () => Map<any, number>
  _getFacetedUniqueValues?: () => Map<any, number>
  getFacetedMinMaxValues: () => undefined | [number, number]
  _getFacetedMinMaxValues?: () => undefined | [number, number]
}

export type FiltersRow<TGenerics extends TableGenerics> = {
  columnFilters: Record<string, boolean>
  columnFiltersMeta: Record<string, TGenerics['FilterMeta']>
  subRowsByFacetId: Record<string, Row<TGenerics>[]>
}

export type FiltersOptions<TGenerics extends TableGenerics> = {
  enableFilters?: boolean
  manualFiltering?: boolean
  filterFromLeafRows?: boolean
  filterFns?: TGenerics['FilterFns']
  getFilteredRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>

  // Column
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  enableColumnFilters?: boolean

  // Global
  globalFilterFn?: FilterFnOption<TGenerics>
  onGlobalFilterChange?: OnChangeFn<any>
  enableGlobalFilter?: boolean
  getColumnCanGlobalFilter?: (column: Column<TGenerics>) => boolean

  // Faceting
  getFacetedRowModel?: (
    instance: TableInstance<TGenerics>,
    columnId: string
  ) => () => RowModel<TGenerics>
  getFacetedUniqueValues?: (
    instance: TableInstance<TGenerics>,
    columnId: string
  ) => () => Map<any, number>
  getFacetedMinMaxValues?: (
    instance: TableInstance<TGenerics>,
    columnId: string
  ) => () => undefined | [number, number]
}

export type FiltersInstance<TGenerics extends TableGenerics> = {
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void

  resetColumnFilters: (defaultState?: boolean) => void

  // Column Filters
  getPreFilteredRowModel: () => RowModel<TGenerics>
  getFilteredRowModel: () => RowModel<TGenerics>
  _getFilteredRowModel?: () => RowModel<TGenerics>

  // Global Filters
  setGlobalFilter: (updater: Updater<any>) => void
  resetGlobalFilter: (defaultState?: boolean) => void
  getGlobalAutoFilterFn: () => FilterFn<TGenerics> | undefined
  getGlobalFilterFn: () => FilterFn<TGenerics> | undefined
  getGlobalFacetedRowModel: () => RowModel<TGenerics>
  _getGlobalFacetedRowModel?: () => RowModel<TGenerics>
  getGlobalFacetedUniqueValues: () => Map<any, number>
  _getGlobalFacetedUniqueValues?: () => Map<any, number>
  getGlobalFacetedMinMaxValues: () => undefined | [number, number]
  _getGlobalFacetedMinMaxValues?: () => undefined | [number, number]
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
      // filtersProgress: 1,
      // facetProgress: {},
      ...state,
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): FiltersOptions<TGenerics> => {
    return {
      onColumnFiltersChange: makeStateUpdater('columnFilters', instance),
      onGlobalFilterChange: makeStateUpdater('globalFilter', instance),
      filterFromLeafRows: false,
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: column => {
        const value = instance
          .getCoreRowModel()
          .flatRows[0]?.getAllCellsByColumnId()
          [column.id]?.getValue()

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
      getAutoFilterFn: () => {
        const firstRow = instance.getCoreRowModel().flatRows[0]

        const value = firstRow?.getValue(column.id)

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
      getFilterFn: () => {
        const userFilterFns = instance.options.filterFns

        return isFunction(column.filterFn)
          ? column.filterFn
          : column.filterFn === 'auto'
          ? column.getAutoFilterFn()
          : (userFilterFns as Record<string, any>)?.[
              column.filterFn as string
            ] ??
            (filterFns[
              column.filterFn as BuiltInFilterFn
            ] as FilterFn<TGenerics>)
      },
      getCanFilter: () => {
        return (
          (column.enableColumnFilter ?? true) &&
          (instance.options.enableColumnFilters ?? true) &&
          (instance.options.enableFilters ?? true) &&
          !!column.accessorFn
        )
      },

      getCanGlobalFilter: () => {
        return (
          (column.enableGlobalFilter ?? true) &&
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
              filterFn as FilterFn<TGenerics>,
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

  createRow: <TGenerics extends TableGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
  ): FiltersRow<TGenerics> => {
    return {
      columnFilters: {},
      columnFiltersMeta: {},
      subRowsByFacetId: {},
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): FiltersInstance<TGenerics> => {
    return {
      getGlobalAutoFilterFn: () => {
        return filterFns.includesString
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

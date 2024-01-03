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
  /**
   * The filter function to use with this column. Can be the name of a built-in filter function or a custom filter function.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#filterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  filterFn?: FilterFnOption<TData>
  /**
   * Enables/disables the **column** filter for this column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#enablecolumnfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  enableColumnFilter?: boolean
  /**
   * Enables/disables the **global** filter for this column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#enableglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  enableGlobalFilter?: boolean
}

export interface FiltersColumn<TData extends RowData> {
  _getFacetedMinMaxValues?: () => undefined | [number, number]
  _getFacetedRowModel?: () => RowModel<TData>
  _getFacetedUniqueValues?: () => Map<any, number>
  /**
   * Returns an automatically calculated filter function for the column based off of the columns first known value.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getautofilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getAutoFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns whether or not the column can be **column** filtered.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getcanfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getCanFilter: () => boolean
  /**
   * Returns whether or not the column can be **globally** filtered. Set to `false` to disable a column from being scanned during global filtering.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getcanglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getCanGlobalFilter: () => boolean
  /**
   * A function that **computes and returns** a min/max tuple derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   * > ⚠️ Requires that you pass a valid `getFacetedMinMaxValues` function to `options.getFacetedMinMaxValues`. A default implementation is provided via the exported `getFacetedMinMaxValues` function.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfacetedminmaxvalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model with all other column filters applied, excluding its own filter. Useful for displaying faceted result counts.
   * > ⚠️ Requires that you pass a valid `getFacetedRowModel` function to `options.facetedRowModel`. A default implementation is provided via the exported `getFacetedRowModel` function.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfacetedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFacetedRowModel: () => RowModel<TData>
  /**
   * A function that **computes and returns** a `Map` of unique values and their occurrences derived from `column.getFacetedRowModel`. Useful for displaying faceted result values.
   * > ⚠️ Requires that you pass a valid `getFacetedUniqueValues` function to `options.getFacetedUniqueValues`. A default implementation is provided via the exported `getFacetedUniqueValues` function.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfaceteduniquevalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFacetedUniqueValues: () => Map<any, number>
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the columnId specified.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns the index (including `-1`) of the column filter in the table's `state.columnFilters` array.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfilterindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFilterIndex: () => number
  /**
   * Returns the current filter value for the column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfiltervalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFilterValue: () => unknown
  /**
   * Returns whether or not the column is currently filtered.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getisfiltered)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getIsFiltered: () => boolean
  /**
   * A function that sets the current filter value for the column. You can pass it a value or an updater function for immutability-safe operations on existing values.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#setfiltervalue)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  setFilterValue: (updater: Updater<any>) => void
}

export interface FiltersRow<TData extends RowData> {
  /**
   * The column filters map for the row. This object tracks whether a row is passing/failing specific filters by their column ID.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#columnfilters)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  columnFilters: Record<string, boolean>
  /**
   * The column filters meta map for the row. This object tracks any filter meta for a row as optionally provided during the filtering process.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#columnfiltersmeta)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  columnFiltersMeta: Record<string, FilterMeta>
}

interface FiltersOptionsBase<TData extends RowData> {
  /**
   * Enables/disables all filtering for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#enablefilters)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  enableFilters?: boolean
  /**
   * By default, filtering is done from parent rows down (so if a parent row is filtered out, all of its children will be filtered out as well). Setting this option to `true` will cause filtering to be done from leaf rows up (which means parent rows will be included so long as one of their child or grand-child rows is also included).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#filterfromleafrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  filterFromLeafRows?: boolean
  /**
   * If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
   * - For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
   * - For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfilteredrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFilteredRowModel?: (table: Table<any>) => () => RowModel<any>
  /**
   * Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#manualfiltering)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  manualFiltering?: boolean
  /**
   * By default, filtering is done for all rows (max depth of 100), no matter if they are root level parent rows or the child leaf rows of a parent row. Setting this option to `0` will cause filtering to only be applied to the root level parent rows, with all sub-rows remaining unfiltered. Similarly, setting this option to `1` will cause filtering to only be applied to child leaf rows 1 level deep, and so on.

   * This is useful for situations where you want a row's entire child hierarchy to be visible regardless of the applied filter.
    * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#maxleafrowfilterdepth)
    * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  maxLeafRowFilterDepth?: number

  // Column
  /**
   * Enables/disables **column** filtering for all columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#enablecolumnfilters)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  enableColumnFilters?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnFilters` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#oncolumnfilterschange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>

  // Global
  /**
   * Enables/disables **global** filtering for all columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#enableglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  enableGlobalFilter?: boolean
  /**
   * If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.
   *
   * This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getcolumncanglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getColumnCanGlobalFilter?: (column: Column<TData, unknown>) => boolean
  /**
   * The filter function to use for global filtering.
   * - A `string` referencing a built-in filter function
   * - A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
   * - A custom filter function
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#globalfilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  globalFilterFn?: FilterFnOption<TData>
  /**
   * If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#onglobalfilterchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  onGlobalFilterChange?: OnChangeFn<any>

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
  /**
   * Sets or updates the `state.columnFilters` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#setcolumnfilters)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
  /**
   * Resets the **columnFilters** state to `initialState.columnFilters`, or `true` can be passed to force a default blank state reset to `[]`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#resetcolumnfilters)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  resetColumnFilters: (defaultState?: boolean) => void

  // Column Filters
  _getFilteredRowModel?: () => RowModel<TData>
  /**
   * Returns the row model for the table after **column** filtering has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getfilteredrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getFilteredRowModel: () => RowModel<TData>
  /**
   * Returns the row model for the table before any **column** filtering has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getprefilteredrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getPreFilteredRowModel: () => RowModel<TData>

  // Global Filters
  _getGlobalFacetedMinMaxValues?: () => undefined | [number, number]
  _getGlobalFacetedRowModel?: () => RowModel<TData>
  _getGlobalFacetedUniqueValues?: () => Map<any, number>
  /**
   * Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getglobalautofilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getGlobalAutoFilterFn: () => FilterFn<TData> | undefined
  /**
   * Returns the faceted min and max values for the global filter.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getglobalfacetedminmaxvalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getGlobalFacetedMinMaxValues: () => undefined | [number, number]
  /**
   * Returns the row model for the table after **global** filtering has been applied.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getglobalfacetedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getGlobalFacetedRowModel: () => RowModel<TData>
  /**
   * Returns the faceted unique values for the global filter.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getglobalfaceteduniquevalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getGlobalFacetedUniqueValues: () => Map<any, number>
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getglobalfilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getGlobalFilterFn: () => FilterFn<TData> | undefined
  /**
   * Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#resetglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  resetGlobalFilter: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.globalFilter` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#setglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  setGlobalFilter: (updater: Updater<any>) => void
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
  ): void => {
    column.getAutoFilterFn = () => {
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
    }
    column.getFilterFn = () => {
      return isFunction(column.columnDef.filterFn)
        ? column.columnDef.filterFn
        : column.columnDef.filterFn === 'auto'
          ? column.getAutoFilterFn()
          : // @ts-ignore
            table.options.filterFns?.[column.columnDef.filterFn as string] ??
            filterFns[column.columnDef.filterFn as BuiltInFilterFn]
    }
    column.getCanFilter = () => {
      return (
        (column.columnDef.enableColumnFilter ?? true) &&
        (table.options.enableColumnFilters ?? true) &&
        (table.options.enableFilters ?? true) &&
        !!column.accessorFn
      )
    }

    column.getCanGlobalFilter = () => {
      return (
        (column.columnDef.enableGlobalFilter ?? true) &&
        (table.options.enableGlobalFilter ?? true) &&
        (table.options.enableFilters ?? true) &&
        (table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
        !!column.accessorFn
      )
    }

    column.getIsFiltered = () => column.getFilterIndex() > -1

    column.getFilterValue = () =>
      table.getState().columnFilters?.find(d => d.id === column.id)?.value

    column.getFilterIndex = () =>
      table.getState().columnFilters?.findIndex(d => d.id === column.id) ?? -1

    column.setFilterValue = value => {
      table.setColumnFilters(old => {
        const filterFn = column.getFilterFn()
        const previousfilter = old?.find(d => d.id === column.id)

        const newFilter = functionalUpdate(
          value,
          previousfilter ? previousfilter.value : undefined
        )

        //
        if (
          shouldAutoRemoveFilter(filterFn as FilterFn<TData>, newFilter, column)
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
    }
    column._getFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, column.id)
    column.getFacetedRowModel = () => {
      if (!column._getFacetedRowModel) {
        return table.getPreFilteredRowModel()
      }

      return column._getFacetedRowModel()
    }
    column._getFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, column.id)
    column.getFacetedUniqueValues = () => {
      if (!column._getFacetedUniqueValues) {
        return new Map()
      }

      return column._getFacetedUniqueValues()
    }
    column._getFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, column.id)
    column.getFacetedMinMaxValues = () => {
      if (!column._getFacetedMinMaxValues) {
        return undefined
      }

      return column._getFacetedMinMaxValues()
    }
    // () => [column.getFacetedRowModel()],
    // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.columnFilters = {}
    row.columnFiltersMeta = {}
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.getGlobalAutoFilterFn = () => {
      return filterFns.includesString
    }

    table.getGlobalFilterFn = () => {
      const { globalFilterFn: globalFilterFn } = table.options

      return isFunction(globalFilterFn)
        ? globalFilterFn
        : globalFilterFn === 'auto'
          ? table.getGlobalAutoFilterFn()
          : // @ts-ignore
            table.options.filterFns?.[globalFilterFn as string] ??
            filterFns[globalFilterFn as BuiltInFilterFn]
    }

    table.setColumnFilters = (updater: Updater<ColumnFiltersState>) => {
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
    }

    table.setGlobalFilter = updater => {
      table.options.onGlobalFilterChange?.(updater)
    }

    table.resetGlobalFilter = defaultState => {
      table.setGlobalFilter(
        defaultState ? undefined : table.initialState.globalFilter
      )
    }

    table.resetColumnFilters = defaultState => {
      table.setColumnFilters(
        defaultState ? [] : table.initialState?.columnFilters ?? []
      )
    }

    table.getPreFilteredRowModel = () => table.getCoreRowModel()
    table.getFilteredRowModel = () => {
      if (!table._getFilteredRowModel && table.options.getFilteredRowModel) {
        table._getFilteredRowModel = table.options.getFilteredRowModel(table)
      }

      if (table.options.manualFiltering || !table._getFilteredRowModel) {
        return table.getPreFilteredRowModel()
      }

      return table._getFilteredRowModel()
    }

    table._getGlobalFacetedRowModel =
      table.options.getFacetedRowModel &&
      table.options.getFacetedRowModel(table, '__global__')

    table.getGlobalFacetedRowModel = () => {
      if (table.options.manualFiltering || !table._getGlobalFacetedRowModel) {
        return table.getPreFilteredRowModel()
      }

      return table._getGlobalFacetedRowModel()
    }

    table._getGlobalFacetedUniqueValues =
      table.options.getFacetedUniqueValues &&
      table.options.getFacetedUniqueValues(table, '__global__')
    table.getGlobalFacetedUniqueValues = () => {
      if (!table._getGlobalFacetedUniqueValues) {
        return new Map()
      }

      return table._getGlobalFacetedUniqueValues()
    }

    table._getGlobalFacetedMinMaxValues =
      table.options.getFacetedMinMaxValues &&
      table.options.getFacetedMinMaxValues(table, '__global__')
    table.getGlobalFacetedMinMaxValues = () => {
      if (!table._getGlobalFacetedMinMaxValues) {
        return
      }

      return table._getGlobalFacetedMinMaxValues()
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

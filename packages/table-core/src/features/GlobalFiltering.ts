import { FilterFn, FilterFnOption, RowModel } from '..'
import { BuiltInFilterFn, filterFns } from '../filterFns'
import {
  Column,
  OnChangeFn,
  Table,
  Updater,
  RowData,
  TableFeature,
} from '../types'
import { isFunction, makeStateUpdater } from '../utils'

export interface GlobalFilterTableState {
  globalFilter: any
}

export interface GlobalFilterColumnDef {
  /**
   * Enables/disables the **global** filter for this column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#enableglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  enableGlobalFilter?: boolean
}

export interface GlobalFilterColumn {
  /**
   * Returns whether or not the column can be **globally** filtered. Set to `false` to disable a column from being scanned during global filtering.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/filters#getcanglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/filters)
   */
  getCanGlobalFilter: () => boolean
}

export interface GlobalFilterOptions<TData extends RowData> {
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
}

export interface GlobalFilterInstance<TData extends RowData> {
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

export const GlobalFiltering: TableFeature = {
  getInitialState: (state): GlobalFilterTableState => {
    return {
      globalFilter: undefined,
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): GlobalFilterOptions<TData> => {
    return {
      onGlobalFilterChange: makeStateUpdater('globalFilter', table),
      globalFilterFn: 'auto',
      getColumnCanGlobalFilter: column => {
        const value = table
          .getCoreRowModel()
          .flatRows[0]?._getAllCellsByColumnId()
          [column.id]?.getValue()

        return typeof value === 'string' || typeof value === 'number'
      },
    } as GlobalFilterOptions<TData>
  },

  createColumn: <TData extends RowData>(
    column: Column<TData, unknown>,
    table: Table<TData>
  ): void => {
    column.getCanGlobalFilter = () => {
      return (
        (column.columnDef.enableGlobalFilter ?? true) &&
        (table.options.enableGlobalFilter ?? true) &&
        (table.options.enableFilters ?? true) &&
        (table.options.getColumnCanGlobalFilter?.(column) ?? true) &&
        !!column.accessorFn
      )
    }
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

    table.setGlobalFilter = updater => {
      table.options.onGlobalFilterChange?.(updater)
    }

    table.resetGlobalFilter = defaultState => {
      table.setGlobalFilter(
        defaultState ? undefined : table.initialState.globalFilter
      )
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

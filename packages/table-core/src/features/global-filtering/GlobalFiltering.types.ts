import type {
  CellData,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Column } from '../../types/Column'
import type {
  FilterFn,
  FilterFnOption,
} from '../column-filtering/ColumnFiltering.types'

export interface TableState_GlobalFiltering {
  globalFilter: any
}

export interface TableState_GlobalFiltering_Unavailable {
  /**
   * @deprecated Import the `GlobalFiltering` feature to use the global filtering APIs.
   */
  globalFilter?: any
}

export interface ColumnDef_GlobalFiltering {
  /**
   * Enables/disables the **global** filter for this column.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#enableglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  enableGlobalFilter?: boolean
}

export interface Column_GlobalFiltering {
  /**
   * Returns whether or not the column can be **globally** filtered. Set to `false` to disable a column from being scanned during global filtering.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcanglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  getCanGlobalFilter: () => boolean
}

export interface TableOptions_GlobalFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enables/disables **global** filtering for all columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#enableglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  enableGlobalFilter?: boolean
  /**
   * If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.
   *
   * This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getcolumncanglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  getColumnCanGlobalFilter?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
  ) => boolean
  /**
   * The filter function to use for global filtering.
   * - A `string` referencing a built-in filter function
   * - A `string` that references a custom filter functions provided via the `tableOptions.filterFns` option
   * - A custom filter function
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#globalfilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  globalFilterFn?: FilterFnOption<TFeatures, TData>
  /**
   * If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#onglobalfilterchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  onGlobalFilterChange?: OnChangeFn<any>
}

export interface Table_GlobalFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getglobalautofilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  getGlobalAutoFilterFn: () => FilterFn<TFeatures, TData> | undefined
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#getglobalfilterfn)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  getGlobalFilterFn: () => FilterFn<TFeatures, TData> | undefined
  /**
   * Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#resetglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  resetGlobalFilter: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.globalFilter` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/global-filtering#setglobalfilter)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/global-filtering)
   */
  setGlobalFilter: (updater: Updater<any>) => void
}

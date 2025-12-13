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
} from '../column-filtering/columnFilteringFeature.types'

export interface TableState_GlobalFiltering {
  globalFilter: any
}

export interface ColumnDef_GlobalFiltering {
  /**
   * Enables/disables the **global** filter for this column.
   */
  enableGlobalFilter?: boolean
}

export interface Column_GlobalFiltering {
  /**
   * Returns whether or not the column can be **globally** filtered. Set to `false` to disable a column from being scanned during global filtering.
   */
  getCanGlobalFilter: () => boolean
}

export interface TableOptions_GlobalFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enables/disables **global** filtering for all columns.
   */
  enableGlobalFilter?: boolean
  /**
   * If provided, this function will be called with the column and should return `true` or `false` to indicate whether this column should be used for global filtering.
   * This is useful if the column can contain data that is not `string` or `number` (i.e. `undefined`).
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
   */
  globalFilterFn?: FilterFnOption<TFeatures, TData>
  /**
   * If provided, this function will be called with an `updaterFn` when `state.globalFilter` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   */
  onGlobalFilterChange?: OnChangeFn<any>
}

export interface Table_GlobalFiltering<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Currently, this function returns the built-in `includesString` filter function. In future releases, it may return more dynamic filter functions based on the nature of the data provided.
   */
  getGlobalAutoFilterFn: () => FilterFn<TFeatures, TData> | undefined
  /**
   * Returns the filter function (either user-defined or automatic, depending on configuration) for the global filter.
   */
  getGlobalFilterFn: () => FilterFn<TFeatures, TData> | undefined
  /**
   * Resets the **globalFilter** state to `initialState.globalFilter`, or `true` can be passed to force a default blank state reset to `undefined`.
   */
  resetGlobalFilter: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.globalFilter` state.
   */
  setGlobalFilter: (updater: Updater<any>) => void
}

import type { CoreFeatures } from '../coreFeatures'
import type { RowModelFns } from '../../types/RowModelFns'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { CachedRowModels, CreateRowModels_All } from '../../types/RowModel'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'

export interface TableMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface TableOptions_Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * The features that you want to enable for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  _features: TFeatures
  /**
   * The row model options that you want to enable for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  _rowModels?: CreateRowModels_All<TFeatures, TData>
  /**
   * Set this option to override any of the `autoReset...` feature options.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#autoresetall)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  autoResetAll?: boolean
  /**
   * The data for the table to display. When the `data` option changes reference, the table will reprocess the data.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#data)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  data: Array<TData>
  /**
   * Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.
   *
   * Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.
   *
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  initialState?: Partial<TableState<TFeatures>>
  /**
   * This option is used to optionally implement the merging of table options.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#mergeoptions)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  mergeOptions?: (
    defaultOptions: TableOptions<TFeatures, TData>,
    options: Partial<TableOptions<TFeatures, TData>>,
  ) => TableOptions<TFeatures, TData>
  /**
   * You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#meta)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  meta?: TableMeta<TFeatures, TData>
  /**
   * The `onStateChange` option can be used to optionally listen to state changes within the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#onstatechange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  onStateChange?: (updater: Updater<TableState<TFeatures>>) => void
  /**
   * The `state` option can be used to optionally _control_ part or all of the table state. The state you pass here will merge with and overwrite the internal automatically-managed state to produce the final state for the table. You can also listen to state changes via the `onStateChange` option.
   * > Note: Any state passed in here will override both the internal state and any other `initialState` you provide.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#state)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  state?: Partial<TableState<TFeatures>>
}

export interface Table_CoreProperties<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * The features that are enabled for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#_features)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  _features: Partial<CoreFeatures> & TFeatures
  /**
   * The row model processing functions that are used to process the data by features.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowModelFns)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  _rowModelFns: RowModelFns<TFeatures, TData>
  /**
   * The row models that are enabled for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#_rowmodels)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  _rowModels: CachedRowModels<TFeatures, TData>
  /**
   * This is the resolved initial state of the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#initialstate)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  initialState: TableState<TFeatures>
  /**
   * A read-only reference to the table's current options.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#options)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  options: TableOptions<TFeatures, TData>
}

export interface Table_Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Table_CoreProperties<TFeatures, TData> {
  /**
   * Call this function to get the table's current state. It's recommended to use this function and its state, especially when managing the table state manually. It is the exact same state used internally by the table for every feature and function it provides.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getstate)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  getState: () => TableState<TFeatures>
  /**
   * Call this function to reset the table state to the initial state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#reset)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  reset: () => void
  /**
   * This function can be used to update the table options.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#setoptions)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  setOptions: (newOptions: Updater<TableOptions<TFeatures, TData>>) => void
  /**
   * Call this function to update the table state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/core/table#setstate)
   * [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  setState: (updater: Updater<TableState<TFeatures>>) => void
}

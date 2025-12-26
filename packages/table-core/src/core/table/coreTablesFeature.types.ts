import type { CoreFeatures } from '../coreFeatures'
import type { RowModelFns } from '../../types/RowModelFns'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { CachedRowModels, CreateRowModels_All } from '../../types/RowModel'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState } from '../../types/TableState'
import { Store } from '@tanstack/store'

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
   */
  _features: TFeatures
  /**
   * The row model options that you want to enable for the table.
   */
  _rowModels?: CreateRowModels_All<TFeatures, TData>
  /**
   * Set this option to override any of the `autoReset...` feature options.
   */
  autoResetAll?: boolean
  /**
   * The data for the table to display. When the `data` option changes reference, the table will reprocess the data.
   */
  data: Array<TData>
  /**
   * Use this option to optionally pass initial state to the table. This state will be used when resetting various table states either automatically by the table (eg. `options.autoResetPageIndex`) or via functions like `table.resetRowSelection()`. Most reset function allow you optionally pass a flag to reset to a blank/default state instead of the initial state.
   * Table state will not be reset when this object changes, which also means that the initial state object does not need to be stable.
   */
  initialState?: Partial<TableState<TFeatures>>
  /**
   * This option is used to optionally implement the merging of table options.
   */
  mergeOptions?: (
    defaultOptions: TableOptions<TFeatures, TData>,
    options: Partial<TableOptions<TFeatures, TData>>,
  ) => TableOptions<TFeatures, TData>
  /**
   * You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.
   */
  meta?: TableMeta<TFeatures, TData>
  /**
   * Optionally, provide your own external TanStack Store instance if you want to manage the table state externally.
   */
  store?: Store<TableState<TFeatures>>
}

export interface Table_CoreProperties<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * The features that are enabled for the table.
   */
  _features: Partial<CoreFeatures> & TFeatures
  /**
   * Prototype cache for Cell objects - shared by all cells in this table
   */
  _cellPrototype?: object
  /**
   * Prototype cache for Column objects - shared by all columns in this table
   */
  _columnPrototype?: object
  /**
   * Prototype cache for Header objects - shared by all headers in this table
   */
  _headerPrototype?: object
  /**
   * The row model processing functions that are used to process the data by features.
   */
  _rowModelFns: RowModelFns<TFeatures, TData>
  /**
   * The row models that are enabled for the table.
   */
  _rowModels: CachedRowModels<TFeatures, TData>
  /**
   * Prototype cache for Row objects - shared by all rows in this table
   */
  _rowPrototype?: object
  /**
   * This is the resolved initial state of the table.
   */
  initialState: TableState<TFeatures>
  /**
   * A read-only reference to the table's current options.
   */
  options: TableOptions<TFeatures, TData>
  /**
   * Where the table state is stored.
   */
  store: Store<TableState<TFeatures>>
}

export interface Table_Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Table_CoreProperties<TFeatures, TData> {
  /**
   * Call this function to reset the table state to the initial state.
   */
  reset: () => void
  /**
   * This function can be used to update the table options.
   */
  setOptions: (newOptions: Updater<TableOptions<TFeatures, TData>>) => void
}

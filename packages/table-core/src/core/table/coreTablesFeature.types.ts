import type { Atom, ReadonlyAtom, ReadonlyStore, Store } from '@tanstack/store'
import type { CoreFeatures } from '../coreFeatures'
import type { RowModelFns } from '../../types/RowModelFns'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { CachedRowModels, CreateRowModels_All } from '../../types/RowModel'
import type { TableOptions } from '../../types/TableOptions'
import type { TableReactivityBindings } from '../../features/table-reactivity/table-reactivity'
import type { TableState, TableState_All } from '../../types/TableState'

export interface TableMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

/**
 * A map of writable atoms, one per `TableState` slice. These are the internal
 * writable atoms that the library always writes to via `makeStateUpdater`.
 */
export type BaseAtoms<TFeatures extends TableFeatures> = {
  [K in keyof TableState<TFeatures>]-?: Atom<TableState<TFeatures>[K]>
}

/**
 * A map of readonly derived atoms, one per `TableState` slice. Each derives
 * from its corresponding `baseAtom` plus, optionally, a per-slice external
 * atom or external state value.
 *
 * Precedence: `options.atoms[key]` > `options.state[key]` > `baseAtoms[key]`.
 */
export type Atoms<TFeatures extends TableFeatures> = {
  [K in keyof TableState<TFeatures>]-?: ReadonlyAtom<TableState<TFeatures>[K]>
}

/**
 * A map of optional external atoms, one per `TableState` slice. Consumers can
 * provide their own writable atom for any state slice to take over ownership
 * of that slice.
 */
export type ExternalAtoms<TFeatures extends TableFeatures> = Partial<{
  [K in keyof TableState<TFeatures>]: Atom<TableState<TFeatures>[K]>
}>

/**
 * Internal "all features" flat variants of the atom types. `Table_Internal`
 * uses these so feature code (written generically over `TFeatures`) can access
 * any slice atom (e.g. `table.atoms.columnPinning`) without TypeScript
 * narrowing away slices that aren't in the current `TFeatures` union.
 *
 * Keys are optional: feature code can read atoms from slices it doesn't own,
 * but those slices may not be registered on the current table. Consumers must
 * use optional chaining (`table.atoms.columnPinning?.get() ?? default`).
 */
export type BaseAtoms_All = {
  [K in keyof TableState_All]?: Atom<TableState_All[K]>
}
export type Atoms_All = {
  [K in keyof TableState_All]?: ReadonlyAtom<TableState_All[K]>
}
export type ExternalAtoms_All = Partial<{
  [K in keyof TableState_All]: Atom<TableState_All[K]>
}>

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
   * Optionally, provide your own external writable atoms for individual state slices.
   * When an atom is provided for a given slice, it takes precedence over `options.state[key]`
   * and the internal base atom for that slice. Writes originating from the library are
   * still routed through the internal base atom; consumers are responsible for
   * mirroring changes back to their external atom via the corresponding `onXChange` callback.
   */
  atoms?: ExternalAtoms<TFeatures>
  /**
   * Set this option to override any of the `autoReset...` feature options.
   */
  autoResetAll?: boolean
  /**
   * The data for the table to display. When the `data` option changes reference, the table will reprocess the data.
   */
  data: ReadonlyArray<TData>
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
   * Pass in individual self-managed state to the table.
   */
  state?: Partial<TableState<TFeatures>>
  /**
   * Table custom reactibity bindings.
   */
  readonly reactivity?: TableReactivityBindings
}

export interface Table_CoreProperties<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Table custom reactivity bindings.
   */
  _reactivity: TableReactivityBindings
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
   * The internal writable atoms for each `TableState` slice. This is the library's
   * single write surface — all state mutations from features land here.
   */
  baseAtoms: BaseAtoms<TFeatures>
  /**
   * The readonly derived atoms for each `TableState` slice. Each derives from
   * its corresponding `baseAtom` plus, optionally, a per-slice external atom or
   * external state value (precedence: external atom > external state > base atom).
   */
  atoms: Atoms<TFeatures>
  /**
   * The base store for the table options.
   */
  optionsStore: Atom<TableOptions<TFeatures, TData>>
  /**
   * This is the resolved initial state of the table.
   */
  initialState: TableState<TFeatures>
  /**
   * A read-only reference to the table's current options.
   */
  readonly options: TableOptions<TFeatures, TData>
  /**
   * The readonly flat store for the table state. Derives from `table.atoms`
   * only; never reads external state directly.
   */
  store: ReadonlyStore<TableState<TFeatures>>
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

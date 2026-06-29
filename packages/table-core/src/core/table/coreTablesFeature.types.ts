import type { TableReactivityBindings } from '../reactivity/coreReactivityFeature.types'
import type { Atom, ReadonlyAtom, ReadonlyStore } from '@tanstack/store'
import type { CoreFeatures } from '../coreFeatures'
import type { RowModelFns } from '../../types/RowModelFns'
import type { RowData, Updater } from '../../types/type-utils'
import type {
  IsAny,
  TableFeatures,
  ValidateFeatureSlots,
} from '../../types/TableFeatures'
import type { CachedRowModels } from '../../types/RowModel'
import type { TableOptions } from '../../types/TableOptions'
import type { TableState, TableState_All } from '../../types/TableState'

export interface TableMeta<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {}

/**
 * Resolves the type of `options.meta` for a feature set.
 *
 * When the features object declares a `tableMeta` type-only slot
 * (`tableFeatures({ ..., tableMeta: {} as MyTableMeta })`), that type wins.
 * Otherwise this falls back to the global declaration-merged `TableMeta`
 * interface.
 */
export type ExtractTableMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
> =
  IsAny<TFeatures> extends true
    ? TableMeta<TFeatures, TData>
    : TFeatures extends { tableMeta: infer TMeta extends object }
      ? TMeta
      : TableMeta<TFeatures, TData>

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
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * The feature modules registered on this table instance.
   *
   * Feature registration controls which state slices, options, and prototype
   * APIs are available. This object also carries the table's row model
   * factories (`sortedRowModel`, `filteredRowModel`, etc.), row model function
   * registries (`sortFns`, `filterFns`, `aggregationFns`), and type-only meta
   * slots (`tableMeta`, `columnMeta`).
   */
  readonly features: TFeatures & ValidateFeatureSlots<TFeatures>
  /**
   * Optionally, provide your own external writable atoms for individual state slices.
   * When an atom is provided for a given slice, it takes precedence over `options.state[key]`
   * and the internal base atom for that slice. Feature state update APIs write through
   * the corresponding atom updater, so external atoms are the preferred v9 ownership
   * model for app-managed table state slices.
   */
  readonly atoms?: ExternalAtoms<TFeatures>
  /**
   * Set this option to override any of the `autoReset...` feature options.
   */
  readonly autoResetAll?: boolean
  /**
   * The data for the table to display. When the `data` option changes reference, the table will reprocess the data.
   */
  readonly data: ReadonlyArray<TData>
  /**
   * Optional key used to identify this table instance.
   *
   * This is used by TanStack Table Devtools to register and select tables. It is
   * not required unless the table is passed to devtools.
   */
  readonly key?: string
  /**
   * Optionally provide starting values for registered table state slices.
   * Feature reset APIs use this value by default, and many reset APIs accept
   * `true` to reset to that feature's blank/default state instead. Changing this
   * object later does not reset table state, so it does not need to be stable.
   */
  readonly initialState?: Partial<TableState<TFeatures>>
  /**
   * This option is used to optionally implement the merging of table options.
   */
  readonly mergeOptions?: (
    defaultOptions: TableOptions<TFeatures, TData>,
    options: Partial<TableOptions<TFeatures, TData>>,
  ) => TableOptions<TFeatures, TData>
  /**
   * You can pass any object to `options.meta` and access it anywhere the `table` is available via `table.options.meta`.
   *
   * Declare its type per-table via the `tableMeta` type-only slot on the
   * `features` option, or globally via declaration merging on `TableMeta`.
   */
  readonly meta?: ExtractTableMeta<TFeatures, TData>
  /**
   * Optionally provide externally managed values for individual state slices.
   *
   * Pair each slice with its matching `on[State]Change` callback so table state
   * updates can be persisted outside the table. External atoms take precedence
   * over this option when both are provided for the same slice.
   */
  readonly state?: Partial<TableState<TFeatures>>
}

export interface Table_CoreProperties<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Table reactivity bindings for interacting with TanStack Store.
   */
  readonly _reactivity: TableReactivityBindings
  /**
   * Prototype cache for Cell objects - shared by all cells in this table
   */
  _cellPrototype?: object
  /**
   * Prototype cache for Column objects - shared by all columns in this table
   */
  _columnPrototype?: object
  /**
   * The features that are enabled for the table.
   */
  readonly _features: Partial<CoreFeatures> & TFeatures
  /**
   * Prototype cache for Header objects - shared by all headers in this table
   */
  _headerPrototype?: object
  /**
   * The row model processing functions that are used to process the data by features.
   */
  readonly _rowModelFns: RowModelFns<TFeatures, TData>
  /**
   * The row models that are enabled for the table.
   */
  readonly _rowModels: CachedRowModels<TFeatures, TData>
  /**
   * Prototype cache for Row objects - shared by all rows in this table
   */
  _rowPrototype?: object
  /**
   * The readonly derived atoms for each `TableState` slice. Each derives from
   * its corresponding `baseAtom` plus, optionally, a per-slice external atom or
   * external state value (precedence: external atom > external state > base atom).
   */
  readonly atoms: Atoms<TFeatures>
  /**
   * The internal writable atoms for each `TableState` slice. This is the library's
   * single write surface — all state mutations from features land here.
   */
  readonly baseAtoms: BaseAtoms<TFeatures>
  /**
   * This is the resolved initial state of the table.
   */
  readonly initialState: TableState<TFeatures>
  /**
   * A read-only reference to the table's current options.
   */
  readonly options: TableOptions<TFeatures, TData>
  /**
   * Writable atom for table options. Only created when `createOptionsStore` is
   * true on the active core reactivity bindings. Adapters that opt out keep
   * options as plain resolved data instead of backing them with an atom.
   */
  readonly optionsStore?: Atom<TableOptions<TFeatures, TData>> | undefined
  /**
   * The readonly flat store for the table state. Derives from `table.atoms`
   * only; never reads external state directly.
   */
  readonly store: ReadonlyStore<TableState<TFeatures>>
}

export interface Table_Table<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> extends Table_CoreProperties<TFeatures, TData> {
  /**
   * Resets the table's internal base atoms to `table.initialState`.
   *
   * Prefer feature-specific reset APIs, such as `resetPagination`, when a state
   * slice may be owned by an external atom or needs that feature's blank/default
   * reset behavior.
   */
  reset: () => void
  /**
   * Updates the table options by applying a value or updater to the current
   * resolved options and then merging them through `options.mergeOptions`.
   */
  setOptions: (newOptions: Updater<TableOptions<TFeatures, TData>>) => void
}

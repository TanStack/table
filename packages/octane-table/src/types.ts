// Every type in the binding's public surface lives here, in plain TypeScript.
//
// The runtime lives in `.tsrx` files, which ship a hand-written `.tsrx.d.ts`
// sidecar so consumers on plain `tsc`/`tsgo` still get types. Keeping the types
// in a real `.ts` module means those sidecars only restate function signatures —
// the type definitions themselves are checked once, here, and imported by both
// the `.tsrx` implementation and its sidecar.
import type {
  Atom,
  ReadonlyAtom,
  ReadonlyStore,
  Store,
} from '@tanstack/octane-store'
import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  Cell,
  CellContext,
  CellData,
  Column,
  ColumnDef,
  NoInfer as CoreNoInfer,
  DeepKeys,
  DeepValue,
  DisplayColumnDef,
  GroupColumnDef,
  Header,
  IdentifiedColumnDef,
  Row,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type {
  ComponentBody,
  Context,
  ElementDescriptor,
  OctaneNode,
} from 'octane'

// =============================================================================
// Renderables
// =============================================================================

/**
 * Anything a `columnDef.cell`/`header`/`footer` slot may hold: an octane
 * component, an already-created element descriptor, or a primitive that
 * renders as text.
 */
export type Renderable<TProps> =
  | ComponentBody<TProps>
  | ElementDescriptor<any>
  | string
  | number
  | boolean
  | null
  | undefined

/**
 * A component in a `createTableHook` component registry.
 *
 * Structural on purpose (octane components are plain functions), so registries
 * accept components declared in `.tsrx`, `.tsx`, or plain `.ts` alike.
 */
export type TableComponentType<TProps = any> = (props: TProps) => OctaneNode

// =============================================================================
// FlexRender
// =============================================================================

/**
 * Props for the {@link FlexRender} component. Exactly one of `cell`, `header`,
 * or `footer` may be passed.
 */
export type FlexRenderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> =
  | { cell: Cell<TFeatures, TData, TValue>; header?: never; footer?: never }
  | { header: Header<TFeatures, TData, TValue>; cell?: never; footer?: never }
  | { footer: Header<TFeatures, TData, TValue>; cell?: never; header?: never }

// =============================================================================
// Subscribe
// =============================================================================

/** Any atom or store that `Subscribe` can read and subscribe to. */
export type SubscribeSource<TValue> =
  Atom<TValue> | ReadonlyAtom<TValue> | Store<TValue> | ReadonlyStore<TValue>

/**
 * A non-render-prop child accepted by Subscribe. This stays concrete instead
 * of using `OctaneNode` (currently `unknown`) so function children retain
 * contextual typing.
 */
export type SubscribeStaticChild =
  | ElementDescriptor<any>
  | string
  | number
  | boolean
  | null
  | undefined
  | ReadonlyArray<unknown>

/**
 * Subscribe to `table.store` (full table state). The selector receives the full
 * {@link TableState}.
 */
export interface SubscribePropsWithStore<
  TFeatures extends TableFeatures,
  TSelected,
> {
  source: SubscribeSource<TableState<TFeatures>>
  /**
   * Select from full table state. Re-renders when the selected value changes
   * (shallow compare).
   *
   * Required in store mode so you never accidentally subscribe to the whole
   * store without an explicit projection.
   */
  selector: (state: TableState<TFeatures>) => TSelected
  children: ((state: TSelected) => OctaneNode) | SubscribeStaticChild
}

/**
 * Subscribe to the full value of a source (e.g. `table.atoms.rowSelection` or
 * `table.optionsStore`). Omitting `selector` is equivalent to the identity
 * selector — children receive `TSourceValue`.
 */
export interface SubscribePropsWithSourceIdentity<TSourceValue> {
  source: SubscribeSource<TSourceValue>
  selector?: undefined
  children: ((state: TSourceValue) => OctaneNode) | SubscribeStaticChild
}

/**
 * Subscribe to a projected value from a source (atom or store). The selector
 * receives the source value; children receive the projected `TSelected`.
 */
export interface SubscribePropsWithSourceWithSelector<TSourceValue, TSelected> {
  source: SubscribeSource<TSourceValue>
  selector: (state: TSourceValue) => TSelected
  children: ((state: TSelected) => OctaneNode) | SubscribeStaticChild
}

/**
 * Subscribe to a single source — atom or store (identity or projected). Prefer
 * {@link SubscribePropsWithSourceIdentity} or
 * {@link SubscribePropsWithSourceWithSelector} for clearer inference when
 * `selector` is omitted.
 */
export type SubscribePropsWithSource<TSourceValue, TSelected = TSourceValue> =
  | SubscribePropsWithSourceIdentity<TSourceValue>
  | SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>

export type SubscribeProps<
  TFeatures extends TableFeatures,
  TSelected = unknown,
  TSourceValue = unknown,
> =
  | SubscribePropsWithStore<TFeatures, TSelected>
  | SubscribePropsWithSourceIdentity<TSourceValue>
  | SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>

/**
 * The call signature of the standalone `Subscribe` component.
 *
 * Declared as an overloaded callable type rather than `function` overloads
 * because the implementation is authored in `.tsrx`: a `@{ … }` body cannot
 * carry preceding overload signatures (TS2384). Overload *resolution* is what
 * matters at the JSX call site, and a callable type provides exactly that.
 *
 * The **source** overloads come first so `TSourceValue` is inferred from
 * `source`; the identity overload (no `selector`) is separate so children
 * receive `TSourceValue` rather than `unknown`.
 */
export interface SubscribeComponent {
  <TSourceValue>(
    props: SubscribePropsWithSourceIdentity<TSourceValue>,
  ): OctaneNode
  <TSourceValue, TSelected>(
    props: SubscribePropsWithSourceWithSelector<TSourceValue, TSelected>,
  ): OctaneNode
  <TFeatures extends TableFeatures, TSelected>(
    props: SubscribePropsWithStore<TFeatures, TSelected>,
  ): OctaneNode
}

// =============================================================================
// useTable
// =============================================================================

/**
 * The table instance returned by {@link useTable}: the framework-agnostic
 * `Table` from table-core, plus octane's `Subscribe`/`FlexRender` components
 * and the selected `state`.
 */
export type OctaneTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
> = Omit<Table<TFeatures, TData>, 'store'> & {
  /**
   * @deprecated Prefer `table.state` for render reads,
   * `table.atoms.<slice>.get()` for slice snapshots, or
   * `table.Subscribe` / `useSelector(table.store, selector)` for explicit
   * subscriptions. `table.store.state` is a current-value snapshot and is easy
   * to misuse in render code.
   */
  readonly store: Table<TFeatures, TData>['store']
  /**
   * An octane component that subscribes to the table state.
   *
   * This is useful for opting into state re-renders for specific parts of the
   * table state.
   *
   * Pass `source` to subscribe to a single atom or store (e.g.
   * `table.atoms.rowSelection` or `table.optionsStore`) instead of the full
   * `table.store`.
   *
   * @example
   * ```tsx
   * <table.Subscribe selector={(state) => ({ rowSelection: state.rowSelection })}>
   *   {({ rowSelection }) => <div>{Object.keys(rowSelection).length as string}</div>}
   * </table.Subscribe>
   * ```
   *
   * @example
   * ```tsx
   * <table.Subscribe source={table.atoms.rowSelection}>
   *   {(rowSelection) => <div>…</div>}
   * </table.Subscribe>
   * ```
   */
  /**
   * Overloads (not a single union) so `selector` callbacks get correct
   * contextual types in JSX; a union of two `selector` signatures degrades to
   * implicit `any`.
   *
   * Source **without** `selector` is a separate overload so children receive
   * `TSourceValue` (identity projection). If `selector` were optional on one
   * overload, `TSubSelected` would default to `unknown` instead of inferring
   * from the source.
   *
   * The **source** overloads are listed first so `TSourceValue` is inferred
   * from `source`.
   */
  Subscribe: {
    <TSourceValue>(props: {
      source: SubscribeSource<TSourceValue>
      selector?: undefined
      children: ((state: TSourceValue) => OctaneNode) | SubscribeStaticChild
    }): OctaneNode
    <TSourceValue, TSubSelected>(props: {
      source: SubscribeSource<TSourceValue>
      selector: (state: TSourceValue) => TSubSelected
      children: ((state: TSubSelected) => OctaneNode) | SubscribeStaticChild
    }): OctaneNode
    <TSubSelected>(
      props: Omit<SubscribePropsWithStore<TFeatures, TSubSelected>, 'source'>,
    ): OctaneNode
  }
  /**
   * An octane component that renders headers, cells, or footers with custom
   * markup. Use this utility component instead of manually calling
   * `flexRender`.
   *
   * @example
   * ```tsx
   * <table.FlexRender cell={cell} />
   * <table.FlexRender header={header} />
   * <table.FlexRender footer={footer} />
   * ```
   *
   * This replaces calling `flexRender` directly like this:
   * ```tsx
   * flexRender(cell.column.columnDef.cell, cell.getContext())
   * flexRender(header.column.columnDef.header, header.getContext())
   * flexRender(footer.column.columnDef.footer, footer.getContext())
   * ```
   */
  FlexRender: <TValue extends CellData = CellData>(
    props: FlexRenderProps<TFeatures, TData, TValue>,
  ) => OctaneNode
  /**
   * The selected state of the table. This state may not match the structure of
   * the full table state because it is selected by the selector function that
   * you pass as the 2nd argument to `useTable`.
   *
   * @example
   * const table = useTable(options, (state) => ({ globalFilter: state.globalFilter }))
   *
   * table.state.globalFilter
   */
  readonly state: Readonly<TSelected>
}

// =============================================================================
// createTableHookContexts
// =============================================================================

/**
 * The object returned by `createTableHookContexts`: three scoped octane
 * contexts plus matching context hooks.
 */
export interface TableHookContexts<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  tableContext: Context<OctaneTable<any, any>>
  cellContext: Context<Cell<any, any, any>>
  headerContext: Context<Header<any, any, any>>
  useTableContext: <TTableData extends RowData = TData>() => OctaneTable<
    TFeatures,
    TTableData
  >
  useCellContext: <TValue extends CellData = CellData>() => Cell<
    TFeatures,
    any,
    TValue
  >
  useHeaderContext: <TValue extends CellData = CellData>() => Header<
    TFeatures,
    any,
    TValue
  >
}

// =============================================================================
// createTableHook — enhanced contexts with pre-bound components
// =============================================================================

/**
 * Enhanced CellContext with pre-bound cell components.
 * The `cell` property includes the registered cellComponents.
 */
export interface AppCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, TableComponentType>,
> {
  cell: Cell<TFeatures, TData, TValue> &
    TCellComponents & { FlexRender: () => OctaneNode }
  column: Column<TFeatures, TData, TValue>
  getValue: CellContext<TFeatures, TData, TValue>['getValue']
  renderValue: CellContext<TFeatures, TData, TValue>['renderValue']
  row: Row<TFeatures, TData>
  table: Table<TFeatures, TData>
}

/**
 * Enhanced HeaderContext with pre-bound header components.
 * The `header` property includes the registered headerComponents.
 */
export interface AppHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, TableComponentType>,
> {
  column: Column<TFeatures, TData, TValue>
  header: Header<TFeatures, TData, TValue> &
    THeaderComponents & { FlexRender: () => OctaneNode }
  table: Table<TFeatures, TData>
}

/**
 * Template type for column definitions that can be a string or a function.
 */
export type AppColumnDefTemplate<TProps extends object> =
  string | ((props: TProps) => any)

/**
 * Enhanced column definition base with pre-bound components in
 * cell/header/footer contexts.
 */
export type AppColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> = Omit<
  IdentifiedColumnDef<TFeatures, TData, TValue>,
  'cell' | 'header' | 'footer'
> & {
  cell?: AppColumnDefTemplate<
    AppCellContext<TFeatures, TData, TValue, TCellComponents>
  >
  header?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>
  >
  footer?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, TValue, THeaderComponents>
  >
}

/**
 * Enhanced display column definition with pre-bound components.
 */
export type AppDisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> = Omit<
  DisplayColumnDef<TFeatures, TData, unknown>,
  'cell' | 'header' | 'footer'
> & {
  cell?: AppColumnDefTemplate<
    AppCellContext<TFeatures, TData, unknown, TCellComponents>
  >
  header?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
  footer?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
}

/**
 * Enhanced group column definition with pre-bound components.
 */
export type AppGroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> = Omit<
  GroupColumnDef<TFeatures, TData, unknown>,
  'cell' | 'header' | 'footer' | 'columns'
> & {
  cell?: AppColumnDefTemplate<
    AppCellContext<TFeatures, TData, unknown, TCellComponents>
  >
  header?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
  footer?: AppColumnDefTemplate<
    AppHeaderContext<TFeatures, TData, unknown, THeaderComponents>
  >
  columns?: Array<ColumnDef<TFeatures, TData, unknown>>
}

/**
 * Enhanced column helper with pre-bound components in cell/header/footer
 * contexts. This enables TypeScript to know about the registered components
 * when defining columns.
 */
export interface AppColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> {
  /**
   * Creates a data column definition with an accessor key or function.
   * The cell, header, and footer contexts include pre-bound components.
   */
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends (TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never),
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? AppColumnDefBase<
          TFeatures,
          TData,
          TValue,
          TCellComponents,
          THeaderComponents
        > & {
          id: string
        }
      : AppColumnDefBase<
          TFeatures,
          TData,
          TValue,
          TCellComponents,
          THeaderComponents
        >,
  ) => TAccessor extends AccessorFn<TData>
    ? AccessorFnColumnDef<TFeatures, TData, TValue>
    : AccessorKeyColumnDef<TFeatures, TData, TValue>

  /**
   * Wraps an array of column definitions to preserve each column's individual
   * TValue type.
   */
  columns: <TColumns extends ReadonlyArray<ColumnDef<TFeatures, TData, any>>>(
    columns: [...TColumns],
  ) => Array<ColumnDef<TFeatures, TData, any>> & [...TColumns]

  /**
   * Creates a display column definition for non-data columns.
   * The cell, header, and footer contexts include pre-bound components.
   */
  display: (
    column: AppDisplayColumnDef<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >,
  ) => DisplayColumnDef<TFeatures, TData, unknown>

  /**
   * Creates a group column definition with nested child columns.
   * The cell, header, and footer contexts include pre-bound components.
   */
  group: (
    column: AppGroupColumnDef<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >,
  ) => GroupColumnDef<TFeatures, TData, unknown>
}

/**
 * Options for creating a table hook with pre-bound components and default table
 * options. Extends all TableOptions except
 * `columns` | `data` | `store` | `state` | `initialState`.
 */
export type CreateTableHookOptions<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, TableComponentType>,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> = Omit<
  TableOptions<TFeatures, any>,
  'columns' | 'data' | 'store' | 'state' | 'initialState'
> & {
  /**
   * Table-level components that need access to the table instance.
   * These are available directly on the table object returned by useAppTable.
   * Use `useTableContext()` inside these components.
   * @example { PaginationControls, GlobalFilter, RowCount }
   */
  tableComponents?: TTableComponents
  /**
   * Cell-level components that need access to the cell instance.
   * These are available on the cell object passed to AppCell's children.
   * Use `useCellContext()` inside these components.
   * @example { TextCell, NumberCell, DateCell, CurrencyCell }
   */
  cellComponents?: TCellComponents
  /**
   * Header-level components that need access to the header instance.
   * These are available on the header object passed to AppHeader/AppFooter's
   * children. Use `useHeaderContext()` inside these components.
   * @example { SortIndicator, ColumnFilter, ResizeHandle }
   */
  headerComponents?: THeaderComponents
  /**
   * A custom octane context for the table instance (read with `useContext`
   * inside your `tableComponents`). Optional: defaults to a shared
   * module-scoped context. Only pass your own (created via `createContext`)
   * when you need to isolate this table's context from other tables, e.g. when
   * nesting one table inside another.
   */
  tableContext?: Context<OctaneTable<any, any>>
  /**
   * A custom octane context for the cell instance, used inside your
   * `cellComponents`.
   * @see {@link CreateTableHookOptions.tableContext}
   */
  cellContext?: Context<Cell<any, any, any>>
  /**
   * A custom octane context for the header instance, used inside your
   * `headerComponents` (and footer components).
   * @see {@link CreateTableHookOptions.tableContext}
   */
  headerContext?: Context<Header<any, any, any>>
}

/** Props for AppTable component — without selector. */
export interface AppTablePropsWithoutSelector {
  children: OctaneNode
  selector?: never
}

/** Props for AppTable component — with selector. */
export interface AppTablePropsWithSelector<
  TFeatures extends TableFeatures,
  TSelected,
> {
  children: (state: TSelected) => OctaneNode
  selector: (state: TableState<TFeatures>) => TSelected
}

/** Props for AppCell component — without selector. */
export interface AppCellPropsWithoutSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, TableComponentType>,
> {
  cell: Cell<TFeatures, TData, TValue>
  children: (
    cell: Cell<TFeatures, TData, TValue> &
      TCellComponents & { FlexRender: () => OctaneNode },
  ) => OctaneNode
  selector?: never
}

/** Props for AppCell component — with selector. */
export interface AppCellPropsWithSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, TableComponentType>,
  TSelected,
> {
  cell: Cell<TFeatures, TData, TValue>
  children: (
    cell: Cell<TFeatures, TData, TValue> &
      TCellComponents & { FlexRender: () => OctaneNode },
    state: TSelected,
  ) => OctaneNode
  selector: (state: TableState<TFeatures>) => TSelected
}

/** Props for AppHeader/AppFooter component — without selector. */
export interface AppHeaderPropsWithoutSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, TableComponentType>,
> {
  header: Header<TFeatures, TData, TValue>
  children: (
    header: Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => OctaneNode },
  ) => OctaneNode
  selector?: never
}

/** Props for AppHeader/AppFooter component — with selector. */
export interface AppHeaderPropsWithSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, TableComponentType>,
  TSelected,
> {
  header: Header<TFeatures, TData, TValue>
  children: (
    header: Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => OctaneNode },
    state: TSelected,
  ) => OctaneNode
  selector: (state: TableState<TFeatures>) => TSelected
}

/**
 * Component type for AppCell — wraps a cell and provides cell context with
 * optional Subscribe.
 */
export interface AppCellComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, TableComponentType>,
> {
  <TValue extends CellData = CellData>(
    props: AppCellPropsWithoutSelector<
      TFeatures,
      TData,
      TValue,
      TCellComponents
    >,
  ): OctaneNode
  <TValue extends CellData = CellData, TSelected = unknown>(
    props: AppCellPropsWithSelector<
      TFeatures,
      TData,
      TValue,
      TCellComponents,
      TSelected
    >,
  ): OctaneNode
}

/**
 * Component type for AppHeader/AppFooter — wraps a header and provides header
 * context with optional Subscribe.
 */
export interface AppHeaderComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  THeaderComponents extends Record<string, TableComponentType>,
> {
  <TValue extends CellData = CellData>(
    props: AppHeaderPropsWithoutSelector<
      TFeatures,
      TData,
      TValue,
      THeaderComponents
    >,
  ): OctaneNode
  <TValue extends CellData = CellData, TSelected = unknown>(
    props: AppHeaderPropsWithSelector<
      TFeatures,
      TData,
      TValue,
      THeaderComponents,
      TSelected
    >,
  ): OctaneNode
}

/** Component type for AppTable — root wrapper with optional Subscribe. */
export interface AppTableComponent<TFeatures extends TableFeatures> {
  (props: AppTablePropsWithoutSelector): OctaneNode
  <TSelected>(
    props: AppTablePropsWithSelector<TFeatures, TSelected>,
  ): OctaneNode
}

/**
 * Extended table API returned by `useAppTable` with all App wrapper components.
 */
export type AppOctaneTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, TableComponentType>,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> = OctaneTable<TFeatures, TData, TSelected> &
  CoreNoInfer<TTableComponents> & {
    /**
     * Root wrapper component that provides table context with optional
     * Subscribe.
     *
     * @example
     * ```tsx
     * // Without selector — children is a renderable
     * <table.AppTable>
     *   <table>…</table>
     * </table.AppTable>
     *
     * // With selector — children receives selected state
     * <table.AppTable selector={(s) => s.pagination}>
     *   {(pagination) => <div>{pagination.pageIndex as unknown as string}</div>}
     * </table.AppTable>
     * ```
     */
    AppTable: AppTableComponent<TFeatures>
    /**
     * Wraps a cell and provides cell context with pre-bound cellComponents.
     * Optionally accepts a selector for Subscribe functionality.
     *
     * @example
     * ```tsx
     * <table.AppCell cell={cell}>
     *   {(c) => <td><c.TextCell /></td>}
     * </table.AppCell>
     * ```
     */
    AppCell: AppCellComponent<TFeatures, TData, CoreNoInfer<TCellComponents>>
    /**
     * Wraps a header and provides header context with pre-bound
     * headerComponents. Optionally accepts a selector for Subscribe
     * functionality.
     *
     * @example
     * ```tsx
     * <table.AppHeader header={header}>
     *   {(h) => <th><h.SortIndicator /></th>}
     * </table.AppHeader>
     * ```
     */
    AppHeader: AppHeaderComponent<
      TFeatures,
      TData,
      CoreNoInfer<THeaderComponents>
    >
    /**
     * Wraps a footer and provides header context with pre-bound
     * headerComponents.
     *
     * @example
     * ```tsx
     * <table.AppFooter header={footer}>
     *   {(f) => <td><f.FlexRender /></td>}
     * </table.AppFooter>
     * ```
     */
    AppFooter: AppHeaderComponent<
      TFeatures,
      TData,
      CoreNoInfer<THeaderComponents>
    >
  }

export interface CreateTableHookResult<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, TableComponentType>,
  TCellComponents extends Record<string, TableComponentType>,
  THeaderComponents extends Record<string, TableComponentType>,
> {
  /** The features object that was passed to `createTableHook`. */
  appFeatures: TFeatures
  /**
   * A column helper pre-bound to `TFeatures` and the registered components, so
   * the cell/header/footer render props expose the bound components.
   */
  createAppColumnHelper: <TData extends RowData>() => AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Creates a table with the `App*` wrapper components and registered
   * `tableComponents` attached. `TData` is inferred from the `data` option.
   */
  useAppTable: <TData extends RowData, TSelected = TableState<TFeatures>>(
    tableOptions: Omit<TableOptions<TFeatures, TData>, 'features'>,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ) => AppOctaneTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Reads the table provided by the nearest `<table.AppTable>`. This is the
   * same extended instance `useAppTable` returns, so the `App*` components and
   * your `tableComponents` are available on it.
   *
   * Pass `TSelected` to match the selector you gave `useAppTable`, so
   * `table.state` is typed as the selected slice. It cannot be inferred
   * automatically (context does not carry the provider's generics), so it
   * defaults to the full table state, which is correct for the common case of
   * `useAppTable` without a selector.
   */
  useTableContext: <
    TData extends RowData = RowData,
    TSelected = TableState<TFeatures>,
  >() => AppOctaneTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Reads the cell provided by the nearest `<table.AppCell>`, extended with
   * your `cellComponents` and a context-bound `FlexRender`.
   */
  useCellContext: <TValue extends CellData = CellData>() => Cell<
    TFeatures,
    any,
    TValue
  > &
    TCellComponents & { FlexRender: () => OctaneNode }
  /**
   * Reads the header provided by the nearest `<table.AppHeader>` /
   * `<table.AppFooter>`, extended with your `headerComponents` and a
   * context-bound `FlexRender`.
   */
  useHeaderContext: <TValue extends CellData = CellData>() => Header<
    TFeatures,
    any,
    TValue
  > &
    THeaderComponents & { FlexRender: () => OctaneNode }
}

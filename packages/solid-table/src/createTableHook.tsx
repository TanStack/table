import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { Show, createContext, merge, useContext } from 'solid-js'
import { createTable } from './createTable'
import { FlexRender } from './FlexRender'
import type { SolidTable } from './createTable'
import type { Accessor, Component } from 'solid-js'
import type { JSX } from '@solidjs/web'
import type {
  AccessorFn,
  AccessorFnColumnDef,
  AccessorKeyColumnDef,
  Cell,
  CellContext,
  CellData,
  Column,
  ColumnDef,
  DeepKeys,
  DeepValue,
  DisplayColumnDef,
  GroupColumnDef,
  Header,
  IdentifiedColumnDef,
  NoInfer,
  Row,
  RowData,
  Table,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'

export type ComponentType<T extends Record<string, any>> = Component<T>

// =============================================================================
// Enhanced Context Types with Pre-bound Components
// =============================================================================

/**
 * Enhanced CellContext with pre-bound cell components.
 * The `cell` property includes the registered cellComponents.
 */
export type AppCellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
> = {
  cell: Cell<TFeatures, TData, TValue> &
    TCellComponents & { FlexRender: () => JSX.Element }
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
export type AppHeaderContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = {
  column: Column<TFeatures, TData, TValue>
  header: Header<TFeatures, TData, TValue> &
    THeaderComponents & { FlexRender: () => JSX.Element }
  table: Table<TFeatures, TData>
}

// =============================================================================
// Enhanced Column Definition Types
// =============================================================================

/**
 * Template type for column definitions that can be a string or a function.
 */
export type AppColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

/**
 * Enhanced column definition base with pre-bound components in cell/header/footer contexts.
 */
export type AppColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
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
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
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
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
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

// =============================================================================
// Enhanced Column Helper Type
// =============================================================================

/**
 * Enhanced column helper with pre-bound components in cell/header/footer contexts.
 * This enables TypeScript to know about the registered components when defining columns.
 */
export type AppColumnHelper<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = {
  /**
   * Creates a data column definition with an accessor key or function.
   * The cell, header, and footer contexts include pre-bound components.
   */
  accessor: <
    TAccessor extends AccessorFn<TData> | DeepKeys<TData>,
    TValue extends TAccessor extends AccessorFn<TData, infer TReturn>
      ? TReturn
      : TAccessor extends DeepKeys<TData>
        ? DeepValue<TData, TAccessor>
        : never,
  >(
    accessor: TAccessor,
    column: TAccessor extends AccessorFn<TData>
      ? AppColumnDefBase<
          TFeatures,
          TData,
          TValue,
          TCellComponents,
          THeaderComponents
        > & { id: string }
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
   * Wraps an array of column definitions to preserve each column's individual TValue type.
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

// =============================================================================
// CreateTableHook Options and Props
// =============================================================================

/**
 * Options for creating a table hook with pre-bound components and default table options.
 * Extends all TableOptions except 'columns' | 'data' | 'store' | 'state' | 'initialState'.
 */
export type CreateTableHookOptions<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = Omit<
  TableOptions<TFeatures, any>,
  'columns' | 'data' | 'store' | 'state' | 'initialState'
> & {
  /**
   * Table-level components that need access to the table instance.
   * These are available directly on the table object returned by createAppTable.
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
   * These are available on the header object passed to AppHeader/AppFooter's children.
   * Use `useHeaderContext()` inside these components.
   * @example { SortIndicator, ColumnFilter, ResizeHandle }
   */
  headerComponents?: THeaderComponents
}

/**
 * Props for AppTable component - without selector
 */
export interface AppTablePropsWithoutSelector {
  children: JSX.Element
  selector?: never
}

/**
 * Props for AppTable component - with selector
 */
export interface AppTablePropsWithSelector<
  TFeatures extends TableFeatures,
  TSelected,
> {
  children: (state: Accessor<TSelected>) => JSX.Element
  selector: (state: TableState<TFeatures>) => TSelected
}

/**
 * Props for AppCell component - without selector
 */
export interface AppCellPropsWithoutSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
> {
  cell: Cell<TFeatures, TData, TValue>
  children: (
    cell: Cell<TFeatures, TData, TValue> &
      TCellComponents & { FlexRender: () => JSX.Element },
  ) => JSX.Element
  selector?: never
}

/**
 * Props for AppCell component - with selector
 */
export interface AppCellPropsWithSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
  TSelected,
> {
  cell: Cell<TFeatures, TData, TValue>
  children: (
    cell: Cell<TFeatures, TData, TValue> &
      TCellComponents & { FlexRender: () => JSX.Element },
    state: Accessor<TSelected>,
  ) => JSX.Element
  selector: (state: TableState<TFeatures>) => TSelected
}

/**
 * Props for AppHeader/AppFooter component - without selector
 */
export interface AppHeaderPropsWithoutSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, ComponentType<any>>,
> {
  header: Header<TFeatures, TData, TValue>
  children: (
    header: Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => JSX.Element },
  ) => JSX.Element
  selector?: never
}

/**
 * Props for AppHeader/AppFooter component - with selector
 */
export interface AppHeaderPropsWithSelector<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, ComponentType<any>>,
  TSelected,
> {
  header: Header<TFeatures, TData, TValue>
  children: (
    header: Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => JSX.Element },
    state: Accessor<TSelected>,
  ) => JSX.Element
  selector: (state: TableState<TFeatures>) => TSelected
}

/**
 * Component type for AppCell - wraps a cell and provides cell context with optional Subscribe
 */
export interface AppCellComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TCellComponents extends Record<string, ComponentType<any>>,
> {
  <TValue extends CellData = CellData>(
    props: AppCellPropsWithoutSelector<
      TFeatures,
      TData,
      TValue,
      TCellComponents
    >,
  ): JSX.Element
  <TValue extends CellData = CellData, TSelected = unknown>(
    props: AppCellPropsWithSelector<
      TFeatures,
      TData,
      TValue,
      TCellComponents,
      TSelected
    >,
  ): JSX.Element
}

/**
 * Component type for AppHeader/AppFooter - wraps a header and provides header context with optional Subscribe
 */
export interface AppHeaderComponent<
  TFeatures extends TableFeatures,
  TData extends RowData,
  THeaderComponents extends Record<string, ComponentType<any>>,
> {
  <TValue extends CellData = CellData>(
    props: AppHeaderPropsWithoutSelector<
      TFeatures,
      TData,
      TValue,
      THeaderComponents
    >,
  ): JSX.Element
  <TValue extends CellData = CellData, TSelected = unknown>(
    props: AppHeaderPropsWithSelector<
      TFeatures,
      TData,
      TValue,
      THeaderComponents,
      TSelected
    >,
  ): JSX.Element
}

/**
 * Component type for AppTable - root wrapper with optional Subscribe
 */
export interface AppTableComponent<TFeatures extends TableFeatures> {
  (props: AppTablePropsWithoutSelector): JSX.Element
  <TSelected>(
    props: AppTablePropsWithSelector<TFeatures, TSelected>,
  ): JSX.Element
}

/**
 * Extended table API returned by createAppTable with all App wrapper components
 */
export type AppSolidTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = SolidTable<TFeatures, TData, TSelected> &
  NoInfer<TTableComponents> & {
    /**
     * Root wrapper component that provides table context with optional Subscribe.
     * @example
     * ```tsx
     * // Without selector - children is JSX.Element
     * <table.AppTable>
     *   <table>...</table>
     * </table.AppTable>
     *
     * // With selector - children receives selected state
     * <table.AppTable selector={(s) => s.pagination}>
     *   {(pagination) => <div>Page {pagination.pageIndex}</div>}
     * </table.AppTable>
     * ```
     */
    AppTable: AppTableComponent<TFeatures>
    /**
     * Wraps a cell and provides cell context with pre-bound cellComponents.
     * Optionally accepts a selector for Subscribe functionality.
     * @example
     * ```tsx
     * // Without selector
     * <table.AppCell cell={cell}>
     *   {(c) => <td><c.TextCell /></td>}
     * </table.AppCell>
     *
     * // With selector - children receives cell and selected state
     * <table.AppCell cell={cell} selector={(s) => s.columnFilters}>
     *   {(c, filters) => <td>{filters.length}</td>}
     * </table.AppCell>
     * ```
     */
    AppCell: AppCellComponent<TFeatures, TData, NoInfer<TCellComponents>>
    /**
     * Wraps a header and provides header context with pre-bound headerComponents.
     * Optionally accepts a selector for Subscribe functionality.
     * @example
     * ```tsx
     * // Without selector
     * <table.AppHeader header={header}>
     *   {(h) => <th><h.SortIndicator /></th>}
     * </table.AppHeader>
     *
     * // With selector
     * <table.AppHeader header={header} selector={(s) => s.sorting}>
     *   {(h, sorting) => <th>{sorting.length} sorted</th>}
     * </table.AppHeader>
     * ```
     */
    AppHeader: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>
    /**
     * Wraps a footer and provides header context with pre-bound headerComponents.
     * Optionally accepts a selector for Subscribe functionality.
     * @example
     * ```tsx
     * <table.AppFooter header={footer}>
     *   {(f) => <td><table.FlexRender footer={footer} /></td>}
     * </table.AppFooter>
     * ```
     */
    AppFooter: AppHeaderComponent<TFeatures, TData, NoInfer<THeaderComponents>>
    /**
     * Convenience FlexRender component attached to the table instance.
     * Renders cell, header, or footer content from column definitions.
     * @example
     * ```tsx
     * <table.FlexRender header={header} />
     * <table.FlexRender cell={cell} />
     * <table.FlexRender footer={footer} />
     * ```
     */
    FlexRender: typeof FlexRender
  }

/**
 * Creates a custom table hook with pre-bound components for composition.
 *
 * This is the table equivalent of TanStack Form's `createFormHook`. It allows you to:
 * - Define features, row models, and default options once, shared across all tables
 * - Register reusable table, cell, and header components
 * - Access table/cell/header instances via context in those components
 * - Get a `createAppTable` hook that returns an extended table with App wrapper components
 * - Get a `createAppColumnHelper` function pre-bound to your features
 *
 * @example
 * ```tsx
 * // hooks/table.ts
 * export const {
 *   createAppTable,
 *   createAppColumnHelper,
 *   useTableContext,
 *   useCellContext,
 *   useHeaderContext,
 * } = createTableHook({
 *   _features: tableFeatures({
 *     rowPaginationFeature,
 *     rowSortingFeature,
 *     columnFilteringFeature,
 *   }),
 *   _rowModels: {
 *     paginatedRowModel: createPaginatedRowModel(),
 *     sortedRowModel: createSortedRowModel(sortFns),
 *     filteredRowModel: createFilteredRowModel(filterFns),
 *   },
 *   tableComponents: { PaginationControls, RowCount },
 *   cellComponents: { TextCell, NumberCell },
 *   headerComponents: { SortIndicator, ColumnFilter },
 * })
 *
 * // Create column helper with TFeatures already bound
 * const columnHelper = createAppColumnHelper<Person>()
 *
 * // components/table-components.tsx
 * function PaginationControls() {
 *   const table = useTableContext() // TFeatures already known!
 *   return <table.Subscribe selector={(s) => s.pagination}>...</table.Subscribe>
 * }
 *
 * // features/users.tsx
 * function UsersTable({ data }: { data: Person[] }) {
 *   const table = createAppTable({
 *     columns,
 *     data, // TData inferred from Person[]
 *   })
 *
 *   return (
 *     <table.AppTable>
 *       <table>
 *         <thead>
 *           <For each={table.getHeaderGroups()}>
 *             {(headerGroup) => (
 *               <tr>
 *                 <For each={headerGroup.headers}>
 *                   {(h) => (
 *                     <table.AppHeader header={h}>
 *                       {(header) => (
 *                         <th>
 *                           <header.FlexRender />
 *                           <header.SortIndicator />
 *                         </th>
 *                       )}
 *                     </table.AppHeader>
 *                   )}
 *                 </For>
 *               </tr>
 *             )}
 *           </For>
 *         </thead>
 *         <tbody>
 *           <For each={table.getRowModel().rows}>
 *             {(row) => (
 *               <tr>
 *                 <For each={row.getAllCells()}>
 *                   {(c) => (
 *                     <table.AppCell cell={c}>
 *                       {(cell) => <td><cell.TextCell /></td>}
 *                     </table.AppCell>
 *                   )}
 *                 </For>
 *               </tr>
 *             )}
 *           </For>
 *         </tbody>
 *       </table>
 *       <table.PaginationControls />
 *     </table.AppTable>
 *   )
 * }
 * ```
 */
export function createTableHook<
  TFeatures extends TableFeatures,
  const TTableComponents extends Record<string, ComponentType<any>>,
  const TCellComponents extends Record<string, ComponentType<any>>,
  const THeaderComponents extends Record<string, ComponentType<any>>,
>({
  tableComponents,
  cellComponents,
  headerComponents,
  ...defaultTableOptions
}: CreateTableHookOptions<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
>) {
  // Create contexts internally with TFeatures baked in
  const TableContext = createContext<SolidTable<TFeatures, any, any>>(
    null as never,
  )
  const CellContext = createContext<Cell<TFeatures, any, any>>(null as never)
  const HeaderContext = createContext<Header<TFeatures, any, any>>(
    null as never,
  )

  /**
   * Create a column helper pre-bound to the features and components configured in this table hook.
   * The cell, header, and footer contexts include pre-bound components (e.g., `cell.TextCell`).
   * @example
   * ```tsx
   * const columnHelper = createAppColumnHelper<Person>()
   *
   * const columns = [
   *   columnHelper.accessor('firstName', {
   *     header: 'First Name',
   *     cell: ({ cell }) => <cell.TextCell />, // cell has pre-bound components!
   *   }),
   *   columnHelper.accessor('age', {
   *     header: 'Age',
   *     cell: ({ cell }) => <cell.NumberCell />,
   *   }),
   * ]
   * ```
   */
  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  > {
    // The runtime implementation is the same - components are attached at render time
    // This cast provides the enhanced types for column definitions
    return coreCreateColumnHelper<TFeatures, TData>() as AppColumnHelper<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >
  }

  /**
   * Access the table instance from within an `AppTable` wrapper.
   * Use this in custom `tableComponents` passed to `createTableHook`.
   * TFeatures is already known from the createTableHook call.
   *
   * @example
   * ```tsx
   * function PaginationControls() {
   *   const table = useTableContext()
   *   return (
   *     <table.Subscribe selector={(s) => s.pagination}>
   *       {(pagination) => (
   *         <div>
   *           <button onClick={() => table.previousPage()}>Prev</button>
   *           <span>Page {pagination.pageIndex + 1}</span>
   *           <button onClick={() => table.nextPage()}>Next</button>
   *         </div>
   *       )}
   *     </table.Subscribe>
   *   )
   * }
   * ```
   */
  function useTableContext<TData extends RowData = RowData>(): SolidTable<
    TFeatures,
    TData
  > {
    const table = useContext(TableContext)

    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    return table
  }

  /**
   * Access the cell instance from within an `AppCell` wrapper.
   * Use this in custom `cellComponents` passed to `createTableHook`.
   * TFeatures is already known from the createTableHook call.
   *
   * @example
   * ```tsx
   * function TextCell() {
   *   const cell = useCellContext<string>()
   *   return <span>{cell.getValue()}</span>
   * }
   *
   * function NumberCell({ format }: { format?: Intl.NumberFormatOptions }) {
   *   const cell = useCellContext<number>()
   *   return <span>{cell.getValue().toLocaleString(undefined, format)}</span>
   * }
   * ```
   */
  function useCellContext<TValue extends CellData = CellData>(): Cell<
    TFeatures,
    any,
    TValue
  > {
    const cell = useContext(CellContext)

    if (!cell) {
      throw new Error(
        '`useCellContext` must be used within an `AppCell` component. ' +
          'Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.',
      )
    }

    return cell
  }

  /**
   * Access the header instance from within an `AppHeader` or `AppFooter` wrapper.
   * Use this in custom `headerComponents` passed to `createTableHook`.
   * TFeatures is already known from the createTableHook call.
   *
   * @example
   * ```tsx
   * function SortIndicator() {
   *   const header = useHeaderContext()
   *   const sorted = header.column.getIsSorted()
   *   return sorted === 'asc' ? '🔼' : sorted === 'desc' ? '🔽' : null
   * }
   *
   * function ColumnFilter() {
   *   const header = useHeaderContext()
   *   if (!header.column.getCanFilter()) return null
   *   return (
   *     <input
   *       value={(header.column.getFilterValue() ?? '') as string}
   *       onChange={(e) => header.column.setFilterValue(e.target.value)}
   *       placeholder="Filter..."
   *     />
   *   )
   * }
   * ```
   */
  function useHeaderContext<TValue extends CellData = CellData>(): Header<
    TFeatures,
    any,
    TValue
  > {
    const header = useContext(HeaderContext)

    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    return header
  }

  /**
   * Context-aware FlexRender component for cells.
   * Uses the cell from context, so no need to pass cell prop.
   */
  function CellFlexRender() {
    const cell = useCellContext()
    return <FlexRender cell={cell} />
  }

  /**
   * Context-aware FlexRender component for headers.
   * Uses the header from context, so no need to pass header prop.
   */
  function HeaderFlexRender() {
    const header = useHeaderContext()
    return <FlexRender header={header} />
  }

  /**
   * Context-aware FlexRender component for footers.
   * Uses the header from context, so no need to pass footer prop.
   */
  function FooterFlexRender() {
    const header = useHeaderContext()
    return <FlexRender footer={header} />
  }

  /**
   * Enhanced useTable hook that returns a table with App wrapper components
   * and pre-bound tableComponents attached directly to the table object.
   *
   * Default options from createTableHook are automatically merged with
   * the options passed here. Options passed here take precedence.
   *
   * TFeatures is already known from the createTableHook call; TData is inferred from the data prop.
   */
  function createAppTable<TData extends RowData, TSelected = {}>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): AppSolidTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    // Merge default options with provided options (provided takes precedence)
    const mergedProps = merge(defaultTableOptions, tableOptions)
    const table = createTable<TFeatures, TData, TSelected>(
      mergedProps as TableOptions<TFeatures, TData>,
      selector,
    )

    // AppTable - Root wrapper that provides table context with optional state selector
    function AppTable(props: AppTablePropsWithoutSelector): JSX.Element
    function AppTable<TAppTableSelected>(
      props: AppTablePropsWithSelector<TFeatures, TAppTableSelected>,
    ): JSX.Element
    function AppTable<TAppTableSelected>(
      props:
        | AppTablePropsWithoutSelector
        | AppTablePropsWithSelector<TFeatures, TAppTableSelected>,
    ): JSX.Element {
      return (
        <TableContext value={table}>
          <Show when={props.selector} fallback={props.children as JSX.Element}>
            {(selector) => (
              <table.Subscribe selector={selector()}>
                {(state: Accessor<TAppTableSelected>) =>
                  (
                    props.children as (
                      state: Accessor<TAppTableSelected>,
                    ) => JSX.Element
                  )(state)
                }
              </table.Subscribe>
            )}
          </Show>
        </TableContext>
      )
    }

    // AppCell - Wraps cell with context, pre-bound cellComponents, and optional state selector
    function AppCell<TValue extends CellData = CellData>(
      props: AppCellPropsWithoutSelector<
        TFeatures,
        TData,
        TValue,
        TCellComponents
      >,
    ): JSX.Element
    function AppCell<
      TValue extends CellData = CellData,
      TAppCellSelected = unknown,
    >(
      props: AppCellPropsWithSelector<
        TFeatures,
        TData,
        TValue,
        TCellComponents,
        TAppCellSelected
      >,
    ): JSX.Element
    function AppCell<
      TValue extends CellData = CellData,
      TAppCellSelected = unknown,
    >(
      props:
        | AppCellPropsWithoutSelector<TFeatures, TData, TValue, TCellComponents>
        | AppCellPropsWithSelector<
            TFeatures,
            TData,
            TValue,
            TCellComponents,
            TAppCellSelected
          >,
    ): JSX.Element {
      const extendedCell = Object.assign(props.cell, {
        FlexRender: CellFlexRender,
        ...cellComponents,
      }) as Cell<TFeatures, TData, TValue> &
        TCellComponents & { FlexRender: () => JSX.Element }

      return (
        <CellContext value={props.cell}>
          <Show
            when={props.selector}
            fallback={(props.children as (cell: any) => JSX.Element)(
              extendedCell as any,
            )}
          >
            {(selector) => (
              <table.Subscribe selector={selector()}>
                {(state: Accessor<TAppCellSelected>) =>
                  props.children(extendedCell, state)
                }
              </table.Subscribe>
            )}
          </Show>
        </CellContext>
      )
    }

    // AppHeader - Wraps header with context, pre-bound headerComponents, and optional state selector
    function AppHeader<TValue extends CellData = CellData>(
      props: AppHeaderPropsWithoutSelector<
        TFeatures,
        TData,
        TValue,
        THeaderComponents
      >,
    ): JSX.Element
    function AppHeader<
      TValue extends CellData = CellData,
      TAppHeaderSelected = unknown,
    >(
      props: AppHeaderPropsWithSelector<
        TFeatures,
        TData,
        TValue,
        THeaderComponents,
        TAppHeaderSelected
      >,
    ): JSX.Element
    function AppHeader<
      TValue extends CellData = CellData,
      TAppHeaderSelected = unknown,
    >(
      props:
        | AppHeaderPropsWithoutSelector<
            TFeatures,
            TData,
            TValue,
            THeaderComponents
          >
        | AppHeaderPropsWithSelector<
            TFeatures,
            TData,
            TValue,
            THeaderComponents,
            TAppHeaderSelected
          >,
    ): JSX.Element {
      const extendedHeader = Object.assign(props.header, {
        FlexRender: HeaderFlexRender,
        ...headerComponents,
      }) as Header<TFeatures, TData, TValue> &
        THeaderComponents & { FlexRender: () => JSX.Element }

      return (
        <HeaderContext value={props.header}>
          <Show
            when={props.selector}
            fallback={(props.children as (header: any) => JSX.Element)(
              extendedHeader as any,
            )}
          >
            {(selector) => (
              <table.Subscribe selector={selector()}>
                {(state: Accessor<TAppHeaderSelected>) =>
                  props.children(extendedHeader, state)
                }
              </table.Subscribe>
            )}
          </Show>
        </HeaderContext>
      )
    }

    // AppFooter - Same as AppHeader but uses FooterFlexRender (footers use Header type)
    function AppFooter<TValue extends CellData = CellData>(
      props: AppHeaderPropsWithoutSelector<
        TFeatures,
        TData,
        TValue,
        THeaderComponents
      >,
    ): JSX.Element
    function AppFooter<
      TValue extends CellData = CellData,
      TAppFooterSelected = unknown,
    >(
      props: AppHeaderPropsWithSelector<
        TFeatures,
        TData,
        TValue,
        THeaderComponents,
        TAppFooterSelected
      >,
    ): JSX.Element
    function AppFooter<
      TValue extends CellData = CellData,
      TAppFooterSelected = unknown,
    >(
      props:
        | AppHeaderPropsWithoutSelector<
            TFeatures,
            TData,
            TValue,
            THeaderComponents
          >
        | AppHeaderPropsWithSelector<
            TFeatures,
            TData,
            TValue,
            THeaderComponents,
            TAppFooterSelected
          >,
    ): JSX.Element {
      const extendedHeader = Object.assign(props.header, {
        FlexRender: FooterFlexRender,
        ...headerComponents,
      }) as Header<TFeatures, TData, TValue> &
        THeaderComponents & { FlexRender: () => JSX.Element }

      return (
        <HeaderContext value={props.header}>
          <Show
            when={props.selector}
            fallback={(props.children as (header: any) => JSX.Element)(
              extendedHeader as any,
            )}
          >
            {(selector) => (
              <table.Subscribe selector={selector()}>
                {(state: Accessor<TAppFooterSelected>) =>
                  props.children(extendedHeader, state)
                }
              </table.Subscribe>
            )}
          </Show>
        </HeaderContext>
      )
    }

    // Combine everything into the extended table API
    return Object.assign(table, {
      AppTable,
      AppCell,
      AppHeader,
      AppFooter,
      FlexRender,
      ...tableComponents,
    }) as AppSolidTable<
      TFeatures,
      TData,
      TSelected,
      TTableComponents,
      TCellComponents,
      THeaderComponents
    >
  }

  return {
    appFeatures: defaultTableOptions._features as TFeatures,
    createAppColumnHelper,
    createAppTable: createAppTable,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}

'use client'
/* eslint-disable @eslint-react/no-context-provider */
import React, { createContext, useContext, useMemo } from 'react'
import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { useTable } from './useTable'
import { FlexRender } from './FlexRender'
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
import type { ComponentType, ReactNode } from 'react'
import type { ReactTable } from './useTable'

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
    TCellComponents & { FlexRender: () => ReactNode }
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
    THeaderComponents & { FlexRender: () => ReactNode }
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
  children: ReactNode
  selector?: never
}

/**
 * Props for AppTable component - with selector
 */
export interface AppTablePropsWithSelector<
  TFeatures extends TableFeatures,
  TSelected,
> {
  children: (state: TSelected) => ReactNode
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
      TCellComponents & { FlexRender: () => ReactNode },
  ) => ReactNode
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
      TCellComponents & { FlexRender: () => ReactNode },
    state: TSelected,
  ) => ReactNode
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
      THeaderComponents & { FlexRender: () => ReactNode },
  ) => ReactNode
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
      THeaderComponents & { FlexRender: () => ReactNode },
    state: TSelected,
  ) => ReactNode
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
  ): ReactNode
  <TValue extends CellData = CellData, TSelected = unknown>(
    props: AppCellPropsWithSelector<
      TFeatures,
      TData,
      TValue,
      TCellComponents,
      TSelected
    >,
  ): ReactNode
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
  ): ReactNode
  <TValue extends CellData = CellData, TSelected = unknown>(
    props: AppHeaderPropsWithSelector<
      TFeatures,
      TData,
      TValue,
      THeaderComponents,
      TSelected
    >,
  ): ReactNode
}

/**
 * Component type for AppTable - root wrapper with optional Subscribe
 */
export interface AppTableComponent<TFeatures extends TableFeatures> {
  (props: AppTablePropsWithoutSelector): ReactNode
  <TSelected>(props: AppTablePropsWithSelector<TFeatures, TSelected>): ReactNode
}

/**
 * Extended table API returned by useAppTable with all App wrapper components
 */
export type AppReactTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = ReactTable<TFeatures, TData, TSelected> &
  NoInfer<TTableComponents> & {
    /**
     * Root wrapper component that provides table context with optional Subscribe.
     * @example
     * ```tsx
     * // Without selector - children is ReactNode
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
  }

/**
 * Creates a custom table hook with pre-bound components for composition.
 *
 * This is the table equivalent of TanStack Form's `createFormHook`. It allows you to:
 * - Define features, row models, and default options once, shared across all tables
 * - Register reusable table, cell, and header components
 * - Access table/cell/header instances via context in those components
 * - Get a `useAppTable` hook that returns an extended table with App wrapper components
 * - Get a `createAppColumnHelper` function pre-bound to your features
 *
 * @example
 * ```tsx
 * // hooks/table.ts
 * export const {
 *   useAppTable,
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
 *   const table = useAppTable({
 *     columns,
 *     data, // TData inferred from Person[]
 *   })
 *
 *   return (
 *     <table.AppTable>
 *       <table>
 *         <thead>
 *           {table.getHeaderGroups().map(headerGroup => (
 *             <tr key={headerGroup.id}>
 *               {headerGroup.headers.map(h => (
 *                 <table.AppHeader header={h} key={h.id}>
 *                   {(header) => (
 *                     <th>
 *                       <table.FlexRender header={h} />
 *                       <header.SortIndicator />
 *                     </th>
 *                   )}
 *                 </table.AppHeader>
 *               ))}
 *             </tr>
 *           ))}
 *         </thead>
 *         <tbody>
 *           {table.getRowModel().rows.map(row => (
 *             <tr key={row.id}>
 *               {row.getAllCells().map(c => (
 *                 <table.AppCell cell={c} key={c.id}>
 *                   {(cell) => <td><cell.TextCell /></td>}
 *                 </table.AppCell>
 *               ))}
 *             </tr>
 *           ))}
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
  const TableContext = createContext<ReactTable<TFeatures, any, any>>(
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
  function useTableContext<TData extends RowData = RowData>(): ReactTable<
    TFeatures,
    TData
  > {
    // `useContext` keeps React 18 support; `use(Context)` is React 19+ only.
    // eslint-disable-next-line @eslint-react/no-use-context -- intentional for React 18
    const table = useContext(TableContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    return table as ReactTable<TFeatures, TData>
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
  function useCellContext<TValue extends CellData = CellData>() {
    // `useContext` keeps React 18 support; `use(Context)` is React 19+ only.
    // eslint-disable-next-line @eslint-react/no-use-context -- intentional for React 18
    const cell = useContext(CellContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!cell) {
      throw new Error(
        '`useCellContext` must be used within an `AppCell` component. ' +
          'Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.',
      )
    }

    return cell as Cell<TFeatures, any, TValue>
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
  function useHeaderContext<TValue extends CellData = CellData>() {
    // `useContext` keeps React 18 support; `use(Context)` is React 19+ only.
    // eslint-disable-next-line @eslint-react/no-use-context -- intentional for React 18
    const header = useContext(HeaderContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    return header as Header<TFeatures, any, TValue>
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
  function useAppTable<TData extends RowData, TSelected = {}>(
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): AppReactTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    // Merge default options with provided options (provided takes precedence)
    const table = useTable<TFeatures, TData, TSelected>(
      { ...defaultTableOptions, ...tableOptions } as TableOptions<
        TFeatures,
        TData
      >,
      selector,
    )

    // AppTable - Root wrapper that provides table context with optional Subscribe
    const AppTable = useMemo(() => {
      function AppTableImpl(props: AppTablePropsWithoutSelector): ReactNode
      function AppTableImpl<TAppTableSelected>(
        props: AppTablePropsWithSelector<TFeatures, TAppTableSelected>,
      ): ReactNode
      function AppTableImpl<TAppTableSelected>(
        props:
          | AppTablePropsWithoutSelector
          | AppTablePropsWithSelector<TFeatures, TAppTableSelected>,
      ): ReactNode {
        const { children, selector: appTableSelector } = props

        return (
          <TableContext.Provider value={table}>
            {appTableSelector ? (
              <table.Subscribe selector={appTableSelector}>
                {(state: TAppTableSelected) =>
                  (children as (state: TAppTableSelected) => ReactNode)(state)
                }
              </table.Subscribe>
            ) : (
              children
            )}
          </TableContext.Provider>
        )
      }
      return AppTableImpl as AppTableComponent<TFeatures>
    }, [table])

    // AppCell - Wraps cell with context, pre-bound cellComponents, and optional Subscribe
    const AppCell = useMemo(() => {
      function AppCellImpl<TValue extends CellData = CellData>(
        props: AppCellPropsWithoutSelector<
          TFeatures,
          TData,
          TValue,
          TCellComponents
        >,
      ): ReactNode
      function AppCellImpl<
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
      ): ReactNode
      function AppCellImpl<
        TValue extends CellData = CellData,
        TAppCellSelected = unknown,
      >(
        props:
          | AppCellPropsWithoutSelector<
              TFeatures,
              TData,
              TValue,
              TCellComponents
            >
          | AppCellPropsWithSelector<
              TFeatures,
              TData,
              TValue,
              TCellComponents,
              TAppCellSelected
            >,
      ): ReactNode {
        const { cell, children, selector: appCellSelector } = props as any
        const extendedCell = Object.assign(cell, {
          FlexRender: CellFlexRender,
          ...cellComponents,
        })

        return (
          <CellContext.Provider value={cell}>
            {appCellSelector ? (
              <table.Subscribe selector={appCellSelector}>
                {(state: TAppCellSelected) =>
                  (
                    children as (
                      cell: Cell<TFeatures, TData, TValue> &
                        TCellComponents & { FlexRender: () => ReactNode },
                      state: TAppCellSelected,
                    ) => ReactNode
                  )(extendedCell, state)
                }
              </table.Subscribe>
            ) : (
              (
                children as (
                  cell: Cell<TFeatures, TData, TValue> &
                    TCellComponents & { FlexRender: () => ReactNode },
                ) => ReactNode
              )(extendedCell)
            )}
          </CellContext.Provider>
        )
      }
      return AppCellImpl as AppCellComponent<TFeatures, TData, TCellComponents>
    }, [table])

    // AppHeader - Wraps header with context, pre-bound headerComponents, and optional Subscribe
    const AppHeader = useMemo(() => {
      function AppHeaderImpl<TValue extends CellData = CellData>(
        props: AppHeaderPropsWithoutSelector<
          TFeatures,
          TData,
          TValue,
          THeaderComponents
        >,
      ): ReactNode
      function AppHeaderImpl<
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
      ): ReactNode
      function AppHeaderImpl<
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
      ): ReactNode {
        const { header, children, selector: appHeaderSelector } = props as any
        const extendedHeader = Object.assign(header, {
          FlexRender: HeaderFlexRender,
          ...headerComponents,
        })

        return (
          <HeaderContext.Provider value={header}>
            {appHeaderSelector ? (
              <table.Subscribe selector={appHeaderSelector}>
                {(state: TAppHeaderSelected) =>
                  (
                    children as (
                      header: Header<TFeatures, TData, TValue> &
                        THeaderComponents & { FlexRender: () => ReactNode },
                      state: TAppHeaderSelected,
                    ) => ReactNode
                  )(extendedHeader, state)
                }
              </table.Subscribe>
            ) : (
              (
                children as (
                  header: Header<TFeatures, TData, TValue> &
                    THeaderComponents & { FlexRender: () => ReactNode },
                ) => ReactNode
              )(extendedHeader)
            )}
          </HeaderContext.Provider>
        )
      }
      return AppHeaderImpl as AppHeaderComponent<
        TFeatures,
        TData,
        THeaderComponents
      >
    }, [table])

    // AppFooter - Same as AppHeader (footers use Header type)
    const AppFooter = useMemo(() => {
      function AppFooterImpl<TValue extends CellData = CellData>(
        props: AppHeaderPropsWithoutSelector<
          TFeatures,
          TData,
          TValue,
          THeaderComponents
        >,
      ): ReactNode
      function AppFooterImpl<
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
      ): ReactNode
      function AppFooterImpl<
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
      ): ReactNode {
        const { header, children, selector: appFooterSelector } = props as any
        const extendedHeader = Object.assign(header, {
          FlexRender: FooterFlexRender,
          ...headerComponents,
        })

        return (
          <HeaderContext.Provider value={header}>
            {appFooterSelector ? (
              <table.Subscribe selector={appFooterSelector}>
                {(state: TAppFooterSelected) =>
                  (
                    children as (
                      header: Header<TFeatures, TData, TValue> &
                        THeaderComponents & { FlexRender: () => ReactNode },
                      state: TAppFooterSelected,
                    ) => ReactNode
                  )(extendedHeader, state)
                }
              </table.Subscribe>
            ) : (
              (
                children as (
                  header: Header<TFeatures, TData, TValue> &
                    THeaderComponents & { FlexRender: () => ReactNode },
                ) => ReactNode
              )(extendedHeader)
            )}
          </HeaderContext.Provider>
        )
      }
      return AppFooterImpl as AppHeaderComponent<
        TFeatures,
        TData,
        THeaderComponents
      >
    }, [table])

    // Combine everything into the extended table API
    const extendedTable = useMemo(() => {
      return Object.assign(table, {
        AppTable,
        AppCell,
        AppHeader,
        AppFooter,
        ...tableComponents,
      }) as AppReactTable<
        TFeatures,
        TData,
        TSelected,
        TTableComponents,
        TCellComponents,
        THeaderComponents
      >
    }, [table, AppTable, AppCell, AppHeader, AppFooter])

    return extendedTable
  }

  return {
    appFeatures: defaultTableOptions._features as TFeatures,
    createAppColumnHelper,
    useAppTable,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}

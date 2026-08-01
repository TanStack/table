'use client'
import { createContext } from 'preact'
import { useContext, useState } from 'preact/hooks'
import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { useSignalTable } from './useSignalTable'
import { FlexRender } from './FlexRender'
import type {
  Cell,
  CellData,
  Header,
  NoInfer,
  RowData,
  TableFeatures,
  TableOptions,
} from '@tanstack/table-core'
import type { ComponentChildren, ComponentType, Context } from 'preact'
import type { AppColumnHelper } from './createTableHook'
import type { PreactSignalTable } from './useSignalTable'

const sharedTableContext = createContext<PreactSignalTable<any, any> | null>(
  null,
)
const sharedCellContext = createContext<Cell<any, any, any> | null>(null)
const sharedHeaderContext = createContext<Header<any, any, any> | null>(null)

// =============================================================================
// CreateSignalTableHook Options and Props
// =============================================================================

/**
 * Options for creating a signal table hook with pre-bound components and
 * default table options. Extends all TableOptions except
 * 'columns' | 'data' | 'store' | 'state' | 'initialState'.
 */
export type CreateSignalTableHookOptions<
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
  /**
   * A custom Preact context for the table instance (read with `useContext`
   * inside your `tableComponents`). Optional: defaults to a shared
   * module-scoped context. Only pass your own (created via `createContext`)
   * when you need to isolate this table's context from other tables, e.g. when
   * nesting one table inside another.
   */
  tableContext?: Context<PreactSignalTable<any, any>>
  /**
   * A custom Preact context for the cell instance, used inside your `cellComponents`.
   * @see {@link CreateSignalTableHookOptions.tableContext}
   */
  cellContext?: Context<Cell<any, any, any>>
  /**
   * A custom Preact context for the header instance, used inside your
   * `headerComponents` (and footer components).
   * @see {@link CreateSignalTableHookOptions.tableContext}
   */
  headerContext?: Context<Header<any, any, any>>
}

/**
 * Props for AppCell. There is no selector variant: signal reads inside
 * `children` happen during AppCell's render, so the boundary already
 * subscribes to exactly what it reads.
 */
export interface AppSignalCellProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  TCellComponents extends Record<string, ComponentType<any>>,
> {
  cell: Cell<TFeatures, TData, TValue>
  children: (
    cell: Cell<TFeatures, TData, TValue> &
      TCellComponents & { FlexRender: () => ComponentChildren },
  ) => ComponentChildren
}

/**
 * Props for AppHeader/AppFooter. No selector variant; see
 * {@link AppSignalCellProps}.
 */
export interface AppSignalHeaderProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData,
  THeaderComponents extends Record<string, ComponentType<any>>,
> {
  header: Header<TFeatures, TData, TValue>
  children: (
    header: Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => ComponentChildren },
  ) => ComponentChildren
}

/**
 * Extended table API returned by useAppTable with all App wrapper components.
 */
export type AppPreactSignalTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = PreactSignalTable<TFeatures, TData> &
  NoInfer<TTableComponents> & {
    /**
     * Root wrapper component that provides the table context to
     * `tableComponents` and the `use*Context` hooks.
     * @example
     * ```tsx
     * <table.AppTable>
     *   <table>...</table>
     *   <table.PaginationControls />
     * </table.AppTable>
     * ```
     */
    AppTable: (props: { children: ComponentChildren }) => ComponentChildren
    /**
     * Wraps a cell and provides cell context with pre-bound cellComponents.
     * Signal reads inside `children` subscribe this boundary, not its parent.
     * @example
     * ```tsx
     * <table.AppCell cell={cell}>
     *   {(c) => <td><c.TextCell /></td>}
     * </table.AppCell>
     * ```
     */
    AppCell: <TValue extends CellData = CellData>(
      props: AppSignalCellProps<
        TFeatures,
        TData,
        TValue,
        NoInfer<TCellComponents>
      >,
    ) => ComponentChildren
    /**
     * Wraps a header and provides header context with pre-bound headerComponents.
     * @example
     * ```tsx
     * <table.AppHeader header={header}>
     *   {(h) => <th><h.FlexRender /><h.SortIndicator /></th>}
     * </table.AppHeader>
     * ```
     */
    AppHeader: <TValue extends CellData = CellData>(
      props: AppSignalHeaderProps<
        TFeatures,
        TData,
        TValue,
        NoInfer<THeaderComponents>
      >,
    ) => ComponentChildren
    /**
     * Wraps a footer and provides header context with pre-bound headerComponents.
     * @example
     * ```tsx
     * <table.AppFooter header={footer}>
     *   {(f) => <td><f.FlexRender /></td>}
     * </table.AppFooter>
     * ```
     */
    AppFooter: <TValue extends CellData = CellData>(
      props: AppSignalHeaderProps<
        TFeatures,
        TData,
        TValue,
        NoInfer<THeaderComponents>
      >,
    ) => ComponentChildren
  }

export interface CreateSignalTableHookResult<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> {
  /** The features object that was passed to `createSignalTableHook`. */
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
   * Creates a signal table with the `App*` wrapper components and registered
   * `tableComponents` attached. `TData` is inferred from the `data` option.
   * No selector argument: components subscribe by reading.
   */
  useAppTable: <TData extends RowData>(
    tableOptions: Omit<TableOptions<TFeatures, TData>, 'features'>,
  ) => AppPreactSignalTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >
  /**
   * Reads the table provided by the nearest `<table.AppTable>`. This is the
   * same extended instance `useAppTable` returns, so the `App*` components and
   * your `tableComponents` are available on it. Table API calls made during
   * render subscribe the calling component to the state they read.
   */
  useTableContext: <TData extends RowData = RowData>() => AppPreactSignalTable<
    TFeatures,
    TData,
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
    TCellComponents & { FlexRender: () => ComponentChildren }
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
    THeaderComponents & { FlexRender: () => ComponentChildren }
}

/**
 * Creates a custom signal table hook with pre-bound components for
 * composition: the signals counterpart of `createTableHook`.
 *
 * The moving parts are the same (shared features and default options,
 * registered table/cell/header components, context hooks, a pre-bound column
 * helper), but there are no selectors and no Subscribe anywhere: every
 * component subscribes automatically to the state it reads during render, and
 * the `App*` wrappers double as re-render boundaries.
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
 * } = createSignalTableHook({
 *   features: tableFeatures({
 *     rowPaginationFeature,
 *     rowSortingFeature,
 *     paginatedRowModel: createPaginatedRowModel(),
 *     sortedRowModel: createSortedRowModel(),
 *     sortFns,
 *   }),
 *   tableComponents: { PaginationControls },
 *   cellComponents: { TextCell },
 *   headerComponents: { SortIndicator },
 * })
 *
 * // components/table-components.tsx
 * function PaginationControls() {
 *   const table = useTableContext()
 *   // Reading getPageCount() here subscribes just this component.
 *   return <span>Page count: {table.getPageCount()}</span>
 * }
 *
 * // features/users.tsx
 * function UsersTable({ data }: { data: Person[] }) {
 *   const table = useAppTable({ columns, data })
 *
 *   return (
 *     <table.AppTable>
 *       <table>...</table>
 *       <table.PaginationControls />
 *     </table.AppTable>
 *   )
 * }
 * ```
 */
export function createSignalTableHook<
  TFeatures extends TableFeatures,
  const TTableComponents extends Record<string, ComponentType<any>>,
  const TCellComponents extends Record<string, ComponentType<any>>,
  const THeaderComponents extends Record<string, ComponentType<any>>,
>({
  tableComponents,
  cellComponents,
  headerComponents,
  tableContext = sharedTableContext as Context<PreactSignalTable<any, any>>,
  cellContext = sharedCellContext as Context<Cell<any, any, any>>,
  headerContext = sharedHeaderContext as Context<Header<any, any, any>>,
  ...defaultTableOptions
}: CreateSignalTableHookOptions<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
>): CreateSignalTableHookResult<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
> {
  // Re-narrow the (loosely typed) incoming contexts to this hook's TFeatures.
  // The contexts themselves are never created here; see the module-scoped
  // singletons above for why.
  const TableContext = tableContext as unknown as Context<
    PreactSignalTable<TFeatures, any>
  >
  const CellContext = cellContext as unknown as Context<
    Cell<TFeatures, any, any>
  >
  const HeaderContext = headerContext as unknown as Context<
    Header<TFeatures, any, any>
  >

  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  > {
    // The runtime implementation is the same - components are attached at
    // render time. This cast provides the enhanced types for column definitions.
    return coreCreateColumnHelper<TFeatures, TData>() as AppColumnHelper<
      TFeatures,
      TData,
      TCellComponents,
      THeaderComponents
    >
  }

  function useTableContext<
    TData extends RowData = RowData,
  >(): AppPreactSignalTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    const table = useContext(TableContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    // The value provided by `<table.AppTable>` is the extended table (the App*
    // wrapper components and `tableComponents` are Object.assign-ed onto the
    // same instance `useAppTable` returns), so this asserts the runtime shape.
    return table as unknown as AppPreactSignalTable<
      TFeatures,
      TData,
      TTableComponents,
      TCellComponents,
      THeaderComponents
    >
  }

  function useCellContext<TValue extends CellData = CellData>() {
    const cell = useContext(CellContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!cell) {
      throw new Error(
        '`useCellContext` must be used within an `AppCell` component. ' +
          'Make sure your component is wrapped with `<table.AppCell cell={cell}>...</table.AppCell>`.',
      )
    }

    // `<table.AppCell>` Object.assign-es `cellComponents` and `FlexRender` onto
    // the same cell instance it provides, so this asserts the runtime shape.
    return cell as unknown as Cell<TFeatures, any, TValue> &
      TCellComponents & { FlexRender: () => ComponentChildren }
  }

  function useHeaderContext<TValue extends CellData = CellData>() {
    const header = useContext(HeaderContext)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    // `<table.AppHeader>` / `<table.AppFooter>` Object.assign `headerComponents`
    // and `FlexRender` onto the same header instance they provide.
    return header as unknown as Header<TFeatures, any, TValue> &
      THeaderComponents & { FlexRender: () => ComponentChildren }
  }

  /** Context-aware FlexRender for cells; reads the cell from context. */
  function CellFlexRender() {
    const cell = useCellContext()
    return <FlexRender cell={cell} />
  }

  /** Context-aware FlexRender for headers; reads the header from context. */
  function HeaderFlexRender() {
    const header = useHeaderContext()
    return <FlexRender header={header} />
  }

  /** Context-aware FlexRender for footers; reads the header from context. */
  function FooterFlexRender() {
    const header = useHeaderContext()
    return <FlexRender footer={header} />
  }

  // The cell/header/footer wrappers close over the component maps and contexts
  // only, so a single instance of each is shared by every table this hook
  // creates. Each is a real component: signal reads inside `children` subscribe
  // the wrapper, not the component that rendered it.
  function AppCell<TData extends RowData, TValue extends CellData = CellData>(
    props: AppSignalCellProps<TFeatures, TData, TValue, TCellComponents>,
  ): ComponentChildren {
    // The spread of a possibly-undefined component map widens the type, so
    // assert the runtime shape the same way the render-model hook does.
    const extendedCell = Object.assign(props.cell, {
      FlexRender: CellFlexRender,
      ...cellComponents,
    }) as Cell<TFeatures, TData, TValue> &
      TCellComponents & { FlexRender: () => ComponentChildren }

    return (
      <CellContext.Provider value={props.cell}>
        {props.children(extendedCell)}
      </CellContext.Provider>
    )
  }

  function AppHeader<TData extends RowData, TValue extends CellData = CellData>(
    props: AppSignalHeaderProps<TFeatures, TData, TValue, THeaderComponents>,
  ): ComponentChildren {
    const extendedHeader = Object.assign(props.header, {
      FlexRender: HeaderFlexRender,
      ...headerComponents,
    }) as Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => ComponentChildren }

    return (
      <HeaderContext.Provider value={props.header}>
        {props.children(extendedHeader)}
      </HeaderContext.Provider>
    )
  }

  function AppFooter<TData extends RowData, TValue extends CellData = CellData>(
    props: AppSignalHeaderProps<TFeatures, TData, TValue, THeaderComponents>,
  ): ComponentChildren {
    const extendedHeader = Object.assign(props.header, {
      FlexRender: FooterFlexRender,
      ...headerComponents,
    }) as Header<TFeatures, TData, TValue> &
      THeaderComponents & { FlexRender: () => ComponentChildren }

    return (
      <HeaderContext.Provider value={props.header}>
        {props.children(extendedHeader)}
      </HeaderContext.Provider>
    )
  }

  /**
   * Enhanced useSignalTable hook that returns a table with App wrapper
   * components and pre-bound tableComponents attached directly to the table
   * object. Default options from createSignalTableHook are merged with the
   * options passed here (which take precedence).
   */
  function useAppTable<TData extends RowData>(
    tableOptions: Omit<TableOptions<TFeatures, TData>, 'features'>,
  ): AppPreactSignalTable<
    TFeatures,
    TData,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    const table = useSignalTable<TFeatures, TData>({
      ...defaultTableOptions,
      ...tableOptions,
    } as TableOptions<TFeatures, TData>)

    // `useSignalTable` returns a stable instance, so the extension runs once
    // and the wrapper components never change identity (no remount churn).
    const [extendedTable] = useState(() => {
      const extended = Object.assign(table, {
        AppCell,
        AppHeader,
        AppFooter,
        ...tableComponents,
      }) as AppPreactSignalTable<
        TFeatures,
        TData,
        TTableComponents,
        TCellComponents,
        THeaderComponents
      >

      extended.AppTable = function AppTable(props: {
        children: ComponentChildren
      }) {
        return (
          <TableContext.Provider value={extended}>
            {props.children}
          </TableContext.Provider>
        )
      }

      return extended
    })

    return extendedTable
  }

  return {
    appFeatures: defaultTableOptions.features,
    createAppColumnHelper,
    useAppTable,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}

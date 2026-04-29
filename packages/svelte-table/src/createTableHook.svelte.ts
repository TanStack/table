import { getContext, setContext } from 'svelte'
import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { createTable } from './createTable.svelte'
import { mergeObjects } from './merge-objects'
import {
  cellContextKey,
  headerContextKey,
  tableContextKey,
} from './context-keys.js'
import AppTableSvelte from './AppTable.svelte'
import AppCellSvelte from './AppCell.svelte'
import AppHeaderSvelte from './AppHeader.svelte'
import FlexRenderSvelte from './FlexRender.svelte'
import type { SvelteTable } from './createTable.svelte'
import type { Component, Snippet } from 'svelte'
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
    TCellComponents & { FlexRender: typeof FlexRenderSvelte }
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
    THeaderComponents & { FlexRender: typeof FlexRenderSvelte }
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
// CreateTableHook Options
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

// =============================================================================
// Extended Table Type
// =============================================================================

/**
 * Extended table API returned by createAppTable with all App wrapper components.
 */
export type AppSvelteTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = SvelteTable<TFeatures, TData, TSelected> &
  NoInfer<TTableComponents> & {
    /**
     * Root wrapper component that provides table context.
     * @example
     * ```svelte
     * <table.AppTable>
     *   <table>...</table>
     * </table.AppTable>
     * ```
     */
    AppTable: Component<{ children: Snippet }>
    /**
     * Wraps a cell and provides cell context with pre-bound cellComponents.
     * @example
     * ```svelte
     * <table.AppCell cell={cell}>
     *   {#snippet children(c)}
     *     <td><c.TextCell /></td>
     *   {/snippet}
     * </table.AppCell>
     * ```
     */
    AppCell: Component<{
      cell: Cell<TFeatures, TData, any>
      children: Snippet<
        [
          Cell<TFeatures, TData, any> &
            NoInfer<TCellComponents> & { FlexRender: typeof FlexRenderSvelte },
        ]
      >
    }>
    /**
     * Wraps a header and provides header context with pre-bound headerComponents.
     * @example
     * ```svelte
     * <table.AppHeader header={header}>
     *   {#snippet children(h)}
     *     <th><h.SortIndicator /></th>
     *   {/snippet}
     * </table.AppHeader>
     * ```
     */
    AppHeader: Component<{
      header: Header<TFeatures, TData, any>
      children: Snippet<
        [
          Header<TFeatures, TData, any> &
            NoInfer<THeaderComponents> & {
              FlexRender: typeof FlexRenderSvelte
            },
        ]
      >
    }>
    /**
     * Wraps a footer and provides header context with pre-bound headerComponents.
     * @example
     * ```svelte
     * <table.AppFooter header={footer}>
     *   {#snippet children(f)}
     *     <td><f.FlexRender /></td>
     *   {/snippet}
     * </table.AppFooter>
     * ```
     */
    AppFooter: Component<{
      header: Header<TFeatures, TData, any>
      children: Snippet<
        [
          Header<TFeatures, TData, any> &
            NoInfer<THeaderComponents> & {
              FlexRender: typeof FlexRenderSvelte
            },
        ]
      >
    }>
    /**
     * Convenience FlexRender component attached to the table instance.
     */
    FlexRender: typeof FlexRenderSvelte
  }

// =============================================================================
// createTableHook Factory
// =============================================================================

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
 * ```ts
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
  /**
   * Create a column helper pre-bound to the features and components configured in this table hook.
   * The cell, header, and footer contexts include pre-bound components (e.g., `cell.TextCell`).
   */
  function createAppColumnHelper<TData extends RowData>(): AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  > {
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
   */
  function useTableContext<TData extends RowData = RowData>(): SvelteTable<
    TFeatures,
    TData
  > {
    const table = getContext(tableContextKey)

    if (!table) {
      throw new Error(
        '`useTableContext` must be used within an `AppTable` component. ' +
          'Make sure your component is wrapped with `<table.AppTable>...</table.AppTable>`.',
      )
    }

    return table as SvelteTable<TFeatures, TData>
  }

  /**
   * Access the cell instance from within an `AppCell` wrapper.
   * Use this in custom `cellComponents` passed to `createTableHook`.
   * TFeatures is already known from the createTableHook call.
   */
  function useCellContext<TValue extends CellData = CellData>(): Cell<
    TFeatures,
    any,
    TValue
  > {
    const cell = getContext(cellContextKey)

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
   */
  function useHeaderContext<TValue extends CellData = CellData>(): Header<
    TFeatures,
    any,
    TValue
  > {
    const header = getContext(headerContextKey)

    if (!header) {
      throw new Error(
        '`useHeaderContext` must be used within an `AppHeader` or `AppFooter` component.',
      )
    }

    return header as Header<TFeatures, any, TValue>
  }

  /**
   * Enhanced createTable hook that returns a table with App wrapper components
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
  ): AppSvelteTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    // Merge default options with provided options (provided takes precedence)
    const mergedTableOptions = mergeObjects(
      defaultTableOptions,
      tableOptions,
    ) as TableOptions<TFeatures, TData>

    const table = createTable<TFeatures, TData, TSelected>(
      mergedTableOptions,
      selector,
    )

    // Build cellComponents with FlexRender included
    const cellComponentsWithFlexRender = {
      FlexRender: FlexRenderSvelte,
      ...(cellComponents ?? {}),
    }

    // Build headerComponents with FlexRender included
    const headerComponentsWithFlexRender = {
      FlexRender: FlexRenderSvelte,
      ...(headerComponents ?? {}),
    }

    // Create wrapper components using the svelte-form (internal, props) => pattern.
    // setContext is called in the closure — this runs during component
    // initialization, so Svelte's context API works correctly.
    // With keyed {#each} blocks, components are recreated on reorder,
    // so context is always fresh.
    const AppTable = ((internal: any, props: any) => {
      setContext(tableContextKey, table)
      return AppTableSvelte(internal, { ...props })
    }) as Component<{ children: Snippet }>

    const AppCell = ((internal: any, { children, cell, ...rest }: any) => {
      setContext(cellContextKey, cell)
      return AppCellSvelte(internal, {
        cell,
        cellComponents: cellComponentsWithFlexRender,
        children,
      })
    }) as Component<{
      cell: Cell<TFeatures, TData, any>
      children: Snippet<[any]>
    }>

    const AppHeader = ((internal: any, { children, header, ...rest }: any) => {
      setContext(headerContextKey, header)
      return AppHeaderSvelte(internal, {
        header,
        headerComponents: headerComponentsWithFlexRender,
        children,
      })
    }) as Component<{
      header: Header<TFeatures, TData, any>
      children: Snippet<[any]>
    }>

    // AppFooter reuses AppHeaderSvelte (footers use Header type in table-core)
    const AppFooter = ((internal: any, { children, header, ...rest }: any) => {
      setContext(headerContextKey, header)
      return AppHeaderSvelte(internal, {
        header,
        headerComponents: headerComponentsWithFlexRender,
        children,
      })
    }) as Component<{
      header: Header<TFeatures, TData, any>
      children: Snippet<[any]>
    }>

    // Combine everything into the extended table API
    return Object.assign(table, {
      AppTable,
      AppCell,
      AppHeader,
      AppFooter,
      FlexRender: FlexRenderSvelte,
      ...(tableComponents ?? {}),
    }) as AppSvelteTable<
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
    createAppTable,
    useTableContext,
    useCellContext,
    useHeaderContext,
  }
}

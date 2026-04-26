import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { ContextConsumer, ContextProvider, createContext } from '@lit/context'
import { FlexRender, flexRender } from './flexRender'
import { TableController } from './TableController'
import type { Context } from '@lit/context'
import type { LitTable } from './TableController'
import type { ReactiveControllerHost, TemplateResult } from 'lit'
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

type ComponentType<T extends Record<string, any>> = (props: T) => any

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
    TCellComponents & {
      FlexRender: () => TemplateResult | string | null
    }
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
    THeaderComponents & {
      FlexRender: () => TemplateResult | string | null
    }
  table: Table<TFeatures, TData>
}

// =============================================================================
// Enhanced Column Definition Types
// =============================================================================

/**
 * Template type for column definitions that can be a string or a function.
 */
type AppColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

/**
 * Enhanced column definition base with pre-bound components in cell/header/footer contexts.
 */
type AppColumnDefBase<
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
type AppDisplayColumnDef<
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
type AppGroupColumnDef<
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
 * Extended table API returned by useAppTable with all App wrapper functions
 */
export type AppLitTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, ComponentType<any>>,
  TCellComponents extends Record<string, ComponentType<any>>,
  THeaderComponents extends Record<string, ComponentType<any>>,
> = LitTable<TFeatures, TData, TSelected> &
  NoInfer<TTableComponents> & {
    /**
     * Wraps a cell and provides cell context with pre-bound cellComponents.
     * @example
     * ```ts
     * ${table.AppCell(cell, (c) => html`<td>${c.FlexRender()}</td>`)}
     * ```
     */
    AppCell: <TValue extends CellData = CellData>(
      cell: Cell<TFeatures, TData, TValue>,
      renderFn: (
        cell: Cell<TFeatures, TData, TValue> &
          TCellComponents & {
            FlexRender: () => TemplateResult | string | null
          },
      ) => TemplateResult | string,
    ) => TemplateResult | string
    /**
     * Wraps a header and provides header context with pre-bound headerComponents.
     * @example
     * ```ts
     * ${table.AppHeader(header, (h) => html`<th>${h.FlexRender()}</th>`)}
     * ```
     */
    AppHeader: <TValue extends CellData = CellData>(
      header: Header<TFeatures, TData, TValue>,
      renderFn: (
        header: Header<TFeatures, TData, TValue> &
          THeaderComponents & {
            FlexRender: () => TemplateResult | string | null
          },
      ) => TemplateResult | string,
    ) => TemplateResult | string
    /**
     * Wraps a footer and provides header context with pre-bound headerComponents.
     * @example
     * ```ts
     * ${table.AppFooter(footer, (f) => html`<td>${f.FlexRender()}</td>`)}
     * ```
     */
    AppFooter: <TValue extends CellData = CellData>(
      header: Header<TFeatures, TData, TValue>,
      renderFn: (
        header: Header<TFeatures, TData, TValue> &
          THeaderComponents & {
            FlexRender: () => TemplateResult | string | null
          },
      ) => TemplateResult | string,
    ) => TemplateResult | string
    /**
     * Convenience FlexRender function attached to the table instance.
     * Renders cell, header, or footer content from column definitions.
     * @example
     * ```ts
     * ${table.FlexRender({ header })}
     * ${table.FlexRender({ cell })}
     * ${table.FlexRender({ footer: header })}
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
 * - Access table/cell/header instances via `@lit/context` in those components
 * - Get a `useAppTable` hook that returns an extended table with App wrapper functions
 * - Get a `createAppColumnHelper` function pre-bound to your features
 *
 * @example
 * ```ts
 * // hooks/table.ts
 * export const {
 *   createAppColumnHelper,
 *   useAppTable,
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
 * // my-table.ts
 * @customElement('my-table')
 * class MyTable extends LitElement {
 *   private appTable = useAppTable(this, {
 *     columns,
 *     data: this.data,
 *   })
 *
 *   protected render() {
 *     const table = this.appTable.table()
 *
 *     return html`
 *       <table>
 *         <thead>
 *           ${repeat(table.getHeaderGroups(), (hg) => hg.id, (hg) => html`
 *             <tr>
 *               ${hg.headers.map((h) => table.AppHeader(h, (header) => html`
 *                 <th>${header.FlexRender()}</th>
 *               `))}
 *             </tr>
 *           `)}
 *         </thead>
 *         <tbody>
 *           ${table.getRowModel().rows.map((row) => html`
 *             <tr>
 *               ${row.getAllCells().map((c) => table.AppCell(c, (cell) => html`
 *                 <td>${cell.FlexRender()}</td>
 *               `))}
 *             </tr>
 *           `)}
 *         </tbody>
 *       </table>
 *     `
 *   }
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
  // Create context keys for @lit/context
  const tableContext = createContext<LitTable<TFeatures, any, any>>(
    Symbol('tanstack-table'),
  )
  const cellContext = createContext<Cell<TFeatures, any, any>>(
    Symbol('tanstack-cell'),
  )
  const headerContext = createContext<Header<TFeatures, any, any>>(
    Symbol('tanstack-header'),
  )

  /**
   * Create a column helper pre-bound to the features and components configured in this table hook.
   * The cell, header, and footer contexts include pre-bound components (e.g., `cell.TextCell`).
   * @example
   * ```ts
   * const columnHelper = createAppColumnHelper<Person>()
   *
   * const columns = [
   *   columnHelper.accessor('firstName', {
   *     header: 'First Name',
   *     cell: ({ cell }) => cell.FlexRender(), // cell has pre-bound components!
   *   }),
   *   columnHelper.accessor('age', {
   *     header: 'Age',
   *     cell: ({ cell }) => cell.NumberCell(),
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
   * Access the table instance from within a custom element that is a descendant
   * of the element using `useAppTable`.
   * Uses `@lit/context` ContextConsumer to retrieve the table from the nearest ancestor provider.
   * TFeatures is already known from the createTableHook call.
   *
   * @example
   * ```ts
   * @customElement('pagination-controls')
   * class PaginationControls extends LitElement {
   *   private _table = useTableContext(this)
   *
   *   protected render() {
   *     const table = this._table.value
   *     if (!table) return html``
   *     return html`
   *       <button @click=${() => table.previousPage()}>Prev</button>
   *       <button @click=${() => table.nextPage()}>Next</button>
   *     `
   *   }
   * }
   * ```
   */
  function useTableContext<TData extends RowData = RowData>(
    host: ReactiveControllerHost & HTMLElement,
  ): ContextConsumer<
    Context<symbol, LitTable<TFeatures, TData, any>>,
    ReactiveControllerHost & HTMLElement
  > {
    return new ContextConsumer(host, {
      context: tableContext,
      subscribe: true,
    })
  }

  /**
   * Access the cell instance from within a custom element that is a descendant
   * of an element providing cell context.
   * Uses `@lit/context` ContextConsumer to retrieve the cell.
   * TFeatures is already known from the createTableHook call.
   *
   * @example
   * ```ts
   * @customElement('text-cell')
   * class TextCell extends LitElement {
   *   private _cell = useCellContext(this)
   *
   *   protected render() {
   *     const cell = this._cell.value
   *     if (!cell) return html``
   *     return html`<span>${cell.getValue()}</span>`
   *   }
   * }
   * ```
   */
  function useCellContext<TValue extends CellData = CellData>(
    host: ReactiveControllerHost & HTMLElement,
  ): ContextConsumer<
    Context<symbol, Cell<TFeatures, any, TValue>>,
    ReactiveControllerHost & HTMLElement
  > {
    return new ContextConsumer(host, {
      context: cellContext,
      subscribe: true,
    })
  }

  /**
   * Access the header instance from within a custom element that is a descendant
   * of an element providing header context.
   * Uses `@lit/context` ContextConsumer to retrieve the header.
   * TFeatures is already known from the createTableHook call.
   *
   * @example
   * ```ts
   * @customElement('sort-indicator')
   * class SortIndicator extends LitElement {
   *   private _header = useHeaderContext(this)
   *
   *   protected render() {
   *     const header = this._header.value
   *     if (!header) return html``
   *     const sorted = header.column.getIsSorted()
   *     return html`${sorted === 'asc' ? '🔼' : sorted === 'desc' ? '🔽' : ''}`
   *   }
   * }
   * ```
   */
  function useHeaderContext<TValue extends CellData = CellData>(
    host: ReactiveControllerHost & HTMLElement,
  ): ContextConsumer<
    Context<symbol, Header<TFeatures, any, TValue>>,
    ReactiveControllerHost & HTMLElement
  > {
    return new ContextConsumer(host, {
      context: headerContext,
      subscribe: true,
    })
  }

  /**
   * Enhanced table hook that returns a controller-like object with a `table()` method.
   * The returned table has App wrapper functions and pre-bound tableComponents
   * attached directly to the table object.
   *
   * Default options from createTableHook are automatically merged with
   * the options passed here. Options passed here take precedence.
   *
   * TFeatures is already known from the createTableHook call; TData is inferred from the data prop.
   *
   * @example
   * ```ts
   * @customElement('my-table')
   * class MyTable extends LitElement {
   *   private appTable = useAppTable(this, {
   *     columns,
   *     data: this.data,
   *   })
   *
   *   protected render() {
   *     const table = this.appTable.table()
   *     return html`...`
   *   }
   * }
   * ```
   */
  function useAppTable<TData extends RowData, TSelected = {}>(
    host: ReactiveControllerHost & HTMLElement,
    tableOptions: Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): {
    table: () => AppLitTable<
      TFeatures,
      TData,
      TSelected,
      TTableComponents,
      TCellComponents,
      THeaderComponents
    >
  } {
    const controller = new TableController<TFeatures, TData>(host)
    const provider = new ContextProvider(host, { context: tableContext })

    return {
      table(): AppLitTable<
        TFeatures,
        TData,
        TSelected,
        TTableComponents,
        TCellComponents,
        THeaderComponents
      > {
        // Merge default options with provided options (provided takes precedence)
        const mergedOptions = {
          ...defaultTableOptions,
          ...tableOptions,
        } as TableOptions<TFeatures, TData>

        const table = controller.table(mergedOptions, selector)

        // Update context provider with current table
        provider.setValue(table)

        // AppCell - Wraps cell with pre-bound cellComponents
        function AppCell<TValue extends CellData = CellData>(
          cell: Cell<TFeatures, TData, TValue>,
          renderFn: (
            cell: Cell<TFeatures, TData, TValue> &
              TCellComponents & {
                FlexRender: () => TemplateResult | string | null
              },
          ) => TemplateResult | string,
        ): TemplateResult | string {
          const cellFlexRender = () =>
            flexRender(cell.column.columnDef.cell, cell.getContext())

          // Bind each cell component so it receives the cell as its first argument.
          // This allows column defs to call `cell.TextCell()` which internally
          // invokes `TextCell(cellInstance)`.
          const boundCellComponents: Record<string, () => any> = {}
          for (const [key, fn] of Object.entries(cellComponents ?? {})) {
            boundCellComponents[key] = () => (fn as Function)(cell)
          }

          const extendedCell = Object.assign(cell, {
            FlexRender: cellFlexRender,
            ...boundCellComponents,
          }) as Cell<TFeatures, TData, TValue> &
            TCellComponents & {
              FlexRender: () => TemplateResult | string | null
            }

          return renderFn(extendedCell)
        }

        // AppHeader - Wraps header with pre-bound headerComponents
        function AppHeader<TValue extends CellData = CellData>(
          header: Header<TFeatures, TData, TValue>,
          renderFn: (
            header: Header<TFeatures, TData, TValue> &
              THeaderComponents & {
                FlexRender: () => TemplateResult | string | null
              },
          ) => TemplateResult | string,
        ): TemplateResult | string {
          const headerFlexRender = () =>
            flexRender(header.column.columnDef.header, header.getContext())

          // Bind each header component so it receives the header as its first argument.
          const boundHeaderComponents: Record<string, () => any> = {}
          for (const [key, fn] of Object.entries(headerComponents ?? {})) {
            boundHeaderComponents[key] = () => (fn as Function)(header)
          }

          const extendedHeader = Object.assign(header, {
            FlexRender: headerFlexRender,
            ...boundHeaderComponents,
          }) as Header<TFeatures, TData, TValue> &
            THeaderComponents & {
              FlexRender: () => TemplateResult | string | null
            }

          return renderFn(extendedHeader)
        }

        // AppFooter - Same as AppHeader but uses footer column def
        function AppFooter<TValue extends CellData = CellData>(
          header: Header<TFeatures, TData, TValue>,
          renderFn: (
            header: Header<TFeatures, TData, TValue> &
              THeaderComponents & {
                FlexRender: () => TemplateResult | string | null
              },
          ) => TemplateResult | string,
        ): TemplateResult | string {
          const footerFlexRender = () =>
            flexRender(header.column.columnDef.footer, header.getContext())

          // Bind each header component so it receives the header as its first argument.
          const boundFooterComponents: Record<string, () => any> = {}
          for (const [key, fn] of Object.entries(headerComponents ?? {})) {
            boundFooterComponents[key] = () => (fn as Function)(header)
          }

          const extendedHeader = Object.assign(header, {
            FlexRender: footerFlexRender,
            ...boundFooterComponents,
          }) as Header<TFeatures, TData, TValue> &
            THeaderComponents & {
              FlexRender: () => TemplateResult | string | null
            }

          return renderFn(extendedHeader)
        }

        // Combine everything into the extended table API
        return Object.assign(table, {
          AppCell,
          AppHeader,
          AppFooter,
          FlexRender,
          ...(tableComponents ?? {}),
        }) as AppLitTable<
          TFeatures,
          TData,
          TSelected,
          TTableComponents,
          TCellComponents,
          THeaderComponents
        >
      },
    }
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

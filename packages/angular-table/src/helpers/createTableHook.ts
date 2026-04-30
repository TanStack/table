import { createColumnHelper as coreCreateColumnHelper } from '@tanstack/table-core'
import { injectTable } from '../injectTable'
import { injectFlexRenderContext } from '../flexRender'
import { injectTableHeaderContext as _injectTableHeaderContext } from './header'
import { injectTableContext as _injectTableContext } from './table'
import { injectTableCellContext as _injectTableCellContext } from './cell'
import type { FlexRenderContent } from '../flexRender'
import type { AngularTable } from '../injectTable'
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
  HeaderContext,
  IdentifiedColumnDef,
  Row,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
  TableOptions,
  TableState,
} from '@tanstack/table-core'
import type { Signal, Type } from '@angular/core'

export type RenderableComponent =
  | Type<any>
  | (<T extends NonNullable<unknown>>(props: T) => FlexRenderContent<T>)

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
  TCellComponents extends Record<string, RenderableComponent>,
> = {
  cell: Cell<TFeatures, TData, TValue> &
    TCellComponents & { FlexRender: () => unknown }
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
  THeaderComponents extends Record<string, RenderableComponent>,
> = {
  column: Column<TFeatures, TData, TValue>
  header: Header<TFeatures, TData, TValue> &
    THeaderComponents & { FlexRender: () => unknown }
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
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
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
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
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
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
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
  columns?: ReadonlyArray<ColumnDef<TFeatures, TData, unknown>>
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
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
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

/**
 * Extended table API returned by useAppTable with all App wrapper components
 */
export type AppAngularTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected,
  TTableComponents extends Record<string, RenderableComponent>,
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
> = AngularTable<TFeatures, TData, TSelected> &
  NoInfer<TTableComponents> & {
    appCell: <TValue>(
      cell: Cell<TFeatures, TData, TValue>,
    ) => Cell<TFeatures, TData, TValue> & NoInfer<TCellComponents>

    appHeader: <TValue>(
      header: Header<TFeatures, TData, TValue>,
    ) => Header<TFeatures, TData, TValue> & NoInfer<THeaderComponents>

    appFooter: <TValue>(
      footer: Header<TFeatures, TData, TValue>,
    ) => Header<TFeatures, TData, TValue> & NoInfer<THeaderComponents>
  }

// =============================================================================
// CreateTableHook Options and Props
// =============================================================================

/**
 * Options for creating a table hook with pre-bound components and default table options.
 * Extends all TableOptions except 'columns' | 'data' | 'store' | 'state' | 'initialState'.
 */
export type CreateTableContextOptions<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, RenderableComponent>,
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
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

export type CreateTableHookResult<
  TFeatures extends TableFeatures,
  TTableComponents extends Record<string, RenderableComponent>,
  TCellComponents extends Record<string, RenderableComponent>,
  THeaderComponents extends Record<string, RenderableComponent>,
> = {
  createAppColumnHelper: <TData extends RowData>() => AppColumnHelper<
    TFeatures,
    TData,
    TCellComponents,
    THeaderComponents
  >
  injectTableContext: <TData extends RowData = RowData>() => Signal<
    AngularTable<TFeatures, TData>
  >
  injectTableHeaderContext: <
    TValue extends CellData = CellData,
    TRowData extends RowData = RowData,
  >() => Signal<Header<TFeatures, TRowData, TValue>>
  injectTableCellContext: <
    TValue extends CellData = CellData,
    TRowData extends RowData = RowData,
  >() => Signal<Cell<TFeatures, TRowData, TValue>>
  injectFlexRenderHeaderContext: <
    TData extends RowData,
    TValue extends CellData,
  >() => HeaderContext<TFeatures, TData, TValue>
  injectFlexRenderCellContext: <
    TData extends RowData,
    TValue extends CellData,
  >() => CellContext<TFeatures, TData, TValue>
  injectAppTable: <TData extends RowData, TSelected = TableState<TFeatures>>(
    tableOptions: () => Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ) => AppAngularTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  >
}

export function createTableHook<
  TFeatures extends TableFeatures,
  const TTableComponents extends Record<string, RenderableComponent>,
  const TCellComponents extends Record<string, RenderableComponent>,
  const THeaderComponents extends Record<string, RenderableComponent>,
>({
  tableComponents,
  cellComponents,
  headerComponents,
  ...defaultTableOptions
}: CreateTableContextOptions<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
>): CreateTableHookResult<
  TFeatures,
  TTableComponents,
  TCellComponents,
  THeaderComponents
> {
  function injectTableContext<TData extends RowData = RowData>(): Signal<
    AngularTable<TFeatures, TData>
  > {
    return _injectTableContext<TFeatures, TData>()
  }

  function injectTableHeaderContext<
    TValue extends CellData = CellData,
    TRowData extends RowData = RowData,
  >(): Signal<Header<TFeatures, TRowData, TValue>> {
    return _injectTableHeaderContext<TFeatures, TRowData, TValue>()
  }

  function injectTableCellContext<
    TValue extends CellData = CellData,
    TRowData extends RowData = RowData,
  >(): Signal<Cell<TFeatures, TRowData, TValue>> {
    return _injectTableCellContext<TFeatures, TRowData, TValue>()
  }

  function injectFlexRenderHeaderContext<
    TData extends RowData,
    TValue extends CellData,
  >(): HeaderContext<TFeatures, TData, TValue> {
    return injectFlexRenderContext<HeaderContext<TFeatures, TData, TValue>>()
  }

  function injectFlexRenderCellContext<
    TData extends RowData,
    TValue extends CellData,
  >(): CellContext<TFeatures, TData, TValue> {
    return injectFlexRenderContext<CellContext<TFeatures, TData, TValue>>()
  }

  function injectAppTable<TData extends RowData, TSelected = {}>(
    tableOptions: () => Omit<
      TableOptions<TFeatures, TData>,
      '_features' | '_rowModels'
    >,
    selector?: (state: TableState<TFeatures>) => TSelected,
  ): AppAngularTable<
    TFeatures,
    TData,
    TSelected,
    TTableComponents,
    TCellComponents,
    THeaderComponents
  > {
    function appCell(cell: Cell<TFeatures, TData, any>) {
      return cell as Cell<TFeatures, TData, any> & TCellComponents
    }

    function appHeader(header: Header<TFeatures, TData, any>) {
      return header as Header<TFeatures, TData, any> & THeaderComponents
    }

    function appFooter(footer: Header<TFeatures, TData, any>) {
      return footer as Header<TFeatures, TData, any> & THeaderComponents
    }

    const appTableFeatures: TableFeature<{}> = {
      constructTableAPIs: (table) => {
        Object.assign(table, tableComponents, { appCell, appHeader, appFooter })
      },
      assignCellPrototype(prototype) {
        Object.assign(prototype, cellComponents)
      },
      assignHeaderPrototype(prototype) {
        Object.assign(prototype, headerComponents)
      },
    }

    return injectTable<TFeatures, TData, TSelected>(() => {
      const options = {
        ...defaultTableOptions,
        ...tableOptions(),
      } as TableOptions<TFeatures, TData>
      options._features = { ...options._features, appTableFeatures }
      return options
    }, selector) as AngularTable<any, any>
  }

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

  return {
    createAppColumnHelper,
    injectTableContext,
    injectTableHeaderContext,
    injectTableCellContext,
    injectFlexRenderHeaderContext,
    injectFlexRenderCellContext,
    injectAppTable,
  }
}

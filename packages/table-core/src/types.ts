import { CoreOptions, CoreTableState, TableCore } from './core'
import { ColumnsOptions, CoreColumn, CoreColumnDef } from './features/Columns'
import {
  VisibilityInstance,
  VisibilityTableState,
  VisibilityColumn as ColumnVisibilityColumn,
  VisibilityOptions,
  VisibilityColumnDef,
  VisibilityRow,
} from './features/Visibility'
import {
  ColumnOrderInstance,
  ColumnOrderOptions,
  ColumnOrderTableState,
} from './features/Ordering'
import {
  ColumnPinningColumn,
  ColumnPinningColumnDef,
  ColumnPinningInstance,
  ColumnPinningOptions,
  ColumnPinningPosition,
  ColumnPinningRow,
  ColumnPinningTableState,
} from './features/Pinning'
import { HeadersInstance } from './features/Headers'
import {
  FiltersColumn,
  FiltersColumnDef,
  FiltersInstance,
  FiltersOptions,
  FiltersTableState,
} from './features/Filters'
import {
  SortingColumn,
  SortingColumnDef,
  SortingInstance,
  SortingOptions,
  SortingTableState,
} from './features/Sorting'
import {
  GroupingCell,
  GroupingColumn,
  GroupingColumnDef,
  GroupingInstance,
  GroupingOptions,
  GroupingRow,
  GroupingTableState,
} from './features/Grouping'
import {
  ExpandedInstance,
  ExpandedOptions,
  ExpandedTableState,
  ExpandedRow,
} from './features/Expanding'
import { Overwrite } from './utils'
import {
  ColumnSizingColumn,
  ColumnSizingColumnDef,
  ColumnSizingHeader,
  ColumnSizingInstance,
  ColumnSizingOptions,
  ColumnSizingTableState,
} from './features/ColumnSizing'
import {
  PaginationInstance,
  PaginationOptions,
  PaginationTableState,
} from './features/Pagination'
import {
  RowSelectionInstance,
  RowSelectionOptions,
  RowSelectionRow,
  RowSelectionTableState,
} from './features/RowSelection'
import { ColumnsInstance } from './features/Columns'
import { CellsInstance, CellsRow } from './features/Cells'
import { CoreRow, RowsInstance, RowsOptions } from './features/Rows'

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type TableGenerics = {
  Row?: any
  Value?: any
  FilterFns?: any
  SortingFns?: any
  AggregationFns?: any
  Renderer?: any
  Rendered?: any
  ColumnMeta?: any
  TableMeta?: any
}

export type AnyRender = (Comp: any, props: any) => any

export type TableFeature = {
  getDefaultOptions?: (instance: any) => any
  getInitialState?: () => any
  createInstance?: (instance: any) => any
  getDefaultColumn?: () => any
  createColumn?: (column: any, instance: any) => any
  createHeader?: (column: any, instance: any) => any
  createCell?: (cell: any, column: any, row: any, instance: any) => any
  createRow?: (row: any, instance: any) => any
}

export type TableInstance<TGenerics extends TableGenerics> =
  TableCore<TGenerics> &
    ColumnsInstance<TGenerics> &
    RowsInstance<TGenerics> &
    CellsInstance<TGenerics> &
    VisibilityInstance<TGenerics> &
    ColumnOrderInstance<TGenerics> &
    ColumnPinningInstance<TGenerics> &
    HeadersInstance<TGenerics> &
    FiltersInstance<TGenerics> &
    SortingInstance<TGenerics> &
    GroupingInstance<TGenerics> &
    ColumnSizingInstance<TGenerics> &
    ExpandedInstance<TGenerics> &
    PaginationInstance<TGenerics> &
    RowSelectionInstance<TGenerics>

export type TableOptions<TGenerics extends TableGenerics> =
  CoreOptions<TGenerics> &
    ColumnsOptions<TGenerics> &
    RowsOptions<TGenerics> &
    VisibilityOptions &
    ColumnOrderOptions &
    ColumnPinningOptions &
    FiltersOptions<TGenerics> &
    SortingOptions<TGenerics> &
    GroupingOptions<TGenerics> &
    ExpandedOptions<TGenerics> &
    ColumnSizingOptions &
    PaginationOptions<TGenerics> &
    RowSelectionOptions<TGenerics>

export type TableState = CoreTableState &
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState

export type Row<TGenerics extends TableGenerics> = CoreRow<TGenerics> &
  CellsRow<TGenerics> &
  VisibilityRow<TGenerics> &
  ColumnPinningRow<TGenerics> &
  GroupingRow &
  RowSelectionRow &
  ExpandedRow

export type RowValues = {
  [key: string]: any
}

export type RowModel<TGenerics extends TableGenerics> = {
  rows: Row<TGenerics>[]
  flatRows: Row<TGenerics>[]
  rowsById: Record<string, Row<TGenerics>>
}

export type AccessorFn<TData> = (originalRow: TData, index: number) => any

export type Renderable<TGenerics extends TableGenerics, TProps> =
  | string
  | ((props: TProps) => TGenerics['Rendered'])

export type ColumnDef<TGenerics extends TableGenerics> =
  CoreColumnDef<TGenerics> &
    VisibilityColumnDef &
    ColumnPinningColumnDef &
    FiltersColumnDef<TGenerics> &
    SortingColumnDef<TGenerics> &
    GroupingColumnDef<TGenerics> &
    ColumnSizingColumnDef

export type Column<TGenerics extends TableGenerics> = ColumnDef<TGenerics> &
  CoreColumn<TGenerics> &
  ColumnVisibilityColumn &
  ColumnPinningColumn &
  FiltersColumn<TGenerics> &
  SortingColumn<TGenerics> &
  GroupingColumn<TGenerics> &
  ColumnSizingColumn<TGenerics>

export type Cell<TGenerics extends TableGenerics> = CoreCell<TGenerics> &
  GroupingCell<TGenerics>

export type CoreCell<TGenerics extends TableGenerics> = {
  id: string
  rowId: string
  columnId: string
  value: TGenerics['Value']
  row: Row<TGenerics>
  column: Column<TGenerics>
  getCellProps: PropGetter<CellProps>
  renderCell: () => string | null | TGenerics['Rendered']
}

export type Header<TGenerics extends TableGenerics> = CoreHeader<TGenerics> &
  ColumnSizingHeader<TGenerics>

export type CoreHeader<TGenerics extends TableGenerics> = {
  id: string
  index: number
  depth: number
  column: Column<TGenerics>
  getStart: () => number
  getSize: () => number
  headerGroup: HeaderGroup<TGenerics>
  subHeaders: Header<TGenerics>[]
  colSpan?: number
  rowSpan?: number
  getHeaderProps: PropGetter<HeaderProps>
  getFooterProps: PropGetter<HeaderProps>
  getLeafHeaders: () => Header<TGenerics>[]
  isPlaceholder?: boolean
  placeholderId?: string
  renderHeader: (options?: {
    renderPlaceholder?: boolean
  }) => string | null | TGenerics['Rendered']
  renderFooter: (options?: {
    renderPlaceholder?: boolean
  }) => string | null | TGenerics['Rendered']
}

export type HeaderGroup<TGenerics extends TableGenerics> = {
  id: string
  depth: number
  headers: Header<TGenerics>[]
  getHeaderGroupProps: PropGetter<HeaderGroupProps>
  getFooterGroupProps: PropGetter<FooterGroupProps>
}

export type HeaderRenderProps<THeader> = {
  header: THeader
}

export type FooterRenderProps<THeader> = {
  header: THeader
}

export type CellRenderProps<TCell, TRow> = {
  cell: TCell
  row: TRow
}

export type TableProps = {
  role: string
}

export type TableBodyProps = {
  role: string
}

export type TableHeadProps = {
  key: string
  role: string
}

export type TableFooterProps = {
  key: string
  role: string
}

export type HeaderGroupProps = {
  key: string
  role: string
}

export type FooterGroupProps = {
  key: string
  role: string
}

export type HeaderProps = {
  key: string
  role: string
  colSpan?: number
  rowSpan?: number
}

export type FooterProps = {
  key: string
  role: string
  colSpan?: number
  rowSpan?: number
}

export type RowProps = {
  key: string
  role: string
}

export type CellProps = {
  key: string
  role: string
}

//

export type PropGetter<TBase> = <TGetter extends Getter<TBase>>(
  userProps?: TGetter
) => PropGetterValue<TBase, TGetter>

export type Getter<TInitial> =
  | ((initial: TInitial) => object)
  | object
  | undefined

export type PropGetterValue<TBase, TGetter> = TGetter extends undefined
  ? TBase
  : TGetter extends (...args: any[]) => infer TReturn
  ? Overwrite<TBase, TReturn>
  : TGetter extends object
  ? Overwrite<TBase, TGetter>
  : never

export type NoInfer<A extends any> = [A][A extends any ? 0 : never]

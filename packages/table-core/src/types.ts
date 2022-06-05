import { CoreOptions, CoreTableState, CoreInstance } from './core/instance'
import { CoreColumn, CoreColumnDef } from './core/column'
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
  ColumnPinningRow,
  ColumnPinningTableState,
} from './features/Pinning'
import { CoreHeader, CoreHeaderGroup, HeadersInstance } from './core/headers'
import {
  FiltersColumn,
  FiltersColumnDef,
  FiltersInstance,
  FiltersOptions,
  FiltersRow,
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
import {
  ColumnSizingColumn,
  ColumnSizingColumnDef,
  ColumnSizingHeader,
  ColumnSizingInstance,
  ColumnSizingOptions,
  ColumnSizingTableState,
} from './features/ColumnSizing'
import {
  PaginationInitialTableState,
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
import { CoreRow } from './core/row'
import { PartialKeys } from './utils'
import { CoreCell } from './core/cell'

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
  FilterMeta?: any
}

export type AnyRender = (Comp: any, props: any) => any

export type TableInstance<TGenerics extends TableGenerics> =
  CoreInstance<TGenerics> &
    HeadersInstance<TGenerics> &
    VisibilityInstance<TGenerics> &
    ColumnOrderInstance<TGenerics> &
    ColumnPinningInstance<TGenerics> &
    FiltersInstance<TGenerics> &
    SortingInstance<TGenerics> &
    GroupingInstance<TGenerics> &
    ColumnSizingInstance<TGenerics> &
    ExpandedInstance<TGenerics> &
    PaginationInstance<TGenerics> &
    RowSelectionInstance<TGenerics>

export type TableOptionsResolved<TGenerics extends TableGenerics> =
  CoreOptions<TGenerics> &
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

export type TableOptions<TGenerics extends TableGenerics> = Omit<
  PartialKeys<TableOptionsResolved<TGenerics>, 'state' | 'onStateChange'>,
  'render' | 'renderFallbackValue'
>

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

export type InitialTableState = Partial<
  CoreTableState &
    VisibilityTableState &
    ColumnOrderTableState &
    ColumnPinningTableState &
    FiltersTableState &
    SortingTableState &
    ExpandedTableState &
    GroupingTableState &
    ColumnSizingTableState &
    PaginationInitialTableState &
    RowSelectionTableState
>

export type Row<TGenerics extends TableGenerics> = CoreRow<TGenerics> &
  VisibilityRow<TGenerics> &
  ColumnPinningRow<TGenerics> &
  FiltersRow<TGenerics> &
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

export type Column<TGenerics extends TableGenerics> = CoreColumn<TGenerics> &
  ColumnVisibilityColumn &
  ColumnPinningColumn &
  FiltersColumn<TGenerics> &
  SortingColumn<TGenerics> &
  GroupingColumn<TGenerics> &
  ColumnSizingColumn<TGenerics>

export type Cell<TGenerics extends TableGenerics> = CoreCell<TGenerics> &
  GroupingCell<TGenerics>

export type Header<TGenerics extends TableGenerics> = CoreHeader<TGenerics> &
  ColumnSizingHeader<TGenerics>

export type HeaderGroup<TGenerics extends TableGenerics> =
  CoreHeaderGroup<TGenerics>

export type NoInfer<A extends any> = [A][A extends any ? 0 : never]

import { CoreOptions, CoreTableState, CoreInstance } from './core/table'
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
  CustomAggregationFns,
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

export type RowData = object | any[]

export type TableGenerics = {
  Row?: any
  Value?: any
  ColumnMeta?: any
  TableMeta?: any
}

export type AnyRender = (Comp: any, props: any) => any

export type Table<TData extends RowData> = CoreInstance<TData> &
  HeadersInstance<TData> &
  VisibilityInstance<TData> &
  ColumnOrderInstance<TData> &
  ColumnPinningInstance<TData> &
  FiltersInstance<TData> &
  SortingInstance<TData> &
  GroupingInstance<TData> &
  ColumnSizingInstance &
  ExpandedInstance<TData> &
  PaginationInstance<TData> &
  RowSelectionInstance<TData>

export type TableOptionsResolved<TData extends RowData> = CoreOptions<TData> &
  VisibilityOptions &
  ColumnOrderOptions &
  ColumnPinningOptions &
  FiltersOptions<TData> &
  SortingOptions<TData> &
  GroupingOptions &
  ExpandedOptions<TData> &
  ColumnSizingOptions &
  PaginationOptions &
  RowSelectionOptions<TData>

export type TableOptions<TData extends RowData> = PartialKeys<
  TableOptionsResolved<TData>,
  'state' | 'onStateChange' | 'renderFallbackValue'
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

export type Row<TData extends RowData> = CoreRow<TData> &
  VisibilityRow<TData> &
  ColumnPinningRow<TData> &
  FiltersRow<TData> &
  GroupingRow &
  RowSelectionRow &
  ExpandedRow

export type RowValues = {
  [key: string]: any
}

export type RowModel<TData extends RowData> = {
  rows: Row<TData>[]
  flatRows: Row<TData>[]
  rowsById: Record<string, Row<TData>>
}

export type AccessorFn<TData extends RowData> = (
  originalRow: TData,
  index: number
) => any

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type ColumnDef<TData extends RowData> = CoreColumnDef<TData> &
  VisibilityColumnDef &
  ColumnPinningColumnDef &
  FiltersColumnDef<TData> &
  SortingColumnDef<TData> &
  GroupingColumnDef<TData> &
  ColumnSizingColumnDef

export type Column<TData extends RowData> = CoreColumn<TData> &
  ColumnVisibilityColumn &
  ColumnPinningColumn &
  FiltersColumn<TData> &
  SortingColumn<TData> &
  GroupingColumn<TData> &
  ColumnSizingColumn

export type Cell<TData extends RowData> = CoreCell<TData> & GroupingCell

export type Header<TData extends RowData> = CoreHeader<TData> &
  ColumnSizingHeader

export type HeaderGroup<TData extends RowData> = CoreHeaderGroup<TData>

export type NoInfer<A extends any> = [A][A extends any ? 0 : never]

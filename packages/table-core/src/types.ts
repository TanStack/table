import { CoreOptions, CoreTableState, CoreInstance } from './core/table'
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
import {
  CoreHeader,
  CoreHeaderGroup,
  HeaderContext,
  HeadersInstance,
} from './core/headers'
import {
  FilterFn,
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
import { DeepKeys, PartialKeys, UnionToIntersection } from './utils'
import { CellContext, CoreCell } from './core/cell'
import { CoreColumn } from './core/column'

export interface TableMeta<TData extends RowData> {}
export interface ColumnMeta<TData extends RowData, TValue> {}
export interface FilterMeta {}
export interface FilterFns {}
export interface SortingFns {}
export interface AggregationFns {}

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = unknown | object | any[]

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

export type RowModel<TData extends RowData> = {
  rows: Row<TData>[]
  flatRows: Row<TData>[]
  rowsById: Record<string, Row<TData>>
}

export type AccessorFn<TData extends RowData, TValue = unknown> = (
  originalRow: TData,
  index: number
) => TValue

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type StringOrTemplateHeader<TData, TValue> =
  | string
  | ColumnDefTemplate<HeaderContext<TData, TValue>>

type StringHeaderIdentifier = {
  header: string
  id?: string
}

type IdIdentifier<TData extends RowData, TValue> = {
  id: string
  header?: StringOrTemplateHeader<TData, TValue>
}

type ColumnIdentifiers<TData extends RowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier

//

export type ColumnDefBase<TData extends RowData, TValue = unknown> = {
  footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>
  meta?: ColumnMeta<TData, TValue>
} & VisibilityColumnDef &
  ColumnPinningColumnDef &
  FiltersColumnDef<TData> &
  SortingColumnDef<TData> &
  GroupingColumnDef<TData, TValue> &
  ColumnSizingColumnDef

//

export type IdentifiedColumnDef<
  TData extends RowData,
  TValue = unknown
> = ColumnDefBase<TData, TValue> & {
  id?: string
  header?: StringOrTemplateHeader<TData, TValue>
}

export type DisplayColumnDef<
  TData extends RowData,
  TValue = unknown
> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

export type GroupColumnDef<
  TData extends RowData,
  TValue = unknown
> = ColumnDefBase<TData, TValue> &
  ColumnIdentifiers<TData, TValue> & {
    columns?: ColumnDef<TData, any>[]
  }

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown
> = ColumnDefBase<TData, TValue> &
  ColumnIdentifiers<TData, TValue> & {
    accessorFn: AccessorFn<TData, TValue>
  }

export type AccessorKeyColumnDef<TData extends RowData, TValue = unknown> = {
  id?: string
} & Partial<ColumnIdentifiers<TData, TValue>> &
  ColumnDefBase<TData, TValue> & {
    accessorKey: string | keyof TData
  }

export type AccessorColumnDef<TData extends RowData, TValue = unknown> =
  | AccessorKeyColumnDef<TData, TValue>
  | AccessorFnColumnDef<TData, TValue>

//

export type ColumnDef<TData extends RowData, TValue = unknown> =
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>
  | AccessorColumnDef<TData, TValue>

export type ColumnDefResolved<
  TData extends RowData,
  TValue = unknown
> = Partial<UnionToIntersection<ColumnDef<TData, TValue>>> & {
  accessorKey?: string
}

export type Column<TData extends RowData, TValue = unknown> = CoreColumn<
  TData,
  TValue
> &
  ColumnVisibilityColumn &
  ColumnPinningColumn &
  FiltersColumn<TData> &
  SortingColumn<TData> &
  GroupingColumn<TData> &
  ColumnSizingColumn

export type Cell<TData extends RowData, TValue> = CoreCell<TData, TValue> &
  GroupingCell

export type Header<TData extends RowData, TValue> = CoreHeader<TData, TValue> &
  ColumnSizingHeader

export type HeaderGroup<TData extends RowData> = CoreHeaderGroup<TData>

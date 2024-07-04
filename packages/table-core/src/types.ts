import { TableOptions_Core, Table_Core } from './core/table/Table'
import {
  Table_ColumnVisibility,
  TableState_ColumnVisibility,
  Column_ColumnVisibility,
  TableOptions_ColumnVisibility,
  ColumnDef_ColumnVisibility,
  Row_ColumnVisibility,
} from './features/column-visibility/ColumnVisibility.types'
import {
  Column_ColumnOrdering,
  Table_ColumnOrdering,
  TableOptions_ColumnOrdering,
  TableState_ColumnOrdering,
} from './features/column-ordering/ColumnOrdering.types'
import {
  Column_ColumnPinning,
  ColumnDef_ColumnPinning,
  Table_ColumnPinning,
  TableOptions_ColumnPinning,
  Row_ColumnPinning,
  TableState_ColumnPinning,
} from './features/column-pinning/ColumnPinning.types'
import {
  Table_RowPinning,
  TableOptions_RowPinning,
  Row_RowPinning,
  TableState_RowPinning,
} from './features/row-pinning/RowPinning.types'
import {
  Header_Core,
  HeaderGroup_Core,
  HeaderContext,
  Table_Headers,
} from './core/headers/Headers'
import {
  Column_ColumnFaceting,
  TableOptions_ColumnFaceting,
} from './features/column-faceting/ColumnFaceting.types'
import { Table_GlobalFaceting } from './features/global-faceting/GlobalFaceting.types'
import {
  Column_ColumnFiltering,
  ColumnDef_ColumnFiltering,
  Table_ColumnFiltering,
  TableOptions_ColumnFiltering,
  Row_ColumnFiltering,
  TableState_ColumnFiltering,
} from './features/column-filtering/ColumnFiltering.types'
import {
  Column_GlobalFiltering,
  ColumnDef_GlobalFiltering,
  Table_GlobalFiltering,
  TableOptions_GlobalFiltering,
  TableState_GlobalFiltering,
} from './features/global-filtering/GlobalFiltering.types'
import {
  Column_RowSorting,
  ColumnDef_RowSorting,
  Table_RowSorting,
  TableOptions_RowSorting,
  TableState_RowSorting,
} from './features/row-sorting/RowSorting.types'
import {
  Cell_ColumnGrouping,
  Column_ColumnGrouping,
  ColumnDef_ColumnGrouping,
  Table_ColumnGrouping,
  TableOptions_ColumnGrouping,
  Row_ColumnGrouping,
  TableState_ColumnGrouping,
} from './features/column-grouping/ColumnGrouping.types'
import {
  Table_RowExpanding,
  TableOptions_RowExpanding,
  TableState_RowExpanding,
  Row_RowExpanding,
} from './features/row-expanding/RowExpanding.types'
import {
  Column_ColumnSizing as Column_ColumnSizing,
  ColumnDef_ColumnSizing,
  Header_ColumnSizing,
  Table_ColumnSizing,
  TableOptions_ColumnSizing,
  TableState_ColumnSizing,
} from './features/column-sizing/ColumnSizing.types'
import {
  Column_ColumnResizing,
  ColumnDef_ColumnResizing,
  Header_ColumnResizing,
  Table_ColumnResizing,
  TableOptions_ColumnResizing,
  TableState_ColumnResizing,
} from './features/column-resizing/ColumnResizing.types'
import {
  Table_RowPagination,
  TableOptions_RowPagination,
  TableState_RowPagination,
} from './features/row-pagination/RowPagination.types'
import {
  Row_RowSelection,
  TableOptions_RowSelection,
  TableState_RowSelection,
  Table_RowSelection,
} from './features/row-selection/RowSelection.types'
import { Row_Core, Table_Rows, TableOptions_Rows } from './core/rows/Rows.types'
import { PartialKeys, UnionToIntersection } from './utils'
import {
  CellContext,
  Cell_Core,
  TableOptions_Cell,
} from './core/cells/Cells.types'
import { Column_Core } from './core/columns/Columns'

export interface TableFeature<TData extends RowData = any> {
  _createCell?: (cell: Cell<TData, unknown>, table: Table<TData>) => void
  _createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void
  _createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void
  _createRow?: (row: Row<TData>, table: Table<TData>) => void
  _createTable?: (table: Table<TData>) => void
  _getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>
  _getDefaultOptions?: (
    table: Table<TData>
  ) => Partial<TableOptionsResolved<TData>>
  _getInitialState?: (initialState?: Partial<TableState>) => Partial<TableState>
}

export interface TableMeta<TData extends RowData> {}

export interface ColumnMeta<TData extends RowData, TValue> {}

export interface FilterMeta {}

export interface FilterFns {}

export interface SortingFns {}

export interface AggregationFns {}

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = unknown | object | any[]

export type CellData = unknown

export type AnyRender = (Comp: any, props: any) => any

export interface Table<TData extends RowData>
  extends Table_Core<TData>,
    Table_Rows<TData>,
    Table_Headers<TData>,
    Table_ColumnFiltering<TData>,
    Table_ColumnGrouping<TData>,
    Table_ColumnOrdering<TData>,
    Table_ColumnPinning<TData>,
    Table_ColumnResizing,
    Table_ColumnSizing,
    Table_ColumnVisibility<TData>,
    Table_GlobalFaceting<TData>,
    Table_GlobalFiltering<TData>,
    Table_RowExpanding<TData>,
    Table_RowPagination<TData>,
    Table_RowPinning<TData>,
    Table_RowSelection<TData>,
    Table_RowSorting<TData> {}

export interface TableOptionsResolved<TData extends RowData>
  extends TableOptions_Core<TData>,
    TableOptions_Cell,
    TableOptions_Rows<TData>,
    TableOptions_ColumnFaceting<TData>,
    TableOptions_ColumnFiltering<TData>,
    TableOptions_ColumnGrouping,
    TableOptions_ColumnOrdering,
    TableOptions_ColumnPinning,
    TableOptions_ColumnResizing,
    TableOptions_ColumnSizing,
    TableOptions_ColumnVisibility,
    TableOptions_GlobalFiltering<TData>,
    TableOptions_RowExpanding<TData>,
    TableOptions_RowPagination,
    TableOptions_RowPinning<TData>,
    TableOptions_RowSelection<TData>,
    TableOptions_RowSorting<TData> {}

export interface TableOptions<TData extends RowData>
  extends PartialKeys<TableOptionsResolved<TData>, 'state' | 'onStateChange'> {}

export interface TableState
  extends TableState_ColumnFiltering,
    TableState_ColumnGrouping,
    TableState_ColumnOrdering,
    TableState_ColumnPinning,
    TableState_ColumnResizing,
    TableState_ColumnSizing,
    TableState_ColumnVisibility,
    TableState_GlobalFiltering,
    TableState_RowExpanding,
    TableState_RowPagination,
    TableState_RowPinning,
    TableState_RowSelection,
    TableState_RowSorting {}

export interface Row<TData extends RowData>
  extends Row_Core<TData>,
    Row_ColumnFiltering<TData>,
    Row_ColumnGrouping,
    Row_ColumnPinning<TData>,
    Row_ColumnVisibility<TData>,
    Row_RowExpanding,
    Row_RowPinning,
    Row_RowSelection {}

export interface RowModel<TData extends RowData> {
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

export interface StringHeaderIdentifier {
  header: string
  id?: string
}

export interface IdIdentifier<TData extends RowData, TValue> {
  id: string
  header?: StringOrTemplateHeader<TData, TValue>
}

type ColumnIdentifiers<TData extends RowData, TValue> =
  | IdIdentifier<TData, TValue>
  | StringHeaderIdentifier

export interface ColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDef_ColumnVisibility,
    ColumnDef_ColumnPinning,
    ColumnDef_ColumnFiltering<TData>,
    ColumnDef_GlobalFiltering,
    ColumnDef_RowSorting<TData>,
    ColumnDef_ColumnGrouping<TData, TValue>,
    ColumnDef_ColumnSizing,
    ColumnDef_ColumnResizing {
  getUniqueValues?: AccessorFn<TData, unknown[]>
  footer?: ColumnDefTemplate<HeaderContext<TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TData, TValue>>
  meta?: ColumnMeta<TData, TValue>
}

export interface IdentifiedColumnDef<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  id?: string
  header?: StringOrTemplateHeader<TData, TValue>
}

export type DisplayColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

interface GroupColumnDefBase<TData extends RowData, TValue = unknown>
  extends ColumnDefBase<TData, TValue> {
  columns?: ColumnDef<TData, any>[]
}

export type GroupColumnDef<
  TData extends RowData,
  TValue = unknown,
> = GroupColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

export interface AccessorFnColumnDefBase<
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TData, TValue> {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TData extends RowData,
  TValue = unknown,
> = AccessorFnColumnDefBase<TData, TValue> & ColumnIdentifiers<TData, TValue>

export interface AccessorKeyColumnDefBase<
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TData, TValue> {
  id?: string
  accessorKey: (string & {}) | keyof TData
}

export type AccessorKeyColumnDef<
  TData extends RowData,
  TValue = unknown,
> = AccessorKeyColumnDefBase<TData, TValue> &
  Partial<ColumnIdentifiers<TData, TValue>>

export type AccessorColumnDef<TData extends RowData, TValue = unknown> =
  | AccessorKeyColumnDef<TData, TValue>
  | AccessorFnColumnDef<TData, TValue>

export type ColumnDef<TData extends RowData, TValue = unknown> =
  | DisplayColumnDef<TData, TValue>
  | GroupColumnDef<TData, TValue>
  | AccessorColumnDef<TData, TValue>

export type ColumnDefResolved<
  TData extends RowData,
  TValue = unknown,
> = Partial<UnionToIntersection<ColumnDef<TData, TValue>>> & {
  accessorKey?: string
}

export interface Column<TData extends RowData, TValue = unknown>
  extends Column_ColumnFaceting<TData>,
    Column_ColumnFiltering<TData>,
    Column_ColumnGrouping<TData>,
    Column_ColumnOrdering,
    Column_ColumnPinning,
    Column_ColumnResizing,
    Column_ColumnSizing,
    Column_ColumnVisibility,
    Column_Core<TData, TValue>,
    Column_GlobalFiltering,
    Column_RowSorting<TData> {}

export interface Cell<TData extends RowData, TValue>
  extends Cell_Core<TData, TValue>,
    Cell_ColumnGrouping {}

export interface Header<TData extends RowData, TValue>
  extends Header_Core<TData, TValue>,
    Header_ColumnSizing,
    Header_ColumnResizing {}

export interface HeaderGroup<TData extends RowData>
  extends HeaderGroup_Core<TData> {}

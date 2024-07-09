import type { TableOptions_Table, Table_Table } from './core/table/Tables.types'
import type {
  ColumnDef_ColumnVisibility,
  Column_ColumnVisibility,
  Row_ColumnVisibility,
  TableOptions_ColumnVisibility,
  TableState_ColumnVisibility,
  Table_ColumnVisibility,
} from './features/column-visibility/ColumnVisibility.types'
import type {
  Column_ColumnOrdering,
  TableOptions_ColumnOrdering,
  TableState_ColumnOrdering,
  Table_ColumnOrdering,
} from './features/column-ordering/ColumnOrdering.types'
import type {
  ColumnDef_ColumnPinning,
  Column_ColumnPinning,
  Row_ColumnPinning,
  TableOptions_ColumnPinning,
  TableState_ColumnPinning,
  Table_ColumnPinning,
} from './features/column-pinning/ColumnPinning.types'
import type {
  Row_RowPinning,
  TableOptions_RowPinning,
  TableState_RowPinning,
  Table_RowPinning,
} from './features/row-pinning/RowPinning.types'
import type {
  HeaderContext,
  HeaderGroup_Header,
  Header_Header,
  TableOptions_Headers,
  Table_Headers,
} from './core/headers/Headers.types'
import type { Column_ColumnFaceting } from './features/column-faceting/ColumnFaceting.types'
import type { Table_GlobalFaceting } from './features/global-faceting/GlobalFaceting.types'
import type {
  ColumnDef_ColumnFiltering,
  Column_ColumnFiltering,
  Row_ColumnFiltering,
  TableOptions_ColumnFiltering,
  TableState_ColumnFiltering,
  Table_ColumnFiltering,
} from './features/column-filtering/ColumnFiltering.types'
import type {
  ColumnDef_GlobalFiltering,
  Column_GlobalFiltering,
  TableOptions_GlobalFiltering,
  TableState_GlobalFiltering,
  Table_GlobalFiltering,
} from './features/global-filtering/GlobalFiltering.types'
import type {
  ColumnDef_RowSorting,
  Column_RowSorting,
  TableOptions_RowSorting,
  TableState_RowSorting,
  Table_RowSorting,
} from './features/row-sorting/RowSorting.types'
import type {
  Cell_ColumnGrouping,
  ColumnDef_ColumnGrouping,
  Column_ColumnGrouping,
  Row_ColumnGrouping,
  TableOptions_ColumnGrouping,
  TableState_ColumnGrouping,
  Table_ColumnGrouping,
} from './features/column-grouping/ColumnGrouping.types'
import type {
  Row_RowExpanding,
  TableOptions_RowExpanding,
  TableState_RowExpanding,
  Table_RowExpanding,
} from './features/row-expanding/RowExpanding.types'
import type {
  ColumnDef_ColumnSizing,
  Column_ColumnSizing as Column_ColumnSizing,
  Header_ColumnSizing,
  TableOptions_ColumnSizing,
  TableState_ColumnSizing,
  Table_ColumnSizing,
} from './features/column-sizing/ColumnSizing.types'
import type {
  ColumnDef_ColumnResizing,
  Column_ColumnResizing,
  Header_ColumnResizing,
  TableOptions_ColumnResizing,
  TableState_ColumnResizing,
  Table_ColumnResizing,
} from './features/column-resizing/ColumnResizing.types'
import type {
  TableOptions_RowPagination,
  TableState_RowPagination,
  Table_RowPagination,
} from './features/row-pagination/RowPagination.types'
import type {
  Row_RowSelection,
  TableOptions_RowSelection,
  TableState_RowSelection,
  Table_RowSelection,
} from './features/row-selection/RowSelection.types'
import type {
  Row_Row,
  TableOptions_Rows,
  Table_Rows,
} from './core/rows/Rows.types'
import type { PartialKeys, UnionToIntersection } from './utils.types'
import type {
  CellContext,
  Cell_Cell,
  TableOptions_Cell,
} from './core/cells/Cells.types'
import type {
  Column_Column,
  TableOptions_Columns,
  Table_Columns,
} from './core/columns/Columns.types'

export interface TableFeature {
  _createCell?: <TData extends RowData = any>(
    cell: Cell<TData, unknown>,
    table: Table<TData>,
  ) => void
  _createColumn?: <TData extends RowData = any>(
    column: Column<TData, unknown>,
    table: Table<TData>,
  ) => void
  _createHeader?: <TData extends RowData = any>(
    header: Header<TData, unknown>,
    table: Table<TData>,
  ) => void
  _createRow?: <TData extends RowData = any>(
    row: Row<TData>,
    table: Table<TData>,
  ) => void
  _createTable?: <TData extends RowData = any>(table: Table<TData>) => void
  _getDefaultColumnDef?: <TData extends RowData = any>() => Partial<
    ColumnDef<TData, unknown>
  >
  _getDefaultOptions?: <TData extends RowData = any>(
    table: Partial<Table<TData>>,
  ) => Partial<TableOptionsResolved<TData>>
  _getInitialState?: (initialState?: Partial<TableState>) => Partial<TableState>
}

export interface CoreTableFeatures {
  Tables: TableFeature
  Rows: TableFeature
  Headers: TableFeature
  Columns: TableFeature
  Cells: TableFeature
}

export interface TableFeatures {
  ColumnFaceting: TableFeature
  ColumnFiltering: TableFeature
  ColumnGrouping: TableFeature
  ColumnOrdering: TableFeature
  ColumnPinning: TableFeature
  ColumnResizing: TableFeature
  ColumnSizing: TableFeature
  ColumnVisibility: TableFeature
  GlobalFaceting: TableFeature
  GlobalFiltering: TableFeature
  RowExpanding: TableFeature
  RowPagination: TableFeature
  RowPinning: TableFeature
  RowSelection: TableFeature
  RowSorting: TableFeature
  [key: string]: TableFeature //allow custom features still? Or make new plugin system instead?
}

export interface RowModel<TData extends RowData> {
  rows: Array<Row<TData>>
  flatRows: Array<Row<TData>>
  rowsById: Record<string, Row<TData>>
}

export interface RowModelOptions<TData extends RowData> {
  /**
   * This required option is a factory for a function that computes and returns the core row model for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  Core?: (table: Table<TData>) => () => RowModel<TData>
  /**
   * This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  Expanded?: (table: Table<TData>) => () => RowModel<TData>
  /**
   * If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
   * - For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
   * - For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  Filtered?: (table: Table<TData>) => () => RowModel<TData>
  /**
   * Returns the row model after grouping has taken place, but no further.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  Grouped?: (table: Table<TData>) => () => RowModel<TData>
  /**
   * Returns the row model after pagination has taken place, but no further.
   *
   * Pagination columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getPaginatedRowModel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  Paginated?: (table: Table<TData>) => () => RowModel<TData>
  /**
   * This function is used to retrieve the sorted row model. If using server-side sorting, this function is not required. To use client-side sorting, pass the exported `getSortedRowModel()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  Sorted?: (table: Table<TData>) => () => RowModel<TData>
  /**
   * This function is used to retrieve the faceted min/max values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedMinMaxValues()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  FacetedMinMax?: (
    table: Table<TData>,
    columnId: string,
  ) => () => [number, number] | undefined
  /**
   * This function is used to retrieve the faceted row model. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedRowModel()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  Faceted?: (table: Table<TData>, columnId: string) => () => RowModel<TData>
  /**
   * This function is used to retrieve the faceted unique values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedUniqueValues()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  FacetedUnique?: (
    table: Table<TData>,
    columnId: string,
  ) => () => Map<any, number>
}

export interface CachedRowModels<TData extends RowData> {
  Core?: () => RowModel<TData>
  Expanded?: () => RowModel<TData>
  Filtered?: () => RowModel<TData>
  Grouped?: () => RowModel<TData>
  Paginated?: () => RowModel<TData>
  Sorted?: () => RowModel<TData>
  FacetedMinMax?: (columnId: string) => [number, number]
  Faceted?: (columnId: string) => RowModel<TData>
  FacetedUnique?: (columnId: string) => Map<any, number>
}

export interface TableMeta<TData extends RowData> {}

export interface ColumnMeta<TData extends RowData, TValue> {}

export interface FilterMeta {}

export interface FilterFns {}

export interface SortingFns {}

export interface AggregationFns {}

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = unknown | object | Array<any>

export type CellData = unknown

export type AnyRender = (Comp: any, props: any) => any

export interface Table_Core<TData extends RowData>
  extends Table_Table<TData>,
    Table_Columns<TData>,
    Table_Rows<TData>,
    Table_Headers<TData> {}

export interface Table<TData extends RowData>
  extends Table_Core<TData>,
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

export interface TableOptions_Core<TData extends RowData>
  extends TableOptions_Table<TData>,
    TableOptions_Cell,
    TableOptions_Columns<TData>,
    TableOptions_Rows<TData>,
    TableOptions_Headers {}

export interface TableOptionsResolved<TData extends RowData>
  extends TableOptions_Core<TData>,
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
  extends Row_Row<TData>,
    Row_ColumnFiltering<TData>,
    Row_ColumnGrouping,
    Row_ColumnPinning<TData>,
    Row_ColumnVisibility<TData>,
    Row_RowExpanding,
    Row_RowPinning,
    Row_RowSelection {}

export interface Cell<TData extends RowData, TValue>
  extends Cell_Cell<TData, TValue>,
    Cell_ColumnGrouping {}

export interface Header<TData extends RowData, TValue>
  extends Header_Header<TData, TValue>,
    Header_ColumnSizing,
    Header_ColumnResizing {}

export interface HeaderGroup<TData extends RowData>
  extends HeaderGroup_Header<TData> {}

export type AccessorFn<TData extends RowData, TValue = unknown> = (
  originalRow: TData,
  index: number,
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
  getUniqueValues?: AccessorFn<TData, Array<unknown>>
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
  columns?: Array<ColumnDef<TData, any>>
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
  extends Column_Column<TData, TValue>,
    Column_ColumnFaceting<TData>,
    Column_ColumnFiltering<TData>,
    Column_ColumnGrouping<TData>,
    Column_ColumnOrdering,
    Column_ColumnPinning,
    Column_ColumnResizing,
    Column_ColumnSizing,
    Column_ColumnVisibility,
    Column_GlobalFiltering,
    Column_RowSorting<TData> {}

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
  _createCell?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ) => void
  _createColumn?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ) => void
  _createHeader?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ) => void
  _createRow?: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
    table: Table<TFeatures, TData>,
  ) => void
  _createTable?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ) => void
  _getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => Partial<ColumnDef<TFeatures, TData, TValue>>
  _getDefaultOptions?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Partial<Table<TFeatures, TData>>,
  ) => Partial<TableOptionsResolved<TFeatures, TData>>
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
  ColumnFaceting?: TableFeature
  ColumnFiltering?: TableFeature
  ColumnGrouping?: TableFeature
  ColumnOrdering?: TableFeature
  ColumnPinning?: TableFeature
  ColumnResizing?: TableFeature
  ColumnSizing?: TableFeature
  ColumnVisibility?: TableFeature
  GlobalFaceting?: TableFeature
  GlobalFiltering?: TableFeature
  RowExpanding?: TableFeature
  RowPagination?: TableFeature
  RowPinning?: TableFeature
  RowSelection?: TableFeature
  RowSorting?: TableFeature
  // [key: string]: TableFeature //allow custom features still? Or make new plugin system instead?
}

export interface RowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  rows: Array<Row<TFeatures, TData>>
  flatRows: Array<Row<TFeatures, TData>>
  rowsById: Record<string, Row<TFeatures, TData>>
}

export interface RowModelOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This required option is a factory for a function that computes and returns the core row model for the table.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getcorerowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/tables)
   */
  Core?: (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>
  /**
   * This function is responsible for returning the expanded row model. If this function is not provided, the table will not expand rows. You can use the default exported `getExpandedRowModel` function to get the expanded row model or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getexpandedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)
   */
  Expanded?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
  /**
   * If provided, this function is called **once** per table and should return a **new function** which will calculate and return the row model for the table when it's filtered.
   * - For server-side filtering, this function is unnecessary and can be ignored since the server should already return the filtered row model.
   * - For client-side filtering, this function is required. A default implementation is provided via any table adapter's `{ getFilteredRowModel }` export.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#getfilteredrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)
   */
  Filtered?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
  /**
   * Returns the row model after grouping has taken place, but no further.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#getgroupedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)
   */
  Grouped?: (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>
  /**
   * Returns the row model after pagination has taken place, but no further.
   *
   * Pagination columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#getPaginatedRowModel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)
   */
  Paginated?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the sorted row model. If using server-side sorting, this function is not required. To use client-side sorting, pass the exported `getSortedRowModel()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  Sorted?: (table: Table<TFeatures, TData>) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the faceted min/max values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedMinMaxValues()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedminmaxvalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  FacetedMinMax?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => [number, number] | undefined
  /**
   * This function is used to retrieve the faceted row model. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedRowModel()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfacetedrowmodel)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  Faceted?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => RowModel<TFeatures, TData>
  /**
   * This function is used to retrieve the faceted unique values. If using server-side faceting, this function is not required. To use client-side faceting, pass the exported `getFacetedUniqueValues()` from your adapter to your table or implement your own.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-faceting#getfaceteduniquevalues)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/column-faceting)
   */
  FacetedUnique?: (
    table: Table<TFeatures, TData>,
    columnId: string,
  ) => () => Map<any, number>
}

export interface CachedRowModels<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  Core?: () => RowModel<TFeatures, TData>
  Expanded?: () => RowModel<TFeatures, TData>
  Filtered?: () => RowModel<TFeatures, TData>
  Grouped?: () => RowModel<TFeatures, TData>
  Paginated?: () => RowModel<TFeatures, TData>
  Sorted?: () => RowModel<TFeatures, TData>
  FacetedMinMax?: (columnId: string) => [number, number]
  Faceted?: (columnId: string) => RowModel<TFeatures, TData>
  FacetedUnique?: (columnId: string) => Map<any, number>
}

export interface TableMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {}

export interface ColumnMeta<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {}

export interface FilterMeta {}

export interface FilterFns {}

export interface SortingFns {}

export interface AggregationFns {}

export type Updater<T> = T | ((old: T) => T)
export type OnChangeFn<T> = (updaterOrValue: Updater<T>) => void

export type RowData = unknown | object | Array<any>

export type CellData = unknown

export type AnyRender = (Comp: any, props: any) => any

export interface Table_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Table_Table<TFeatures, TData>,
    Table_Columns<TFeatures, TData>,
    Table_Rows<TFeatures, TData>,
    Table_Headers<TFeatures, TData> {}

export interface Table<TFeatures extends TableFeatures, TData extends RowData>
  extends Table_Core<TFeatures, TData>,
    Table_ColumnFiltering<TFeatures, TData>,
    Table_ColumnGrouping<TFeatures, TData>,
    Table_ColumnOrdering<TFeatures, TData>,
    Table_ColumnPinning<TFeatures, TData>,
    Table_ColumnResizing,
    Table_ColumnSizing,
    Table_ColumnVisibility<TFeatures, TData>,
    Table_GlobalFaceting<TFeatures, TData>,
    Table_GlobalFiltering<TFeatures, TData>,
    Table_RowExpanding<TFeatures, TData>,
    Table_RowPagination<TFeatures, TData>,
    Table_RowPinning<TFeatures, TData>,
    Table_RowSelection<TFeatures, TData>,
    Table_RowSorting<TFeatures, TData> {}

export interface TableOptions_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends TableOptions_Table<TFeatures, TData>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TData>,
    TableOptions_Rows<TFeatures, TData>,
    TableOptions_Headers {}

export interface TableOptionsResolved<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends TableOptions_Core<TFeatures, TData>,
    TableOptions_ColumnFiltering<TFeatures, TData>,
    TableOptions_ColumnGrouping<TFeatures, TData>,
    TableOptions_ColumnOrdering,
    TableOptions_ColumnPinning,
    TableOptions_ColumnResizing,
    TableOptions_ColumnSizing,
    TableOptions_ColumnVisibility,
    TableOptions_GlobalFiltering<TFeatures, TData>,
    TableOptions_RowExpanding<TFeatures, TData>,
    TableOptions_RowPagination,
    TableOptions_RowPinning<TFeatures, TData>,
    TableOptions_RowSelection<TFeatures, TData>,
    TableOptions_RowSorting<TFeatures, TData> {}

export interface TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends PartialKeys<
    TableOptionsResolved<TFeatures, TData>,
    'state' | 'onStateChange'
  > {}

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

export interface Row<TFeatures extends TableFeatures, TData extends RowData>
  extends Row_Row<TFeatures, TData>,
    Row_ColumnFiltering<TFeatures, TData>,
    Row_ColumnGrouping,
    Row_ColumnPinning<TFeatures, TData>,
    Row_ColumnVisibility<TFeatures, TData>,
    Row_RowExpanding,
    Row_RowPinning,
    Row_RowSelection {}

export interface Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Cell_Cell<TFeatures, TData, TValue>,
    Cell_ColumnGrouping {}

export interface Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Header_Header<TFeatures, TData, TValue>,
    Header_ColumnSizing,
    Header_ColumnResizing {}

export interface HeaderGroup<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends HeaderGroup_Header<TFeatures, TData> {}

export type AccessorFn<
  TData extends RowData,
  TValue extends CellData = CellData,
> = (originalRow: TData, index: number) => TValue

export type ColumnDefTemplate<TProps extends object> =
  | string
  | ((props: TProps) => any)

export type StringOrTemplateHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = string | ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>

export interface StringHeaderIdentifier {
  header: string
  id?: string
}

export interface IdIdentifier<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  id: string
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}

type ColumnIdentifiers<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = IdIdentifier<TFeatures, TData, TValue> | StringHeaderIdentifier

export interface ColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends ColumnDef_ColumnVisibility,
    ColumnDef_ColumnPinning,
    ColumnDef_ColumnFiltering<TFeatures, TData>,
    ColumnDef_GlobalFiltering,
    ColumnDef_RowSorting<TFeatures, TData>,
    ColumnDef_ColumnGrouping<TFeatures, TData, TValue>,
    ColumnDef_ColumnSizing,
    ColumnDef_ColumnResizing {
  getUniqueValues?: AccessorFn<TData, Array<unknown>>
  footer?: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>
  meta?: ColumnMeta<TFeatures, TData, TValue>
}

export interface IdentifiedColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TFeatures, TData, TValue> {
  id?: string
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}

export type DisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

interface GroupColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TFeatures, TData, TValue> {
  columns?: Array<ColumnDef<TFeatures, TData, unknown>>
}

export type GroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = GroupColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export interface AccessorFnColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TFeatures, TData, TValue> {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = AccessorFnColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export interface AccessorKeyColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends ColumnDefBase<TFeatures, TData, TValue> {
  id?: string
  accessorKey: (string & {}) | keyof TData
}

export type AccessorKeyColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = AccessorKeyColumnDefBase<TFeatures, TData, TValue> &
  Partial<ColumnIdentifiers<TFeatures, TData, TValue>>

export type AccessorColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> =
  | AccessorKeyColumnDef<TFeatures, TData, TValue>
  | AccessorFnColumnDef<TFeatures, TData, TValue>

export type ColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> =
  | DisplayColumnDef<TFeatures, TData, TValue>
  | GroupColumnDef<TFeatures, TData, TValue>
  | AccessorColumnDef<TFeatures, TData, TValue>

export type ColumnDefResolved<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & {
  accessorKey?: string
}

export interface Column<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> extends Column_Column<TFeatures, TData, TValue>,
    Column_ColumnFaceting<TFeatures, TData>,
    Column_ColumnFiltering<TFeatures, TData>,
    Column_ColumnGrouping<TFeatures, TData>,
    Column_ColumnOrdering,
    Column_ColumnPinning,
    Column_ColumnResizing,
    Column_ColumnSizing,
    Column_ColumnVisibility,
    Column_GlobalFiltering,
    Column_RowSorting<TFeatures, TData> {}

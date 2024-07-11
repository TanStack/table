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
import type { UnionToIntersection } from './utils.types'
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
  ) => Partial<TableOptions<TFeatures, TData>>
  _getInitialState?: <TFeatures extends TableFeatures>(
    initialState?: Partial<TableState<TFeatures>>,
  ) => Partial<TableState<TFeatures>>
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

export type _Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? Table_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? Table_ColumnGrouping<TFeatures, TData>
        : never)
    | ('ColumnOrdering' extends keyof TFeatures
        ? Table_ColumnOrdering<TFeatures, TData>
        : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? Table_ColumnPinning<TFeatures, TData>
        : never)
    | ('ColumnResizing' extends keyof TFeatures ? Table_ColumnResizing : never)
    | ('ColumnSizing' extends keyof TFeatures ? Table_ColumnSizing : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? Table_ColumnVisibility<TFeatures, TData>
        : never)
    | ('GlobalFaceting' extends keyof TFeatures
        ? Table_GlobalFaceting<TFeatures, TData>
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? Table_GlobalFiltering<TFeatures, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures
        ? Table_RowExpanding<TFeatures, TData>
        : never)
    | ('RowPagination' extends keyof TFeatures
        ? Table_RowPagination<TFeatures, TData>
        : never)
    | ('RowPinning' extends keyof TFeatures
        ? Table_RowPinning<TFeatures, TData>
        : never)
    | ('RowSelection' extends keyof TFeatures
        ? Table_RowSelection<TFeatures, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? Table_RowSorting<TFeatures, TData>
        : never)
  >

export type Table_All<TData extends RowData> = _Table<TableFeatures, TData>

//temp - enable all features for types internally
export type Table<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Table_All<TData>

export interface TableOptions_Core<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends TableOptions_Table<TFeatures, TData>,
    TableOptions_Cell,
    TableOptions_Columns<TFeatures, TData>,
    TableOptions_Rows<TFeatures, TData>,
    TableOptions_Headers {}

export type _TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_Core<TFeatures, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? TableOptions_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? TableOptions_ColumnGrouping<TFeatures, TData>
        : never)
    | ('ColumnOrdering' extends keyof TFeatures
        ? TableOptions_ColumnOrdering
        : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? TableOptions_ColumnPinning
        : never)
    | ('ColumnResizing' extends keyof TFeatures
        ? TableOptions_ColumnResizing
        : never)
    | ('ColumnSizing' extends keyof TFeatures
        ? TableOptions_ColumnSizing
        : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? TableOptions_ColumnVisibility
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? TableOptions_GlobalFiltering<TFeatures, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures
        ? TableOptions_RowExpanding<TFeatures, TData>
        : never)
    | ('RowPagination' extends keyof TFeatures
        ? TableOptions_RowPagination
        : never)
    | ('RowPinning' extends keyof TFeatures
        ? TableOptions_RowPinning<TFeatures, TData>
        : never)
    | ('RowSelection' extends keyof TFeatures
        ? TableOptions_RowSelection<TFeatures, TData>
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? TableOptions_RowSorting<TFeatures, TData>
        : never)
  >

export type TableOptions_All<TData extends RowData> = _TableOptions<
  TableFeatures,
  TData
>

//temp - enable all features for types internally
export type TableOptions<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = TableOptions_All<TData>

export type _TableState<TFeatures extends TableFeatures> = UnionToIntersection<
  | ('ColumnFiltering' extends keyof TFeatures
      ? TableState_ColumnFiltering
      : never)
  | ('ColumnGrouping' extends keyof TFeatures
      ? TableState_ColumnGrouping
      : never)
  | ('ColumnOrdering' extends keyof TFeatures
      ? TableState_ColumnOrdering
      : never)
  | ('ColumnPinning' extends keyof TFeatures ? TableState_ColumnPinning : never)
  | ('ColumnResizing' extends keyof TFeatures
      ? TableState_ColumnResizing
      : never)
  | ('ColumnSizing' extends keyof TFeatures ? TableState_ColumnSizing : never)
  | ('ColumnVisibility' extends keyof TFeatures
      ? TableState_ColumnVisibility
      : never)
  | ('GlobalFiltering' extends keyof TFeatures
      ? TableState_GlobalFiltering
      : never)
  | ('RowExpanding' extends keyof TFeatures ? TableState_RowExpanding : never)
  | ('RowPagination' extends keyof TFeatures ? TableState_RowPagination : never)
  | ('RowPinning' extends keyof TFeatures ? TableState_RowPinning : never)
  | ('RowSelection' extends keyof TFeatures ? TableState_RowSelection : never)
  | ('RowSorting' extends keyof TFeatures ? TableState_RowSorting : never)
>

export type TableState_All = _TableState<TableFeatures>

//temp - enable all features for types internally
export type TableState<TFeatures extends TableFeatures> = TableState_All

export type _Row<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_Row<TFeatures, TData> &
  UnionToIntersection<
    | ('ColumnFiltering' extends keyof TFeatures
        ? Row_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures ? Row_ColumnGrouping : never)
    | ('ColumnPinning' extends keyof TFeatures
        ? Row_ColumnPinning<TFeatures, TData>
        : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? Row_ColumnVisibility<TFeatures, TData>
        : never)
    | ('RowExpanding' extends keyof TFeatures ? Row_RowExpanding : never)
    | ('RowPinning' extends keyof TFeatures ? Row_RowPinning : never)
    | ('RowSelection' extends keyof TFeatures ? Row_RowSelection : never)
  >

export type Row_All<TData extends RowData> = _Row<TableFeatures, TData>

//temp - enable all features for types internally
export type Row<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Row_All<TData>

export type _Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell_Cell<TFeatures, TData, TValue> &
  UnionToIntersection<
    'ColumnGrouping' extends keyof TFeatures ? Cell_ColumnGrouping : never
  >

export type Cell_All<
  TData extends RowData,
  TValue extends CellData = CellData,
> = _Cell<TableFeatures, TData, TValue>

//temp - enable all features for types internally
export type Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Cell_All<TData, TValue>

export type _Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_Header<TFeatures, TData, TValue> &
  UnionToIntersection<
    | ('ColumnSizing' extends keyof TFeatures ? Header_ColumnSizing : never)
    | ('ColumnResizing' extends keyof TFeatures ? Header_ColumnResizing : never)
  >

export type Header_All<
  TData extends RowData,
  TValue extends CellData = CellData,
> = _Header<TableFeatures, TData, TValue>

//temp - enable all features for types internally
export type Header<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Header_All<TData, TValue>

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

export type _ColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = UnionToIntersection<
  | ('ColumnVisibility' extends keyof TFeatures
      ? ColumnDef_ColumnVisibility
      : never)
  | ('ColumnPinning' extends keyof TFeatures ? ColumnDef_ColumnPinning : never)
  | ('ColumnFiltering' extends keyof TFeatures
      ? ColumnDef_ColumnFiltering<TFeatures, TData>
      : never)
  | ('GlobalFiltering' extends keyof TFeatures
      ? ColumnDef_GlobalFiltering
      : never)
  | ('RowSorting' extends keyof TFeatures
      ? ColumnDef_RowSorting<TFeatures, TData>
      : never)
  | ('ColumnGrouping' extends keyof TFeatures
      ? ColumnDef_ColumnGrouping<TFeatures, TData, TValue>
      : never)
  | ('ColumnSizing' extends keyof TFeatures ? ColumnDef_ColumnSizing : never)
  | ('ColumnResizing' extends keyof TFeatures
      ? ColumnDef_ColumnResizing
      : never)
> & {
  getUniqueValues?: AccessorFn<TData, Array<unknown>>
  footer?: ColumnDefTemplate<HeaderContext<TFeatures, TData, TValue>>
  cell?: ColumnDefTemplate<CellContext<TFeatures, TData, TValue>>
  meta?: ColumnMeta<TFeatures, TData, TValue>
}

//temp - enable all features for types internally
export type ColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = _ColumnDefBase<TableFeatures, TData, TValue>

export type IdentifiedColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  id?: string
  header?: StringOrTemplateHeader<TFeatures, TData, TValue>
}

export type DisplayColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

type GroupColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  columns?: Array<ColumnDef<TFeatures, TData, unknown>>
}

export type GroupColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = GroupColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export type AccessorFnColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TFeatures, TData, TValue> & {
  accessorFn: AccessorFn<TData, TValue>
}

export type AccessorFnColumnDef<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = AccessorFnColumnDefBase<TFeatures, TData, TValue> &
  ColumnIdentifiers<TFeatures, TData, TValue>

export type AccessorKeyColumnDefBase<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = ColumnDefBase<TFeatures, TData, TValue> & {
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

export type ColumnDef_All<
  TData extends RowData,
  TValue extends CellData = CellData,
> = ColumnDef<TableFeatures, TData, TValue>

export type ColumnDefResolved<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Partial<UnionToIntersection<ColumnDef<TFeatures, TData, TValue>>> & {
  accessorKey?: string
}

export type _Column<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue = unknown,
> = Column_Column<TFeatures, TData, TValue> &
  UnionToIntersection<
    | ('ColumnFaceting' extends keyof TFeatures
        ? Column_ColumnFaceting<TFeatures, TData>
        : never)
    | ('ColumnFiltering' extends keyof TFeatures
        ? Column_ColumnFiltering<TFeatures, TData>
        : never)
    | ('ColumnGrouping' extends keyof TFeatures
        ? Column_ColumnGrouping<TFeatures, TData>
        : never)
    | ('ColumnOrdering' extends keyof TFeatures ? Column_ColumnOrdering : never)
    | ('ColumnPinning' extends keyof TFeatures ? Column_ColumnPinning : never)
    | ('ColumnResizing' extends keyof TFeatures ? Column_ColumnResizing : never)
    | ('ColumnSizing' extends keyof TFeatures ? Column_ColumnSizing : never)
    | ('ColumnVisibility' extends keyof TFeatures
        ? Column_ColumnVisibility
        : never)
    | ('GlobalFiltering' extends keyof TFeatures
        ? Column_GlobalFiltering
        : never)
    | ('RowSorting' extends keyof TFeatures
        ? Column_RowSorting<TFeatures, TData>
        : never)
  >

export type Column_All<
  TData extends RowData,
  TValue extends CellData = CellData,
> = _Column<TableFeatures, TData, TValue>

//temp - enable all features for types internally
export type Column<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> = Column_All<TData, TValue>

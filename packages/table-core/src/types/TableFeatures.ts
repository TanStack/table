import type { Fns } from './Fns'
import type { CellData, RowData } from './type-utils'
import type { ColumnDef, ColumnDefBase_All } from './ColumnDef'
import type { Cell } from './Cell'
import type { Column } from './Column'
import type { Header } from './Header'
import type { Row } from './Row'
import type { Table } from './Table'
import type { TableOptions, TableOptions_All } from './TableOptions'
import type { TableState } from './TableState'

export interface TableFeature {
  constructCell?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TFns, TData, TValue>,
    table: Table<TFeatures, TFns, TData>,
  ) => void
  constructColumn?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TFns, TData, TValue>,
    table: Table<TFeatures, TFns, TData>,
  ) => void
  constructHeader?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TFns, TData, TValue>,
    table: Table<TFeatures, TFns, TData>,
  ) => void
  constructRow?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    row: Row<TFeatures, TFns, TData>,
    table: Table<TFeatures, TFns, TData>,
  ) => void
  constructTable?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData>,
  ) => void
  getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => ColumnDefBase_All<TFeatures, TFns, TData, TValue>
  getDefaultTableOptions?: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
  >(
    table: Table<TFeatures, TFns, TData>,
  ) => Partial<TableOptions_All<TFeatures, TFns, TData>>
  getInitialState?: <TFeatures extends TableFeatures>(
    initialState: TableState<TFeatures>,
  ) => Partial<TableState<TFeatures>>
}

export interface CoreTableFeatures {
  Cells?: TableFeature
  Columns?: TableFeature
  Headers?: TableFeature
  Rows?: TableFeature
  Tables?: TableFeature
}

export interface TableFeatures extends CoreTableFeatures {
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
}

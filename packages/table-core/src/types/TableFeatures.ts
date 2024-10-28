import type { CellData, RowData } from './type-utils'
import type { ColumnDefBase_All } from './ColumnDef'
import type { Cell } from './Cell'
import type { Column } from './Column'
import type { Header } from './Header'
import type { Row } from './Row'
import type { Table } from './Table'
import type { TableOptions_All } from './TableOptions'
import type { TableState } from './TableState'

type CoreTableFeatureName = 'Cells' | 'Columns' | 'Headers' | 'Rows' | 'Tables'
type StockTableFeatureName =
  | 'ColumnFaceting'
  | 'ColumnFiltering'
  | 'ColumnGrouping'
  | 'ColumnOrdering'
  | 'ColumnPinning'
  | 'ColumnResizing'
  | 'ColumnSizing'
  | 'ColumnVisibility'
  | 'GlobalFaceting'
  | 'GlobalFiltering'
  | 'RowExpanding'
  | 'RowPagination'
  | 'RowPinning'
  | 'RowSelection'
  | 'RowSorting'
type TableFeatureName = CoreTableFeatureName | StockTableFeatureName
export type CoreTableFeatures = Partial<
  Record<CoreTableFeatureName, TableFeature>
>
export type TableFeatures = Partial<Record<TableFeatureName, TableFeature>>

export interface TableFeature {
  constructCellAPIs?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TData, TValue>,
  ) => void
  constructColumnAPIs?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    column: Column<TFeatures, TData, TValue>,
  ) => void
  constructHeaderAPIs?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
  ) => void
  constructRowAPIs?: <TFeatures extends TableFeatures, TData extends RowData>(
    row: Row<TFeatures, TData>,
  ) => void
  constructTableAPIs?: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ) => void
  getDefaultColumnDef?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >() => ColumnDefBase_All<TFeatures, TData, TValue>
  getDefaultTableOptions?: <
    TFeatures extends TableFeatures,
    TData extends RowData,
  >(
    table: Table<TFeatures, TData>,
  ) => Partial<TableOptions_All<TFeatures, TData>>
  getInitialState?: <TFeatures extends TableFeatures>(
    initialState: Partial<TableState<TFeatures>>,
  ) => Partial<TableState<TFeatures>>
}

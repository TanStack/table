import type { CellData, Getter, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table, Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'

export interface CellContext<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  cell: Cell<TFeatures, TData, TValue>
  column: Column<TFeatures, TData, TValue>
  getValue: Getter<TValue>
  renderValue: Getter<TValue | null>
  row: Row<TFeatures, TData>
  table: Table<TFeatures, TData>
}

export interface Cell_CoreProperties<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> {
  /**
   * The associated Column object for the cell.
   */
  column: Column<TFeatures, TData, TValue>
  /**
   * The unique ID for the cell across the entire table.
   */
  id: string
  /**
   * The associated Row object for the cell.
   */
  row: Row<TFeatures, TData>
  /**
   * Reference to the parent table instance.
   */
  _table: Table_Internal<TFeatures, TData>
}

export interface Cell_Cell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
> extends Cell_CoreProperties<TFeatures, TData, TValue> {
  /**
   * Returns the rendering context (or props) for cell-based components like cells and aggregated cells. Use these props with your framework's `flexRender` utility to render these using the template of your choice:
   */
  getContext: () => CellContext<TFeatures, TData, TValue>
  /**
   * Returns the value for the cell, accessed via the associated column's accessor key or accessor function.
   */
  getValue: CellContext<TFeatures, TData, TValue>['getValue']
  /**
   * Renders the value for a cell the same as `getValue`, but will return the `renderFallbackValue` if no value is found.
   */
  renderValue: CellContext<TFeatures, TData, TValue>['renderValue']
}

export interface TableOptions_Cell {
  /**
   * Value used when the desired value is not found in the data.
   */
  renderFallbackValue?: any
}

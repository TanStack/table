import { warmInstanceShape } from '../../utils'
import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type { Cell_CoreProperties } from './coreCellsFeature.types'

type CellConstructor<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = new (
  column: Column<TFeatures, TData, any>,
  row: Row<TFeatures, TData>,
  id: string,
) => Cell_CoreProperties<TFeatures, TData, any>

/**
 * Creates or retrieves the cell constructor for a table.
 *
 * Cells are allocated through a per-table constructor function (rather than
 * `Object.create`) so the engine learns the exact number of fields a cell
 * needs and stores them in-object. The constructor's prototype carries the
 * feature APIs and is shared by all cells.
 */
function getCellConstructor<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): CellConstructor<TFeatures, TData> {
  if (!table._cellConstructor) {
    const cellPrototype: Record<string, unknown> = { table }
    const features = Object.values(table._features)
    for (let i = 0; i < features.length; i++) {
      features[i]!.assignCellPrototype?.(cellPrototype, table)
    }

    // Every core own property is declared here (memo storage as `undefined`)
    // so later writes are value writes that never change the cell's hidden
    // class.
    function TableCell(
      this: any,
      column: Column<TFeatures, TData, any>,
      row: Row<TFeatures, TData>,
      id: string,
    ) {
      this._memoGetContext = undefined
      this._memos = undefined
      this.column = column
      this.id = id
      this.row = row
    }
    TableCell.prototype = cellPrototype

    table._cellPrototype = cellPrototype
    table._cellConstructor = TableCell as unknown as CellConstructor<
      TFeatures,
      TData
    >

    // Discarded warmup cell: pre-marks every declared field as mutable on
    // the shared cell shape before any real cell exists or any code
    // optimizes against it.
    warmInstanceShape(
      constructCell(
        { id: '' } as Column<TFeatures, TData, unknown>,
        { id: '' } as Row<TFeatures, TData>,
        table,
      ) as Record<string, unknown>,
    )
  }
  return table._cellConstructor as CellConstructor<TFeatures, TData>
}

/**
 * Constructs a cell instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
export function constructCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  row: Row<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
): Cell<TFeatures, TData, TValue> {
  const CellCtor = getCellConstructor(table)
  const cell = new CellCtor(column, row, `${row.id}_${column.id}`)

  // Initialize instance-specific data for features that need it
  const initFns = table._cellInstanceInitFns
  for (let i = 0; i < initFns.length; i++) {
    initFns[i]!(cell as Cell<TFeatures, TData, TValue>)
  }

  return cell as Cell<TFeatures, TData, TValue>
}

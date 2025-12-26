import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type { Cell_CoreProperties } from './coreCellsFeature.types'

/**
 * Creates or retrieves the cell prototype for a table.
 * The prototype is cached on the table and shared by all cell instances.
 */
function getCellPrototype<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): object {
  if (!table._cellPrototype) {
    table._cellPrototype = { table }
    for (const feature of Object.values(table._features)) {
      feature.assignCellPrototype?.(table._cellPrototype, table)
    }
  }
  return table._cellPrototype
}

export function constructCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  row: Row<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
): Cell<TFeatures, TData, TValue> {
  // Create cell with shared prototype for memory efficiency
  const cellPrototype = getCellPrototype(table)
  const cell = Object.create(cellPrototype) as Cell_CoreProperties<
    TFeatures,
    TData,
    TValue
  >

  // Only assign instance-specific properties
  cell.column = column
  cell.id = `${row.id}_${column.id}`
  cell.row = row

  return cell as Cell<TFeatures, TData, TValue>
}

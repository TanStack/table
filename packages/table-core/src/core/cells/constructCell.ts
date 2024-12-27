import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type { Cell_CoreProperties } from './coreCellsFeature.types'

export function constructCell<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TData, TValue>,
  row: Row<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
): Cell<TFeatures, TData, TValue> {
  const cell: Cell_CoreProperties<TFeatures, TData, TValue> = {
    column,
    id: `${row.id}_${column.id}`,
    row,
    _table: table,
  }

  for (const feature of Object.values(table._features)) {
    feature.constructCellAPIs?.(cell as Cell<TFeatures, TData, TValue>)
  }

  return cell as Cell<TFeatures, TData, TValue>
}

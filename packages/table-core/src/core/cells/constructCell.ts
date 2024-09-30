import type { Fns } from '../../types/Fns'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { Cell } from '../../types/Cell'
import type { Column } from '../../types/Column'
import type { Cell_CoreProperties } from './Cells.types'

export function constructCell<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column<TFeatures, TFns, TData, TValue>,
  row: Row<TFeatures, TFns, TData>,
  table: Table<TFeatures, TFns, TData>,
): Cell<TFeatures, TFns, TData, TValue> {
  const cell: Cell_CoreProperties<TFeatures, TFns, TData, TValue> = {
    column,
    id: `${row.id}_${column.id}`,
    row,
  }

  for (const feature of Object.values(table._features)) {
    feature?.constructCell?.(
      cell as Cell<TFeatures, TFns, TData, TValue>,
      table,
    )
  }

  return cell as Cell<TFeatures, TFns, TData, TValue>
}

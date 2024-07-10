import { getMemoOptions, memo } from '../../utils'
import { cell_getContext, cell_getValue, cell_renderValue } from './Cells.utils'
import type {
  Cell,
  CellData,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'

export const Cells: TableFeature = {
  _createCell: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ) => {
    cell.getValue = () => cell_getValue(cell, table) as any

    cell.renderValue = () => cell_renderValue(cell, table)

    cell.getContext = memo(
      () => [cell, table],
      (c, t) => cell_getContext(c, t),
      getMemoOptions(table.options, 'debugCells', 'cell.getContext'),
    )
  },
}

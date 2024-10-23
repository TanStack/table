import { assignAPIs } from '../../utils'
import { cell_getContext, cell_getValue, cell_renderValue } from './Cells.utils'
import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'

export const Cells: TableFeature = {
  constructCell: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TData, TValue>,
    table: Table_Internal<TFeatures, TData>,
  ) => {
    assignAPIs(cell, table, [
      {
        fn: () => cell_getValue(cell),
      },
      {
        fn: () => cell_renderValue(cell, table),
      },
      {
        fn: () => cell_getContext(cell, table),
        memoDeps: () => [cell, table],
      },
    ])
  },
}

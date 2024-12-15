import { assignAPIs } from '../../utils'
import {
  cell_getContext,
  cell_getValue,
  cell_renderValue,
} from './coreCellsFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

export const coreCellsFeature: TableFeature<{
  // Cell: Cell_Cell<TableFeatures, RowData, CellData>
  // TableOptions: TableOptions_Cell
}> = {
  constructCellAPIs: (cell) => {
    assignAPIs(cell, [
      {
        fn: () => cell_getValue(cell),
      },
      {
        fn: () => cell_renderValue(cell),
      },
      {
        fn: () => cell_getContext(cell),
        memoDeps: () => [cell],
      },
    ])
  },
}

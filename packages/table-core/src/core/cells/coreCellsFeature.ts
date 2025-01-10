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
  feature: 'coreCellsFeature',

  constructCellAPIs: (cell) => {
    assignAPIs('coreCellsFeature', cell, [
      {
        fn: () => cell_getValue(cell),
        fnName: 'cell_getValue',
      },
      {
        fn: () => cell_renderValue(cell),
        fnName: 'cell_renderValue',
      },
      {
        fn: () => cell_getContext(cell),
        fnName: 'cell_getContext',
        memoDeps: () => [cell],
      },
    ])
  },
}

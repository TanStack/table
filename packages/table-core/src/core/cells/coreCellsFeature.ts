import { assignAPIs } from '../../utils'
import {
  cell_getContext,
  cell_getValue,
  cell_renderValue,
} from './coreCellsFeature.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'

export const coreCellsFeature: TableFeature = {
  constructCellAPIs: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TData, TValue>,
  ) => {
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

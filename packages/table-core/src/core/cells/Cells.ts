import { assignAPIs } from '../../utils'
import { cell_getContext, cell_getValue, cell_renderValue } from './Cells.utils'
import type { Fns } from '../../types/Fns'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Cell } from '../../types/Cell'

export const Cells: TableFeature = {
  constructCell: <
    TFeatures extends TableFeatures,
    TFns extends Fns<TFeatures, TFns, TData>,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    cell: Cell<TFeatures, TFns, TData, TValue>,
    table: Table<TFeatures, TFns, TData>,
  ) => {
    assignAPIs(cell, table, [
      {
        fn: () => cell_getValue(cell, table) as any,
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

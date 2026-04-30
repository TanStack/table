import { assignPrototypeAPIs } from '../../utils'
import {
  cell_getContext,
  cell_getValue,
  cell_renderValue,
} from './coreCellsFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type { Cell_Cell, TableOptions_Cell } from './coreCellsFeature.types'

export interface CoreCellsFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Cell: Cell_Cell<TableFeatures, RowData>
  // TableOptions: TableOptions_Cell
}

export function constructCoreCellsFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<CoreCellsFeatureConstructors<TFeatures, TData>> {
  return {
    assignCellPrototype: (prototype, table) => {
      assignPrototypeAPIs('coreCellsFeature', prototype, table, {
        cell_getValue: {
          fn: (cell) => cell_getValue(cell),
        },
        cell_renderValue: {
          fn: (cell) => cell_renderValue(cell),
        },
        cell_getContext: {
          fn: (cell) => cell_getContext(cell),
          memoDeps: (cell) => [cell],
        },
      })
    },
  }
}

/**
 * The Core Cells feature provides the core cell functionality.
 */
export const coreCellsFeature = constructCoreCellsFeature()

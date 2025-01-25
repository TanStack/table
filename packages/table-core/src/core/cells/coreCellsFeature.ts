import { assignAPIs } from '../../utils'
import {
  cell_getContext,
  cell_getValue,
  cell_renderValue,
} from './coreCellsFeature.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type { Cell_Cell, TableOptions_Cell } from './coreCellsFeature.types'

interface CoreCellsFeatureConstructors<
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
}

/**
 * The Core Cells feature provides the core cell functionality.
 */
export const coreCellsFeature = constructCoreCellsFeature()

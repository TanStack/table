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
      assignAPIs('coreCellsFeature', cell, {
        cell_getValue: {
          fn: () => cell_getValue(cell),
        },
        cell_renderValue: {
          fn: () => cell_renderValue(cell),
        },
        cell_getContext: {
          fn: () => cell_getContext(cell),
          memoDeps: () => [cell],
        },
      })
    },
  }
}

/**
 * The Core Cells feature provides the core cell functionality.
 */
export const coreCellsFeature = constructCoreCellsFeature()

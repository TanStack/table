import { assignPrototypeAPIs } from '../../utils'
import {
  cell_getContext,
  cell_getValue,
  cell_renderValue,
} from './coreCellsFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Core feature that adds cell value, render, and context APIs.
 */
export const coreCellsFeature: TableFeature = {
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

import { assignPrototypeAPIs } from '../../utils'
import {
  cell_getIsAggregated,
  column_getAggregationFns,
  column_getAggregationValue,
  column_getAutoAggregationFn,
} from './rowAggregationFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Independent aggregation feature for grouped values and root/custom-row totals.
 */
export const rowAggregationFeature: TableFeature = {
  getDefaultColumnDef: () => ({
    aggregationFn: 'auto',
    maxAggregationDepth: 0,
  }),

  getDefaultTableOptions: () => ({
    manualAggregation: false,
  }),

  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs('rowAggregationFeature', prototype, table, {
      cell_getIsAggregated: {
        fn: (cell) => cell_getIsAggregated(cell),
      },
    })
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('rowAggregationFeature', prototype, table, {
      column_getAggregationFns: {
        fn: (column) => column_getAggregationFns(column),
      },
      column_getAggregationValue: {
        fn: (column, options) => column_getAggregationValue(column, options),
      },
      column_getAutoAggregationFn: {
        fn: (column) => column_getAutoAggregationFn(column),
        memoDeps: (column) => [
          column.table.getCoreRowModel(),
          column.table._rowModelFns.aggregationFns,
        ],
      },
    })
  },

  initColumnInstanceData: (column) => {
    ;(column as any)._aggregationValueCache = undefined
    ;(column as any)._resolvedAggregationFnsCache = undefined
  },
}

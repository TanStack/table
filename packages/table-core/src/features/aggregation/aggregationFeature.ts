import { assignPrototypeAPIs, makeObjectMap } from '../../utils'
import {
  cell_getIsAggregated,
  column_getAggregationFns,
  column_getAggregationValue,
  column_getAutoAggregationFn,
  formatAggregatedCellValue,
} from './aggregationFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Independent aggregation feature for grouped values and root/custom-row totals.
 */
export const aggregationFeature: TableFeature = {
  getDefaultColumnDef: () => ({
    aggregatedCell: ({ column, getValue }: any) =>
      formatAggregatedCellValue(getValue(), column.columnDef.aggregationFn),
    aggregationFn: 'auto',
    maxAggregationDepth: 0,
  }),

  getDefaultTableOptions: () => ({
    manualAggregation: false,
  }),

  assignCellPrototype: (prototype, table) => {
    assignPrototypeAPIs('aggregationFeature', prototype, table, {
      cell_getIsAggregated: {
        fn: (cell) => cell_getIsAggregated(cell),
      },
    })
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('aggregationFeature', prototype, table, {
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

  initRowInstanceData: (row) => {
    ;(row as any)._aggregationValuesCache = makeObjectMap()
  },
}

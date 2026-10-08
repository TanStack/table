import { assignPrototypeAPIs } from '../../utils'
import {
  aggregateColumnValue,
  cell_getIsAggregated,
  column_getAggregationFns,
  column_getAggregationValue,
  column_getAutoAggregationFn,
  formatAggregatedCellValue,
} from './rowAggregationFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Independent aggregation feature for grouped values and root/custom-row totals.
 */
export const rowAggregationFeature: TableFeature = {
  getDefaultColumnDef: () => ({
    aggregatedCell: ({ column, getValue }: any) =>
      formatAggregatedCellValue(getValue(), column.columnDef.aggregationFn),
    aggregationFn: 'auto',
    maxAggregationDepth: 0,
  }),

  getDefaultTableOptions: () => ({
    manualAggregation: false,
  }),

  initTableInstanceData: (table) => {
    // @ts-ignore - _aggregateColumnValue is row aggregation table instance
    // data. The grouped row model reads the executor from here so tables that
    // group without aggregating don't bundle it.
    table._aggregateColumnValue = aggregateColumnValue
  },

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

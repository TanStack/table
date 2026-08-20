import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
import {
  column_getFacetedMinMaxValues,
  column_getFacetedRowModel,
  column_getFacetedUniqueValues,
  table_getGlobalFacetedMinMaxValues,
  table_getGlobalFacetedRowModel,
  table_getGlobalFacetedUniqueValues,
} from './columnFacetingFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that derives faceted row models, unique values, and min/max values for filters.
 *
 * These APIs are deliberately not memoized at this layer: the stock
 * `createFaceted*` factories memoize internally (like every other stock row
 * model), and an extra memo layer here would freeze custom factories whose
 * data changes independently of the faceted row model. Custom factories own
 * their memoization.
 */
export const columnFacetingFeature: TableFeature = {
  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnFacetingFeature', prototype, table, {
      column_getFacetedRowModel: {
        fn: (column) => column_getFacetedRowModel(column, column.table),
      },
      column_getFacetedMinMaxValues: {
        fn: (column) => column_getFacetedMinMaxValues(column, column.table),
      },
      column_getFacetedUniqueValues: {
        fn: (column) => column_getFacetedUniqueValues(column, column.table),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnFacetingFeature', table, {
      table_getGlobalFacetedRowModel: {
        fn: () => table_getGlobalFacetedRowModel(table),
      },
      table_getGlobalFacetedMinMaxValues: {
        fn: () => table_getGlobalFacetedMinMaxValues(table),
      },
      table_getGlobalFacetedUniqueValues: {
        fn: () => table_getGlobalFacetedUniqueValues(table),
      },
    })
  },
}

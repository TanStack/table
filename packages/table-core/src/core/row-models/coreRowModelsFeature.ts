import { assignTableAPIs } from '../../utils'
import {
  table_getCoreRowModel,
  table_getExpandedRowModel,
  table_getFilteredRowModel,
  table_getGroupedRowModel,
  table_getPaginatedRowModel,
  table_getPreExpandedRowModel,
  table_getPreFilteredRowModel,
  table_getPreGroupedRowModel,
  table_getPrePaginatedRowModel,
  table_getPreSortedRowModel,
  table_getRowModel,
  table_getSortedRowModel,
} from './coreRowModelsFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Core feature that wires table row-model accessors and row-model caches.
 */
export const coreRowModelsFeature: TableFeature = {
  constructTableAPIs: (table) => {
    assignTableAPIs('coreRowModelsFeature', table, {
      table_getCoreRowModel: {
        fn: () => table_getCoreRowModel(table),
      },
      table_getPreFilteredRowModel: {
        fn: () => table_getPreFilteredRowModel(table),
      },
      table_getFilteredRowModel: {
        fn: () => table_getFilteredRowModel(table),
      },
      table_getPreGroupedRowModel: {
        fn: () => table_getPreGroupedRowModel(table),
      },
      table_getGroupedRowModel: {
        fn: () => table_getGroupedRowModel(table),
      },
      table_getPreSortedRowModel: {
        fn: () => table_getPreSortedRowModel(table),
      },
      table_getSortedRowModel: {
        fn: () => table_getSortedRowModel(table),
      },
      table_getPreExpandedRowModel: {
        fn: () => table_getPreExpandedRowModel(table),
      },
      table_getExpandedRowModel: {
        fn: () => table_getExpandedRowModel(table),
      },
      table_getPrePaginatedRowModel: {
        fn: () => table_getPrePaginatedRowModel(table),
      },
      table_getPaginatedRowModel: {
        fn: () => table_getPaginatedRowModel(table),
      },
      table_getRowModel: {
        fn: () => table_getRowModel(table),
      },
    })
  },
}

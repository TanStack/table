import { assignAPIs } from '../../utils'
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
import type { Table_RowModels } from './coreRowModelsFeature.types'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'

export const coreRowModelsFeature: TableFeature<{
  Table: Table_RowModels<TableFeatures, RowData>
}> = {
  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: () => table_getCoreRowModel(table),
        fnName: 'table_getCoreRowModel',
      },
      {
        fn: () => table_getPreFilteredRowModel(table),
        fnName: 'table_getPreFilteredRowModel',
      },
      {
        fn: () => table_getFilteredRowModel(table),
        fnName: 'table_getFilteredRowModel',
      },
      {
        fn: () => table_getPreGroupedRowModel(table),
        fnName: 'table_getPreGroupedRowModel',
      },
      {
        fn: () => table_getGroupedRowModel(table),
        fnName: 'table_getGroupedRowModel',
      },
      {
        fn: () => table_getPreSortedRowModel(table),
        fnName: 'table_getPreSortedRowModel',
      },
      {
        fn: () => table_getSortedRowModel(table),
        fnName: 'table_getSortedRowModel',
      },
      {
        fn: () => table_getPreExpandedRowModel(table),
        fnName: 'table_getPreExpandedRowModel',
      },
      {
        fn: () => table_getExpandedRowModel(table),
        fnName: 'table_getExpandedRowModel',
      },
      {
        fn: () => table_getPrePaginatedRowModel(table),
        fnName: 'table_getPrePaginatedRowModel',
      },
      {
        fn: () => table_getPaginatedRowModel(table),
        fnName: 'table_getPaginatedRowModel',
      },
      {
        fn: () => table_getRowModel(table),
        fnName: 'table_getRowModel',
      },
    ])
  },
}
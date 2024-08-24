import { assignAPIs } from '../../utils'
import {
  table_getCoreRowModel,
  table_getRowModel,
  table_getState,
  table_reset,
  table_setOptions,
  table_setState,
} from './Tables.utils'
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'

export const Tables: TableFeature = {
  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(table, table, [
      {
        fn: () => table_getCoreRowModel(table),
      },
      {
        fn: () => table_getRowModel(table),
      },
      {
        fn: () => table_getState(table),
      },
      {
        fn: () => table_reset(table),
      },
      {
        fn: (updater) => table_setOptions(table, updater),
      },
      {
        fn: (updater) => table_setState(table, updater),
      },
    ])
  },
}

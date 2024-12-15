import { assignAPIs } from '../../utils'
import {
  table_getState,
  table_reset,
  table_setOptions,
  table_setState,
} from './coreTablesFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

export const coreTablesFeature: TableFeature<{
  // Table: Table_Table<TableFeatures, RowData>
  // TableOptions: TableOptions_Table<TableFeatures, RowData>
}> = {
  constructTableAPIs: (table) => {
    assignAPIs(table, [
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

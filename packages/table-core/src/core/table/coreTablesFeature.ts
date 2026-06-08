import { assignTableAPIs } from '../../utils'
import { table_reset, table_setOptions } from './coreTablesFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Core feature that adds base table instance APIs such as reset and setOptions.
 */
export const coreTablesFeature: TableFeature = {
  constructTableAPIs: (table) => {
    assignTableAPIs('coreTablesFeature', table, {
      table_reset: {
        fn: () => table_reset(table),
      },
      table_setOptions: {
        fn: (updater) => table_setOptions(table, updater),
      },
    })
  },
}

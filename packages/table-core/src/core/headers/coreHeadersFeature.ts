import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
import {
  header_getContext,
  header_getLeafHeaders,
  table_getFlatHeaders,
  table_getFooterGroups,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from './coreHeadersFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Core feature that builds header groups and exposes header context APIs.
 */
export const coreHeadersFeature: TableFeature = {
  assignHeaderPrototype: (prototype, table) => {
    assignPrototypeAPIs('coreHeadersFeature', prototype, table, {
      header_getLeafHeaders: {
        fn: (header) => header_getLeafHeaders(header),
        memoDeps: (header) => [header.column.table.options.columns],
      },
      header_getContext: {
        fn: (header) => header_getContext(header),
        memoDeps: (header) => [header.column.table.options.columns],
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('coreHeadersFeature', table, {
      table_getHeaderGroups: {
        fn: () => table_getHeaderGroups(table),
        memoDeps: () => [
          table.options.columns,
          table.atoms.columnOrder?.get(),
          table.atoms.grouping?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.columnVisibility?.get(),
          table.options.groupedColumnMode,
        ],
      },
      table_getFooterGroups: {
        fn: () => table_getFooterGroups(table),
        memoDeps: () => [table.getHeaderGroups()],
      },
      table_getFlatHeaders: {
        fn: () => table_getFlatHeaders(table),
        memoDeps: () => [table.getHeaderGroups()],
      },
      table_getLeafHeaders: {
        fn: () => table_getLeafHeaders(table),
        memoDeps: () => [table.getHeaderGroups()],
      },
    })
  },
}

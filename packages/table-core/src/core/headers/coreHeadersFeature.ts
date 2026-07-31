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
        computed: (header) => {
          void header.column.table.options.columns
          return header_getLeafHeaders(header)
        },
      },
      header_getContext: {
        computed: (header) => {
          void header.column.table.options.columns
          return header_getContext(header)
        },
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('coreHeadersFeature', table, {
      table_getHeaderGroups: {
        computed: () => table_getHeaderGroups(table),
      },
      table_getFooterGroups: {
        computed: () => table_getFooterGroups(table),
      },
      table_getFlatHeaders: {
        computed: () => table_getFlatHeaders(table),
      },
      table_getLeafHeaders: {
        computed: () => table_getLeafHeaders(table),
      },
    })
  },
}

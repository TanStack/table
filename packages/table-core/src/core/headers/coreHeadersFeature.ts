import { assignAPIs } from '../../utils'
import {
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getRightHeaderGroups,
} from '../../features/column-pinning/columnPinningFeature.utils'
import {
  header_getContext,
  header_getLeafHeaders,
  table_getFlatHeaders,
  table_getFooterGroups,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from './coreHeadersFeature.utils'

import type { TableFeature } from '../../types/TableFeatures'

export const coreHeadersFeature: TableFeature<{
  // Header: Header_Header<TableFeatures, RowData, CellData>
  // Table: Table_Headers<TableFeatures, RowData>
  // TableOptions: TableOptions_Headers
}> = {
  constructHeaderAPIs: (header) => {
    assignAPIs(header, [
      {
        fn: () => header_getLeafHeaders(header),
        memoDeps: () => [header.column.table.options.columns],
      },
      {
        fn: () => header_getContext(header),
        memoDeps: () => [header.column.table.options.columns],
      },
    ])
  },

  constructTableAPIs: (table) => {
    assignAPIs(table, [
      {
        fn: () => table_getHeaderGroups(table),
        memoDeps: () => [
          table.options.columns,
          table.options.state?.columnOrder,
          table.options.state?.grouping,
          table.options.state?.columnPinning,
          table.options.groupedColumnMode,
        ],
      },
      {
        fn: () => table_getFooterGroups(table),
        memoDeps: () => [table.getHeaderGroups()],
      },
      {
        fn: () => table_getFlatHeaders(table),
        memoDeps: () => [table.getHeaderGroups()],
      },
      {
        fn: () => table_getLeafHeaders(table),
        memoDeps: () => [
          table_getLeftHeaderGroups(table),
          table_getCenterHeaderGroups(table),
          table_getRightHeaderGroups(table),
        ],
      },
    ])
  },
}

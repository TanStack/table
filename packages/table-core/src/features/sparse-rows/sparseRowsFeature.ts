import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
import {
  row_getIsPlaceholder,
  table_createSparseRowModel,
  table_getMissingRowRanges,
  table_getRowByPlaceholderId,
} from './sparseRowsFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that reads `data` as a sparse array of loaded rows and fills the core
 * row model with placeholder rows up to `rowCount`.
 *
 * It is not part of `stockFeatures`, because it changes how the table reads
 * `data` and `rowCount`.
 */
export const sparseRowsFeature: TableFeature = {
  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('sparseRowsFeature', prototype, table, {
      row_getIsPlaceholder: {
        fn: (row) => row_getIsPlaceholder(row),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('sparseRowsFeature', table, {
      table__createSparseRowModel: {
        fn: () => table_createSparseRowModel(table),
      },
      table__getRowByPlaceholderId: {
        fn: (rowId) => table_getRowByPlaceholderId(table, rowId),
      },
      table_getMissingRowRanges: {
        fn: (options) => table_getMissingRowRanges(table, options),
      },
    })
  },
}

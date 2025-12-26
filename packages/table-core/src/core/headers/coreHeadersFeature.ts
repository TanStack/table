import {
  assignTableAPIs,
  assignPrototypeAPIs,
  callMemoOrStaticFn,
} from '../../utils'
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
import type { RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
// import type { Header_Header, Table_Headers } from './coreHeadersFeature.types'

interface CoreHeadersFeatureConstructors<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  // Header: Header_Header<TFeatures, TData>
  // Table: Table_Headers<TFeatures, TData>
}

export function constructCoreHeadersFeature<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(): TableFeature<CoreHeadersFeatureConstructors<TFeatures, TData>> {
  return {
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
            table.store.state?.columnOrder,
            table.store.state.grouping,
            table.store.state.columnPinning,
            table.store.state.columnVisibility,
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
          memoDeps: () => [
            callMemoOrStaticFn(
              table,
              'getLeftHeaderGroups',
              table_getLeftHeaderGroups,
            ),
            callMemoOrStaticFn(
              table,
              'getCenterHeaderGroups',
              table_getCenterHeaderGroups,
            ),
            callMemoOrStaticFn(
              table,
              'getRightHeaderGroups',
              table_getRightHeaderGroups,
            ),
          ],
        },
      })
    },
  }
}

/**
 * The Core Headers feature provides the core header functionality.
 */
export const coreHeadersFeature = constructCoreHeadersFeature()

import { assignAPIs, callMemoOrStaticFn } from '../../utils'
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
    constructHeaderAPIs: (header) => {
      assignAPIs('coreHeadersFeature', header, [
        {
          fn: () => header_getLeafHeaders(header),
          fnName: 'header_getLeafHeaders',
          memoDeps: () => [header.column._table.options.columns],
        },
        {
          fn: () => header_getContext(header),
          fnName: 'header_getContext',
          memoDeps: () => [header.column._table.options.columns],
        },
      ])
    },

    constructTableAPIs: (table) => {
      assignAPIs('coreHeadersFeature', table, [
        {
          fn: () => table_getHeaderGroups(table),
          fnName: 'table_getHeaderGroups',
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
          fnName: 'table_getFooterGroups',
          memoDeps: () => [table.getHeaderGroups()],
        },
        {
          fn: () => table_getFlatHeaders(table),
          fnName: 'table_getFlatHeaders',
          memoDeps: () => [table.getHeaderGroups()],
        },
        {
          fn: () => table_getLeafHeaders(table),
          fnName: 'table_getLeafHeaders',
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
      ])
    },
  }
}

/**
 * The Core Headers feature provides the core header functionality.
 */
export const coreHeadersFeature = constructCoreHeadersFeature()

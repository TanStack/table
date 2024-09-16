import { assignAPIs, getMemoOptions, memo } from '../../utils'
import { table_getState } from '../table/Tables.utils'
import {
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getRightHeaderGroups,
} from '../../features/column-pinning/ColumnPinning.utils'
import { constructHeader } from './constructHeader'
import {
  header_getContext,
  header_getLeafHeaders,
  table_getFlatHeaders,
  table_getFooterGroups,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from './Headers.utils'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'

export const Headers: TableFeature = {
  constructHeader: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    header.getLeafHeaders = () => header_getLeafHeaders(header)

    header.getContext = () => header_getContext(header, table)
  },

  constructTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    assignAPIs(table, table, [
      {
        fn: () => table_getHeaderGroups(table),
        memoDeps: () => [
          table.options.columns,
          table_getState(table).columnOrder,
          table_getState(table).grouping,
          table_getState(table).columnPinning,
          table.options.groupedColumnMode,
        ],
      },
      {
        fn: () => table_getFooterGroups(table),
        memoDeps: () => [table_getHeaderGroups(table)],
      },
      {
        fn: () => table_getFlatHeaders(table),
        memoDeps: () => [table_getHeaderGroups(table)],
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

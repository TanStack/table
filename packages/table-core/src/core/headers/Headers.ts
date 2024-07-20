import { getMemoOptions, memo } from '../../utils'
import { _createHeader } from './createHeader'
import {
  header_getContext,
  header_getLeafHeaders,
  table_getFlatHeaders,
  table_getFooterGroups,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from './Headers.utils'
import type { Header_Header } from './Headers.types'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeature, TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'

export const Headers: TableFeature = {
  _createHeader: <
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

  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.getHeaderGroups = memo(
      () => [
        table.options.columns,
        table.getState().columnOrder,
        table.getState().grouping,
        table.getState().columnPinning,
        table.options.groupedColumnMode,
      ],
      () => table_getHeaderGroups(table),
      getMemoOptions(table.options, 'debugHeaders', 'getHeaderGroups'),
    )

    table.getFooterGroups = memo(
      () => [table.getHeaderGroups()],
      (headerGroups) => table_getFooterGroups(headerGroups),
      getMemoOptions(table.options, 'debugHeaders', 'getFooterGroups'),
    )

    table.getFlatHeaders = memo(
      () => [table.getHeaderGroups()],
      (headerGroups) => table_getFlatHeaders(headerGroups),
      getMemoOptions(table.options, 'debugHeaders', 'getFlatHeaders'),
    )

    table.getLeafHeaders = memo(
      () => [
        table.getLeftHeaderGroups(),
        table.getCenterHeaderGroups(),
        table.getRightHeaderGroups(),
      ],
      (left, center, right) => table_getLeafHeaders(left, center, right),
      getMemoOptions(table.options, 'debugHeaders', 'getLeafHeaders'),
    )
  },
}

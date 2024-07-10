import { getMemoOptions, memo } from '../../utils'
import { _createHeader } from './createHeader'
import {
  table_getFlatHeaders,
  table_getFooterGroups,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from './Headers.utils'
import type { Header_Header } from './Headers.types'
import type {
  CellData,
  Header,
  RowData,
  Table,
  TableFeature,
  TableFeatures,
} from '../../types'

export const Headers: TableFeature = {
  _createTable: <TFeatures extends TableFeatures, TData extends RowData>(
    table: Table<TFeatures, TData>,
  ): void => {
    table.getHeaderGroups = memo(
      () => [
        table.getAllColumns(),
        table.getVisibleLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, leafColumns, left, right) =>
        table_getHeaderGroups(table, allColumns, leafColumns, left, right),
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

  _createHeader: <
    TFeatures extends TableFeatures,
    TData extends RowData,
    TValue extends CellData = CellData,
  >(
    header: Header<TFeatures, TData, TValue>,
    table: Table<TFeatures, TData>,
  ): void => {
    header.getLeafHeaders = (): Array<Header<TFeatures, TData, TValue>> => {
      const leafHeaders: Array<Header<TFeatures, TData, TValue>> = []

      const recurseHeader = (h: Header_Header<TFeatures, TData, TValue>) => {
        if (h.subHeaders.length) {
          h.subHeaders.map(recurseHeader)
        }
        leafHeaders.push(h as Header<TFeatures, TData, TValue>)
      }

      recurseHeader(header)

      return leafHeaders
    }

    header.getContext = () => ({
      column: header.column,
      header,
      table,
    })
  },
}

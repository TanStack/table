import { Header, RowData, Table, TableFeature } from '../../types'
import { getMemoOptions, memo } from '../../utils'
import { _createHeader } from './_createHeader'
import { Header_Core } from './Headers.types'
import {
  table_getFlatHeaders,
  table_getFooterGroups,
  table_getHeaderGroups,
  table_getLeafHeaders,
} from './Headers.utils'

export const Headers: TableFeature = {
  _createTable: <TData extends RowData>(table: Table<TData>): void => {
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

  _createHeader: <TData extends RowData>(
    header: Header<TData, unknown>,
    table: Table<TData>,
  ): void => {
    header.getLeafHeaders = (): Header<TData, unknown>[] => {
      const leafHeaders: Header<TData, unknown>[] = []

      const recurseHeader = (h: Header_Core<TData, any>) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader)
        }
        leafHeaders.push(h as Header<TData, unknown>)
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

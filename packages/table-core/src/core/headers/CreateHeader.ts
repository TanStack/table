import { Column, Header, RowData, Table } from '../../types'
import { Header_Core } from './Headers.types'

export function _createHeader<TData extends RowData, TValue>(
  table: Table<TData>,
  column: Column<TData, TValue>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  }
): Header<TData, TValue> {
  const id = options.id ?? column.id

  let header: Header_Core<TData, TValue> = {
    id,
    column,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    depth: options.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null!,
    getLeafHeaders: (): Header<TData, unknown>[] => {
      const leafHeaders: Header<TData, unknown>[] = []

      const recurseHeader = (h: Header_Core<TData, any>) => {
        if (h.subHeaders && h.subHeaders.length) {
          h.subHeaders.map(recurseHeader)
        }
        leafHeaders.push(h as Header<TData, unknown>)
      }

      recurseHeader(header)

      return leafHeaders
    },
    getContext: () => ({
      table,
      header: header as Header<TData, TValue>,
      column,
    }),
  }

  table._features.forEach(feature => {
    feature._createHeader?.(header as Header<TData, TValue>, table)
  })

  return header as Header<TData, TValue>
}

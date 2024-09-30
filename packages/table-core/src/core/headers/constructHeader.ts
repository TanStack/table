import type { Fns } from '../../types/Fns'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type { Header_CoreProperties } from './Headers.types'

export function constructHeader<
  TFeatures extends TableFeatures,
  TFns extends Fns<TFeatures, TFns, TData>,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  table: Table<TFeatures, TFns, TData>,
  column: Column<TFeatures, TFns, TData, TValue>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  },
): Header<TFeatures, TFns, TData, TValue> {
  const header: Header_CoreProperties<TFeatures, TFns, TData, TValue> = {
    colSpan: 0,
    column,
    depth: options.depth,
    headerGroup: null,
    id: options.id ?? column.id,
    index: options.index,
    isPlaceholder: !!options.isPlaceholder,
    placeholderId: options.placeholderId,
    rowSpan: 0,
    subHeaders: [],
  }

  for (const feature of Object.values(table._features)) {
    feature?.constructHeader?.(
      header as Header<TFeatures, TFns, TData, TValue>,
      table,
    )
  }

  return header as Header<TFeatures, TFns, TData, TValue>
}

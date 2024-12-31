import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type { Header_CoreProperties } from './coreHeadersFeature.types'

export function constructHeader<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  table: Table_Internal<TFeatures, TData>,
  column: Column<TFeatures, TData, TValue>,
  options: {
    id?: string
    isPlaceholder?: boolean
    placeholderId?: string
    index: number
    depth: number
  },
): Header<TFeatures, TData, TValue> {
  const header: Header_CoreProperties<TFeatures, TData, TValue> = {
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
    _table: table,
  }

  for (const feature of Object.values(table._features)) {
    feature.constructHeaderAPIs?.(header as Header<TFeatures, TData, TValue>)
  }

  return header as Header<TFeatures, TData, TValue>
}

import type { Table_Internal } from '../../types/Table'
import type { CellData, RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Header } from '../../types/Header'
import type { Column } from '../../types/Column'
import type { Header_CoreProperties } from './coreHeadersFeature.types'

/**
 * Creates or retrieves the header prototype for a table.
 * The prototype is cached on the table and shared by all header instances.
 */
function getHeaderPrototype<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): object {
  if (!table._headerPrototype) {
    table._headerPrototype = { table }
    const features = Object.values(table._features)
    for (let i = 0; i < features.length; i++) {
      features[i]!.assignHeaderPrototype?.(table._headerPrototype, table)
    }
  }
  return table._headerPrototype
}

/**
 * Constructs a header instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
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
  // Create header with shared prototype for memory efficiency
  const headerPrototype = getHeaderPrototype(table)
  const header = Object.create(headerPrototype) as Header_CoreProperties<
    TFeatures,
    TData,
    TValue
  >

  // Only assign instance-specific properties
  header.colSpan = 0
  header.column = column
  header.depth = options.depth
  header.headerGroup = null
  header.id = options.id ?? column.id
  header.index = options.index
  header.isPlaceholder = !!options.isPlaceholder
  header.placeholderId = options.placeholderId
  header.rowSpan = 0
  header.subHeaders = []

  return header as Header<TFeatures, TData, TValue>
}

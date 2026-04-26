import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Row_CoreProperties } from './coreRowsFeature.types'

/**
 * Creates or retrieves the row prototype for a table.
 * The prototype is cached on the table and shared by all row instances.
 */
function getRowPrototype<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): object {
  if (!table._rowPrototype) {
    table._rowPrototype = { table }
    for (const feature of Object.values(table._features)) {
      feature.assignRowPrototype?.(table._rowPrototype, table)
    }
  }
  return table._rowPrototype
}

export const constructRow = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  subRows?: Array<Row<TFeatures, TData>>,
  parentId?: string,
): Row<TFeatures, TData> => {
  // Create row with shared prototype for memory efficiency
  const rowPrototype = getRowPrototype(table)
  const row = Object.create(rowPrototype) as Row_CoreProperties<
    TFeatures,
    TData
  >

  // Only assign instance-specific properties
  row._uniqueValuesCache = {}
  row._valuesCache = {}
  row.depth = depth
  row.id = id
  row.index = rowIndex
  row.original = original
  row.parentId = parentId
  row.subRows = subRows ?? []

  // Initialize instance-specific data (e.g., caches) for features that need it
  for (const feature of Object.values(table._features)) {
    feature.initRowInstanceData?.(row)
  }

  return row as Row<TFeatures, TData>
}

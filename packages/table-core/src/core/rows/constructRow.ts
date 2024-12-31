import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Row_CoreProperties } from './coreRowsFeature.types'

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
  const row: Row_CoreProperties<TFeatures, TData> = {
    _uniqueValuesCache: {},
    _valuesCache: {},
    depth,
    id,
    index: rowIndex,
    original,
    parentId,
    subRows: subRows ?? [],
    _table: table,
  }

  for (const feature of Object.values(table._features)) {
    feature.constructRowAPIs?.(row as Row<TFeatures, TData>)
  }

  return row as Row<TFeatures, TData>
}

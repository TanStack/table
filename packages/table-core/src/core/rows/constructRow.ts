import { makeObjectMap, warmInstanceShape } from '../../utils'
import type { Table_Internal } from '../../types/Table'
import type { RowData } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'
import type { Row_CoreProperties } from './coreRowsFeature.types'

type RowConstructor<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = new (
  id: string,
  original: TData,
  rowIndex: number,
  depth: number,
  parentId: string | undefined,
  subRows: Array<Row<TFeatures, TData>>,
) => Row_CoreProperties<TFeatures, TData>

/**
 * Creates or retrieves the row constructor for a table.
 *
 * Rows are allocated through a per-table constructor function (rather than
 * `Object.create`) so the engine learns the exact number of fields a row
 * needs and stores them in-object, instead of spilling into an out-of-line
 * property backing store that reallocates as fields are assigned. The
 * constructor's prototype carries the feature APIs and is shared by all rows.
 */
function getRowConstructor<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowConstructor<TFeatures, TData> {
  if (!table._rowConstructor) {
    const rowPrototype: Record<string, unknown> = { table }
    const features = Object.values(table._features)
    for (let i = 0; i < features.length; i++) {
      features[i]!.assignRowPrototype?.(rowPrototype, table)
    }

    // Every core own property is declared here (as `undefined` when it has no
    // value yet) so later writes are value writes that never change the row's
    // hidden class.
    function TableRow(
      this: any,
      id: string,
      original: TData,
      rowIndex: number,
      depth: number,
      parentId: string | undefined,
      subRows: Array<Row<TFeatures, TData>>,
    ) {
      this._cellsCache = undefined
      this._displayIndexCache = -1
      this._memoGetAllCells = undefined
      this._memoGetAllCellsByColumnId = undefined
      this._memos = undefined
      this._uniqueValuesCache = undefined
      this._valuesCache = makeObjectMap()
      this.depth = depth
      this.id = id
      this.index = rowIndex
      this.original = original
      this.originalSubRows = undefined
      this.parentId = parentId
      this.subRows = subRows
    }
    TableRow.prototype = rowPrototype

    table._rowPrototype = rowPrototype
    table._rowConstructor = TableRow as unknown as RowConstructor<
      TFeatures,
      TData
    >

    // Discarded warmup row: pre-marks every declared field as mutable on the
    // shared row shape before any real row exists or any code optimizes
    // against it.
    warmInstanceShape(
      constructRow(table, '', undefined as unknown as TData, -1, -1) as Record<
        string,
        unknown
      >,
    )
  }
  return table._rowConstructor as RowConstructor<TFeatures, TData>
}

/**
 * Constructs a row instance from normalized table internals.
 *
 * This wires core properties, feature prototype APIs, and instance data used by table rendering and row-model operations.
 */
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
  const RowCtor = getRowConstructor(table)
  const row = new RowCtor(
    id,
    original,
    rowIndex,
    depth,
    parentId,
    subRows ?? [],
  )

  // Initialize instance-specific data (e.g., caches) for features that need it
  const initFns = table._rowInstanceInitFns
  for (let i = 0; i < initFns.length; i++) {
    initFns[i]!(row as Row<TFeatures, TData>)
  }

  return row as Row<TFeatures, TData>
}

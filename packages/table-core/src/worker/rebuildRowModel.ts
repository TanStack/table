import { constructRow } from '../core/rows/constructRow'
import { makeObjectMap } from '../utils'
import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../types/Table'
import type { TableFeatures } from '../types/TableFeatures'
import type { RowData } from '../types/type-utils'
import type {
  TableWorkerRowNode,
  TableWorkerStage,
  TableWorkerStagePayload,
} from './tableWorkerProtocol'

/** Payloads that carry data; `unchanged` never reaches the rebuilder. */
export type TableWorkerDataPayload = Exclude<
  TableWorkerStagePayload,
  { kind: 'unchanged' }
>

// Main-thread side: payload + this table's core rows -> RowModel. Mirrors how
// the sync row models treat rows: data rows are reused (with depth/parentId
// rewritten, exactly like createGroupedRowModel does), synthetic group rows
// are reconstructed via constructRow with their worker-computed aggregates
// pre-seeded so no aggregation ever runs on the main thread.

function collectLeafRows(subRows: Array<any>, out: Array<any>) {
  for (let i = 0; i < subRows.length; i++) {
    const row = subRows[i]
    if (row.groupingColumnId == null) {
      out.push(row)
    } else {
      collectLeafRows(row.subRows, out)
    }
  }
}

export function rebuildRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  payload: TableWorkerDataPayload,
  stage: TableWorkerStage,
): RowModel<TFeatures, TData> {
  const core = table.getCoreRowModel()
  // The grouped model's flat passthrough resets row relationships, while the
  // filtered model never touches them. Without this distinction a filtered
  // rebuild could zero depths assigned by a grouped/sorted tree rebuild.
  const resetDepths = stage !== 'filtered'
  const flattenParentsFirst = stage === 'sorted'

  if (payload.kind === 'flat') {
    const { indices } = payload
    const rows = new Array(indices.length)
    for (let i = 0; i < indices.length; i++) {
      const row: any = core.flatRows[indices[i]!]!
      if (resetDepths) {
        row.depth = 0
        row.parentId = undefined
      }
      rows[i] = row
    }
    return { rows, flatRows: rows, rowsById: core.rowsById }
  }

  const flatRows: Array<any> = []
  // Data rows resolve through the prototype chain to the core map; only
  // synthetic group rows are added on top.
  const rowsById: Record<string, any> = Object.create(core.rowsById)

  const rebuildRows = (
    nodes: Array<TableWorkerRowNode>,
    depth: number,
    parentId: string | undefined,
  ): Array<any> => {
    const rows = new Array(nodes.length)
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]!
      if (typeof node === 'number') {
        const row: any = core.flatRows[node]!
        row.depth = depth
        row.parentId = parentId
        flatRows.push(row)
        rows[i] = row
        continue
      }

      // Sorted flatRows preserve the recursive rows order. Reserve the
      // synthetic parent's position before rebuilding its descendants, then
      // fill it once the row can be constructed from those descendants.
      const flatIndex = flattenParentsFirst ? flatRows.length : -1
      if (flattenParentsFirst) {
        flatRows.push(undefined)
      }

      const subRows = rebuildRows(node.children, depth + 1, node.id)
      const leafRows: Array<any> = []
      collectLeafRows(subRows, leafRows)

      const row: any = constructRow(
        table,
        node.id,
        leafRows[0]?.original,
        node.index,
        depth,
        undefined,
        parentId,
      )
      const aggregates = node.aggregates
      // Value writes to properties declared by the grouping feature's
      // initRowInstanceData; synthetic group rows keep the shared row shape.
      row.groupingColumnId = node.groupingColumnId
      row.groupingValue = node.groupingValue
      row.subRows = subRows
      row.leafRows = leafRows
      row._groupedRows = leafRows
      // Pre-seed both value caches with the worker-computed aggregates so the
      // grouping-aware prototype `getValue` serves them without recomputing:
      // grouping-column reads check _valuesCache, aggregated reads check
      // _aggregationValuesCache.
      const aggregationValuesCache = makeObjectMap()
      const aggregateKeys = Object.keys(aggregates)
      for (let k = 0; k < aggregateKeys.length; k++) {
        const key = aggregateKeys[k]!
        row._valuesCache[key] = aggregates[key]
        aggregationValuesCache[key] = aggregates[key]
      }
      row._aggregationValuesCache = aggregationValuesCache

      if (flattenParentsFirst) {
        flatRows[flatIndex] = row
      } else {
        flatRows.push(row)
      }
      rowsById[node.id] = row
      rows[i] = row
    }
    return rows
  }

  const rows = rebuildRows(payload.children, 0, undefined)

  return { rows, flatRows, rowsById }
}

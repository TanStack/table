import { constructRow } from '../core/rows/constructRow'
import { hasOwn } from '../utils'
import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../types/Table'
import type {
  TableWorkerRowNode,
  TableWorkerStagePayload,
} from './tableWorkerProtocol'

/** Payloads that carry data; `unchanged` never reaches the rebuilder. */
export type TableWorkerDataPayload = Exclude<
  TableWorkerStagePayload,
  { kind: 'unchanged' }
>

type AnyTable = Table_Internal<any, any>

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

export function rebuildRowModel(
  table: AnyTable,
  payload: TableWorkerDataPayload,
  /**
   * Whether a flat payload should rewrite row depth/parentId. Mirrors core:
   * the grouped model's passthrough resets them, the filtered model never
   * touches them. Without this distinction a filtered rebuild could zero the
   * depths a grouped/sorted tree rebuild just assigned to shared row objects.
   */
  resetDepths: boolean,
): RowModel<any, any> {
  const core = table.getCoreRowModel()

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
      Object.assign(row, {
        groupingColumnId: node.groupingColumnId,
        groupingValue: node.groupingValue,
        subRows,
        leafRows,
        getValue: (columnId: string) =>
          hasOwn(aggregates, columnId) ? aggregates[columnId] : undefined,
      })

      flatRows.push(row)
      rowsById[node.id] = row
      rows[i] = row
    }
    return rows
  }

  const rows = rebuildRows(payload.children, 0, undefined)

  return { rows, flatRows, rowsById }
}

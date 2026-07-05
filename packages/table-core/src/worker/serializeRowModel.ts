import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type {
  TableWorkerRowNode,
  TableWorkerStagePayload,
} from './tableWorkerProtocol'

// Worker-side: RowModel -> transferable payload. Stage-agnostic; the payload
// kind is chosen from the model's shape (synthetic rows present or not).

function isCloneSafe(value: unknown): boolean {
  return typeof value !== 'function' && typeof value !== 'symbol'
}

function serializeRows(
  rows: Array<any>,
  coreIndexById: Record<string, number>,
  aggregateColumnIds: Array<string>,
): Array<TableWorkerRowNode> {
  const nodes = new Array<TableWorkerRowNode>(rows.length)
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (row.groupingColumnId == null) {
      // Data row: its position in `options.data` is all the main thread needs.
      nodes[i] = coreIndexById[row.id]!
      continue
    }
    // Synthetic group row: compute aggregates eagerly (the expensive per-group
    // work we want off the main thread), but only for columns with an explicit
    // aggregation; sync tables aggregate lazily, so eagerly auto-aggregating
    // every column would explode on high-cardinality grouping.
    const aggregates: Record<string, unknown> = {}
    for (let c = 0; c < aggregateColumnIds.length; c++) {
      const columnId = aggregateColumnIds[c]!
      const value = row.getValue(columnId)
      if (value !== undefined && isCloneSafe(value)) {
        aggregates[columnId] = value
      }
    }
    // The group's own column always serializes its display value (the first
    // leaf's value) so grouped cells render.
    if (!(row.groupingColumnId in aggregates)) {
      const value = row.getValue(row.groupingColumnId)
      if (value !== undefined && isCloneSafe(value)) {
        aggregates[row.groupingColumnId] = value
      }
    }
    nodes[i] = {
      id: row.id,
      groupingColumnId: row.groupingColumnId,
      groupingValue: row.groupingValue,
      index: row.index,
      aggregates,
      children: serializeRows(row.subRows, coreIndexById, aggregateColumnIds),
    }
  }
  return nodes
}

export function serializeRowModel(
  model: RowModel<any, any>,
  coreIndexById: Record<string, number>,
  aggregateColumnIds: Array<string>,
  transfer: Array<Transferable>,
): TableWorkerStagePayload {
  // Flat fast path: no synthetic rows anywhere (flatRows === rows for flat
  // data). A Uint32Array permutation transfers at zero-copy cost.
  if (model.flatRows.length === model.rows.length) {
    const indices = new Uint32Array(model.rows.length)
    for (let i = 0; i < indices.length; i++) {
      indices[i] = coreIndexById[model.rows[i]!.id]!
    }
    transfer.push(indices.buffer)
    return { kind: 'flat', indices }
  }

  return {
    kind: 'tree',
    children: serializeRows(model.rows, coreIndexById, aggregateColumnIds),
  }
}

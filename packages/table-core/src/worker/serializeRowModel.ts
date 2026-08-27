import type { RowModel } from '../core/row-models/coreRowModelsFeature.types'
import type {
  TableWorkerFilterData,
  TableWorkerRowNode,
  TableWorkerStage,
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
  coreFlatRows: Array<any>,
  aggregateColumnIds: Array<string>,
  stage: TableWorkerStage,
): Array<TableWorkerRowNode> {
  const nodes = new Array<TableWorkerRowNode>(rows.length)
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (row.groupingColumnId == null) {
      const index = coreIndexById[row.id]!
      const coreRow = coreFlatRows[index]!
      // A true leaf needs only its core-row position. Branch rows must carry
      // their row-model children because filtering and sorting can replace or
      // reorder (or remove all of) the core subtree. Filtered rows also carry
      // the flags and metadata computed by the worker.
      nodes[i] =
        stage === 'filtered' || row.subRows.length || coreRow.subRows.length
          ? {
              index,
              children: serializeRows(
                row.subRows,
                coreIndexById,
                coreFlatRows,
                aggregateColumnIds,
                stage,
              ),
              ...(stage === 'filtered'
                ? { filterData: serializeFilterData(row) }
                : {}),
            }
          : index
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
      children: serializeRows(
        row.subRows,
        coreIndexById,
        coreFlatRows,
        aggregateColumnIds,
        stage,
      ),
    }
  }
  return nodes
}

export function serializeRowModel(
  model: RowModel<any, any>,
  coreIndexById: Record<string, number>,
  coreFlatRows: Array<any>,
  aggregateColumnIds: Array<string>,
  transfer: Array<Transferable>,
  stage: TableWorkerStage,
): TableWorkerStagePayload {
  // Flat fast path: no synthetic rows anywhere (flatRows === rows for flat
  // data). A Uint32Array permutation transfers at zero-copy cost.
  const canUseFlatPayload =
    model.flatRows.length === model.rows.length &&
    model.rows.every((row) => {
      const coreRow = coreFlatRows[coreIndexById[row.id]!]!
      return row.groupingColumnId == null && !coreRow.subRows.length
    })

  if (canUseFlatPayload) {
    const indices = new Uint32Array(model.rows.length)
    const filterData =
      stage === 'filtered'
        ? new Array<TableWorkerFilterData>(model.rows.length)
        : undefined
    for (let i = 0; i < indices.length; i++) {
      indices[i] = coreIndexById[model.rows[i]!.id]!
      if (filterData) {
        filterData[i] = serializeFilterData(model.rows[i]!)
      }
    }
    transfer.push(indices.buffer)
    return { kind: 'flat', indices, filterData }
  }

  return {
    kind: 'tree',
    children: serializeRows(
      model.rows,
      coreIndexById,
      coreFlatRows,
      aggregateColumnIds,
      stage,
    ),
  }
}

function serializeFilterData(row: any): TableWorkerFilterData {
  return {
    columnFilters: row.columnFilters,
    columnFiltersMeta: row.columnFiltersMeta,
  }
}

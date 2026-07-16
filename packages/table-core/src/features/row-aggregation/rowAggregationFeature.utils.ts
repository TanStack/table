import { hasOwn, makeObjectMap } from '../../utils'
import type { Cell } from '../../types/Cell'
import type { Column, Column_Internal } from '../../types/Column'
import type { Row } from '../../types/Row'
import type { TableFeatures } from '../../types/TableFeatures'
import type { CellData, RowData } from '../../types/type-utils'
import type {
  AggregationContext,
  AggregationFnDef,
  AggregationFnDescriptor,
  AggregationFnRef,
  AggregationValueOptions,
  ColumnAggregationValue,
  ResolvedAggregationFn,
} from './rowAggregationFeature.types'

interface AggregationCacheEntry {
  aggregationFnOption: unknown
  dependency: unknown
  maxDepth: number
  registry: unknown
  value: unknown
}

interface ResolvedAggregationFnsCacheEntry<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  coreRowModel: unknown
  option: unknown
  registry: unknown
  value: ReadonlyArray<ResolvedAggregationFn<TFeatures, TData>>
}

function isAggregationFnDef(value: unknown): value is AggregationFnDef {
  return !!value && typeof value === 'object' && 'aggregate' in value
}

function isAggregationFnDescriptor(
  value: unknown,
): value is AggregationFnDescriptor<any, any> {
  return (
    !!value &&
    typeof value === 'object' &&
    'id' in value &&
    'aggregationFn' in value
  )
}

function warn(message: string) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(message)
  }
}

function resolveMaxAggregationDepth(maxDepth: number | undefined) {
  return maxDepth === undefined || Number.isNaN(maxDepth)
    ? 0
    : Math.max(0, Math.floor(maxDepth))
}

/**
 * Selects unique rows at a maximum relative depth in encounter order.
 * Branches that end before the requested depth contribute their deepest row.
 */
export function normalizeAggregationRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rows: ReadonlyArray<Row<TFeatures, TData>>,
  maxDepth = 0,
): Array<Row<TFeatures, TData>> {
  const result: Array<Row<TFeatures, TData>> = []
  const seen = new Set<string>()
  const normalizedMaxDepth = resolveMaxAggregationDepth(maxDepth)

  const visit = (row: Row<TFeatures, TData>, depth: number) => {
    if (row.subRows.length && depth < normalizedMaxDepth) {
      for (let i = 0; i < row.subRows.length; i++) {
        visit(row.subRows[i]!, depth + 1)
      }
      return
    }

    if (!seen.has(row.id)) {
      seen.add(row.id)
      result.push(row)
    }
  }

  for (let i = 0; i < rows.length; i++) {
    visit(rows[i]!, 0)
  }

  return result
}

/**
 * Frontier selection for rows that are distinct nodes of a single row tree —
 * the row models the table builds itself. Skips `normalizeAggregationRows`'
 * duplicate-id guard (disjoint subtrees cannot revisit a row) and returns
 * `rows` unchanged when no row descends, so the default `maxDepth: 0` case
 * costs nothing per aggregation.
 */
export function normalizeUniqueAggregationRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rows: ReadonlyArray<Row<TFeatures, TData>>,
  maxDepth = 0,
): ReadonlyArray<Row<TFeatures, TData>> {
  const normalizedMaxDepth = resolveMaxAggregationDepth(maxDepth)

  let needsDescent = false
  if (normalizedMaxDepth > 0) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i]!.subRows.length) {
        needsDescent = true
        break
      }
    }
  }
  if (!needsDescent) return rows

  const result: Array<Row<TFeatures, TData>> = []

  const visit = (row: Row<TFeatures, TData>, depth: number) => {
    if (row.subRows.length && depth < normalizedMaxDepth) {
      for (let i = 0; i < row.subRows.length; i++) {
        visit(row.subRows[i]!, depth + 1)
      }
      return
    }
    result.push(row)
  }

  for (let i = 0; i < rows.length; i++) {
    visit(rows[i]!, 0)
  }

  return result
}

function getAutoAggregationFnName(
  value: unknown,
): 'extent' | 'sum' | undefined {
  if (typeof value === 'number') {
    return 'sum'
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return 'extent'
  }

  return undefined
}

/** Resolves the `sum` or `extent` definition inferred from the first core row. */
export function column_getAutoAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const value = column.table.getCoreRowModel().flatRows[0]?.getValue(column.id)

  const name = getAutoAggregationFnName(value)
  if (!name) return undefined

  const aggregationFn = column.table._rowModelFns.aggregationFns?.[name]

  if (!aggregationFn) {
    warn(
      `aggregationFn '${name}' (auto) for column '${column.id}' is not registered`,
    )
  }

  return aggregationFn
}

function resolveAggregationFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  column: Column_Internal<TFeatures, TData, any>,
  ref: AggregationFnRef<TFeatures, TData, any, any>,
): AggregationFnDef<TFeatures, TData, any, any> | undefined {
  if (isAggregationFnDef(ref)) return ref as any
  if (ref === 'auto') return column_getAutoAggregationFn(column)

  const aggregationFn =
    column.table._rowModelFns.aggregationFns?.[ref as string]
  if (!aggregationFn) {
    warn(
      `aggregationFn '${String(ref)}' for column '${column.id}' is not registered`,
    )
  }
  return aggregationFn
}

/** Resolves and validates a column's scalar or multiple aggregation option. */
export function column_getAggregationFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): ReadonlyArray<ResolvedAggregationFn<TFeatures, TData>> {
  const option = column.columnDef.aggregationFn
  const registry = column.table._rowModelFns.aggregationFns
  const coreRowModel = column.table.getCoreRowModel()
  const previous = (column as any)._resolvedAggregationFnsCache as
    | ResolvedAggregationFnsCacheEntry<TFeatures, TData>
    | undefined

  if (
    previous &&
    previous.option === option &&
    previous.registry === registry &&
    previous.coreRowModel === coreRowModel
  ) {
    return previous.value
  }

  const finish = (
    value: ReadonlyArray<ResolvedAggregationFn<TFeatures, TData>>,
  ) => {
    ;(column as any)._resolvedAggregationFnsCache = {
      coreRowModel,
      option,
      registry,
      value,
    } satisfies ResolvedAggregationFnsCacheEntry<TFeatures, TData>
    return value
  }

  if (option == null) return finish([])

  if (!Array.isArray(option)) {
    return finish([
      {
        aggregationFn: resolveAggregationFn(column, option as any),
        id: typeof option === 'string' ? option : undefined,
      },
    ])
  }

  const ids = makeObjectMap<number>()
  for (let i = 0; i < option.length; i++) {
    const item = option[i]
    const id =
      typeof item === 'string'
        ? item
        : isAggregationFnDescriptor(item)
          ? item.id
          : undefined
    if (id !== undefined) ids[id] = (ids[id] ?? 0) + 1
  }

  const resolved: Array<ResolvedAggregationFn<TFeatures, TData>> = []

  for (let i = 0; i < option.length; i++) {
    const item = option[i]
    const id =
      typeof item === 'string'
        ? item
        : isAggregationFnDescriptor(item)
          ? item.id
          : undefined

    if (id === undefined) {
      warn(
        `aggregationFn at index ${i} for column '${column.id}' needs a stable id`,
      )
      resolved.push({ aggregationFn: undefined, id: undefined })
      continue
    }

    if (ids[id]! > 1) {
      warn(`aggregationFn id '${id}' for column '${column.id}' is duplicated`)
      resolved.push({ aggregationFn: undefined, id })
      continue
    }

    const ref = isAggregationFnDescriptor(item) ? item.aggregationFn : item
    resolved.push({
      aggregationFn: resolveAggregationFn(column, ref),
      id,
    })
  }

  return finish(resolved)
}

function getSubRowResult(
  subRowValue: unknown,
  isMultiple: boolean,
  id: string | undefined,
) {
  if (!isMultiple) return subRowValue
  if (!id || !subRowValue || typeof subRowValue !== 'object') return undefined
  return hasOwn(subRowValue, id)
    ? (subRowValue as Record<string, unknown>)[id]
    : undefined
}

/** Executes every configured aggregation over a depth-selected row frontier. */
export function aggregateColumnValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(args: {
  maxDepth?: number
  subRows?: ReadonlyArray<Row<TFeatures, TData>>
  column: Column<TFeatures, TData, unknown>
  groupingRow?: Row<TFeatures, TData>
  rows: ReadonlyArray<Row<TFeatures, TData>>
  /**
   * Marks `rows` as distinct nodes of a single row tree (rows the table's own
   * row models produced), enabling frontier selection without the
   * duplicate-id guard. Caller-supplied row arrays must omit this.
   */
  uniqueRows?: boolean
}): unknown {
  const { subRows, column, groupingRow, rows, uniqueRows } = args
  const internalColumn = column as Column_Internal<TFeatures, TData, unknown>
  const maxDepth = resolveMaxAggregationDepth(
    args.maxDepth ?? internalColumn.columnDef.maxAggregationDepth,
  )
  const aggregationRows = uniqueRows
    ? normalizeUniqueAggregationRows(rows, maxDepth)
    : normalizeAggregationRows(rows, maxDepth)
  const entries = column_getAggregationFns(internalColumn)
  const isMultiple = Array.isArray(internalColumn.columnDef.aggregationFn)
  const canMerge =
    !!subRows?.length &&
    subRows.every(
      (row) =>
        !!(row as any).groupingColumnId &&
        (row as any).groupingColumnId !== column.id,
    )

  const getValue = (row: Row<TFeatures, TData>) => row.getValue(column.id)

  const execute = (entry: ResolvedAggregationFn<TFeatures, TData>) => {
    const definition = entry.aggregationFn
    if (!definition) return undefined

    const context: AggregationContext<TFeatures, TData, unknown> = {
      ...(subRows ? { subRows } : {}),
      column,
      columnId: column.id,
      getValue,
      ...(groupingRow ? { groupingRow } : {}),
      maxDepth,
      rows: aggregationRows,
      table: column.table as any,
    }

    if (canMerge && definition.merge) {
      return definition.merge({
        ...context,
        subRowResults: subRows.map((row) =>
          getSubRowResult(row.getValue(column.id), isMultiple, entry.id),
        ),
        subRows,
      })
    }

    return definition.aggregate(context)
  }

  if (!isMultiple) {
    return entries[0] ? execute(entries[0]) : undefined
  }

  const result = makeObjectMap<unknown>()
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i]!
    if (entry.id !== undefined) {
      result[entry.id] = execute(entry)
    }
  }
  return result
}

/** Implements `column.getAggregationValue(options?)` and its default cache. */
export function column_getAggregationValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  options?: AggregationValueOptions<TFeatures, TData>,
): ColumnAggregationValue<TFeatures> {
  const rows = options?.rows
  const resolvedMaxDepth = resolveMaxAggregationDepth(
    options?.maxDepth ?? column.columnDef.maxAggregationDepth,
  )
  const providedResult = column.columnDef.getAggregationValue?.({
    column: column as any,
    maxDepth: resolvedMaxDepth,
    rows,
    table: column.table as any,
  })

  if (providedResult) return providedResult.value as any
  if (column.table.options.manualAggregation) return undefined

  if (rows !== undefined) {
    return aggregateColumnValue({
      column: column as any,
      maxDepth: resolvedMaxDepth,
      rows,
    }) as any
  }

  const model = column.table.getPreGroupedRowModel()
  const previous = (column as any)._aggregationValueCache as
    | AggregationCacheEntry
    | undefined
  const registry = column.table._rowModelFns.aggregationFns
  const aggregationFnOption = column.columnDef.aggregationFn

  if (
    previous &&
    previous.dependency === model &&
    previous.maxDepth === resolvedMaxDepth &&
    previous.registry === registry &&
    previous.aggregationFnOption === aggregationFnOption
  ) {
    return previous.value as any
  }

  const value = aggregateColumnValue({
    column: column as any,
    maxDepth: resolvedMaxDepth,
    rows: model.rows,
    uniqueRows: true,
  })
  ;(column as any)._aggregationValueCache = {
    aggregationFnOption,
    dependency: model,
    maxDepth: resolvedMaxDepth,
    registry,
    value,
  } satisfies AggregationCacheEntry
  return value as any
}

/** Implements `cell.getIsAggregated()` for synthetic grouped rows. */
export function cell_getIsAggregated<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(cell: Cell<TFeatures, TData, TValue>) {
  const groupingColumnId = (cell.row as any).groupingColumnId as
    | string
    | undefined
  if (!groupingColumnId || groupingColumnId === cell.column.id) return false

  const grouping = (cell.column.table as any).atoms.grouping?.get?.() as
    | Array<string>
    | undefined
  if (grouping?.includes(cell.column.id)) return false

  return column_getAggregationFns(cell.column as any).some(
    (entry) => !!entry.aggregationFn,
  )
}

/** Formats the default scalar or keyed aggregated-cell representation. */
export function formatAggregatedCellValue(
  value: unknown,
  option: unknown,
): string | null {
  if (value == null) return null

  if (Array.isArray(option) && typeof value === 'object') {
    const entries = Object.keys(value)
    return entries
      .map(
        (key) => `${key}: ${String((value as Record<string, unknown>)[key])}`,
      )
      .join(', ')
  }

  return String(value)
}

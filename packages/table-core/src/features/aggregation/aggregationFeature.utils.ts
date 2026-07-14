import { hasOwn, makeObjectMap } from '../../utils'
import type { Cell } from '../../types/Cell'
import type { Column, Column_Internal } from '../../types/Column'
import type { Row } from '../../types/Row'
import type { TableFeatures } from '../../types/TableFeatures'
import type { CellData, RowData } from '../../types/type-utils'
import type {
  AggregationFnDef,
  AggregationFnDescriptor,
  AggregationFnRef,
  ColumnAggregationValue,
  ResolvedAggregationFn,
} from './aggregationFeature.types'

interface AggregationCacheEntry {
  aggregationFnOption: unknown
  dependency: unknown
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

/**
 * Flattens hierarchical row inputs to unique terminal leaves in encounter
 * order. This is the normalization used by public aggregation-value calls.
 */
export function normalizeAggregationRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(rows: ReadonlyArray<Row<TFeatures, TData>>): Array<Row<TFeatures, TData>> {
  const result: Array<Row<TFeatures, TData>> = []
  const seen = new Set<string>()

  const visit = (row: Row<TFeatures, TData>) => {
    if (row.subRows.length) {
      for (let i = 0; i < row.subRows.length; i++) {
        visit(row.subRows[i]!)
      }
      return
    }

    if (!seen.has(row.id)) {
      seen.add(row.id)
      result.push(row)
    }
  }

  for (let i = 0; i < rows.length; i++) {
    visit(rows[i]!)
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

function getChildResult(
  childValue: unknown,
  isMultiple: boolean,
  id: string | undefined,
) {
  if (!isMultiple) return childValue
  if (!id || !childValue || typeof childValue !== 'object') return undefined
  return hasOwn(childValue, id)
    ? (childValue as Record<string, unknown>)[id]
    : undefined
}

/** Executes every configured aggregation for a column over normalized rows. */
export function aggregateColumnValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(args: {
  childRows?: ReadonlyArray<Row<TFeatures, TData>>
  column: Column<TFeatures, TData, unknown>
  groupingRow?: Row<TFeatures, TData>
  rows: ReadonlyArray<Row<TFeatures, TData>>
}): unknown {
  const { childRows, column, groupingRow, rows } = args
  const internalColumn = column as Column_Internal<TFeatures, TData, unknown>
  const entries = column_getAggregationFns(internalColumn)
  const isMultiple = Array.isArray(internalColumn.columnDef.aggregationFn)
  const canMerge =
    !!childRows?.length &&
    childRows.every(
      (row) =>
        !!(row as any).groupingColumnId &&
        (row as any).groupingColumnId !== column.id,
    )

  const execute = (entry: ResolvedAggregationFn<TFeatures, TData>) => {
    const definition = entry.aggregationFn
    if (!definition) return undefined

    const context = {
      column,
      columnId: column.id,
      getValue: (row: Row<TFeatures, TData>) => row.getValue(column.id),
      ...(groupingRow ? { groupingRow } : {}),
      rows,
      table: column.table as any,
    }

    if (canMerge && definition.merge) {
      return definition.merge({
        ...context,
        childResults: childRows.map((row) =>
          getChildResult(row.getValue(column.id), isMultiple, entry.id),
        ),
        childRows: childRows,
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

/** Implements `column.getAggregationValue(rows?)` and its default-value cache. */
export function column_getAggregationValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  rows?: ReadonlyArray<Row<TFeatures, TData>>,
): ColumnAggregationValue<TFeatures> {
  const providedResult = column.columnDef.getAggregationValue?.({
    column: column as any,
    rows,
    table: column.table as any,
  })

  if (providedResult) return providedResult.value as any
  if (column.table.options.manualAggregation) return undefined

  if (rows !== undefined) {
    return aggregateColumnValue({
      column: column as any,
      rows: normalizeAggregationRows(rows),
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
    previous.registry === registry &&
    previous.aggregationFnOption === aggregationFnOption
  ) {
    return previous.value as any
  }

  const value = aggregateColumnValue({
    column: column as any,
    rows: normalizeAggregationRows(model.rows),
  })
  ;(column as any)._aggregationValueCache = {
    aggregationFnOption,
    dependency: model,
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

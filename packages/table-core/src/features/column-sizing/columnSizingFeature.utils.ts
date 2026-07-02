import {
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getPinnedVisibleLeafColumns,
  table_getRightHeaderGroups,
} from '../column-pinning/columnPinningFeature.utils'
import {
  callMemoOrStaticFn,
  cloneState,
  hasOwn,
  makeObjectMap,
} from '../../utils'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column_Internal } from '../../types/Column'
import type {
  ColumnOffsets,
  ColumnOffsetsByPosition,
  ColumnSizingState,
} from './columnSizingFeature.types'

/**
 * Creates the default committed column sizing state.
 *
 * The feature default is an empty map, so columns fall back to their column def
 * size or the built-in sizing defaults.
 *
 * @example
 * ```ts
 * const sizing = getDefaultColumnSizingState()
 * ```
 */
export function getDefaultColumnSizingState(): ColumnSizingState {
  return makeObjectMap()
}

/**
 * Creates the built-in sizing defaults for column definitions.
 *
 * Columns default to `size: 150`, `minSize: 20`, and
 * `maxSize: Number.MAX_SAFE_INTEGER` unless overridden by column definitions or
 * table defaults.
 *
 * @example
 * ```ts
 * const defaults = getDefaultColumnSizingColumnDef()
 * ```
 */
export function getDefaultColumnSizingColumnDef() {
  return {
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER,
  }
}

/**
 * Resolves a column's current pixel size.
 *
 * Committed `state.columnSizing[column.id]` wins over `columnDef.size`, then the
 * built-in default size. The result is clamped between min and max size.
 *
 * @example
 * ```ts
 * const width = column_getSize(column)
 * ```
 */
export function column_getSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  const defaultSizes = getDefaultColumnSizingColumnDef()
  const columnSizing = column.table.atoms.columnSizing?.get()
  const columnSize =
    columnSizing && hasOwn(columnSizing, column.id)
      ? columnSizing[column.id]
      : undefined

  return Math.min(
    Math.max(
      column.columnDef.minSize ?? defaultSizes.minSize,
      columnSize ?? column.columnDef.size ?? defaultSizes.size,
    ),
    column.columnDef.maxSize ?? defaultSizes.maxSize,
  )
}

function buildColumnOffsets<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columns: Array<Column_Internal<TFeatures, TData, unknown>>): ColumnOffsets {
  const starts = makeObjectMap<number>()
  const afters = makeObjectMap<number>()
  const sizes = new Array<number>(columns.length)

  let start = 0
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i]!
    const size = callMemoOrStaticFn(column, 'getSize', column_getSize)
    sizes[i] = size
    starts[column.id] = start
    start += size
  }

  let after = 0
  for (let i = columns.length - 1; i >= 0; i--) {
    afters[columns[i]!.id] = after
    after += sizes[i]!
  }

  return { starts, afters }
}

/**
 * Builds start and after offset maps for every visible leaf column, computed
 * once per pinning region plus the full visible list.
 *
 * A single table-level memo of this result backs all `column.getStart()` and
 * `column.getAfter()` calls with O(1) lookups.
 *
 * @example
 * ```ts
 * const offsets = table_getColumnOffsets(table)
 * const leftOffset = offsets.left.starts[column.id]
 * ```
 */
export function table_getColumnOffsets<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): ColumnOffsetsByPosition {
  return {
    all: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table) as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    center: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'center') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    left: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'left') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
    right: buildColumnOffsets(
      table_getPinnedVisibleLeafColumns(table, 'right') as Array<
        Column_Internal<TFeatures, TData, unknown>
      >,
    ),
  }
}

function toOffsetsKey(
  position: ColumnPinningPosition | 'center' | undefined,
): keyof ColumnOffsetsByPosition {
  return position === 'left'
    ? 'left'
    : position === 'right'
      ? 'right'
      : position === 'center'
        ? 'center'
        : 'all' // undefined | false use the full visible list
}

/**
 * Computes the offset from the start edge of a pinning region to this column.
 *
 * The value is the sum of all previous visible leaf column sizes in the
 * requested `'left'`, `'center'`, or `'right'` region.
 *
 * @example
 * ```ts
 * const leftOffset = column_getStart(column, 'left')
 * ```
 */
export function column_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
): number {
  const offsets = callMemoOrStaticFn(
    column.table,
    'getColumnOffsets',
    table_getColumnOffsets,
  )
  return offsets[toOffsetsKey(position)].starts[column.id] ?? 0
}

/**
 * Computes the offset from the end edge of a pinning region after this column.
 *
 * The value is the sum of all following visible leaf column sizes in the
 * requested region.
 *
 * @example
 * ```ts
 * const rightOffset = column_getAfter(column, 'right')
 * ```
 */
export function column_getAfter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  position?: ColumnPinningPosition | 'center',
): number {
  const offsets = callMemoOrStaticFn(
    column.table,
    'getColumnOffsets',
    table_getColumnOffsets,
  )
  return offsets[toOffsetsKey(position)].afters[column.id] ?? 0
}

/**
 * Removes this column's committed size override.
 *
 * After reset, the column resolves size from `columnDef.size` or built-in
 * defaults again.
 *
 * @example
 * ```ts
 * column_resetSize(column)
 * ```
 */
export function column_resetSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  table_setColumnSizing(column.table, (old) => {
    const rest = makeObjectMap<number>()
    const columnIds = Object.keys(old)
    for (let i = 0; i < columnIds.length; i++) {
      const columnId = columnIds[i]!
      if (columnId !== column.id) {
        rest[columnId] = old[columnId]!
      }
    }
    return rest
  })
}

/**
 * Computes a header's rendered size from its leaf headers.
 *
 * Group headers sum the sizes of all descendant leaf columns. Leaf headers use
 * their column's current size.
 *
 * @example
 * ```ts
 * const width = header_getSize(header)
 * ```
 */
export function header_getSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>) {
  let sum = 0

  const recurse = (h: Header<TFeatures, TData, TValue>) => {
    if (h.subHeaders.length) {
      h.subHeaders.forEach(recurse)
    } else {
      sum += column_getSize(h.column)
    }
  }

  recurse(header)

  return sum
}

/**
 * Computes a header's offset from the start of its header group.
 *
 * The offset is the previous sibling header's start plus size, or `0` for the
 * first header in the group.
 *
 * @example
 * ```ts
 * const offset = header_getStart(header)
 * ```
 */
export function header_getStart<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(header: Header<TFeatures, TData, TValue>): number {
  if (header.index > 0) {
    const prevSiblingHeader = header.headerGroup?.headers[header.index - 1]
    if (prevSiblingHeader) {
      return (
        callMemoOrStaticFn(prevSiblingHeader, 'getStart', header_getStart) +
        callMemoOrStaticFn(prevSiblingHeader, 'getSize', header_getSize)
      )
    }
  }

  return 0
}

// Table APIs

/**
 * Routes a committed column sizing updater through the table's sizing handler.
 *
 * The updater may be a next size map or a function of the previous map,
 * matching the instance `table.setColumnSizing` behavior.
 *
 * @example
 * ```ts
 * table_setColumnSizing(table, (old) => ({ ...old, age: 96 }))
 * ```
 */
export function table_setColumnSizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnSizingState>,
) {
  table.options.onColumnSizingChange?.(updater)
}

/**
 * Resets `columnSizing` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnSizing` when it
 * exists. Passing `true` ignores initial state and resets to `{}`.
 *
 * @example
 * ```ts
 * table_resetColumnSizing(table)
 * table_resetColumnSizing(table, true)
 * ```
 */
export function table_resetColumnSizing<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnSizing(
    table,
    defaultState
      ? makeObjectMap()
      : Object.assign(
          makeObjectMap<number>(),
          cloneState(table.initialState.columnSizing ?? {}),
        ),
  )
}

/**
 * Sums the rendered size of the full table header row.
 *
 * This includes left, center, and right columns in the main header group.
 *
 * @example
 * ```ts
 * const width = table_getTotalSize(table)
 * ```
 */
export function table_getTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    table.getHeaderGroups()[0]?.headers.reduce((sum, header) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

/**
 * Sums the rendered size of the left pinned header region.
 *
 * An empty left pinning region returns `0`.
 *
 * @example
 * ```ts
 * const width = table_getLeftTotalSize(table)
 * ```
 */
export function table_getLeftTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    callMemoOrStaticFn(
      table,
      'getLeftHeaderGroups',
      table_getLeftHeaderGroups,
    )[0]?.headers.reduce((sum: number, header: Header<TFeatures, TData>) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

/**
 * Sums the rendered size of the center, unpinned header region.
 *
 * An empty center region returns `0`.
 *
 * @example
 * ```ts
 * const width = table_getCenterTotalSize(table)
 * ```
 */
export function table_getCenterTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    callMemoOrStaticFn(
      table,
      'getCenterHeaderGroups',
      table_getCenterHeaderGroups,
    )[0]?.headers.reduce((sum: number, header: Header<TFeatures, TData>) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

/**
 * Sums the rendered size of the right pinned header region.
 *
 * An empty right pinning region returns `0`.
 *
 * @example
 * ```ts
 * const width = table_getRightTotalSize(table)
 * ```
 */
export function table_getRightTotalSize<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (
    callMemoOrStaticFn(
      table,
      'getRightHeaderGroups',
      table_getRightHeaderGroups,
    )[0]?.headers.reduce((sum: number, header: Header<TFeatures, TData>) => {
      return sum + header_getSize(header)
    }, 0) ?? 0
  )
}

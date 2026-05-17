import {
  table_getCenterHeaderGroups,
  table_getLeftHeaderGroups,
  table_getPinnedVisibleLeafColumns,
  table_getRightHeaderGroups,
} from '../column-pinning/columnPinningFeature.utils'
import { column_getIndex } from '../column-ordering/columnOrderingFeature.utils'
import { callMemoOrStaticFn, cloneState } from '../../utils'
import type { ColumnPinningPosition } from '../column-pinning/columnPinningFeature.types'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Header } from '../../types/Header'
import type { Column_Internal } from '../../types/Column'
import type { ColumnSizingState } from './columnSizingFeature.types'

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
  return {}
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
  const columnSize = column.table.atoms.columnSizing?.get()?.[column.id]

  return Math.min(
    Math.max(
      column.columnDef.minSize ?? defaultSizes.minSize,
      columnSize ?? column.columnDef.size ?? defaultSizes.size,
    ),
    column.columnDef.maxSize ?? defaultSizes.maxSize,
  )
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
  position: ColumnPinningPosition | 'center',
): number {
  const index = callMemoOrStaticFn(
    column,
    'getIndex',
    column_getIndex,
    position,
  )
  if (index <= 0) return 0

  const visibleLeafColumns = callMemoOrStaticFn(
    column.table,
    'getPinnedVisibleLeafColumns',
    table_getPinnedVisibleLeafColumns,
    position,
  )

  const prevColumn = visibleLeafColumns[index - 1]!
  return (
    callMemoOrStaticFn(prevColumn, 'getStart', column_getStart, position) +
    callMemoOrStaticFn(prevColumn, 'getSize', column_getSize)
  )
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
  position: ColumnPinningPosition | 'center',
): number {
  const visibleLeafColumns = callMemoOrStaticFn(
    column.table,
    'getPinnedVisibleLeafColumns',
    table_getPinnedVisibleLeafColumns,
    position,
  )
  const index = callMemoOrStaticFn(
    column,
    'getIndex',
    column_getIndex,
    position,
  )
  if (index < 0 || index >= visibleLeafColumns.length - 1) return 0

  const nextColumn = visibleLeafColumns[index + 1]!
  return (
    callMemoOrStaticFn(nextColumn, 'getSize', column_getSize) +
    callMemoOrStaticFn(nextColumn, 'getAfter', column_getAfter, position)
  )
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
  table_setColumnSizing(column.table, ({ [column.id]: _, ...rest }) => {
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
    defaultState ? {} : cloneState(table.initialState.columnSizing ?? {}),
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

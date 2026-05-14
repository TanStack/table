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
 * Returns the default column sizing state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnSizingState()
 * ```
 */
export function getDefaultColumnSizingState(): ColumnSizingState {
  return {}
}

/**
 * Returns the default column sizing column def.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnSizingColumnDef()
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
 * Returns size for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getSize(column)
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
 * Returns start for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getStart(column)
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
    column_getSize(prevColumn)
  )
}

/**
 * Returns after for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getAfter(column)
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
    column_getSize(nextColumn) +
    callMemoOrStaticFn(nextColumn, 'getAfter', column_getAfter, position)
  )
}

/**
 * Reset Size. for a column.
 *
 * This is the static implementation behind the matching column instance API.
 *
 * @example
 * ```ts
 * const value = column_resetSize(column)
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
 * Returns size for a header.
 *
 * This is the static implementation behind the matching header instance API and can account for nested header groups.
 *
 * @example
 * ```ts
 * const value = header_getSize(header)
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
 * Returns start for a header.
 *
 * This is the static implementation behind the matching header instance API and can account for nested header groups.
 *
 * @example
 * ```ts
 * const value = header_getStart(header)
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
 * Updates the table's column sizing state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setColumnSizing(table, (old) => old)
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
 * Resets the table's column sizing state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
 * Returns total size for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getTotalSize(table)
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
 * Returns left total size for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getLeftTotalSize(table)
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
 * Returns center total size for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterTotalSize(table)
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
 * Returns right total size for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getRightTotalSize(table)
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

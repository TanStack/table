import { row_getIsAllParentsExpanded } from '../row-expanding/rowExpandingFeature.utils'
import { callMemoOrStaticFn, cloneState } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  RowPinningPosition,
  RowPinningState,
} from './rowPinningFeature.types'

// State Utils

/**
 * Returns the default row pinning state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultRowPinningState()
 * ```
 */
export function getDefaultRowPinningState(): RowPinningState {
  return {
    top: [],
    bottom: [],
  }
}

/**
 * Updates the table's row pinning state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setRowPinning(table, (old) => old)
 * ```
 */
export function table_setRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<RowPinningState>,
): void {
  table.options.onRowPinningChange?.(updater)
}

/**
 * Resets the table's row pinning state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
 *
 * @example
 * ```ts
 * table_resetRowPinning(table)
 * table_resetRowPinning(table, true)
 * ```
 */
export function table_resetRowPinning<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean): void {
  table_setRowPinning(
    table,
    defaultState
      ? getDefaultRowPinningState()
      : cloneState(
          table.initialState.rowPinning ?? getDefaultRowPinningState(),
        ),
  )
}

// Table Utils

/**
 * Returns is some rows pinned for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsSomeRowsPinned(table)
 * ```
 */
export function table_getIsSomeRowsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position?: RowPinningPosition,
): boolean {
  const rowPinning = table.atoms.rowPinning?.get()

  if (!position) {
    return Boolean(rowPinning?.top.length || rowPinning?.bottom.length)
  }
  return Boolean(rowPinning?.[position].length)
}

function table_getPinnedRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  position: 'top' | 'bottom',
): Array<Row<TFeatures, TData>> {
  const visibleRows = table.getRowModel().rows
  const pinnedRowIds = table.atoms.rowPinning?.get()?.[position] ?? []
  const keepPinnedRows = table.options.keepPinnedRows ?? true

  const result: Array<Row<TFeatures, TData>> = []
  for (let i = 0; i < pinnedRowIds.length; i++) {
    const rowId = pinnedRowIds[i]!
    let row: Row<TFeatures, TData> | undefined
    if (keepPinnedRows) {
      // get all rows that are pinned even if they would not be otherwise
      // visible; account for expanded parent rows, but not pagination/filtering
      const fullRow = table.getRow(rowId, true)
      if (row_getIsAllParentsExpanded(fullRow)) row = fullRow
    } else {
      // else get only visible rows that are pinned
      row = visibleRows.find((r) => r.id === rowId)
    }
    if (!row)
      continue
      // Assign position property directly to preserve prototype chain
    ;(row as any).position = position
    result.push(row)
  }
  return result
}

/**
 * Returns top rows for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getTopRows(table)
 * ```
 */
export function table_getTopRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'top')
}

/**
 * Returns bottom rows for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getBottomRows(table)
 * ```
 */
export function table_getBottomRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'bottom')
}

/**
 * Returns center rows for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCenterRows(table)
 * ```
 */
export function table_getCenterRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  const { top, bottom } =
    table.atoms.rowPinning?.get() ?? getDefaultRowPinningState()
  const allRows = table.getRowModel().rows

  const topAndBottom = new Set([...top, ...bottom])
  return allRows.filter((d) => !topAndBottom.has(d.id))
}

// Row Utils

/**
 * Returns whether a row can use pin.
 *
 * This evaluates row data, table options, and feature-specific enablement rules.
 *
 * @example
 * ```ts
 * const value = row_getCanPin(row)
 * ```
 */
export function row_getCanPin<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): boolean {
  const { enableRowPinning } = row.table.options
  if (typeof enableRowPinning === 'function') {
    return enableRowPinning(row)
  }
  return enableRowPinning ?? true
}

/**
 * Returns is pinned for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsPinned(row)
 * ```
 */
export function row_getIsPinned<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): RowPinningPosition {
  const { top, bottom } =
    row.table.atoms.rowPinning?.get() ?? getDefaultRowPinningState()

  return top.includes(row.id)
    ? 'top'
    : bottom.includes(row.id)
      ? 'bottom'
      : false
}

/**
 * Returns pinned index for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getPinnedIndex(row)
 * ```
 */
export function row_getPinnedIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): number {
  const position = row_getIsPinned(row)
  if (!position) return -1

  const visiblePinnedRowIds = (
    position === 'top'
      ? callMemoOrStaticFn(row.table, 'getTopRows', table_getTopRows)
      : callMemoOrStaticFn(row.table, 'getBottomRows', table_getBottomRows)
  ).map(({ id }) => id)

  return visiblePinnedRowIds.indexOf(row.id)
}

/**
 * Pins or unpins a row.
 *
 * Optional flags let callers include parent rows or leaf rows when updating
 * the row pinning state.
 *
 * @example
 * ```ts
 * row_pin(row, 'top')
 * ```
 */
export function row_pin<TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  position: RowPinningPosition,
  includeLeafRows?: boolean,
  includeParentRows?: boolean,
): void {
  const leafRowIds = includeLeafRows
    ? row.getLeafRows().map(({ id }) => id)
    : []
  const parentRowIds = includeParentRows
    ? row.getParentRows().map(({ id }) => id)
    : []
  const rowIds: Set<string> = new Set([...parentRowIds, row.id, ...leafRowIds])

  table_setRowPinning(row.table, (old) => {
    if (position === 'bottom') {
      return {
        top: old.top.filter((d) => !rowIds.has(d)),
        bottom: [
          ...old.bottom.filter((d) => !rowIds.has(d)),
          ...Array.from(rowIds),
        ],
      }
    }

    if (position === 'top') {
      return {
        top: [...old.top.filter((d) => !rowIds.has(d)), ...Array.from(rowIds)],
        bottom: old.bottom.filter((d) => !rowIds.has(d)),
      }
    }

    return {
      top: old.top.filter((d) => !rowIds.has(d)),
      bottom: old.bottom.filter((d) => !rowIds.has(d)),
    }
  })
}

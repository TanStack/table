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
 * Creates the default row pinning state.
 *
 * Both pinning regions start empty. Reset APIs use this value when
 * `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const pinning = getDefaultRowPinningState()
 * ```
 */
export function getDefaultRowPinningState(): RowPinningState {
  return {
    top: [],
    bottom: [],
  }
}

/**
 * Routes a row pinning updater through the table's row-pinning change handler.
 *
 * The updater may be a next `{ top, bottom }` state or a function of the
 * previous state, matching the instance `table.setRowPinning` behavior.
 *
 * @example
 * ```ts
 * table_setRowPinning(table, (old) => ({ ...old, top: [rowId] }))
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
 * Resets `rowPinning` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.rowPinning` when it
 * exists. Passing `true` ignores initial state and resets to empty top/bottom
 * arrays.
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
 * Checks whether any rows are pinned.
 *
 * Omit `position` to check both regions, or pass `'top'`/`'bottom'` to inspect
 * one region.
 *
 * @example
 * ```ts
 * const hasPinnedRows = table_getIsSomeRowsPinned(table)
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
 * Resolves the visible rows pinned to the top region.
 *
 * The result follows `state.rowPinning.top` order and marks each row with
 * `position = 'top'`.
 *
 * @example
 * ```ts
 * const rows = table_getTopRows(table)
 * ```
 */
export function table_getTopRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'top')
}

/**
 * Resolves the visible rows pinned to the bottom region.
 *
 * The result follows `state.rowPinning.bottom` order and marks each row with
 * `position = 'bottom'`.
 *
 * @example
 * ```ts
 * const rows = table_getBottomRows(table)
 * ```
 */
export function table_getBottomRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<Row<TFeatures, TData>> {
  return table_getPinnedRows(table, 'bottom')
}

/**
 * Resolves rows that are not pinned to top or bottom.
 *
 * The current row model is filtered by `state.rowPinning.top` and
 * `state.rowPinning.bottom`.
 *
 * @example
 * ```ts
 * const rows = table_getCenterRows(table)
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
 * Checks whether this row can be pinned.
 *
 * `options.enableRowPinning` may be a boolean or a row predicate; it defaults
 * to `true`.
 *
 * @example
 * ```ts
 * const canPin = row_getCanPin(row)
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
 * Reads this row's current pinning region.
 *
 * Rows listed in `state.rowPinning.top` return `'top'`, rows listed in
 * `bottom` return `'bottom'`, and unpinned rows return `false`.
 *
 * @example
 * ```ts
 * const position = row_getIsPinned(row)
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
 * Finds this row's visible index within its pinned region.
 *
 * Unpinned rows return `-1`.
 *
 * @example
 * ```ts
 * const index = row_getPinnedIndex(row)
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

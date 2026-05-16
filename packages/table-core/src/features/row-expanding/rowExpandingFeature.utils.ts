import { cloneState } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  ExpandedState,
  ExpandedStateList,
} from './rowExpandingFeature.types'

/**
 * Returns the default expanded state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultExpandedState()
 * ```
 */
export function getDefaultExpandedState(): ExpandedState {
  return {}
}

/**
 * Schedules an automatic reset for expanded.
 *
 * The reset only runs when the related feature options allow automatic resets for the current table state change.
 *
 * @example
 * ```ts
 * table_autoResetExpanded(table)
 * ```
 */
export function table_autoResetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  if (
    table.options.autoResetAll ??
    table.options.autoResetExpanded ??
    !table.options.manualExpanding
  ) {
    table._reactivity.schedule(() => table_resetExpanded(table))
  }
}

/**
 * Updates the table's expanded state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setExpanded(table, (old) => old)
 * ```
 */
export function table_setExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<ExpandedState>) {
  table.options.onExpandedChange?.(updater)
}

/**
 * Toggles all rows expanded for the table.
 *
 * This is the table-level convenience API used by UI controls that affect many columns or rows at once.
 *
 * @example
 * ```ts
 * table_toggleAllRowsExpanded(table)
 * ```
 */
export function table_toggleAllRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, expanded?: boolean) {
  if (expanded ?? !table_getIsAllRowsExpanded(table)) {
    table_setExpanded(table, true)
  } else {
    table_setExpanded(table, {})
  }
}

/**
 * Resets the table's expanded state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
 *
 * @example
 * ```ts
 * table_resetExpanded(table)
 * table_resetExpanded(table, true)
 * ```
 */
export function table_resetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setExpanded(
    table,
    defaultState ? {} : cloneState(table.initialState.expanded ?? {}),
  )
}

/**
 * Returns can some rows expand for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getCanSomeRowsExpand(table)
 * ```
 */
export function table_getCanSomeRowsExpand<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table
    .getPrePaginatedRowModel()
    .flatRows.some((row) => row_getCanExpand(row))
}

/**
 * Returns an event handler for all rows expanded handler.
 *
 * The handler calls the matching table toggle API and can be attached directly to checkbox or button UI.
 *
 * @example
 * ```ts
 * const value = table_getToggleAllRowsExpandedHandler(table)
 * ```
 */
export function table_getToggleAllRowsExpandedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (e: unknown) => {
    ;(e as any).persist?.()
    table_toggleAllRowsExpanded(table)
  }
}

/**
 * Returns is some rows expanded for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsSomeRowsExpanded(table)
 * ```
 */
export function table_getIsSomeRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const expanded = table.atoms.expanded?.get() ?? {}
  return expanded === true || Object.values(expanded).some(Boolean)
}

/**
 * Returns is all rows expanded for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsAllRowsExpanded(table)
 * ```
 */
export function table_getIsAllRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const expanded = table.atoms.expanded?.get() ?? {}

  // If expanded is true, save some cycles and return true
  if (expanded === true) {
    return true
  }

  if (!Object.keys(expanded).length) {
    return false
  }

  // If any row is not expanded, return false
  if (table.getRowModel().flatRows.some((row) => !row_getIsExpanded(row))) {
    return false
  }

  // They must all be expanded :shrug:
  return true
}

/**
 * Returns expanded depth for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getExpandedDepth(table)
 * ```
 */
export function table_getExpandedDepth<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  let maxDepth = 0

  const rowIds =
    table.atoms.expanded?.get() === true
      ? Object.keys(table.getRowModel().rowsById)
      : Object.keys(table.atoms.expanded?.get() ?? {})

  rowIds.forEach((id) => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}

/**
 * Toggles expanded for a row.
 *
 * The update is routed through the table state updater for the owning feature state slice.
 *
 * @example
 * ```ts
 * row_toggleExpanded(row)
 * ```
 */
export function row_toggleExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, expanded?: boolean) {
  table_setExpanded(row.table, (old) => {
    const exists = old === true ? true : !!old[row.id]

    let oldExpanded: ExpandedStateList = {}

    if (old === true) {
      Object.keys(row.table.getRowModel().rowsById).forEach((rowId) => {
        oldExpanded[rowId] = true
      })
    } else {
      oldExpanded = old
    }

    expanded = expanded ?? !exists

    if (!exists && expanded) {
      return {
        ...oldExpanded,
        [row.id]: true,
      }
    }

    if (exists && !expanded) {
      const { [row.id]: _, ...rest } = oldExpanded
      return rest
    }

    return old
  })
}

/**
 * Returns is expanded for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsExpanded(row)
 * ```
 */
export function row_getIsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const expanded: ExpandedState = row.table.atoms.expanded?.get() ?? {}

  return !!(
    row.table.options.getIsRowExpanded?.(row) ??
    (expanded === true || expanded[row.id])
  )
}

/**
 * Returns whether a row can use expand.
 *
 * This evaluates row data, table options, and feature-specific enablement rules.
 *
 * @example
 * ```ts
 * const value = row_getCanExpand(row)
 * ```
 */
export function row_getCanExpand<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return (
    row.table.options.getRowCanExpand?.(row) ??
    ((row.table.options.enableExpanding ?? true) && !!row.subRows.length)
  )
}

/**
 * Returns is all parents expanded for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsAllParentsExpanded(row)
 * ```
 */
export function row_getIsAllParentsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  let isFullyExpanded = true
  let currentRow = row

  while (isFullyExpanded && currentRow.parentId) {
    currentRow = row.table.getRow(currentRow.parentId, true)
    isFullyExpanded = row_getIsExpanded(currentRow)
  }

  return isFullyExpanded
}

/**
 * Returns an event handler for toggling expanded handler.
 *
 * The handler is intended for direct use in row-level controls such as expansion or selection buttons.
 *
 * @example
 * ```ts
 * const value = row_getToggleExpandedHandler(row)
 * ```
 */
export function row_getToggleExpandedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const canExpand = row_getCanExpand(row)

  return () => {
    if (!canExpand) return
    row_toggleExpanded(row)
  }
}

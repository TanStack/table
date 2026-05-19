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
 * Creates the default expanded state.
 *
 * The feature default is an empty map, meaning no rows are expanded. Reset APIs
 * use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const expanded = getDefaultExpandedState()
 * ```
 */
export function getDefaultExpandedState(): ExpandedState {
  return {}
}

/**
 * Schedules an expanded-state reset after row-structure changes.
 *
 * The reset runs when `autoResetAll`, `autoResetExpanded`, or the default
 * client-side expanding behavior allows it. Manual expanding opts out unless
 * the reset options explicitly opt back in.
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
 * Routes an expanded-state updater through the table's expanded change handler.
 *
 * The updater may be `true`, a row-id map, or a function of the previous
 * expanded state, matching the instance `table.setExpanded` behavior.
 *
 * @example
 * ```ts
 * table_setExpanded(table, (old) => ({ ...old, [rowId]: true }))
 * ```
 */
export function table_setExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<ExpandedState>) {
  table.options.onExpandedChange?.(updater)
}

/**
 * Expands or collapses every row.
 *
 * Passing `true` stores the special expanded-all state. Passing `false` stores
 * an empty map. Omitting the value toggles based on whether all rows are
 * currently expanded.
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
 * Resets `expanded` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.expanded` when it
 * exists. Passing `true` ignores initial state and resets to `{}`.
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
 * Checks whether at least one pre-paginated row can expand.
 *
 * Pagination is intentionally ignored so controls can reflect expandable rows
 * that may not be on the current page.
 *
 * @example
 * ```ts
 * const canExpand = table_getCanSomeRowsExpand(table)
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
 * Creates an event handler that toggles all rows expanded.
 *
 * React-style synthetic events are persisted when present before the table state
 * is toggled.
 *
 * @example
 * ```ts
 * const onClick = table_getToggleAllRowsExpandedHandler(table)
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
 * Checks whether any row is expanded.
 *
 * The special expanded-all value `true` counts as some rows expanded.
 *
 * @example
 * ```ts
 * const someExpanded = table_getIsSomeRowsExpanded(table)
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
 * Checks whether every row in the current row model is expanded.
 *
 * The special expanded-all value `true` returns true immediately. Empty
 * expanded state returns false.
 *
 * @example
 * ```ts
 * const allExpanded = table_getIsAllRowsExpanded(table)
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
 * Computes the deepest expanded row id depth.
 *
 * Row ids are split on `.`; expanded-all state scans the current row model,
 * while explicit expanded state scans its expanded id keys.
 *
 * @example
 * ```ts
 * const depth = table_getExpandedDepth(table)
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
 * Expands or collapses this row.
 *
 * Omitting `expanded` toggles the row. If the current state is expanded-all,
 * the function first materializes that state into a row-id map before applying
 * the row-specific change.
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
 * Checks whether this row is expanded.
 *
 * `options.getIsRowExpanded` can override state-derived behavior. Otherwise
 * the row is expanded when expanded state is `true` or contains this row id.
 *
 * @example
 * ```ts
 * const expanded = row_getIsExpanded(row)
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
 * Checks whether this row can be expanded.
 *
 * `options.getRowCanExpand` wins when provided. Otherwise rows can expand when
 * expanding is enabled and the row has subRows.
 *
 * @example
 * ```ts
 * const canExpand = row_getCanExpand(row)
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
 * Checks whether every ancestor of this row is expanded.
 *
 * The current row is not considered; only its parent chain is walked.
 *
 * @example
 * ```ts
 * const parentsExpanded = row_getIsAllParentsExpanded(row)
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
 * Creates a row control handler that toggles this row's expanded state.
 *
 * The handler is a no-op when the row cannot expand.
 *
 * @example
 * ```ts
 * const onClick = row_getToggleExpandedHandler(row)
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

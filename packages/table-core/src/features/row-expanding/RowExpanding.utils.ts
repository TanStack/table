import { table_getPrePaginationRowModel } from '../row-pagination/RowPagination.utils'
import { table_getSortedRowModel } from '../row-sorting/RowSorting.utils'
import { table_getRow } from '../../core/rows/Rows.utils'
import {
  _table_getInitialState,
  _table_getState,
  table_getInitialState,
  table_getRowModel,
} from '../../core/table/Tables.utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../types/RowModel'
import type { Table } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  ExpandedState,
  ExpandedStateList,
  TableOptions_RowExpanding,
} from './RowExpanding.types'

/**
 *
 * @param table
 * @param registered
 * @param queued
 * @returns
 */
export function table_autoResetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
  registered: boolean,
  queued: boolean,
) {
  if (!registered) {
    table._queue(() => {
      registered = true
    })
    return
  }

  if (
    table.options.autoResetAll ??
    table.options.autoResetExpanded ??
    !table.options.manualExpanding
  ) {
    if (queued) return
    queued = true
    table._queue(() => {
      table_resetExpanded(table)
      queued = false
    })
  }
}

/**
 *
 * @param table
 * @param updater
 */
export function table_setExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
  updater: Updater<ExpandedState>,
) {
  table.options.onExpandedChange?.(updater)
}

/**
 *
 * @param table
 * @param expanded
 */
export function table_toggleAllRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
  expanded?: boolean,
) {
  if (expanded ?? !table_getIsAllRowsExpanded(table)) {
    table_setExpanded(table, true)
  } else {
    table_setExpanded(table, {})
  }
}

/**
 *
 * @param table
 * @param defaultState
 */
export function table_resetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
  defaultState?: boolean,
) {
  table_setExpanded(
    table,
    defaultState ? {} : _table_getInitialState(table).expanded ?? {},
  )
}

/**
 *
 * @param table
 * @returns
 */
export function table_getCanSomeRowsExpand<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  return table_getPrePaginationRowModel(table).flatRows.some((row) =>
    row_getCanExpand(row, table),
  )
}

/**
 *
 * @param table
 * @returns
 */
export function table_getToggleAllRowsExpandedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  return (e: unknown) => {
    ;(e as any).persist?.()
    table_toggleAllRowsExpanded(table)
  }
}

/**
 *
 * @param table
 * @returns
 */
export function table_getIsSomeRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  const expanded = _table_getState(table).expanded ?? {}
  return expanded === true || Object.values(expanded).some(Boolean)
}

/**
 *
 * @param table
 * @returns
 */
export function table_getIsAllRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  const expanded = _table_getState(table).expanded ?? {}

  // If expanded is true, save some cycles and return true
  if (expanded === true) {
    return true
  }

  if (!Object.keys(expanded).length) {
    return false
  }

  // If any row is not expanded, return false
  if (
    table_getRowModel(table).flatRows.some(
      (row) => !row_getIsExpanded(row, table),
    )
  ) {
    return false
  }

  // They must all be expanded :shrug:
  return true
}

/**
 *
 * @param table
 * @returns
 */
export function table_getExpandedDepth<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  let maxDepth = 0

  const rowIds =
    _table_getState(table).expanded === true
      ? Object.keys(table_getRowModel(table).rowsById)
      : Object.keys(_table_getState(table).expanded ?? {})

  rowIds.forEach((id) => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}

/**
 *
 * @param table
 * @returns
 */
export function table_getPreExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
): RowModel<TFeatures, TData> {
  return table_getSortedRowModel(table)
}

/**
 *
 * @param table
 * @returns
 */
export function table_getExpandedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
): RowModel<TFeatures, TData> {
  if (!table._rowModels.Expanded) {
    table._rowModels.Expanded = table.options._rowModels?.Expanded?.(table)
  }

  if (table.options.manualExpanding || !table._rowModels.Expanded) {
    return table_getPreExpandedRowModel(table)
  }

  return table._rowModels.Expanded()
}

/**
 *
 * @param row
 * @param table
 * @param expanded
 */
export function row_toggleExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
  expanded?: boolean,
) {
  table_setExpanded(table, (old) => {
    const exists = old === true ? true : !!old[row.id]

    let oldExpanded: ExpandedStateList = {}

    if (old === true) {
      Object.keys(table_getRowModel(table).rowsById).forEach((rowId) => {
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
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getIsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  const expanded = _table_getState(table).expanded ?? {}

  return !!(
    table.options.getIsRowExpanded?.(row) ??
    (expanded === true || expanded[row.id])
  )
}

/**
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getCanExpand<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  return (
    table.options.getRowCanExpand?.(row) ??
    ((table.options.enableExpanding ?? true) && !!row.subRows.length)
  )
}

/**
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getIsAllParentsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  let isFullyExpanded = true
  let currentRow = row

  while (isFullyExpanded && currentRow.parentId) {
    currentRow = table_getRow(table, currentRow.parentId, true)
    isFullyExpanded = row_getIsExpanded(row, table)
  }

  return isFullyExpanded
}

/**
 *
 * @param row
 * @param table
 * @returns
 */
export function row_getToggleExpandedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  table: Table<TFeatures, TData> & {
    options: Partial<TableOptions_RowExpanding<TFeatures, TData>>
  },
) {
  const canExpand = row_getCanExpand(row, table)

  return () => {
    if (!canExpand) return
    row_toggleExpanded(row, table)
  }
}

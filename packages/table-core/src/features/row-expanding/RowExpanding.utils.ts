import { table_getPrePaginationRowModel } from '../row-pagination/RowPagination.utils'
import { table_getSortedRowModel } from '../row-sorting/RowSorting.utils'
import { table_getRowModel } from '../../core/row-models/RowModels.utils'
import { table_getRow } from '../../core/rows/Rows.utils'
import type { Row, RowData, RowModel, Table, Updater } from '../../types'
import type { ExpandedState, ExpandedStateList } from './RowExpanding.types'

export function table_autoResetExpanded<TData extends RowData>(
  table: Table<TData>,
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

export function table_setExpanded<TData extends RowData>(
  table: Table<TData>,
  updater: Updater<ExpandedState>,
) {
  table.options.onExpandedChange?.(updater)
}

export function table_toggleAllRowsExpanded<TData extends RowData>(
  table: Table<TData>,
  expanded?: boolean,
) {
  if (expanded ?? !table_getIsAllRowsExpanded(table)) {
    table_setExpanded(table, true)
  } else {
    table_setExpanded(table, {})
  }
}

export function table_resetExpanded<TData extends RowData>(
  table: Table<TData>,
  defaultState?: boolean,
) {
  table_setExpanded(table, defaultState ? {} : table.initialState.expanded)
}

export function table_getCanSomeRowsExpand<TData extends RowData>(
  table: Table<TData>,
) {
  return table_getPrePaginationRowModel(table).flatRows.some((row) =>
    row_getCanExpand(row, table),
  )
}

export function table_getToggleAllRowsExpandedHandler<TData extends RowData>(
  table: Table<TData>,
) {
  return (e: unknown) => {
    ;(e as any).persist?.()
    table_toggleAllRowsExpanded(table)
  }
}

export function table_getIsSomeRowsExpanded<TData extends RowData>(
  table: Table<TData>,
) {
  const expanded = table.getState().expanded
  return expanded === true || Object.values(expanded).some(Boolean)
}

export function table_getIsAllRowsExpanded<TData extends RowData>(
  table: Table<TData>,
) {
  const expanded = table.getState().expanded

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

export function table_getExpandedDepth<TData extends RowData>(
  table: Table<TData>,
) {
  let maxDepth = 0

  const rowIds =
    table.getState().expanded === true
      ? Object.keys(table_getRowModel(table).rowsById)
      : Object.keys(table.getState().expanded)

  rowIds.forEach((id) => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}

export function table_getPreExpandedRowModel<TData extends RowData>(
  table: Table<TData>,
): RowModel<TData> {
  return table_getSortedRowModel(table)
}

export function table_getExpandedRowModel<TData extends RowData>(
  table: Table<TData>,
): RowModel<TData> {
  if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
    table._getExpandedRowModel = table.options.getExpandedRowModel(table)
  }

  if (table.options.manualExpanding || !table._getExpandedRowModel) {
    return table_getPreExpandedRowModel(table)
  }

  return table._getExpandedRowModel()
}

export function row_toggleExpanded<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
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

export function row_getIsExpanded<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const expanded = table.getState().expanded

  return !!(
    table.options.getIsRowExpanded?.(row) ??
    (expanded === true || expanded[row.id])
  )
}

export function row_getCanExpand<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  return (
    table.options.getRowCanExpand?.(row) ??
    ((table.options.enableExpanding ?? true) && !!row.subRows.length)
  )
}

export function row_getIsAllParentsExpanded<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  let isFullyExpanded = true
  let currentRow = row

  while (isFullyExpanded && currentRow.parentId) {
    currentRow = table_getRow(table, currentRow.parentId, true)
    isFullyExpanded = row_getIsExpanded(row, table)
  }

  return isFullyExpanded
}

export function row_getToggleExpandedHandler<TData extends RowData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const canExpand = row_getCanExpand(row, table)

  return () => {
    if (!canExpand) return
    row_toggleExpanded(row, table)
  }
}

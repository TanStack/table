import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  ExpandedState,
  ExpandedStateList,
} from './rowExpandingFeature.types'

export function getDefaultExpandedState(): ExpandedState {
  return structuredClone({})
}

export function table_autoResetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  if (
    table.options.autoResetAll ??
    table.options.autoResetExpanded ??
    !table.options.manualExpanding
  ) {
    queueMicrotask(() => table_resetExpanded(table))
  }
}

export function table_setExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<ExpandedState>) {
  table.options.onExpandedChange?.(updater)
}

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

export function table_resetExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setExpanded(
    table,
    defaultState ? {} : (table.initialState.expanded ?? {}),
  )
}

export function table_getCanSomeRowsExpand<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return table
    .getPrePaginatedRowModel()
    .flatRows.some((row) => row_getCanExpand(row))
}

export function table_getToggleAllRowsExpandedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (e: unknown) => {
    ;(e as any).persist?.()
    table_toggleAllRowsExpanded(table)
  }
}

export function table_getIsSomeRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const expanded = table.options.state?.expanded ?? {}
  return expanded === true || Object.values(expanded).some(Boolean)
}

export function table_getIsAllRowsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const expanded = table.options.state?.expanded ?? {}

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

export function table_getExpandedDepth<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  let maxDepth = 0

  const rowIds =
    table.options.state?.expanded === true
      ? Object.keys(table.getRowModel().rowsById)
      : Object.keys(table.options.state?.expanded ?? {})

  rowIds.forEach((id) => {
    const splitId = id.split('.')
    maxDepth = Math.max(maxDepth, splitId.length)
  })

  return maxDepth
}

export function row_toggleExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, expanded?: boolean) {
  table_setExpanded(row._table, (old) => {
    const exists = old === true ? true : !!old[row.id]

    let oldExpanded: ExpandedStateList = {}

    if (old === true) {
      Object.keys(row._table.getRowModel().rowsById).forEach((rowId) => {
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

export function row_getIsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const expanded = row._table.options.state?.expanded ?? ({} as ExpandedState)

  return !!(
    row._table.options.getIsRowExpanded?.(row) ??
    (expanded === true || expanded[row.id])
  )
}

export function row_getCanExpand<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return (
    row._table.options.getRowCanExpand?.(row) ??
    ((row._table.options.enableExpanding ?? true) && !!row.subRows.length)
  )
}

export function row_getIsAllParentsExpanded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  let isFullyExpanded = true
  let currentRow = row

  while (isFullyExpanded && currentRow.parentId) {
    currentRow = row._table.getRow(currentRow.parentId, true)
    isFullyExpanded = row_getIsExpanded(row)
  }

  return isFullyExpanded
}

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

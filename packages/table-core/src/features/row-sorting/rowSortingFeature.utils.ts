import { reSplitAlphaNumeric, sortingFn_basic } from '../../fns/sortFns'
import { isFunction } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'
import type {
  SortDirection,
  SortingFn,
  SortingState,
} from './rowSortingFeature.types'

// State Utils

export function getDefaultSortingState(): SortingState {
  return structuredClone([])
}

export function table_setSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<SortingState>) {
  table.options.onSortingChange?.(updater)
}

export function table_resetSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setSorting(
    table,
    defaultState ? [] : (table.initialState.sorting ?? []),
  )
}

// Column Utils

export function column_getAutoSortingFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): SortingFn<TFeatures, TData> {
  const sortFns = column.table._rowModelFns.sortFns as
    | Record<string, SortingFn<TFeatures, TData>>
    | undefined

  let sortingFn: SortingFn<TFeatures, TData> | undefined

  const firstRows = column.table.getFilteredRowModel().flatRows.slice(10)

  let isString = false

  for (const row of firstRows) {
    const value = row.getValue(column.id)

    if (Object.prototype.toString.call(value) === '[object Date]') {
      sortingFn = sortFns?.datetime
    }

    if (typeof value === 'string') {
      isString = true

      if (value.split(reSplitAlphaNumeric).length > 1) {
        sortingFn = sortFns?.alphanumeric
      }
    }
  }

  if (isString) {
    sortingFn = sortFns?.text
  }

  return sortingFn ?? sortingFn_basic
}

export function column_getAutoSortDir<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const firstRow = column.table.getFilteredRowModel().flatRows[0]

  const value = firstRow ? firstRow.getValue(column.id) : undefined

  if (typeof value === 'string') {
    return 'asc'
  }

  return 'desc'
}

export function column_getSortingFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): SortingFn<TFeatures, TData> {
  const sortFns = column.table._rowModelFns.sortFns as
    | Record<string, SortingFn<TFeatures, TData>>
    | undefined

  return isFunction(column.columnDef.sortingFn)
    ? column.columnDef.sortingFn
    : column.columnDef.sortingFn === 'auto'
      ? column_getAutoSortingFn(column)
      : (sortFns?.[column.columnDef.sortingFn as string] ?? sortingFn_basic)
}

export function column_toggleSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
  desc?: boolean,
  multi?: boolean,
) {
  // if (column.columns.length) {
  //   column.columns.forEach((c, i) => {
  //     if (c.id) {
  //       table.toggleColumnSorting(c.id, undefined, multi || !!i)
  //     }
  //   })
  //   return
  // }

  // this needs to be outside of table.setSorting to be in sync with rerender
  const nextSortingOrder = column_getNextSortingOrder(column)
  const hasManualValue = typeof desc !== 'undefined'

  table_setSorting(column.table, (old) => {
    // Find any existing sorting for this column
    const existingSorting = old.find((d) => d.id === column.id)
    const existingIndex = old.findIndex((d) => d.id === column.id)

    let newSorting: SortingState = []

    // What should we do with this sort action?
    let sortAction: 'add' | 'remove' | 'toggle' | 'replace'
    const nextDesc = hasManualValue ? desc : nextSortingOrder === 'desc'

    // Multi-mode
    if (old.length && column_getCanMultiSort(column) && multi) {
      if (existingSorting) {
        sortAction = 'toggle'
      } else {
        sortAction = 'add'
      }
    } else {
      // Normal mode
      if (old.length && existingIndex !== old.length - 1) {
        sortAction = 'replace'
      } else if (existingSorting) {
        sortAction = 'toggle'
      } else {
        sortAction = 'replace'
      }
    }

    // Handle toggle states that will remove the sorting
    if (sortAction === 'toggle') {
      // If we are "actually" toggling (not a manual set value), should we remove the sorting?
      if (!hasManualValue) {
        // Is our intention to remove?
        if (!nextSortingOrder) {
          sortAction = 'remove'
        }
      }
    }

    if (sortAction === 'add') {
      newSorting = [
        ...old,
        {
          id: column.id,
          desc: nextDesc,
        },
      ]
      // Take latest n columns
      newSorting.splice(
        0,
        newSorting.length -
          (column.table.options.maxMultiSortColCount ??
            Number.MAX_SAFE_INTEGER),
      )
    } else if (sortAction === 'toggle') {
      // This flips (or sets) the
      newSorting = old.map((d) => {
        if (d.id === column.id) {
          return {
            ...d,
            desc: nextDesc,
          }
        }
        return d
      })
    } else if (sortAction === 'remove') {
      newSorting = old.filter((d) => d.id !== column.id)
    } else {
      newSorting = [
        {
          id: column.id,
          desc: nextDesc,
        },
      ]
    }

    return newSorting
  })
}

export function column_getFirstSortDir<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const sortDescFirst =
    column.columnDef.sortDescFirst ??
    column.table.options.sortDescFirst ??
    column_getAutoSortDir(column) === 'desc'
  return sortDescFirst ? 'desc' : 'asc'
}

export function column_getNextSortingOrder<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>, multi?: boolean) {
  const firstSortDirection = column_getFirstSortDir(column)
  const isSorted = column_getIsSorted(column)

  if (!isSorted) {
    return firstSortDirection
  }

  if (
    isSorted !== firstSortDirection &&
    (column.table.options.enableSortingRemoval ?? true) && // If enableSortRemove, enable in general
    (multi ? (column.table.options.enableMultiRemove ?? true) : true) // If multi, don't allow if enableMultiRemove))
  ) {
    return false
  }
  return isSorted === 'desc' ? 'asc' : 'desc'
}

export function column_getCanSort<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableSorting ?? true) &&
    (column.table.options.enableSorting ?? true) &&
    !!column.accessorFn
  )
}

export function column_getCanMultiSort<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): boolean {
  return (
    column.columnDef.enableMultiSort ??
    column.table.options.enableMultiSort ??
    !!column.accessorFn
  )
}

export function column_getIsSorted<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): false | SortDirection {
  const columnSort = column.table.options.state?.sorting?.find(
    (d) => d.id === column.id,
  )
  return !columnSort ? false : columnSort.desc ? 'desc' : 'asc'
}

export function column_getSortIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  return (
    column.table.options.state?.sorting?.findIndex((d) => d.id === column.id) ??
    -1
  )
}

export function column_clearSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  // clear sorting for just 1 column
  table_setSorting(column.table, (old) =>
    old.length ? old.filter((d) => d.id !== column.id) : [],
  )
}

export function column_getToggleSortingHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const canSort = column_getCanSort(column)

  return (e: unknown) => {
    if (!canSort) return
    ;(e as any).persist?.()
    column_toggleSorting(
      column,

      undefined,
      column_getCanMultiSort(column)
        ? column.table.options.isMultiSortEvent?.(e)
        : false,
    )
  }
}

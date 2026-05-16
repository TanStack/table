import { reSplitAlphaNumeric, sortFn_basic } from '../../fns/sortFns'
import { cloneState, isFunction } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'
import type {
  SortDirection,
  SortFn,
  SortingState,
} from './rowSortingFeature.types'

// State Utils

/**
 * Returns the default sorting state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultSortingState()
 * ```
 */
export function getDefaultSortingState(): SortingState {
  return []
}

/**
 * Updates the table's sorting state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setSorting(table, (old) => old)
 * ```
 */
export function table_setSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<SortingState>) {
  table.options.onSortingChange?.(updater)
}

/**
 * Resets the table's sorting state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
 *
 * @example
 * ```ts
 * table_resetSorting(table)
 * table_resetSorting(table, true)
 * ```
 */
export function table_resetSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setSorting(
    table,
    defaultState ? [] : cloneState(table.initialState.sorting ?? []),
  )
}

// Column Utils

/**
 * Infers sort fn for a column.
 *
 * The inference uses the column definition, table options, and sampled row values when needed.
 *
 * @example
 * ```ts
 * const value = column_getAutoSortFn(column)
 * ```
 */
export function column_getAutoSortFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): SortFn<TFeatures, TData> {
  const sortFns: Record<string, SortFn<TFeatures, TData>> | undefined =
    column.table._rowModelFns.sortFns

  let sortFn: SortFn<TFeatures, TData> | undefined

  const firstRows = column.table.getFilteredRowModel().flatRows.slice(10)

  let isString = false

  for (let i = 0; i < firstRows.length; i++) {
    const value = firstRows[i]!.getValue(column.id)

    if (Object.prototype.toString.call(value) === '[object Date]') {
      sortFn = sortFns?.datetime
    }

    if (typeof value === 'string') {
      isString = true

      if (value.split(reSplitAlphaNumeric).length > 1) {
        sortFn = sortFns?.alphanumeric
      }
    }
  }

  if (isString) {
    sortFn = sortFns?.text
  }

  return sortFn ?? sortFn_basic
}

/**
 * Infers sort dir for a column.
 *
 * The inference uses the column definition, table options, and sampled row values when needed.
 *
 * @example
 * ```ts
 * const value = column_getAutoSortDir(column)
 * ```
 */
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

/**
 * Returns sort fn for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getSortFn(column)
 * ```
 */
export function column_getSortFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): SortFn<TFeatures, TData> {
  const sortFns: Record<string, SortFn<TFeatures, TData>> | undefined =
    column.table._rowModelFns.sortFns

  return isFunction(column.columnDef.sortFn)
    ? column.columnDef.sortFn
    : column.columnDef.sortFn === 'auto'
      ? column_getAutoSortFn(column)
      : (sortFns?.[column.columnDef.sortFn as string] ?? sortFn_basic)
}

/**
 * Toggles sorting for a column.
 *
 * The update is applied through the owning table state slice and respects the feature options for that column.
 *
 * @example
 * ```ts
 * column_toggleSorting(column)
 * ```
 */
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

/**
 * Returns first sort dir for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getFirstSortDir(column)
 * ```
 */
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

/**
 * Returns next sorting order for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getNextSortingOrder(column)
 * ```
 */
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

/**
 * Returns whether a column can use sort.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanSort(column)
 * ```
 */
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

/**
 * Returns whether a column can use multi sort.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanMultiSort(column)
 * ```
 */
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

/**
 * Returns is sorted for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsSorted(column)
 * ```
 */
export function column_getIsSorted<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): false | SortDirection {
  const columnSort = column.table.atoms.sorting
    ?.get()
    ?.find((d) => d.id === column.id)
  return !columnSort ? false : columnSort.desc ? 'desc' : 'asc'
}

/**
 * Returns sort index for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getSortIndex(column)
 * ```
 */
export function column_getSortIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  return (
    column.table.atoms.sorting?.get()?.findIndex((d) => d.id === column.id) ??
    -1
  )
}

/**
 * Clear Sorting. for a column.
 *
 * This is the static implementation behind the matching column instance API.
 *
 * @example
 * ```ts
 * const value = column_clearSorting(column)
 * ```
 */
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

/**
 * Returns an event handler for toggling sorting handler.
 *
 * The handler is intended for direct use in column header controls such as buttons or checkboxes.
 *
 * @example
 * ```ts
 * const value = column_getToggleSortingHandler(column)
 * ```
 */
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

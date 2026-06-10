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
 * Creates the default sorting state.
 *
 * The feature default is an empty array, meaning no columns are sorted. Reset
 * APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const sorting = getDefaultSortingState()
 * ```
 */
export function getDefaultSortingState(): SortingState {
  return []
}

/**
 * Routes a sorting updater through the table's sorting change handler.
 *
 * The updater may be a next `SortingState` array or a function of the previous
 * sorting state, matching the instance `table.setSorting` behavior.
 *
 * @example
 * ```ts
 * table_setSorting(table, (old) => [...old, { id: 'age', desc: true }])
 * ```
 */
export function table_setSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<SortingState>) {
  table.options.onSortingChange?.(updater)
}

/**
 * Resets `sorting` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.sorting` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
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
 * Chooses a built-in sorting function from sampled filtered row values.
 *
 * Date-like values use `datetime`, mixed text/numeric strings use
 * `alphanumeric`, plain strings use `text`, and unknown values fall back to
 * `basic`.
 *
 * @example
 * ```ts
 * const sortFn = column_getAutoSortFn(column)
 * ```
 */
export function column_getAutoSortFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): SortFn<TFeatures, TData> {
  const sortFns: Record<string, SortFn<TFeatures, TData>> | undefined =
    column.table._rowModelFns.sortFns

  const firstRows = column.table.getFilteredRowModel().flatRows.slice(0, 10)

  let isString = false

  for (let i = 0; i < firstRows.length; i++) {
    const value = firstRows[i]!.getValue(column.id)

    if (Object.prototype.toString.call(value) === '[object Date]') {
      if (sortFns?.datetime) {
        return sortFns.datetime
      }
    }

    if (typeof value === 'string') {
      isString = true

      if (value.split(reSplitAlphaNumeric).length > 1) {
        if (sortFns?.alphanumeric) {
          return sortFns.alphanumeric
        }
      }
    }
  }

  if (isString) {
    return sortFns?.text ?? sortFn_basic
  }

  return sortFn_basic
}

/**
 * Chooses the default first sort direction from the first filtered row value.
 *
 * String columns start ascending so alphabetical order is natural; other value
 * types start descending.
 *
 * @example
 * ```ts
 * const direction = column_getAutoSortDir(column)
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
 * Resolves the sorting function configured for a column.
 *
 * Function-valued `columnDef.sortFn` is returned directly, `'auto'` delegates
 * to `column_getAutoSortFn`, and string values are looked up in the table's
 * sorting function registry before falling back to `basic`.
 *
 * @example
 * ```ts
 * const sortFn = column_getSortFn(column)
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
 * Applies the next sorting state for this column.
 *
 * The toggle can add, replace, flip, or remove this column's sort entry. Multi
 * sorting respects `enableMultiSort`, `maxMultiSortColCount`, and the `multi`
 * argument.
 *
 * @example
 * ```ts
 * column_toggleSorting(column, undefined, true)
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
 * Resolves the first direction used when this column begins sorting.
 *
 * Column-level `sortDescFirst` wins, then table-level `sortDescFirst`, then the
 * auto direction inferred from sampled values.
 *
 * @example
 * ```ts
 * const firstDirection = column_getFirstSortDir(column)
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
 * Resolves the next sort order for this column's toggle cycle.
 *
 * The cycle starts with the first sort direction, flips between `asc` and
 * `desc`, and can return `false` when sorting removal is enabled.
 *
 * @example
 * ```ts
 * const nextOrder = column_getNextSortingOrder(column)
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
 * Checks whether this accessor column can participate in sorting.
 *
 * The column must have an accessor and sorting must be enabled by both the
 * column definition and table options.
 *
 * @example
 * ```ts
 * const canSort = column_getCanSort(column)
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
 * Checks whether this column can be added to a multi-sort state.
 *
 * Column-level `enableMultiSort` wins over table-level `enableMultiSort`; if
 * neither is set, accessor columns can multi-sort by default.
 *
 * @example
 * ```ts
 * const canMultiSort = column_getCanMultiSort(column)
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
 * Reads this column's current sort direction.
 *
 * The result is `false` when the column is not sorted, otherwise `'asc'` or
 * `'desc'` based on the column's entry in `state.sorting`.
 *
 * @example
 * ```ts
 * const direction = column_getIsSorted(column)
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
 * Finds this column's position in the ordered `state.sorting` array.
 *
 * The result is `-1` when the column is not sorted.
 *
 * @example
 * ```ts
 * const index = column_getSortIndex(column)
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
 * Removes this column from the sorting state.
 *
 * Other sorted columns are preserved, including their relative order.
 *
 * @example
 * ```ts
 * column_clearSorting(column)
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
 * Creates a header event handler that toggles this column's sorting.
 *
 * The handler ignores events when the column cannot sort, persists React-style
 * synthetic events when present, and asks `options.isMultiSortEvent` whether
 * the event should add to a multi-sort.
 *
 * @example
 * ```ts
 * const onClick = column_getToggleSortingHandler(column)
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

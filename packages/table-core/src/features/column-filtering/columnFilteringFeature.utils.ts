import { cloneState, functionalUpdate, isFunction } from '../../utils'
import type { CellData, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Table_Internal } from '../../types/Table'
import type { Column_Internal } from '../../types/Column'
import type {
  ColumnFiltersState,
  FilterFn,
} from './columnFilteringFeature.types'

/**
 * Creates the default column filter state.
 *
 * The feature default is an empty array, meaning no column filters are active.
 * Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const filters = getDefaultColumnFiltersState()
 * ```
 */
export function getDefaultColumnFiltersState(): ColumnFiltersState {
  return []
}

/**
 * Chooses a built-in filter function from the column's first core row value.
 *
 * Strings use `includesString`, numbers use `inNumberRange`, booleans and
 * objects use `equals`, arrays use `arrIncludes`, and unknown values fall back
 * to `weakEquals`.
 *
 * @example
 * ```ts
 * const filterFn = column_getAutoFilterFn(column)
 * ```
 */
export function column_getAutoFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  const filterFns: Record<string, FilterFn<TFeatures, TData>> | undefined =
    column.table._rowModelFns.filterFns

  const firstRow = column.table.getCoreRowModel().flatRows[0]

  const value = firstRow ? firstRow.getValue(column.id) : undefined

  if (typeof value === 'string') {
    return filterFns?.includesString
  }

  if (typeof value === 'number') {
    return filterFns?.inNumberRange
  }

  if (typeof value === 'boolean') {
    return filterFns?.equals
  }

  if (value !== null && typeof value === 'object') {
    return filterFns?.equals
  }

  if (Array.isArray(value)) {
    return filterFns?.arrIncludes
  }

  return filterFns?.weakEquals
}

/**
 * Resolves the filter function configured for a column.
 *
 * Function-valued `columnDef.filterFn` is returned directly, `'auto'` delegates
 * to `column_getAutoFilterFn`, and string values are looked up in the table's
 * filter function registry.
 *
 * @example
 * ```ts
 * const filterFn = column_getFilterFn(column)
 * ```
 */
export function column_getFilterFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  column: Column_Internal<TFeatures, TData, TValue>,
): FilterFn<TFeatures, TData> | undefined {
  let filterFn = null
  const filterFns: Record<string, FilterFn<TFeatures, TData>> | undefined =
    column.table._rowModelFns.filterFns
  filterFn = isFunction(column.columnDef.filterFn)
    ? column.columnDef.filterFn
    : column.columnDef.filterFn === 'auto'
      ? column_getAutoFilterFn(column)
      : filterFns?.[column.columnDef.filterFn as string]

  if (process.env.NODE_ENV === 'development' && !filterFn) {
    console.warn(
      `Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`,
    )
  }

  return filterFn ?? undefined
}

/**
 * Checks whether column filtering is enabled for this accessor column.
 *
 * The column must have an accessor and filtering must be enabled by the column
 * definition, `enableColumnFilters`, and the table-wide `enableFilters` option.
 *
 * @example
 * ```ts
 * const canFilter = column_getCanFilter(column)
 * ```
 */
export function column_getCanFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return (
    (column.columnDef.enableColumnFilter ?? true) &&
    (column.table.options.enableColumnFilters ?? true) &&
    (column.table.options.enableFilters ?? true) &&
    !!column.accessorFn
  )
}

/**
 * Checks whether this column currently has an entry in `state.columnFilters`.
 *
 * This only reflects filter state presence; it does not indicate whether the
 * filter removes any rows.
 *
 * @example
 * ```ts
 * const isFiltered = column_getIsFiltered(column)
 * ```
 */
export function column_getIsFiltered<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return column_getFilterIndex(column) > -1
}

/**
 * Reads this column's current filter value from `state.columnFilters`.
 *
 * Missing filter entries return `undefined`.
 *
 * @example
 * ```ts
 * const value = column_getFilterValue(column)
 * ```
 */
export function column_getFilterValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>) {
  return column.table.atoms.columnFilters
    ?.get()
    ?.find((d) => d.id === column.id)?.value
}

/**
 * Finds this column's position in the ordered `state.columnFilters` array.
 *
 * The result is `-1` when the column has no active filter.
 *
 * @example
 * ```ts
 * const index = column_getFilterIndex(column)
 * ```
 */
export function column_getFilterIndex<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>): number {
  return (
    column.table.atoms.columnFilters
      ?.get()
      ?.findIndex((d) => d.id === column.id) ?? -1
  )
}

/**
 * Adds, updates, or removes this column's filter value.
 *
 * The incoming value may be an updater. After resolution, `autoRemove` rules
 * decide whether the filter should be removed instead of stored.
 *
 * @example
 * ```ts
 * column_setFilterValue(column, (old) => String(old ?? '').trim())
 * ```
 */
export function column_setFilterValue<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(column: Column_Internal<TFeatures, TData, TValue>, value: any) {
  table_setColumnFilters(column.table, (old) => {
    const filterFn = column_getFilterFn(column)
    const previousFilter = old.find((d) => d.id === column.id)

    const newFilter = functionalUpdate(
      value,
      previousFilter ? previousFilter.value : undefined,
    )

    if (shouldAutoRemoveFilter(filterFn, newFilter, column)) {
      return old.filter((d) => d.id !== column.id)
    }

    const newFilterObj = { id: column.id, value: newFilter }

    if (previousFilter) {
      return old.map((d) => {
        if (d.id === column.id) {
          return newFilterObj
        }
        return d
      })
    }

    if (old.length) {
      return [...old, newFilterObj]
    }

    return [newFilterObj]
  })
}

/**
 * Routes a column filter updater through the table's filter change handler.
 *
 * The resolved filters are cleaned before they are emitted: filters for known
 * columns are removed when their filter function says the value should be
 * auto-removed.
 *
 * @example
 * ```ts
 * table_setColumnFilters(table, (old) => old.filter((filter) => filter.id !== 'age'))
 * ```
 */
export function table_setColumnFilters<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<ColumnFiltersState>,
) {
  const leafColumnsById = table.getAllLeafColumnsById()

  const updateFn = (old: ColumnFiltersState) => {
    return functionalUpdate(updater, old).filter((filter) => {
      const column = leafColumnsById[filter.id]

      if (column) {
        const filterFn = column_getFilterFn(column)

        if (shouldAutoRemoveFilter(filterFn, filter.value, column)) {
          return false
        }
      }

      return true
    })
  }

  table.options.onColumnFiltersChange?.(updateFn)
}

/**
 * Resets `columnFilters` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.columnFilters` when it
 * exists. Passing `true` ignores initial state and resets to `[]`.
 *
 * @example
 * ```ts
 * table_resetColumnFilters(table)
 * table_resetColumnFilters(table, true)
 * ```
 */
export function table_resetColumnFilters<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setColumnFilters(
    table,
    defaultState ? [] : cloneState(table.initialState.columnFilters ?? []),
  )
}

/**
 * Returns whether a filter value should be removed from filter state.
 *
 * This checks the filter function's `autoRemove` hook and built-in empty-value rules.
 *
 * @example
 * ```ts
 * const removeFilter = shouldAutoRemoveFilter(filterFn, value, column)
 * ```
 */
export function shouldAutoRemoveFilter<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TValue extends CellData = CellData,
>(
  filterFn?: FilterFn<TFeatures, TData>,
  value?: any,
  column?: Column_Internal<TFeatures, TData, TValue>,
) {
  return (
    (filterFn && filterFn.autoRemove
      ? filterFn.autoRemove(value, column as Column_Internal<TFeatures, TData>)
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}

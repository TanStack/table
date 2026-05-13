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
 * Returns the default column filters state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultColumnFiltersState()
 * ```
 */
export function getDefaultColumnFiltersState(): ColumnFiltersState {
  return []
}

/**
 * Infers filter fn for a column.
 *
 * The inference uses the column definition, table options, and sampled row values when needed.
 *
 * @example
 * ```ts
 * const value = column_getAutoFilterFn(column)
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
 * Returns filter fn for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getFilterFn(column)
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

  return filterFn
}

/**
 * Returns whether a column can use filter.
 *
 * This combines column options, table options, and any required accessor or feature state for the capability.
 *
 * @example
 * ```ts
 * const value = column_getCanFilter(column)
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
 * Returns is filtered for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getIsFiltered(column)
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
 * Returns filter value for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
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
 * Returns filter index for a column.
 *
 * This derives the value from the column definition, table options, and the feature state atoms registered on the table.
 *
 * @example
 * ```ts
 * const value = column_getFilterIndex(column)
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
 * Updates filter value for a column.
 *
 * This delegates to the owning table state updater so external state, external atoms, and internal state stay synchronized.
 *
 * @example
 * ```ts
 * column_setFilterValue(column, (old) => old)
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
 * Updates the table's column filters state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setColumnFilters(table, (old) => old)
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
 * Resets the table's column filters state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
      ? filterFn.autoRemove(value, column)
      : false) ||
    typeof value === 'undefined' ||
    (typeof value === 'string' && !value)
  )
}

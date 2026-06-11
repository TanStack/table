import { cloneState } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowSelectionState } from './rowSelectionFeature.types'

// State APIs

/**
 * Creates the default row selection state.
 *
 * The feature default is an empty map, meaning no rows are selected. Reset APIs
 * use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const selection = getDefaultRowSelectionState()
 * ```
 */
export function getDefaultRowSelectionState(): RowSelectionState {
  return {}
}

/**
 * Routes a row selection updater through the table's selection change handler.
 *
 * The updater may be a next selection map or a function of the previous map,
 * matching the instance `table.setRowSelection` behavior.
 *
 * @example
 * ```ts
 * table_setRowSelection(table, (old) => ({ ...old, [rowId]: true }))
 * ```
 */
export function table_setRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  updater: Updater<RowSelectionState>,
) {
  table.options.onRowSelectionChange?.(updater)
}

/**
 * Resets `rowSelection` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.rowSelection` when it
 * exists. Passing `true` ignores initial state and resets to `{}`.
 *
 * @example
 * ```ts
 * table_resetRowSelection(table)
 * table_resetRowSelection(table, true)
 * ```
 */
export function table_resetRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setRowSelection(
    table,
    defaultState ? {} : cloneState(table.initialState.rowSelection ?? {}),
  )
}

// Table APIs

/**
 * Selects or deselects every selectable row before grouping.
 *
 * Omitting `value` toggles based on `table_getIsAllRowsSelected(table)`.
 * Deselecting removes matching ids from the existing selection map.
 *
 * @example
 * ```ts
 * table_toggleAllRowsSelected(table)
 * ```
 */
export function table_toggleAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, value?: boolean) {
  table_setRowSelection(table, (old) => {
    value =
      typeof value !== 'undefined' ? value : !table_getIsAllRowsSelected(table)

    const rowSelection = { ...old }

    const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

    // We don't use `mutateRowIsSelected` here for performance reasons.
    // All of the rows are flat already, so it wouldn't be worth it
    if (value) {
      preGroupedFlatRows.forEach((row) => {
        if (!row_getCanSelect(row)) {
          return
        }
        rowSelection[row.id] = true
      })
    } else {
      preGroupedFlatRows.forEach((row) => {
        delete rowSelection[row.id]
      })
    }

    return rowSelection
  })
}

/**
 * Selects or deselects every selectable row on the current page.
 *
 * Omitting `value` toggles based on `table_getIsAllPageRowsSelected(table)`.
 * Child rows are included when sub-row selection allows it.
 *
 * @example
 * ```ts
 * table_toggleAllPageRowsSelected(table)
 * ```
 */
export function table_toggleAllPageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, value?: boolean) {
  table_setRowSelection(table, (old) => {
    const resolvedValue =
      typeof value !== 'undefined'
        ? value
        : !table_getIsAllPageRowsSelected(table)

    const rowSelection: RowSelectionState = { ...old }

    table.getRowModel().rows.forEach((row) => {
      mutateRowIsSelected(rowSelection, row.id, resolvedValue, true, table)
    })

    return rowSelection
  })
}

/**
 * Reads the row model before row selection is projected into selected rows.
 *
 * Selection does not alter the base row pipeline, so this returns the core row
 * model.
 *
 * @example
 * ```ts
 * const rowsBeforeSelection = table_getPreSelectedRowModel(table)
 * ```
 */
export function table_getPreSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getCoreRowModel()
}

/**
 * Builds a row model containing selected rows from the core row model.
 *
 * If no row ids are selected, an empty row model is returned without walking
 * the rows.
 *
 * @example
 * ```ts
 * const selectedRows = table_getSelectedRowModel(table)
 * ```
 */
export function table_getSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rowModel = table.getCoreRowModel()

  if (!Object.keys(table.atoms.rowSelection?.get() ?? {}).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(rowModel)
}

/**
 * Builds a row model containing selected rows from the filtered row model.
 *
 * If no row ids are selected, an empty row model is returned without walking
 * the rows.
 *
 * @example
 * ```ts
 * const selectedRows = table_getFilteredSelectedRowModel(table)
 * ```
 */
export function table_getFilteredSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rowModel = table.getCoreRowModel()

  if (!Object.keys(table.atoms.rowSelection?.get() ?? {}).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(rowModel)
}

/**
 * Builds a row model containing selected rows from the grouped row model.
 *
 * If no row ids are selected, an empty row model is returned without walking
 * the rows.
 *
 * @example
 * ```ts
 * const selectedRows = table_getGroupedSelectedRowModel(table)
 * ```
 */
export function table_getGroupedSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const rowModel = table.getCoreRowModel()

  if (!Object.keys(table.atoms.rowSelection?.get() ?? {}).length) {
    return {
      rows: [],
      flatRows: [],
      rowsById: {},
    }
  }

  return selectRowsFn(rowModel)
}

/**
 * Checks whether every selectable filtered row is selected.
 *
 * The result is false when there are no filtered rows or when selection state is
 * empty.
 *
 * @example
 * ```ts
 * const allSelected = table_getIsAllRowsSelected(table)
 * ```
 */
export function table_getIsAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const preGroupedFlatRows = table.getFilteredRowModel().flatRows
  const rowSelection: RowSelectionState = table.atoms.rowSelection?.get() ?? {}

  let isAllRowsSelected = Boolean(
    preGroupedFlatRows.length && Object.keys(rowSelection).length,
  )

  if (isAllRowsSelected) {
    if (
      preGroupedFlatRows.some(
        (row) => row_getCanSelect(row) && !rowSelection[row.id],
      )
    ) {
      isAllRowsSelected = false
    }
  }

  return isAllRowsSelected
}

/**
 * Checks whether every selectable row on the current page is selected.
 *
 * Non-selectable rows are ignored for this calculation.
 *
 * @example
 * ```ts
 * const allPageRowsSelected = table_getIsAllPageRowsSelected(table)
 * ```
 */
export function table_getIsAllPageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const paginationFlatRows = table
    .getPaginatedRowModel()
    .flatRows.filter((row) => row_getCanSelect(row))
  const rowSelection: RowSelectionState = table.atoms.rowSelection?.get() ?? {}

  let isAllPageRowsSelected = !!paginationFlatRows.length

  if (
    isAllPageRowsSelected &&
    paginationFlatRows.some((row) => !rowSelection[row.id])
  ) {
    isAllPageRowsSelected = false
  }

  return isAllPageRowsSelected
}

/**
 * Checks whether selection is partially applied across filtered rows.
 *
 * The result is true when at least one row id is selected but fewer ids are
 * selected than the current filtered flat row count.
 *
 * @example
 * ```ts
 * const someRowsSelected = table_getIsSomeRowsSelected(table)
 * ```
 */
export function table_getIsSomeRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const totalSelected = Object.keys(
    table.atoms.rowSelection?.get() ?? {},
  ).length
  return (
    totalSelected > 0 &&
    totalSelected < table.getFilteredRowModel().flatRows.length
  )
}

/**
 * Checks whether the current page has a partial selection.
 *
 * This is false when all selectable page rows are selected. Otherwise it is true
 * if any selectable page row or descendant is selected.
 *
 * @example
 * ```ts
 * const somePageRowsSelected = table_getIsSomePageRowsSelected(table)
 * ```
 */
export function table_getIsSomePageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  const paginationFlatRows = table.getPaginatedRowModel().flatRows
  return table_getIsAllPageRowsSelected(table)
    ? false
    : paginationFlatRows
        .filter((row) => row_getCanSelect(row))
        .some((row) => row_getIsSelected(row) || row_getIsSomeSelected(row))
}

/**
 * Creates a checkbox-style handler that selects or deselects all rows.
 *
 * The handler reads `event.target.checked`, so it is intended for controls whose
 * checked state means "all rows selected".
 *
 * @example
 * ```ts
 * const onChange = table_getToggleAllRowsSelectedHandler(table)
 * ```
 */
export function table_getToggleAllRowsSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllRowsSelected(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

/**
 * Creates a checkbox-style handler that selects or deselects current page rows.
 *
 * The handler reads `event.target.checked`, so it is intended for controls whose
 * checked state means "all page rows selected".
 *
 * @example
 * ```ts
 * const onChange = table_getToggleAllPageRowsSelectedHandler(table)
 * ```
 */
export function table_getToggleAllPageRowsSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>) {
  return (e: unknown) => {
    table_toggleAllPageRowsSelected(
      table,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

// Row APIs

/**
 * Selects or deselects this row.
 *
 * Omitting `value` toggles the row. Child rows are selected recursively unless
 * `opts.selectChildren` is `false` or sub-row selection is disabled.
 *
 * @example
 * ```ts
 * row_toggleSelected(row)
 * ```
 */
export function row_toggleSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  row: Row<TFeatures, TData>,
  value?: boolean,
  opts?: {
    selectChildren?: boolean
  },
) {
  const isSelected = row_getIsSelected(row)

  table_setRowSelection(row.table, (old) => {
    value = typeof value !== 'undefined' ? value : !isSelected

    if (row_getCanSelect(row) && isSelected === value) {
      return old
    }

    const selectedRowIds = { ...old }

    mutateRowIsSelected(
      selectedRowIds,
      row.id,
      value,
      opts?.selectChildren ?? true,
      row.table,
    )

    return selectedRowIds
  })
}

/**
 * Checks whether this row id is selected in `state.rowSelection`.
 *
 * Missing row ids are treated as not selected.
 *
 * @example
 * ```ts
 * const selected = row_getIsSelected(row)
 * ```
 */
export function row_getIsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isRowSelected(row)
}

/**
 * Checks whether some, but not all, selectable descendants are selected.
 *
 * This supports indeterminate selection UI for parent rows.
 *
 * @example
 * ```ts
 * const partial = row_getIsSomeSelected(row)
 * ```
 */
export function row_getIsSomeSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isSubRowSelected(row) === 'some'
}

/**
 * Checks whether all selectable descendants are selected.
 *
 * Rows without selectable descendants return false.
 *
 * @example
 * ```ts
 * const allChildrenSelected = row_getIsAllSubRowsSelected(row)
 * ```
 */
export function row_getIsAllSubRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isSubRowSelected(row) === 'all'
}

/**
 * Checks whether this row can be selected.
 *
 * `options.enableRowSelection` may be a boolean or a row predicate; it defaults
 * to `true`.
 *
 * @example
 * ```ts
 * const canSelect = row_getCanSelect(row)
 * ```
 */
export function row_getCanSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const options = row.table.options
  if (typeof options.enableRowSelection === 'function') {
    return options.enableRowSelection(row)
  }

  return options.enableRowSelection ?? true
}

/**
 * Checks whether selecting this row should also select its subRows.
 *
 * `options.enableSubRowSelection` may be a boolean or a row predicate; it
 * defaults to `true`.
 *
 * @example
 * ```ts
 * const canSelectChildren = row_getCanSelectSubRows(row)
 * ```
 */
export function row_getCanSelectSubRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const options = row.table.options
  if (typeof options.enableSubRowSelection === 'function') {
    return options.enableSubRowSelection(row)
  }

  return options.enableSubRowSelection ?? true
}

/**
 * Checks whether this row can be selected alongside other rows.
 *
 * `options.enableMultiRowSelection` may be a boolean or a row predicate; it
 * defaults to `true`.
 *
 * @example
 * ```ts
 * const canMultiSelect = row_getCanMultiSelect(row)
 * ```
 */
export function row_getCanMultiSelect<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const options = row.table.options
  if (typeof options.enableMultiRowSelection === 'function') {
    return options.enableMultiRowSelection(row)
  }

  return options.enableMultiRowSelection ?? true
}

/**
 * Creates a checkbox-style handler that selects or deselects this row.
 *
 * The handler is a no-op when the row cannot be selected and reads
 * `event.target.checked`.
 *
 * @example
 * ```ts
 * const onChange = row_getToggleSelectedHandler(row)
 * ```
 */
export function row_getToggleSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  const canSelect = row_getCanSelect(row)

  return (e: unknown) => {
    if (!canSelect) return
    row_toggleSelected(
      row,
      ((e as MouseEvent).target as HTMLInputElement).checked,
    )
  }
}

const mutateRowIsSelected = <
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  selectedRowIds: Record<string, boolean | undefined>,
  rowId: string,
  value: boolean,
  includeChildren: boolean,
  table: Table_Internal<TFeatures, TData>,
) => {
  const row = table.getRow(rowId, true)

  if (value) {
    if (!row_getCanMultiSelect(row)) {
      Object.keys(selectedRowIds).forEach((key) => delete selectedRowIds[key])
    }
    if (row_getCanSelect(row)) {
      selectedRowIds[rowId] = true
    }
  } else {
    delete selectedRowIds[rowId]
  }

  if (includeChildren && row.subRows.length && row_getCanSelectSubRows(row)) {
    row.subRows.forEach((r) =>
      mutateRowIsSelected(selectedRowIds, r.id, value, includeChildren, table),
    )
  }
}

/**
 * Builds a row model containing rows selected by the current row selection state.
 *
 * The result is derived from the supplied row model, so selected ids absent from
 * that model are not materialized as rows.
 *
 * @example
 * ```ts
 * const selectedRows = selectRowsFn(rowModel)
 * ```
 */
export function selectRowsFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(rowModel: RowModel<TFeatures, TData>): RowModel<TFeatures, TData> {
  const newSelectedFlatRows: Array<Row<TFeatures, TData>> = []
  const newSelectedRowsById: Record<string, Row<TFeatures, TData>> = {}

  // Filters top level and nested rows.
  const recurseRows = (
    rows: Array<Row<TFeatures, TData>>,
    depth = 0,
  ): Array<Row<TFeatures, TData>> => {
    const result: Array<Row<TFeatures, TData>> = []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]!
      const isSelected = isRowSelected(row)

      if (isSelected) {
        newSelectedFlatRows.push(row)
        newSelectedRowsById[row.id] = row
      }

      if (row.subRows.length) {
        // Always recurse — selected descendants of unselected parents must
        // still be collected into flatRows/rowsById.
        const newSubRows = recurseRows(row.subRows, depth + 1)

        if (isSelected) {
          // Preserve prototype chain so methods like getValue() remain accessible
          const cloned = Object.create(Object.getPrototypeOf(row))
          Object.assign(cloned, row)
          cloned.subRows = newSubRows
          result.push(cloned)
        }
      } else if (isSelected) {
        result.push(row)
      }
    }
    return result
  }

  return {
    rows: recurseRows(rowModel.rows),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

/**
 * Returns whether a row id is selected in the current row selection state.
 *
 * @example
 * ```ts
 * const selected = isRowSelected(row)
 * ```
 */
export function isRowSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): boolean {
  return (row.table.atoms.rowSelection?.get() ?? {})[row.id] ?? false
}

/**
 * Returns whether all, some, or none of a row's selectable descendants are selected.
 *
 * The result is used to drive indeterminate row selection UI.
 *
 * @example
 * ```ts
 * const selectedState = isSubRowSelected(row)
 * ```
 */
export function isSubRowSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>): boolean | 'some' | 'all' {
  if (!row.subRows.length) return false

  let allChildrenSelected = true
  let someSelected = false

  row.subRows.forEach((subRow) => {
    // Bail out early if we know both of these
    if (someSelected && !allChildrenSelected) {
      return
    }

    if (row_getCanSelect(subRow)) {
      if (isRowSelected(subRow)) {
        someSelected = true
      } else {
        allChildrenSelected = false
      }
    }

    // Check row selection of nested subrows
    if (subRow.subRows.length) {
      const subRowChildrenSelected = isSubRowSelected(subRow)
      if (subRowChildrenSelected === 'all') {
        someSelected = true
      } else if (subRowChildrenSelected === 'some') {
        someSelected = true
        allChildrenSelected = false
      } else {
        allChildrenSelected = false
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return allChildrenSelected ? 'all' : someSelected ? 'some' : false
}

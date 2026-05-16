import { cloneState } from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type { RowSelectionState } from './rowSelectionFeature.types'

// State APIs

/**
 * Returns the default row selection state.
 *
 * Feature constructors use this value to initialize the table state or option defaults when no user value is provided.
 *
 * @example
 * ```ts
 * const initialValue = getDefaultRowSelectionState()
 * ```
 */
export function getDefaultRowSelectionState(): RowSelectionState {
  return {}
}

/**
 * Updates the table's row selection state slice.
 *
 * The updater follows TanStack Table updater semantics and is routed through the corresponding `on*Change` option or backing atom.
 *
 * @example
 * ```ts
 * table_setRowSelection(table, (old) => old)
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
 * Resets the table's row selection state slice.
 *
 * By default the reset uses `table.initialState`; when supported, a blank/default reset bypasses the saved initial value.
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
 * Toggles all rows selected for the table.
 *
 * This is the table-level convenience API used by UI controls that affect many columns or rows at once.
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
 * Toggles all page rows selected for the table.
 *
 * This is the table-level convenience API used by UI controls that affect many columns or rows at once.
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
 * Returns pre selected row model for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getPreSelectedRowModel(table)
 * ```
 */
export function table_getPreSelectedRowModel<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): RowModel<TFeatures, TData> {
  return table.getCoreRowModel()
}

/**
 * Returns selected row model for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getSelectedRowModel(table)
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
 * Returns filtered selected row model for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getFilteredSelectedRowModel(table)
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
 * Returns grouped selected row model for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getGroupedSelectedRowModel(table)
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
 * Returns is all rows selected for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsAllRowsSelected(table)
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
 * Returns is all page rows selected for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsAllPageRowsSelected(table)
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
 * Returns is some rows selected for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsSomeRowsSelected(table)
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
 * Returns is some page rows selected for the table.
 *
 * This reads the relevant table atoms, options, and row-model cache to derive the current table-level value.
 *
 * @example
 * ```ts
 * const value = table_getIsSomePageRowsSelected(table)
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
 * Returns an event handler for all rows selected handler.
 *
 * The handler calls the matching table toggle API and can be attached directly to checkbox or button UI.
 *
 * @example
 * ```ts
 * const value = table_getToggleAllRowsSelectedHandler(table)
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
 * Returns an event handler for all page rows selected handler.
 *
 * The handler calls the matching table toggle API and can be attached directly to checkbox or button UI.
 *
 * @example
 * ```ts
 * const value = table_getToggleAllPageRowsSelectedHandler(table)
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
 * Toggles selected for a row.
 *
 * The update is routed through the table state updater for the owning feature state slice.
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
 * Returns is selected for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsSelected(row)
 * ```
 */
export function row_getIsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isRowSelected(row)
}

/**
 * Returns is some selected for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsSomeSelected(row)
 * ```
 */
export function row_getIsSomeSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isSubRowSelected(row) === 'some'
}

/**
 * Returns is all sub rows selected for a row.
 *
 * This is the static implementation behind the matching row instance API and may read row caches or table state atoms.
 *
 * @example
 * ```ts
 * const value = row_getIsAllSubRowsSelected(row)
 * ```
 */
export function row_getIsAllSubRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>) {
  return isSubRowSelected(row) === 'all'
}

/**
 * Returns whether a row can use select.
 *
 * This evaluates row data, table options, and feature-specific enablement rules.
 *
 * @example
 * ```ts
 * const value = row_getCanSelect(row)
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
 * Returns whether a row can use select sub rows.
 *
 * This evaluates row data, table options, and feature-specific enablement rules.
 *
 * @example
 * ```ts
 * const value = row_getCanSelectSubRows(row)
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
 * Returns whether a row can use multi select.
 *
 * This evaluates row data, table options, and feature-specific enablement rules.
 *
 * @example
 * ```ts
 * const value = row_getCanMultiSelect(row)
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
 * Returns an event handler for toggling selected handler.
 *
 * The handler is intended for direct use in row-level controls such as expansion or selection buttons.
 *
 * @example
 * ```ts
 * const value = row_getToggleSelectedHandler(row)
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
 * The result is derived from the supplied row model, so selected ids absent from the current data are not materialized as rows.
 *
 * @example
 * ```ts
 * const selectedRows = selectRowsFn(table, rowModel)
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
      let row = rows[i]!
      const isSelected = isRowSelected(row)

      if (isSelected) {
        newSelectedFlatRows.push(row)
        newSelectedRowsById[row.id] = row
      }

      if (row.subRows.length) {
        row = {
          ...row,
          subRows: recurseRows(row.subRows, depth + 1),
        }
      }

      if (isSelected) {
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
 * const selected = isRowSelected(row, selection)
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
 * const selectedState = isSubRowSelected(row, selection, table)
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

import {
  callMemoOrStaticFn,
  cloneState,
  copyInstancePropertiesWithoutMemos,
  hasOwn,
  makeObjectMap,
} from '../../utils'
import type { RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table_Internal } from '../../types/Table'
import type { Row } from '../../types/Row'
import type {
  RowSelectionMode,
  RowSelectionState,
  ToggleSelectedOptions,
} from './rowSelectionFeature.types'

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
  return makeObjectMap()
}

/**
 * Creates the default row selection mode.
 *
 * The feature default is `'include'`, meaning the ids in `rowSelection` are the
 * selected rows. Reset APIs use this value when `defaultState` is `true`.
 *
 * @example
 * ```ts
 * const mode = getDefaultRowSelectionModeState()
 * ```
 */
export function getDefaultRowSelectionModeState(): RowSelectionMode {
  return 'include'
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
  // Unguarded: there is no auto reset and selection maps can scale to the
  // full row count, where an O(n) comparison on every gesture would be pure
  // overhead for real changes.
  table.options.onRowSelectionChange?.(updater)
}

/**
 * Routes a row selection mode updater through the table's mode change handler.
 *
 * The mode only has an effect when `options.manualRowSelection` is `true`.
 * Changing it does not change `rowSelection`, so the ids keep their place but
 * change their meaning.
 *
 * @example
 * ```ts
 * table_setRowSelectionMode(table, 'exclude')
 * ```
 */
export function table_setRowSelectionMode<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, updater: Updater<RowSelectionMode>) {
  table.options.onRowSelectionModeChange?.(updater)
}

/**
 * Resets `rowSelectionMode` to the configured initial state or feature default.
 *
 * With no argument, the reset uses `table.initialState.rowSelectionMode` when
 * it exists. Passing `true` ignores initial state and resets to `'include'`.
 * `rowSelection` is not changed; `table_resetRowSelection` resets both.
 *
 * @example
 * ```ts
 * table_resetRowSelectionMode(table)
 * table_resetRowSelectionMode(table, true)
 * ```
 */
export function table_resetRowSelectionMode<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>, defaultState?: boolean) {
  table_setRowSelectionMode(
    table,
    getResetRowSelectionMode(table, defaultState),
  )
}

/**
 * Resets `rowSelection` to the configured initial state or feature default.
 *
 * With no argument, the reset clones `table.initialState.rowSelection` when it
 * exists. Passing `true` ignores initial state and resets to `{}`. With
 * `options.manualRowSelection`, `rowSelectionMode` is reset in the same way.
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
  // @ts-ignore - _lastSelectedRowId is part of the RowSelection feature
  table._lastSelectedRowId = null
  const rowSelection: RowSelectionState = defaultState
    ? makeObjectMap()
    : Object.assign(
        makeObjectMap<true>(),
        cloneState(table.initialState.rowSelection ?? {}),
      )

  if (table.options.manualRowSelection) {
    setRowSelectionAndMode(
      table,
      rowSelection,
      getResetRowSelectionMode(table, defaultState),
    )
  } else {
    table_setRowSelection(table, rowSelection)
  }
}

// Table APIs

/**
 * Selects or deselects every selectable row before grouping.
 *
 * Omitting `value` toggles based on `table_getIsAllRowsSelected(table)`.
 * Selecting skips sub-rows whose ancestors block descent via
 * `enableSubRowSelection`. Deselecting removes matching selectable ids from the
 * existing selection map; rows that cannot be selected keep their selection
 * unless `opts.deselectAll` is `true`.
 *
 * With `options.manualRowSelection`, no row ids are written. Selecting sets
 * `rowSelectionMode` to `'exclude'`, deselecting sets it to `'include'`, and
 * both clear `rowSelection`. Selecting does nothing when
 * `options.enableRowSelection` is `false`, and stays in `'include'` mode when
 * `options.rowCount` is `0`, because no row can be selected.
 *
 * @example
 * ```ts
 * table_toggleAllRowsSelected(table)
 * ```
 */
export function table_toggleAllRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  value?: boolean,
  opts?: { deselectAll?: boolean },
) {
  // @ts-ignore - _lastSelectedRowId is part of the RowSelection feature
  table._lastSelectedRowId = null

  if (table.options.manualRowSelection) {
    const selectAll =
      value ??
      !callMemoOrStaticFn(
        table,
        'getIsAllRowsSelected',
        table_getIsAllRowsSelected,
      )

    if (selectAll && table.options.enableRowSelection === false) {
      return
    }

    setRowSelectionAndMode(
      table,
      makeObjectMap<true>(),
      selectAll && table.options.rowCount !== 0 ? 'exclude' : 'include',
    )
    return
  }

  table_setRowSelection(table, (old) => {
    value =
      typeof value !== 'undefined'
        ? value
        : !callMemoOrStaticFn(
            table,
            'getIsAllRowsSelected',
            table_getIsAllRowsSelected,
          )

    if (opts?.deselectAll && !value) {
      // deselectAll opt: clear the whole selection map instead of deleting ids one-by-one
      return makeObjectMap<true>()
    }

    const rowSelection = Object.assign(makeObjectMap<true>(), old)
    const preGroupedFlatRows = table.getPreGroupedRowModel().flatRows

    // We don't use `mutateRowIsSelected` here for performance reasons.
    // All of the rows are flat already, so it wouldn't be worth it
    if (value) {
      const subtreeCache = new Map<string, boolean>()
      preGroupedFlatRows.forEach((row) => {
        if (isRowSelectableInSelectAll(row, subtreeCache)) {
          rowSelection[row.id] = true
        }
      })
    } else {
      preGroupedFlatRows.forEach((row) => {
        if (row_getCanSelect(row)) {
          delete rowSelection[row.id]
        }
      })
    }

    return rowSelection
  })
}

/**
 * Selects or deselects every selectable row on the current page.
 *
 * Omitting `value` toggles based on `table_getIsAllPageRowsSelected(table)`.
 * Child rows are included when sub-row selection allows it. In `'exclude'`
 * mode, deselecting adds the page row ids to `rowSelection`, selecting removes
 * them, and `opts.deselectAll` switches back to an empty `'include'` selection.
 *
 * @example
 * ```ts
 * table_toggleAllPageRowsSelected(table)
 * ```
 */
export function table_toggleAllPageRowsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  value?: boolean,
  opts?: { deselectAll?: boolean },
) {
  // @ts-ignore - _lastSelectedRowId is part of the RowSelection feature
  table._lastSelectedRowId = null

  if (isRowSelectionExcluded(table)) {
    const resolvedValue =
      value ??
      !callMemoOrStaticFn(
        table,
        'getIsAllPageRowsSelected',
        table_getIsAllPageRowsSelected,
      )

    if (opts?.deselectAll && !resolvedValue) {
      setRowSelectionAndMode(table, makeObjectMap<true>(), 'include')
      return
    }

    updateRowSelection(table, true, !resolvedValue, (rowSelection) => {
      table.getRowModel().rows.forEach((row) => {
        mutateRowIsSelected(
          rowSelection,
          row.id,
          resolvedValue,
          true,
          table,
          true,
          true,
        )
      })
    })
    return
  }

  table_setRowSelection(table, (old) => {
    const resolvedValue =
      typeof value !== 'undefined'
        ? value
        : !callMemoOrStaticFn(
            table,
            'getIsAllPageRowsSelected',
            table_getIsAllPageRowsSelected,
          )

    if (opts?.deselectAll && !resolvedValue) {
      // deselectAll opt: clear the whole selection map instead of deleting ids one-by-one
      return makeObjectMap<true>()
    }

    const rowSelection: RowSelectionState = Object.assign(
      makeObjectMap<true>(),
      old,
    )

    table.getRowModel().rows.forEach((row) => {
      mutateRowIsSelected(
        rowSelection,
        row.id,
        resolvedValue,
        true,
        table,
        true,
      )
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

  if (
    !callMemoOrStaticFn(
      table,
      'getIsSomeRowsSelected',
      table_getIsSomeRowsSelected,
    )
  ) {
    return {
      rows: [],
      flatRows: [],
      rowsById: makeObjectMap(),
    }
  }

  return selectRowsFn(rowModel, table)
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
  const rowModel = table.getFilteredRowModel()

  if (
    !callMemoOrStaticFn(
      table,
      'getIsSomeRowsSelected',
      table_getIsSomeRowsSelected,
    )
  ) {
    return {
      rows: [],
      flatRows: [],
      rowsById: makeObjectMap(),
    }
  }

  return selectRowsFn(rowModel, table)
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
  // The sorted model falls back grouped -> filtered -> core when those
  // features are not registered, so selected group rows are always visible.
  const rowModel = table.getSortedRowModel()

  if (
    !callMemoOrStaticFn(
      table,
      'getIsSomeRowsSelected',
      table_getIsSomeRowsSelected,
    )
  ) {
    return {
      rows: [],
      flatRows: [],
      rowsById: makeObjectMap(),
    }
  }

  return selectRowsFn(rowModel, table)
}

/**
 * Returns the ids of all selected rows.
 *
 * In `'exclude'` mode, only the ids of loaded selected rows are returned,
 * because the table does not know the ids of rows that are not loaded.
 *
 * @example
 * ```ts
 * const selectedRowIds = table_getSelectedRowIds(table)
 * ```
 */
export function table_getSelectedRowIds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): Array<string> {
  const rowSelection = table.atoms.rowSelection?.get() ?? {}

  if (isRowSelectionExcluded(table)) {
    const selectedRowIds: Array<string> = []
    table.getCoreRowModel().flatRows.forEach((row) => {
      if (!isRowSelected(row, rowSelection)) {
        selectedRowIds.push(row.id)
      }
    })
    return selectedRowIds
  }

  return Object.keys(rowSelection)
}

/**
 * Returns the number of selected rows.
 *
 * In `'include'` mode this is the number of ids in `rowSelection`. In
 * `'exclude'` mode this is `options.rowCount` minus the deselected rows, so
 * `rowCount` must be the exact total of the server. With an estimated total,
 * the result is wrong.
 * `rowCount` counts top-level rows, so the ids of loaded sub-rows and of group
 * rows are not subtracted. An id that is not loaded is subtracted as one row,
 * because the table cannot know that it is a sub-row. When `rowCount` is not
 * set, the selected top-level rows of the filtered row model are counted
 * instead, which is only correct when every row is loaded.
 *
 * @example
 * ```ts
 * const selectedRowCount = table_getSelectedRowCount(table)
 * ```
 */
export function table_getSelectedRowCount<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): number {
  if (!isRowSelectionExcluded(table)) {
    return callMemoOrStaticFn(
      table,
      'getSelectedRowIds',
      table_getSelectedRowIds,
    ).length
  }

  const rowSelection = table.atoms.rowSelection?.get() ?? {}
  const rowCount = table.options.rowCount

  if (rowCount === undefined) {
    return table
      .getFilteredRowModel()
      .rows.filter((row) => !isRowSelected(row, rowSelection)).length
  }

  return Math.max(0, rowCount - countExcludedRows(table, rowSelection))
}

/**
 * Checks whether every selectable filtered row is selected.
 *
 * The result is false when there are no filtered rows or when selection state is
 * empty. Sub-rows whose ancestors block descent via `enableSubRowSelection` are
 * ignored, matching the rows that `table_toggleAllRowsSelected` selects.
 *
 * With `options.manualRowSelection`, the loaded rows are not all rows, so the
 * result is only true in `'exclude'` mode with an empty `rowSelection`.
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
  const rowSelection = table.atoms.rowSelection?.get() ?? {}

  if (table.options.manualRowSelection) {
    return (
      isRowSelectionExcluded(table) && Object.keys(rowSelection).length === 0
    )
  }

  const preGroupedFlatRows = table.getFilteredRowModel().flatRows

  let isAllRowsSelected = Boolean(
    preGroupedFlatRows.length && Object.keys(rowSelection).length,
  )

  if (isAllRowsSelected) {
    // The cheap map lookup runs first so already-selected rows skip the
    // capability checks entirely
    const subtreeCache = new Map<string, boolean>()
    if (
      preGroupedFlatRows.some(
        (row) =>
          !isRowSelected(row, rowSelection) &&
          isRowSelectableInSelectAll(row, subtreeCache),
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
 * Non-selectable rows are ignored for this calculation, as are sub-rows whose
 * ancestors block descent via `enableSubRowSelection`.
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
  const paginationFlatRows = table.getPaginatedRowModel().flatRows
  const rowSelection = table.atoms.rowSelection?.get() ?? {}
  const exclude = isRowSelectionExcluded(table)
  const subtreeCache = new Map<string, boolean>()

  // Single pass, cheap map lookup first: an unselected row only matters if
  // select-all could have reached it, and once one selected eligible row is
  // seen the remaining selected rows skip the capability checks entirely.
  let sawSelectableRow = false
  for (let i = 0; i < paginationFlatRows.length; i++) {
    const row = paginationFlatRows[i]!
    if (isRowSelected(row, rowSelection) === exclude) {
      if (isRowSelectableInSelectAll(row, subtreeCache)) {
        return false
      }
    } else if (
      !sawSelectableRow &&
      isRowSelectableInSelectAll(row, subtreeCache)
    ) {
      sawSelectableRow = true
    }
  }

  return sawSelectableRow
}

/**
 * Checks whether at least one row id is selected.
 *
 * The result stays true when every row is selected, and is always true in
 * `'exclude'` mode.
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
  return (
    isRowSelectionExcluded(table) ||
    callMemoOrStaticFn(table, 'getSelectedRowIds', table_getSelectedRowIds)
      .length > 0
  )
}

/**
 * Checks whether at least one selectable row on the current page is selected.
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
  return table
    .getPaginatedRowModel()
    .flatRows.filter((row) => row_getCanSelect(row))
    .some(
      (row) =>
        row_getIsSelected(row) ||
        callMemoOrStaticFn(row, 'getIsSomeSelected', row_getIsSomeSelected),
    )
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
 * `opts.selectChildren` is `false`, sub-row selection is disabled, or the row
 * only supports single selection. Pass `deselectParents: true` to also remove
 * ancestor row ids from the selection when this row is deselected.
 *
 * In `'exclude'` mode, deselecting adds the row id to `rowSelection` and
 * selecting removes it. When `options.rowCount` is set, the deselected rows
 * cover every row, and no loaded row is selected, the state goes back to an
 * empty `'include'` selection.
 *
 * @example
 * ```ts
 * row_toggleSelected(row)
 * row_toggleSelected(row, true)
 * row_toggleSelected(row, false)
 * row_toggleSelected(row, true, { selectChildren: false })
 * row_toggleSelected(row, false, { deselectParents: true })
 * ```
 */
export function row_toggleSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, value?: boolean, opts?: ToggleSelectedOptions) {
  const table = row.table
  const exclude = isRowSelectionExcluded(table)
  const isSelected = row_getIsSelected(row)
  const nextValue = typeof value !== 'undefined' ? value : !isSelected

  if (exclude && nextValue && !row_getCanMultiSelect(row)) {
    // A single-select row must be the only selected row. A list of deselected
    // ids cannot say that, so go back to `'include'` mode.
    setRowSelectionAndMode(
      table,
      Object.assign(
        makeObjectMap<true>(),
        row_getCanSelect(row) ? { [row.id]: true } : undefined,
      ),
      'include',
    )
    return
  }

  updateRowSelection(table, exclude, !nextValue, (rowSelection) => {
    mutateRowIsSelected(
      rowSelection,
      row.id,
      nextValue,
      (opts?.selectChildren ?? true) && row_getCanMultiSelect(row),
      table,
      false,
      exclude,
    )

    if (!nextValue && opts?.deselectParents) {
      pruneAncestorRowIds(rowSelection, row, exclude)
    }
  })
}

/**
 * Checks whether this row id is selected in `state.rowSelection`.
 *
 * Missing row ids are treated as not selected. In `'exclude'` mode this is
 * inverted: a row is selected when its id is missing.
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
  const rowSelection = row.table.atoms.rowSelection?.get() ?? {}
  return isRowSelected(row, rowSelection) !== isRowSelectionExcluded(row.table)
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
 * `event.target.checked`. Shift events select or deselect the inclusive range
 * from the most recent selectable row handled by this table. Pass
 * `selectChildren: false` to limit changes to rows explicitly present in the
 * display-order interval, and `deselectParents: true` to remove ancestor row
 * ids from the selection when rows are deselected.
 *
 * @example
 * ```ts
 * const onChange = row_getToggleSelectedHandler(row)
 * ```
 */
export function row_getToggleSelectedHandler<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, opts?: ToggleSelectedOptions) {
  const canSelect = row_getCanSelect(row)

  return (e: unknown) => {
    if (!canSelect) return

    const event = e as {
      target: { checked: boolean }
    }

    const table = row.table
    const checked = event.target.checked
    // @ts-ignore - _lastSelectedRowId is part of the RowSelection feature
    const anchorId = table._lastSelectedRowId
    const canSelectRange =
      table.options.enableRowRangeSelection !== false &&
      anchorId !== null &&
      row_getCanMultiSelect(row) &&
      (table.options.isRowRangeSelectionEvent?.(e) ?? false)

    if (!canSelectRange || !selectRowRange(row, anchorId, checked, opts)) {
      row_toggleSelected(row, checked, opts)
    }

    // @ts-ignore - _lastSelectedRowId is part of the RowSelection feature
    table._lastSelectedRowId = row.id
  }
}

/**
 * Resolves and mutates an inclusive interval in the table's latest logical
 * display order.
 *
 * The anchor is resolved without throwing from the pre-pagination row model,
 * then the core row model. Both endpoint display indexes must still identify
 * those rows in the current order and both endpoints must support
 * multi-selection. Eligible interval rows are applied through one row
 * selection updater; non-selectable and non-multi-selectable rows are skipped.
 * Returns `false` when the interaction should fall back to an ordinary toggle.
 */
function selectRowRange<TFeatures extends TableFeatures, TData extends RowData>(
  row: Row<TFeatures, TData>,
  anchorId: string,
  value: boolean,
  opts?: ToggleSelectedOptions,
): boolean {
  const includeChildren = opts?.selectChildren ?? true
  const table = row.table
  const rows = table.getRowsInDisplayOrder()
  const anchorRow =
    table.getPrePaginatedRowModel().rowsById[anchorId] ??
    table.getCoreRowModel().rowsById[anchorId]

  if (!anchorRow) {
    return false
  }

  const anchorIndex = anchorRow.getDisplayIndex()
  const rowIndex = row.getDisplayIndex()
  const anchorAtIndex = rows[anchorIndex]
  const rowAtIndex = rows[rowIndex]

  if (
    anchorIndex < 0 ||
    rowIndex < 0 ||
    anchorIndex >= rows.length ||
    rowIndex >= rows.length ||
    anchorAtIndex?.id !== anchorRow.id ||
    rowAtIndex?.id !== row.id ||
    !row_getCanMultiSelect(anchorRow) ||
    !row_getCanMultiSelect(row)
  ) {
    return false
  }

  const start = Math.min(anchorIndex, rowIndex)
  const end = Math.max(anchorIndex, rowIndex)

  const exclude = isRowSelectionExcluded(table)

  updateRowSelection(table, exclude, !value, (rowSelection) => {
    for (let index = start; index <= end; index++) {
      const rangeRow = rows[index]!
      if (!row_getCanSelect(rangeRow) || !row_getCanMultiSelect(rangeRow)) {
        continue
      }
      mutateRowIsSelected(
        rowSelection,
        rangeRow.id,
        value,
        includeChildren,
        table,
        false,
        exclude,
      )
      if (!value && opts?.deselectParents) {
        pruneAncestorRowIds(rowSelection, rangeRow, exclude)
      }
    }
  })

  return true
}

/**
 * Returns whether the ids in `rowSelection` are the deselected rows. The mode
 * state only counts when `options.manualRowSelection` allows it.
 */
function isRowSelectionExcluded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(table: Table_Internal<TFeatures, TData>): boolean {
  return (
    !!table.options.manualRowSelection &&
    table.atoms.rowSelectionMode?.get() === 'exclude'
  )
}

function getResetRowSelectionMode<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  defaultState?: boolean,
): RowSelectionMode {
  return defaultState
    ? getDefaultRowSelectionModeState()
    : (table.initialState.rowSelectionMode ?? getDefaultRowSelectionModeState())
}

function setRowSelectionAndMode<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  rowSelection: RowSelectionState,
  mode: RowSelectionMode,
): void {
  table._reactivity.batch(() => {
    table_setRowSelection(table, rowSelection)
    table_setRowSelectionMode(table, mode)
  })
}

/**
 * Counts the deselected rows in the unit of `options.rowCount`, which is
 * top-level rows. The id of a row that is not loaded counts as a top-level
 * row, because the table cannot know that it is a sub-row.
 */
function countExcludedRows<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  rowSelection: RowSelectionState,
): number {
  const rowsById = table.getCoreRowModel().rowsById
  const groupedRowsById = table.getGroupedRowModel().rowsById
  let count = 0
  for (const rowId of Object.keys(rowSelection)) {
    const row = rowsById[rowId]
    if (!row) {
      // A group row is only in the grouped row model. It is not a data row.
      if (!groupedRowsById[rowId]) {
        count++
      }
      continue
    }
    // Grouping sets `parentId` to a group row id. A group row is not in the
    // core row model, so that row is still a top-level row.
    if (row.parentId === undefined || !rowsById[row.parentId]) {
      count++
    }
  }
  return count
}

function isFlatTable<TFeatures extends TableFeatures, TData extends RowData>(
  table: Table_Internal<TFeatures, TData>,
): boolean {
  return !table.options.getSubRows && !table.options.features.groupedRowModel
}

function isEveryRowIdLoaded<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  rowSelection: RowSelectionState,
): boolean {
  const rowsById = table.getCoreRowModel().rowsById
  const groupedRowsById = table.getGroupedRowModel().rowsById
  return Object.keys(rowSelection).every(
    (rowId) => rowsById[rowId] || groupedRowsById[rowId],
  )
}

/**
 * Applies `mutate` to a copy of the row selection map.
 *
 * In `'exclude'` mode with a known `options.rowCount`, a deselection that
 * leaves no row selected goes back to an empty `'include'` selection. Without
 * this, the mode says "all rows" while no row is selected.
 *
 * The count of deselected rows can be too high: an id can be a sub-row of a
 * page that is not loaded, or `rowCount` can be the count of a new filter. So
 * the state only goes back when no loaded row is selected. With
 * `options.getSubRows` or a grouped row model, every deselected id must also
 * be loaded, because an id that is not loaded can be a sub-row or the id of a
 * group row from an earlier grouping.
 */
function updateRowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  table: Table_Internal<TFeatures, TData>,
  exclude: boolean,
  isDeselect: boolean,
  mutate: (rowSelection: RowSelectionState) => void,
): void {
  const updater = (old: RowSelectionState) => {
    const rowSelection = Object.assign(makeObjectMap<true>(), old)
    mutate(rowSelection)
    return rowSelection
  }
  const rowCount = table.options.rowCount

  if (!exclude || !isDeselect || rowCount === undefined) {
    table_setRowSelection(table, updater)
    return
  }

  // Do not change the mode inside the updater. A state setter can run an
  // updater two times. Use the current state to make the decision. A state
  // owner that applies the updater later can make this decision stale.
  const current: RowSelectionState = table.atoms.rowSelection?.get() ?? {}
  const next = updater(current)

  if (
    countExcludedRows(table, next) >= rowCount &&
    (isFlatTable(table) || isEveryRowIdLoaded(table, next)) &&
    table.getCoreRowModel().flatRows.every((row) => isRowSelected(row, next))
  ) {
    setRowSelectionAndMode(table, makeObjectMap<true>(), 'include')
  } else {
    table_setRowSelection(table, (old) =>
      old === current ? next : updater(old),
    )
  }
}

function mutateRowIsSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowSelection: RowSelectionState,
  rowId: string,
  value: boolean,
  includeChildren: boolean,
  table: Table_Internal<TFeatures, TData>,
  respectCanSelectOnDeselect?: boolean,
  exclude?: boolean,
): void {
  const row = table.getRow(rowId, true)

  if (value) {
    if (!exclude && !row_getCanMultiSelect(row)) {
      Object.keys(rowSelection).forEach((key) => delete rowSelection[key])
    }
    if (row_getCanSelect(row)) {
      writeRowIsSelected(rowSelection, rowId, true, exclude)
    }
  } else if (!respectCanSelectOnDeselect || row_getCanSelect(row)) {
    writeRowIsSelected(rowSelection, rowId, false, exclude)
  }

  if (includeChildren && row.subRows.length && row_getCanSelectSubRows(row)) {
    row.subRows.forEach((r) =>
      mutateRowIsSelected(
        rowSelection,
        r.id,
        value,
        includeChildren,
        table,
        respectCanSelectOnDeselect,
        exclude,
      ),
    )
  }
}

/**
 * Writes one row's selected state into the map. In `'exclude'` mode the map
 * holds the deselected ids, so the write is inverted.
 */
function writeRowIsSelected(
  rowSelection: RowSelectionState,
  rowId: string,
  value: boolean,
  exclude?: boolean,
): void {
  if (value !== !!exclude) {
    rowSelection[rowId] = true
  } else {
    delete rowSelection[rowId]
  }
}

/**
 * Returns whether a select-all cascade can reach this row: the row itself is
 * selectable and no ancestor blocks descent via `enableSubRowSelection`.
 *
 * `subtreeCache` memoizes the per-ancestor verdict for one select-all pass, so
 * ancestor chains shared by sibling rows are only walked (and the
 * `enableSubRowSelection` predicate only invoked) once per unique ancestor.
 */
function isRowSelectableInSelectAll<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, subtreeCache: Map<string, boolean>): boolean {
  if (!row_getCanSelect(row)) return false

  const table = row.table
  // Fast path: the default `true` means every selectable row is reachable
  if (table.options.enableSubRowSelection === true) return true

  const parentId = row.parentId
  if (parentId === undefined) return true

  const cached = subtreeCache.get(parentId)
  if (cached !== undefined) return cached

  // Walk uncached ancestors upward, then record the shared verdict for every
  // id visited. A blocked ancestor blocks its whole subtree.
  const rowsById = table.getCoreRowModel().rowsById
  const visited: Array<string> = []
  let selectable = true
  let currentId: string | undefined = parentId
  while (currentId !== undefined) {
    const known = subtreeCache.get(currentId)
    if (known !== undefined) {
      selectable = known
      break
    }
    visited.push(currentId)
    const parent: Row<TFeatures, TData> =
      rowsById[currentId] ?? table.getRow(currentId, true)
    if (!row_getCanSelectSubRows(parent)) {
      selectable = false
      break
    }
    currentId = parent.parentId
  }
  visited.forEach((id) => subtreeCache.set(id, selectable))
  return selectable
}

function pruneAncestorRowIds<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowSelection: RowSelectionState,
  row: Row<TFeatures, TData>,
  exclude?: boolean,
): void {
  // Deselecting a descendant always invalidates "all children selected", so
  // every ancestor id can be deleted unconditionally. Deliberately not gated
  // by `row_getCanSelect`: like the other targeted deselection paths, pruning
  // may clear ids of rows that cannot be interactively selected — a skipped
  // ancestor would keep reporting `getIsSelected()` over a deselected child,
  // which is the exact stale-parent state this opt-in exists to remove.
  const rowsById = row.table.getCoreRowModel().rowsById
  let parentId = row.parentId
  while (parentId !== undefined) {
    writeRowIsSelected(rowSelection, parentId, false, exclude)
    parentId = (rowsById[parentId] ?? row.table.getRow(parentId, true)).parentId
  }
}

function selectRowsRecursively<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rows: Array<Row<TFeatures, TData>>,
  rowSelection: RowSelectionState,
  selectedFlatRows: Array<Row<TFeatures, TData>>,
  selectedRowsById: Record<string, Row<TFeatures, TData>>,
  exclude: boolean,
): Array<Row<TFeatures, TData>> {
  const result: Array<Row<TFeatures, TData>> = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!
    const isSelected = isRowSelected(row, rowSelection) !== exclude

    if (isSelected) {
      selectedFlatRows.push(row)
      selectedRowsById[row.id] = row
    }

    if (row.subRows.length) {
      // Always recurse — selected descendants of unselected parents must
      // still be collected into flatRows/rowsById.
      const newSubRows = selectRowsRecursively(
        row.subRows,
        rowSelection,
        selectedFlatRows,
        selectedRowsById,
        exclude,
      )

      if (isSelected) {
        // Preserve prototype chain so methods like getValue() remain accessible
        const cloned = Object.create(Object.getPrototypeOf(row))
        copyInstancePropertiesWithoutMemos(cloned, row)
        cloned.subRows = newSubRows
        result.push(cloned)
      }
    } else if (isSelected) {
      result.push(row)
    }
  }

  return result
}

/**
 * Builds a row model containing rows selected by the current row selection state.
 *
 * The result is derived from the supplied row model, so selected ids absent from
 * that model are not materialized as rows. In `'exclude'` mode, the result
 * contains the rows of the supplied row model whose ids are not in the state.
 *
 * @example
 * ```ts
 * const selectedRows = selectRowsFn(rowModel)
 * ```
 */
export function selectRowsFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(
  rowModel: RowModel<TFeatures, TData>,
  table: Table_Internal<TFeatures, TData>,
): RowModel<TFeatures, TData> {
  const newSelectedFlatRows: Array<Row<TFeatures, TData>> = []
  const newSelectedRowsById = makeObjectMap<Row<TFeatures, TData>>()
  const rowSelection = table.atoms.rowSelection?.get() ?? {}

  return {
    rows: selectRowsRecursively(
      rowModel.rows,
      rowSelection,
      newSelectedFlatRows,
      newSelectedRowsById,
      isRowSelectionExcluded(table),
    ),
    flatRows: newSelectedFlatRows,
    rowsById: newSelectedRowsById,
  }
}

/**
 * Returns whether a row id is selected in the current row selection state.
 *
 * This is the plain map lookup. In `'exclude'` mode the map holds the
 * deselected ids, so use `row_getIsSelected` to read the selected state.
 *
 * @example
 * ```ts
 * const selected = isRowSelected(row)
 * ```
 */
export function isRowSelected<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(row: Row<TFeatures, TData>, rowSelection: RowSelectionState): boolean {
  return !!(hasOwn(rowSelection, row.id) && rowSelection[row.id])
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

  const rowSelection = row.table.atoms.rowSelection?.get() ?? {}
  const exclude = isRowSelectionExcluded(row.table)

  let someSelected = false
  let allChildrenSelected = true
  let someSelectable = false

  for (let i = 0; i < row.subRows.length; i++) {
    const subRow = row.subRows[i]!

    // Bail out early if we know both of these
    if (someSelected && !allChildrenSelected) {
      break
    }

    if (row_getCanSelect(subRow)) {
      someSelectable = true
      if (isRowSelected(subRow, rowSelection) !== exclude) {
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
        someSelectable = true
      } else if (subRowChildrenSelected === 'some') {
        someSelected = true
        allChildrenSelected = false
        someSelectable = true
      } else {
        allChildrenSelected = false
      }
    }
  }

  // A row with no selectable descendants can never be in a selected state
  if (!someSelectable) return false

  return allChildrenSelected ? 'all' : someSelected ? 'some' : false
}

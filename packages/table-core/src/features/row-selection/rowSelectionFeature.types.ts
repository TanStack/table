import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'

export type RowSelectionState = Record<string, true>

/**
 * How the ids in `rowSelection` are read.
 *
 * - `'include'`: the ids are the selected rows. This is the default.
 * - `'exclude'`: every row is selected except the ids in `rowSelection`. Only
 *   used when the `manualRowSelection` table option is `true`.
 */
export type RowSelectionMode = 'include' | 'exclude'

/**
 * Controls how toggling a row affects its descendants and ancestors.
 */
export interface ToggleSelectedOptions {
  /**
   * Whether selectable child rows should be toggled recursively. Defaults to
   * `true`.
   */
  selectChildren?: boolean
  /**
   * Whether ancestor row ids should be removed from the selection when this
   * row is deselected. Useful after a parent cascade wrote the parent id into
   * state and a child is later deselected. Defaults to `false`.
   *
   * Ancestor ids are removed even when the ancestor itself cannot be selected.
   * Like the other targeted deselection paths, pruning is not gated by
   * `enableRowSelection`; only the bulk select-all paths preserve
   * non-selectable rows.
   */
  deselectParents?: boolean
}

export interface TableState_RowSelection {
  rowSelection: RowSelectionState
  rowSelectionMode: RowSelectionMode
}

export interface TableOptions_RowSelection<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Enables inclusive row range selection through
   * `row.getToggleSelectedHandler()`. Defaults to `true`.
   */
  enableRowRangeSelection?: boolean
  /**
   * Allows rows to be selected alongside other rows.
   *
   * Provide a predicate to decide per row. Defaults to `true`.
   */
  enableMultiRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * Allows rows to be selected.
   *
   * Provide a predicate to decide per row. Defaults to `true`.
   */
  enableRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * Controls whether selecting a parent row also selects its subRows.
   *
   * Provide a predicate to decide per row. This is most useful with expanding or
   * grouping features and defaults to `true`. Select-all and the all-selected
   * getters also skip descendants of parents that block sub-row selection.
   */
  enableSubRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * Determines whether a row-selection handler event should select or
   * deselect the inclusive range from the most recent handler interaction.
   *
   * By default, events with `shiftKey` directly on the event or on
   * `event.nativeEvent` are treated as range-selection events.
   */
  isRowRangeSelectionEvent?: (event: unknown) => boolean
  /**
   * Allows the `'exclude'` row selection mode, for tables that do not load
   * every row (for example with server-side pagination). Defaults to `false`.
   *
   * When `true`, `toggleAllRowsSelected(true)` sets `rowSelectionMode` to
   * `'exclude'` and clears `rowSelection` instead of writing the loaded row
   * ids, and `toggleAllRowsSelected(false)` sets the mode back to `'include'`
   * and clears `rowSelection`. In `'exclude'` mode the ids in `rowSelection`
   * are the deselected rows, so rows that load later are selected. A row
   * whose id is not in `rowSelection` is selected, also when
   * `enableRowSelection` does not let the user toggle it.
   *
   * When `false`, `rowSelectionMode` is ignored and always read as
   * `'include'`.
   */
  manualRowSelection?: boolean
  /**
   * Called with an updater when row selection state changes. Pair this with
   * `state.rowSelection` when using external state; external atoms can own the
   * slice without this callback.
   */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  /**
   * Called with an updater when the row selection mode changes. Pair this
   * with `state.rowSelectionMode` when using external state; external atoms
   * can own the slice without this callback.
   */
  onRowSelectionModeChange?: OnChangeFn<RowSelectionMode>
  /**
   * The total number of rows, including rows that are not loaded. In
   * `'exclude'` mode, `table.getSelectedRowCount()` subtracts the deselected
   * rows from this value. This is the same option that manual pagination
   * reads, and it counts top-level rows.
   */
  rowCount?: number
  // enableGroupingRowSelection?:
  //   | boolean
  //   | ((
  //       row: Row<TFeatures, TData>
  //     ) => boolean)
  // isAdditiveSelectEvent?: (e: unknown) => boolean
  // selectRowsFn?: (
  //   table: Table<TFeatures, TData>,
  //   rowModel: RowModel<TFeatures, TData>
  // ) => RowModel<TFeatures, TData>
}

export interface Row_RowSelection {
  /**
   * Checks whether this row can be selected alongside other rows.
   */
  getCanMultiSelect: () => boolean
  /**
   * Checks whether this row can currently be selected.
   */
  getCanSelect: () => boolean
  /**
   * Checks whether selecting this row should also select its subRows.
   */
  getCanSelectSubRows: () => boolean
  /**
   * Checks whether all selectable descendants are selected.
   */
  getIsAllSubRowsSelected: () => boolean
  /**
   * Checks whether this row id is selected. In `'exclude'` mode, a row is
   * selected when its id is not in `rowSelection`.
   */
  getIsSelected: () => boolean
  /**
   * Checks whether some selectable descendants are selected.
   */
  getIsSomeSelected: () => boolean
  /**
   * Creates a checkbox-style handler that toggles this row's selected state.
   * Pass the original checkbox click event, or a framework event whose
   * `nativeEvent` is that click, so Shift range selection can detect the
   * modifier key.
   */
  getToggleSelectedHandler: (
    opts?: ToggleSelectedOptions,
  ) => (event: unknown) => void
  /**
   * Selects/deselects the row.
   */
  toggleSelected: (value?: boolean, opts?: ToggleSelectedOptions) => void
}

export interface Table_RowSelection<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * The most recent row interacted with through the row selection handler.
   *
   * @internal
   */
  _lastSelectedRowId: string | null
  /**
   * Builds a selected-row model from rows after filtering.
   */
  getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Builds a selected-row model from rows after grouping.
   */
  getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the ids of all selected rows.
   *
   * In `'exclude'` mode, only the ids of loaded selected rows are returned,
   * because the table does not know the ids of rows that are not loaded.
   */
  getSelectedRowIds: () => Array<string>
  /**
   * Returns the number of selected rows.
   *
   * In `'include'` mode this is the number of ids in `rowSelection`. In
   * `'exclude'` mode this is `options.rowCount` minus the deselected rows.
   * `rowCount` counts top-level rows, so the ids of loaded sub-rows and of
   * group rows are not subtracted. An id that is not loaded is subtracted as
   * one row, because the table cannot know that it is a sub-row. When
   * `rowCount` is not set, the selected top-level rows of the filtered row
   * model are counted instead, which is only correct when every row is loaded.
   */
  getSelectedRowCount: () => number
  /**
   * Checks whether every selectable row on the current page is selected.
   * Sub-rows whose ancestors block sub-row selection are ignored.
   */
  getIsAllPageRowsSelected: () => boolean
  /**
   * Checks whether every selectable filtered row is selected.
   * Sub-rows whose ancestors block sub-row selection are ignored.
   *
   * With `manualRowSelection`, the loaded rows are not all rows, so this is
   * only `true` in `'exclude'` mode with an empty `rowSelection`.
   */
  getIsAllRowsSelected: () => boolean
  /**
   * Checks whether at least one selectable row on the current page is selected.
   */
  getIsSomePageRowsSelected: () => boolean
  /**
   * Checks whether at least one row id is selected. Always `true` in
   * `'exclude'` mode.
   */
  getIsSomeRowsSelected: () => boolean
  /**
   * Returns the core row model of all rows before row selection has been applied.
   */
  getPreSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Builds a selected-row model from the core row model.
   */
  getSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Creates a checkbox-style handler that toggles all current-page rows.
   */
  getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
  /**
   * Creates a checkbox-style handler that toggles all selectable rows.
   */
  getToggleAllRowsSelectedHandler: () => (event: unknown) => void
  /**
   * Resets `rowSelection` to `initialState.rowSelection`.
   *
   * Pass `true` to ignore initial state and reset to `{}`. With
   * `manualRowSelection`, `rowSelectionMode` is reset in the same way.
   */
  resetRowSelection: (defaultState?: boolean) => void
  /**
   * Resets `rowSelectionMode` to `initialState.rowSelectionMode`.
   *
   * Pass `true` to ignore initial state and reset to `'include'`. This does
   * not change `rowSelection`; use `resetRowSelection` to reset both.
   */
  resetRowSelectionMode: (defaultState?: boolean) => void
  /**
   * Updates row selection state with a next map or updater function.
   */
  setRowSelection: (updater: Updater<RowSelectionState>) => void
  /**
   * Updates the row selection mode with a next value or updater function.
   * This does not change `rowSelection`, so the ids keep their place but
   * change their meaning.
   */
  setRowSelectionMode: (updater: Updater<RowSelectionMode>) => void
  /**
   * Selects/deselects all rows on the current page.
   */
  toggleAllPageRowsSelected: (
    value?: boolean,
    opts?: { deselectAll?: boolean },
  ) => void
  /**
   * Selects/deselects all rows in the table.
   *
   * Deselecting keeps rows that cannot be selected in the selection map unless
   * `opts.deselectAll` is `true`.
   *
   * With `manualRowSelection`, no row ids are written. Selecting sets
   * `rowSelectionMode` to `'exclude'`, deselecting sets it to `'include'`,
   * and both clear `rowSelection`. Selecting does nothing when
   * `enableRowSelection` is `false`, and stays in `'include'` mode when
   * `rowCount` is `0`.
   */
  toggleAllRowsSelected: (
    value?: boolean,
    opts?: { deselectAll?: boolean },
  ) => void
}

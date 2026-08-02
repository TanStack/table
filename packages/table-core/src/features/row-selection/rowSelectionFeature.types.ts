import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'

export type RowSelectionState = Record<string, true>

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
   */
  deselectParents?: boolean
}

export interface TableState_RowSelection {
  rowSelection: RowSelectionState
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
   * Called with an updater when row selection state changes. Pair this with
   * `state.rowSelection` when using external state; external atoms can own the
   * slice without this callback.
   */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
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
   * Checks whether this row id is selected.
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
   */
  getSelectedRowIds: () => Array<string>
  /**
   * Checks whether every selectable row on the current page is selected.
   * Sub-rows whose ancestors block sub-row selection are ignored.
   */
  getIsAllPageRowsSelected: () => boolean
  /**
   * Checks whether every selectable filtered row is selected.
   * Sub-rows whose ancestors block sub-row selection are ignored.
   */
  getIsAllRowsSelected: () => boolean
  /**
   * Checks whether at least one selectable row on the current page is selected.
   */
  getIsSomePageRowsSelected: () => boolean
  /**
   * Checks whether at least one row id is selected.
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
   * Pass `true` to ignore initial state and reset to `{}`.
   */
  resetRowSelection: (defaultState?: boolean) => void
  /**
   * Updates row selection state with a next map or updater function.
   */
  setRowSelection: (updater: Updater<RowSelectionState>) => void
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
   */
  toggleAllRowsSelected: (
    value?: boolean,
    opts?: { deselectAll?: boolean },
  ) => void
}

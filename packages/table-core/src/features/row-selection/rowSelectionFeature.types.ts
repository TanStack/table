import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'

export type RowSelectionState = Record<string, boolean | undefined>

export interface TableState_RowSelection {
  rowSelection: RowSelectionState
}

export interface TableOptions_RowSelection<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
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
   * grouping features and defaults to `true`.
   */
  enableSubRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
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
  // isInclusiveSelectEvent?: (e: unknown) => boolean
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
   */
  getToggleSelectedHandler: () => (event: unknown) => void
  /**
   * Selects/deselects the row.
   */
  toggleSelected: (value?: boolean, opts?: { selectChildren?: boolean }) => void
}

export interface Table_RowSelection<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Builds a selected-row model from rows after filtering.
   */
  getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Builds a selected-row model from rows after grouping.
   */
  getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Checks whether every selectable row on the current page is selected.
   */
  getIsAllPageRowsSelected: () => boolean
  /**
   * Checks whether every selectable filtered row is selected.
   */
  getIsAllRowsSelected: () => boolean
  /**
   * Checks whether the current page has a partial row selection.
   */
  getIsSomePageRowsSelected: () => boolean
  /**
   * Checks whether filtered rows have a partial row selection.
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
  toggleAllPageRowsSelected: (value?: boolean) => void
  /**
   * Selects/deselects all rows in the table.
   */
  toggleAllRowsSelected: (value?: boolean) => void
}

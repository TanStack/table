import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Row } from '../../types/Row'

export type RowSelectionState = Record<string, boolean>

export interface TableState_RowSelection {
  rowSelection: RowSelectionState
}

export interface TableOptions_RowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * - Enables/disables multiple row selection for all rows in the table OR
   * - A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren
   */
  enableMultiRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * - Enables/disables row selection for all rows in the table OR
   * - A function that given a row, returns whether to enable/disable row selection for that row
   */
  enableRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.
   * (Use in combination with expanding or grouping features)
   */
  enableSubRowSelection?: boolean | ((row: Row<TFeatures, TData>) => boolean)
  /**
   * If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
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
   * Returns whether or not the row can multi-select.
   */
  getCanMultiSelect: () => boolean
  /**
   * Returns whether or not the row can be selected.
   */
  getCanSelect: () => boolean
  /**
   * Returns whether or not the row can select sub rows automatically when the parent row is selected.
   */
  getCanSelectSubRows: () => boolean
  /**
   * Returns whether or not all of the row's sub rows are selected.
   */
  getIsAllSubRowsSelected: () => boolean
  /**
   * Returns whether or not the row is selected.
   */
  getIsSelected: () => boolean
  /**
   * Returns whether or not some of the row's sub rows are selected.
   */
  getIsSomeSelected: () => boolean
  /**
   * Returns a handler that can be used to toggle the row.
   */
  getToggleSelectedHandler: () => (event: unknown) => void
  /**
   * Selects/deselects the row.
   */
  toggleSelected: (value?: boolean, opts?: { selectChildren?: boolean }) => void
}

export interface Table_RowSelection<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model of all rows that are selected after filtering has been applied.
   */
  getFilteredSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model of all rows that are selected after grouping has been applied.
   */
  getGroupedSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns whether or not all rows on the current page are selected.
   */
  getIsAllPageRowsSelected: () => boolean
  /**
   * Returns whether or not all rows in the table are selected.
   */
  getIsAllRowsSelected: () => boolean
  /**
   * Returns whether or not any rows on the current page are selected.
   */
  getIsSomePageRowsSelected: () => boolean
  /**
   * Returns whether or not any rows in the table are selected.
   */
  getIsSomeRowsSelected: () => boolean
  /**
   * Returns the core row model of all rows before row selection has been applied.
   */
  getPreSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model of all rows that are selected.
   */
  getSelectedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns a handler that can be used to toggle all rows on the current page.
   */
  getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
  /**
   * Returns a handler that can be used to toggle all rows in the table.
   */
  getToggleAllRowsSelectedHandler: () => (event: unknown) => void
  /**
   * Resets the **rowSelection** state to the `initialState.rowSelection`, or `true` can be passed to force a default blank state reset to `{}`.
   */
  resetRowSelection: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.rowSelection` state.
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

import type { RowModel } from '../../core/row-models/coreRowModelsFeature.types'
import type { Table } from '../../types/Table'
import type { BuiltInSortFn } from '../../fns/sortFns'
import type { OnChangeFn, RowData, Updater } from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Row } from '../../types/Row'

export type SortDirection = 'asc' | 'desc'

export interface ColumnSort {
  desc: boolean
  id: string
}

export type SortingState = Array<ColumnSort>

export interface TableState_RowSorting {
  sorting: SortingState
}

export interface RowModelFns_RowSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  sortFns: Record<keyof SortFns, SortFn<TFeatures, TData>>
}

export interface SortFns {}

export interface SortFn<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  (
    rowA: Row<TFeatures, TData>,
    rowB: Row<TFeatures, TData>,
    columnId: string,
  ): number
}

export type CustomSortFns<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = Record<string, SortFn<TFeatures, TData>>

export type SortFnOption<
  TFeatures extends TableFeatures,
  TData extends RowData,
> = 'auto' | keyof SortFns | BuiltInSortFn | SortFn<TFeatures, TData>

export interface ColumnDef_RowSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Enables/Disables multi-sorting for this column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  enableMultiSort?: boolean
  /**
   * Enables/Disables sorting for this column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  enableSorting?: boolean
  /**
   * Inverts the order of the sorting for this column. This is useful for values that have an inverted best/worst scale where lower numbers are better, eg. a ranking (1st, 2nd, 3rd) or golf-like scoring
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#invertsorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  invertSorting?: boolean
  /**
   * Set to `true` for sorting toggles on this column to start in the descending direction.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortDescFirst?: boolean
  /**
   * The sorting function to use with this column.
   * - A `string` referencing a built-in sorting function
   * - A custom sorting function
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortingfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortFn?: SortFnOption<TFeatures, TData>
  /**
   * The priority of undefined values when sorting this column.
   * - `false`
   *   - Undefined values will be considered tied and need to be sorted by the next column filter or original index (whichever applies)
   * - `-1`
   *   - Undefined values will be sorted with higher priority (ascending) (if ascending, undefined will appear on the beginning of the list)
   * - `1`
   *   - Undefined values will be sorted with lower priority (descending) (if ascending, undefined will appear on the end of the list)
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortundefined)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortUndefined?: false | -1 | 1 | 'first' | 'last'
}

export interface Column_RowSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Removes this column from the table's sorting state
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#clearsorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  clearSorting: () => void
  /**
   * Returns a sort direction automatically inferred based on the columns values.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getautosortdir)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getAutoSortDir: () => SortDirection
  /**
   * Returns a sorting function automatically inferred based on the columns values.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getautosortingfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getAutoSortFn: () => SortFn<TFeatures, TData>
  /**
   * Returns whether this column can be multi-sorted.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getcanmultisort)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getCanMultiSort: () => boolean
  /**
   * Returns whether this column can be sorted.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getcansort)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getCanSort: () => boolean
  /**
   * Returns the first direction that should be used when sorting this column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getfirstsortdir)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getFirstSortDir: () => SortDirection
  /**
   * Returns the current sort direction of this column.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getissorted)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getIsSorted: () => false | SortDirection
  /**
   * Returns the next sorting order.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getnextsortingorder)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getNextSortingOrder: () => SortDirection | false
  /**
   * Returns the index position of this column's sorting within the sorting state
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortindex)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getSortIndex: () => number
  /**
   * Returns the resolved sorting function to be used for this column
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortingfn)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getSortFn: () => SortFn<TFeatures, TData>
  /**
   * Returns a function that can be used to toggle this column's sorting state. This is useful for attaching a click handler to the column header.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#gettogglesortinghandler)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getToggleSortingHandler: () => undefined | ((event: unknown) => void)
  /**
   * Toggles this columns sorting state. If `desc` is provided, it will force the sort direction to that value. If `isMulti` is provided, it will additivity multi-sort the column (or toggle it if it is already sorted).
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#togglesorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  toggleSorting: (desc?: boolean, isMulti?: boolean) => void
}

export interface TableOptions_RowSorting {
  /**
   * Enables/disables the ability to remove multi-sorts
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultiremove)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  enableMultiRemove?: boolean
  /**
   * Enables/Disables multi-sorting for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablemultisort)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  enableMultiSort?: boolean
  /**
   * Enables/Disables sorting for the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  enableSorting?: boolean
  /**
   * Enables/Disables the ability to remove sorting for the table.
   * - If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
   * - If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesortingremoval)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  enableSortingRemoval?: boolean
  /**
   * Pass a custom function that will be used to determine if a multi-sort event should be triggered. It is passed the event from the sort toggle handler and should return `true` if the event should trigger a multi-sort.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#ismultisortevent)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  isMultiSortEvent?: (e: unknown) => boolean
  /**
   * Enables manual sorting for the table. If this is `true`, you will be expected to sort your data before it is passed to the table. This is useful if you are doing server-side sorting.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#manualsorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  manualSorting?: boolean
  /**
   * Set a maximum number of columns that can be multi-sorted.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#maxmultisortcolcount)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  maxMultiSortColCount?: number
  /**
   * If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#onsortingchange)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  onSortingChange?: OnChangeFn<SortingState>
  /**
   * If `true`, all sorts will default to descending as their first toggle state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortDescFirst?: boolean
}

export interface Table_RowSorting<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Resets the **sorting** state to `initialState.sorting`, or `true` can be passed to force a default blank state reset to `[]`.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#resetsorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  resetSorting: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.sorting` state.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#setsorting)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  setSorting: (updater: Updater<SortingState>) => void
}

export interface Table_RowModels_Sorted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * Returns the row model for the table before any sorting has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getpresortedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getPreSortedRowModel: () => RowModel<TFeatures, TData>
  /**
   * Returns the row model for the table after sorting has been applied.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  getSortedRowModel: () => RowModel<TFeatures, TData>
}

export interface CreateRowModel_Sorted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /**
   * This function is used to retrieve the sorted row model. If using server-side sorting, this function is not required. To use client-side sorting, pass the exported `getSortedRowModel()` from your adapter to your table or implement your own.
   * [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#getsortedrowmodel)
   * [Guide](https://tanstack.com/table/v8/docs/guide/sorting)
   */
  sortedRowModel?: (
    table: Table<TFeatures, TData>,
  ) => () => RowModel<TFeatures, TData>
}

export interface CachedRowModel_Sorted<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  sortedRowModel: () => RowModel<TFeatures, TData>
}

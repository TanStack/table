import type {
  CellData,
  OnChangeFn,
  RowData,
  Updater,
} from '../../types/type-utils'
import type { TableFeatures } from '../../types/TableFeatures'
import type { Cell } from '../../types/Cell'

/**
 * A single rectangular cell selection, stored as its two defining corners.
 *
 * The `anchor` corner stays put while the `focus` corner moves during a
 * shift-extend or a drag, so the pair carries strictly more information than a
 * normalized min/max rectangle would. Corners are stored as flat row and column
 * ids rather than nested objects or a packed `rowId_columnId` key, because
 * `getRowId` is user-supplied and may return ids containing any separator.
 */
export interface CellSelectionRange {
  anchorColumnId: string
  anchorRowId: string
  focusColumnId: string
  focusRowId: string
}

/**
 * The selected rectangles. The last entry is the active one that shift-extend
 * and drag operate on.
 *
 * A bare array, matching `SortingState` and `ColumnFiltersState`. Drag session
 * state deliberately lives outside this slice as non-reactive instance data, so
 * nothing here is transient and the whole slice is safe to persist.
 */
export type CellSelectionState = Array<CellSelectionRange>

export interface TableState_CellSelection {
  cellSelection: CellSelectionState
}

/**
 * A range resolved into inclusive display-order indexes.
 *
 * Ranges whose corners no longer resolve are omitted rather than clamped, so a
 * range with a filtered-out corner contributes nothing while remaining in state.
 */
export interface CellSelectionBounds {
  maxColumnIndex: number
  maxRowIndex: number
  minColumnIndex: number
  minRowIndex: number
}

/**
 * Which sides of a selected cell sit on the outer boundary of the selection.
 */
export interface CellSelectionEdges {
  bottom: boolean
  left: boolean
  right: boolean
  top: boolean
}

export type CellSelectionDirection = 'up' | 'down' | 'left' | 'right'

export interface SelectCellRangeOptions {
  /**
   * Whether the range should be added alongside existing ranges rather than
   * replacing them. Defaults to `false`.
   */
  additive?: boolean
}

export interface TableOptions_CellSelection<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Resets cell selection to `initialState.cellSelection` whenever `data`
   * changes. Defaults to `true`.
   *
   * Ranges are stored as row and column ids, so new data would otherwise leave
   * a selection pointing at rows that no longer exist, or silently re-select
   * cells if the new data happens to reuse ids. Set to `false` to keep ranges
   * across data changes, and note `autoResetAll` overrides this.
   */
  autoResetCellSelection?: boolean
  /**
   * Enables inclusive cell range selection through shift-click and drag.
   * Defaults to `true`.
   */
  enableCellRangeSelection?: boolean
  /**
   * Allows cells to be selected.
   *
   * Provide a predicate to decide per cell. A column def may also opt out with
   * its own `enableCellSelection: false`. Defaults to `true`.
   */
  enableCellSelection?:
    boolean | ((cell: Cell<TFeatures, TData, any>) => boolean)
  /**
   * Enables extending a selection by dragging across cells. Defaults to `true`.
   */
  enableCellSelectionDrag?: boolean
  /**
   * Allows multiple disjoint rectangles to be selected at once. Defaults to
   * `true`.
   */
  enableMultiCellRangeSelection?: boolean
  /**
   * Determines whether a selection-start event should extend the active range
   * instead of replacing the selection.
   *
   * By default, events with `shiftKey` directly on the event or on
   * `event.nativeEvent` are treated as range-selection events.
   */
  isCellRangeSelectionEvent?: (event: unknown) => boolean
  /**
   * Determines whether a selection-start event should add a new rectangle
   * alongside the existing ones.
   *
   * By default, events with `ctrlKey` or `metaKey` directly on the event or on
   * `event.nativeEvent` are treated as multi-range events.
   */
  isMultiCellRangeSelectionEvent?: (event: unknown) => boolean
  /**
   * Called with an updater when cell selection state changes. Pair this with
   * `state.cellSelection` when using external state; external atoms can own the
   * slice without this callback.
   *
   * A drag emits one change per cell crossed. Subscribe to
   * `table.atoms.cellSelection` for finer-grained reads when that matters.
   */
  onCellSelectionChange?: OnChangeFn<CellSelectionState>
}

export interface ColumnDef_CellSelection {
  /**
   * Allows cells in this column to be selected. Defaults to `true`.
   */
  enableCellSelection?: boolean
}

export interface Cell_CellSelection {
  /**
   * Checks whether this cell can currently be selected.
   */
  getCanSelect: () => boolean
  /**
   * Checks whether this cell is the active cell, i.e. the anchor of the most
   * recent range.
   */
  getIsFocused: () => boolean
  /**
   * Checks whether this cell falls inside any selected range.
   */
  getIsSelected: () => boolean
  /**
   * Returns which sides of this cell sit on the outer boundary of the
   * selection, for rendering a spreadsheet-style outline without each cell
   * inspecting its neighbours.
   *
   * All sides are `false` when the cell is not selected.
   */
  getSelectionEdges: () => CellSelectionEdges
  /**
   * Creates a handler that extends the active range to this cell while a drag
   * is in progress. Bind it to `mouseenter`.
   *
   * The handler no-ops unless a drag is open, and skips redundant writes when
   * the active range already focuses this cell.
   */
  getSelectionExtendHandler: () => (event: unknown) => void
  /**
   * Creates a handler that begins a selection at this cell. Bind it to
   * `mousedown`.
   *
   * Pass the original mouse event, or a framework event whose `nativeEvent` is
   * that event, so modifier keys can be detected. The handler attaches its own
   * document-level `mouseup` listener so a drag released outside the table
   * still ends correctly; pass `contextDocument` when the table renders into
   * another document, such as an iframe or popout window.
   */
  getSelectionStartHandler: (
    contextDocument?: Document,
  ) => (event: unknown) => void
  /**
   * Returns `0` for the focused cell and `-1` otherwise, for roving tabindex.
   */
  getTabIndex: () => number
}

export interface Table_CellSelection<
  in out TFeatures extends TableFeatures,
  in out TData extends RowData,
> {
  /**
   * Whether a drag selection is currently open.
   *
   * Non-reactive instance data rather than state: only the mouse handlers read
   * it, nothing renders from it, and keeping it out of the slice means a
   * selection persisted mid-drag cannot rehydrate into a stuck drag.
   *
   * @internal
   */
  _isSelectingCells: boolean
  /**
   * Schedules a cell selection reset after `data` changes.
   *
   * Honors `autoResetAll` and `autoResetCellSelection`. Called by the core row
   * model; you rarely need to invoke it yourself.
   */
  autoResetCellSelection: () => void
  /**
   * Extends the active range one step in a direction, keeping its anchor fixed.
   */
  extendCellSelection: (direction: CellSelectionDirection) => void
  /**
   * Returns the selected ranges resolved into inclusive display-order indexes.
   *
   * This is the memoized cache every per-cell read goes through. Ranges whose
   * corners no longer resolve are omitted.
   */
  getCellSelectionBounds: () => Array<CellSelectionBounds>
  /**
   * Returns the ids of all columns intersected by the selection.
   */
  getCellSelectionColumnIds: () => Array<string>
  /**
   * Returns a column id to display-index map for the current column order.
   *
   * Registered so the lookup stays memoized even when `columnOrderingFeature`
   * is absent, since its `getColumnIndexes` static rebuilds on every call.
   *
   * @internal
   */
  getCellSelectionColumnIndexes: () => Record<string, number>
  /**
   * Returns the ids of all rows intersected by the selection.
   */
  getCellSelectionRowIds: () => Array<string>
  /**
   * Returns the active cell, i.e. the anchor of the most recent range.
   */
  getFocusedCell: () => Cell<TFeatures, TData, any> | undefined
  /**
   * Returns the number of selected cells.
   *
   * Computed as rectangle arithmetic for one range. Falls back to enumerating
   * cells for overlapping ranges or a per-cell `enableCellSelection` predicate.
   */
  getSelectedCellCount: () => number
  /**
   * Returns the unique ids of all selected cells, in row-major order.
   *
   * This expands the selection, so it costs one pass over the selected area.
   * It is memoized and never runs unless called.
   */
  getSelectedCellIds: () => Array<string>
  /**
   * Returns each selected range's values as a row-major grid.
   *
   * Indexed as `[rangeIndex][rowIndex][columnIndex]`. Serializing this to
   * clipboard text is left to userland, since the delimiter, the null
   * representation, and any quoting rules are application decisions.
   */
  getSelectedCellRangesData: () => Array<Array<Array<unknown>>>
  /**
   * Moves the selection one step in a direction, collapsing it to a single
   * cell. Columns that cannot be selected are skipped over.
   */
  moveCellSelection: (direction: CellSelectionDirection) => void
  /**
   * Resets `cellSelection` to `initialState.cellSelection`.
   *
   * Pass `true` to ignore initial state and reset to an empty selection.
   */
  resetCellSelection: (defaultState?: boolean) => void
  /**
   * Selects every selectable cell in the table as one range.
   */
  selectAllCells: () => void
  /**
   * Selects a rectangle, replacing the current selection unless `additive`.
   */
  selectCellRange: (
    range: CellSelectionRange,
    opts?: SelectCellRangeOptions,
  ) => void
  /**
   * Updates cell selection state with a next value or updater function.
   */
  setCellSelection: (updater: Updater<CellSelectionState>) => void
  /**
   * Collapses the selection to a single cell at the given coordinates.
   */
  setFocusedCell: (rowId: string, columnId: string) => void
}

/**
 * Re-exported for feature utils that need the cell value type parameter.
 */
export type { CellData }

import {
  assignPrototypeAPIs,
  assignTableAPIs,
  callMemoOrStaticFn,
  makeStateUpdater,
} from '../../utils'
import {
  cell_getCanSelect,
  cell_getIsFocused,
  cell_getIsSelected,
  cell_getSelectionEdges,
  cell_getSelectionExtendHandler,
  cell_getSelectionStartHandler,
  cell_getTabIndex,
  getDefaultCellSelectionState,
  table_autoResetCellSelection,
  table_extendCellSelection,
  table_getCellSelectionBounds,
  table_getCellSelectionColumnIds,
  table_getCellSelectionColumnIndexes,
  table_getCellSelectionRowIds,
  table_getFocusedCell,
  table_getSelectedCellCount,
  table_getSelectedCellIds,
  table_getSelectedCellRangesData,
  table_moveCellSelection,
  table_resetCellSelection,
  table_selectAllCells,
  table_selectCellRange,
  table_setCellSelection,
  table_setFocusedCell,
} from './cellSelectionFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that adds spreadsheet-style cell range selection state and APIs.
 */
export const cellSelectionFeature: TableFeature = {
  initTableInstanceData: (table) => {
    // @ts-ignore - _isSelectingCells is cell selection table instance data
    table._isSelectingCells = false
  },

  resetTableInstanceData: (table) => {
    // @ts-ignore - _isSelectingCells is cell selection table instance data
    table._isSelectingCells = false
  },

  getInitialState: (initialState) => {
    return {
      cellSelection: getDefaultCellSelectionState(),
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onCellSelectionChange: makeStateUpdater('cellSelection', table),
      autoResetCellSelection: true,
      enableCellSelection: true,
      enableCellRangeSelection: true,
      enableMultiCellRangeSelection: true,
      enableCellSelectionDrag: true,
      isCellRangeSelectionEvent: (event) => {
        const rangeEvent = event as {
          shiftKey?: boolean
          nativeEvent?: { shiftKey?: boolean }
        }
        return Boolean(rangeEvent.shiftKey || rangeEvent.nativeEvent?.shiftKey)
      },
      isMultiCellRangeSelectionEvent: (event) => {
        const multiEvent = event as {
          ctrlKey?: boolean
          metaKey?: boolean
          nativeEvent?: { ctrlKey?: boolean; metaKey?: boolean }
        }
        return Boolean(
          multiEvent.ctrlKey ||
          multiEvent.metaKey ||
          multiEvent.nativeEvent?.ctrlKey ||
          multiEvent.nativeEvent?.metaKey,
        )
      },
    }
  },

  assignCellPrototype: (prototype, table) => {
    // None of these are memoized on purpose. A per-cell memo would allocate a
    // closure and dependency array for every cell in the table, costing more
    // than the few integer comparisons each read performs against the
    // table-level bounds cache.
    assignPrototypeAPIs('cellSelectionFeature', prototype, table, {
      cell_getCanSelect: {
        fn: (cell) => cell_getCanSelect(cell),
      },
      cell_getIsSelected: {
        fn: (cell) => cell_getIsSelected(cell),
      },
      cell_getIsFocused: {
        fn: (cell) => cell_getIsFocused(cell),
      },
      cell_getTabIndex: {
        fn: (cell) => cell_getTabIndex(cell),
      },
      cell_getSelectionEdges: {
        fn: (cell) => cell_getSelectionEdges(cell),
      },
      cell_getSelectionStartHandler: {
        fn: (cell, contextDocument) =>
          cell_getSelectionStartHandler(cell, contextDocument),
      },
      cell_getSelectionExtendHandler: {
        fn: (cell) => cell_getSelectionExtendHandler(cell),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('cellSelectionFeature', table, {
      table_setCellSelection: {
        fn: (updater) => table_setCellSelection(table, updater),
      },
      table_resetCellSelection: {
        fn: (defaultState) => table_resetCellSelection(table, defaultState),
      },
      table_autoResetCellSelection: {
        fn: () => table_autoResetCellSelection(table),
      },
      table_getCellSelectionColumnIndexes: {
        fn: () => table_getCellSelectionColumnIndexes(table),
        // Mirrors columnVisibilityFeature's own deps rather than calling
        // getVisibleLeafColumns() here, so the map stays memoized even when
        // that feature is absent and its static rebuilds on every call.
        // columnPinning is added because cells render in pinned order.
        memoDeps: () => [
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode,
        ],
      },
      table_getCellSelectionBounds: {
        fn: () => table_getCellSelectionBounds(table),
        memoDeps: () => [
          table.atoms.cellSelection?.get(),
          table.getRowsInDisplayOrder(),
          callMemoOrStaticFn(
            table,
            'getCellSelectionColumnIndexes',
            table_getCellSelectionColumnIndexes,
          ),
        ],
      },
      table_selectCellRange: {
        fn: (range, opts) => table_selectCellRange(table, range, opts),
      },
      table_selectAllCells: {
        fn: () => table_selectAllCells(table),
      },
      table_setFocusedCell: {
        fn: (rowId, columnId) => table_setFocusedCell(table, rowId, columnId),
      },
      table_getFocusedCell: {
        fn: () => table_getFocusedCell(table),
      },
      table_moveCellSelection: {
        fn: (direction) => table_moveCellSelection(table, direction),
      },
      table_extendCellSelection: {
        fn: (direction) => table_extendCellSelection(table, direction),
      },
      table_getSelectedCellIds: {
        fn: () => table_getSelectedCellIds(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCellSelectionBounds',
            table_getCellSelectionBounds,
          ),
          table.getRowsInDisplayOrder(),
          table.options.enableCellSelection,
        ],
      },
      table_getSelectedCellRangesData: {
        fn: () => table_getSelectedCellRangesData(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCellSelectionBounds',
            table_getCellSelectionBounds,
          ),
          table.getRowsInDisplayOrder(),
          table.options.enableCellSelection,
        ],
      },
      table_getSelectedCellCount: {
        fn: () => table_getSelectedCellCount(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCellSelectionBounds',
            table_getCellSelectionBounds,
          ),
          table.getRowsInDisplayOrder(),
          table.options.enableCellSelection,
        ],
      },
      table_getCellSelectionRowIds: {
        fn: () => table_getCellSelectionRowIds(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCellSelectionBounds',
            table_getCellSelectionBounds,
          ),
          table.getRowsInDisplayOrder(),
        ],
      },
      table_getCellSelectionColumnIds: {
        fn: () => table_getCellSelectionColumnIds(table),
        memoDeps: () => [
          callMemoOrStaticFn(
            table,
            'getCellSelectionBounds',
            table_getCellSelectionBounds,
          ),
        ],
      },
    })
  },
}

import {
  assignPrototypeAPIs,
  assignTableAPIs,
  callMemoOrStaticFn,
  makeStateUpdater,
} from '../../utils'
import {
  column_getIsVisible,
  row_getVisibleCellsByColumnId,
} from '../column-visibility/columnVisibilityFeature.utils'
import { buildHeaderGroups } from '../../core/headers/buildHeaderGroups'
import {
  column_getCanPin,
  column_getIsPinned,
  column_getPinnedIndex,
  column_pin,
  getDefaultColumnPinningState,
  row_getCenterVisibleCells,
  table_getCenterFlatHeaders,
  table_getCenterFooterGroups,
  table_getCenterHeaderGroups,
  table_getCenterLeafColumns,
  table_getCenterLeafHeaders,
  table_getCenterVisibleLeafColumns,
  table_getEndFlatHeaders,
  table_getEndFooterGroups,
  table_getEndLeafColumns,
  table_getEndLeafHeaders,
  table_getEndVisibleLeafColumns,
  table_getIsSomeColumnsPinned,
  table_getPinnedLeafColumns,
  table_getPinnedVisibleLeafColumns,
  table_getStartFlatHeaders,
  table_getStartFooterGroups,
  table_getStartLeafColumns,
  table_getStartLeafHeaders,
  table_getStartVisibleLeafColumns,
  table_resetColumnPinning,
  table_setColumnPinning,
} from './columnPinningFeature.utils'
import type { ReadonlyAtom } from '@tanstack/store'
import type { TableFeature } from '../../types/TableFeatures'

function createLazySelector<T>(create: () => ReadonlyAtom<T>): () => T {
  let atom: ReadonlyAtom<T> | undefined
  return () => (atom ??= create()).get()
}

/**
 * Feature that adds column pinning state and APIs for logical start, center,
 * and end regions.
 *
 * In LTR languages/layouts, start usually corresponds to left and end to
 * right. In RTL languages/layouts, start usually corresponds to right and end
 * to left.
 */
export const columnPinningFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      columnPinning: {
        ...getDefaultColumnPinningState(),
        ...initialState.columnPinning,
      },
      ...initialState,
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
    }
  },

  assignColumnPrototype: (prototype, table) => {
    assignPrototypeAPIs('columnPinningFeature', prototype, table, {
      column_pin: {
        fn: (column, position) => column_pin(column, position),
      },
      column_getCanPin: {
        fn: (column) => column_getCanPin(column),
      },
      column_getPinnedIndex: {
        fn: (column) => column_getPinnedIndex(column),
      },
      column_getIsPinned: {
        fn: (column) => column_getIsPinned(column),
      },
    })
  },

  assignRowPrototype: (prototype, table) => {
    const readStartPinning = createLazySelector(() =>
      table._reactivity.createReadonlyAtom(
        () => table.atoms.columnPinning?.get()?.start,
        {
          debugName: 'table/selectors/columnPinning/start',
          mode: 'memo',
        },
      ),
    )
    const readEndPinning = createLazySelector(() =>
      table._reactivity.createReadonlyAtom(
        () => table.atoms.columnPinning?.get()?.end,
        {
          debugName: 'table/selectors/columnPinning/end',
          mode: 'memo',
        },
      ),
    )

    assignPrototypeAPIs('columnPinningFeature', prototype, table, {
      row_getCenterVisibleCells: {
        computed: (row) => row_getCenterVisibleCells(row),
      },
      row_getStartVisibleCells: {
        computed: (row) => {
          const start = readStartPinning() ?? []
          if (!start.length) return []
          const cellsByColumnId = callMemoOrStaticFn(
            row,
            'getVisibleCellsByColumnId',
            row_getVisibleCellsByColumnId,
          )
          const cells: Array<(typeof cellsByColumnId)[string]> = []
          for (let i = 0; i < start.length; i++) {
            const cell = cellsByColumnId[start[i]!]
            if (cell) {
              ;(cell as any).position = 'start'
              cells.push(cell)
            }
          }
          return cells
        },
      },
      row_getEndVisibleCells: {
        computed: (row) => {
          const end = readEndPinning() ?? []
          if (!end.length) return []
          const cellsByColumnId = callMemoOrStaticFn(
            row,
            'getVisibleCellsByColumnId',
            row_getVisibleCellsByColumnId,
          )
          const cells: Array<(typeof cellsByColumnId)[string]> = []
          for (let i = 0; i < end.length; i++) {
            const cell = cellsByColumnId[end[i]!]
            if (cell) {
              ;(cell as any).position = 'end'
              cells.push(cell)
            }
          }
          return cells
        },
      },
    })
  },

  constructTableAPIs: (table) => {
    const readStartPinning = createLazySelector(() =>
      table._reactivity.createReadonlyAtom(
        () => table.atoms.columnPinning?.get()?.start,
        {
          debugName: 'table/selectors/columnPinning/startHeaderGroups',
          mode: 'memo',
        },
      ),
    )
    const readEndPinning = createLazySelector(() =>
      table._reactivity.createReadonlyAtom(
        () => table.atoms.columnPinning?.get()?.end,
        {
          debugName: 'table/selectors/columnPinning/endHeaderGroups',
          mode: 'memo',
        },
      ),
    )
    const buildPinnedHeaderGroups = (
      position: 'start' | 'end',
      pinnedColumnIds: ReadonlyArray<string>,
    ) => {
      const allColumns = table.getAllColumns()
      const leafColumnsById = table.getAllLeafColumnsById()
      const orderedLeafColumns: typeof allColumns = []
      for (let i = 0; i < pinnedColumnIds.length; i++) {
        const column = leafColumnsById[pinnedColumnIds[i]!]
        if (
          column &&
          callMemoOrStaticFn(column, 'getIsVisible', column_getIsVisible)
        ) {
          orderedLeafColumns.push(column)
        }
      }
      return buildHeaderGroups(
        allColumns,
        orderedLeafColumns,
        table,
        position,
      )
    }

    assignTableAPIs('columnPinningFeature', table, {
      table_setColumnPinning: {
        fn: (updater) => table_setColumnPinning(table, updater),
      },
      table_resetColumnPinning: {
        fn: (defaultState) => table_resetColumnPinning(table, defaultState),
      },
      table_getIsSomeColumnsPinned: {
        fn: (position) => table_getIsSomeColumnsPinned(table, position),
      },
      // header groups
      table_getStartHeaderGroups: {
        computed: () => {
          table.atoms.columnOrder?.get()
          return buildPinnedHeaderGroups('start', readStartPinning() ?? [])
        },
      },
      table_getCenterHeaderGroups: {
        computed: () => table_getCenterHeaderGroups(table),
      },
      table_getEndHeaderGroups: {
        computed: () => {
          table.atoms.columnOrder?.get()
          return buildPinnedHeaderGroups('end', readEndPinning() ?? [])
        },
      },
      // footer groups
      table_getStartFooterGroups: {
        computed: () => table_getStartFooterGroups(table),
      },
      table_getCenterFooterGroups: {
        computed: () => table_getCenterFooterGroups(table),
      },
      table_getEndFooterGroups: {
        computed: () => table_getEndFooterGroups(table),
      },
      // flat headers
      table_getStartFlatHeaders: {
        computed: () => table_getStartFlatHeaders(table),
      },
      table_getEndFlatHeaders: {
        computed: () => table_getEndFlatHeaders(table),
      },
      table_getCenterFlatHeaders: {
        computed: () => table_getCenterFlatHeaders(table),
      },
      // leaf headers
      table_getStartLeafHeaders: {
        computed: () => table_getStartLeafHeaders(table),
      },
      table_getEndLeafHeaders: {
        computed: () => table_getEndLeafHeaders(table),
      },
      table_getCenterLeafHeaders: {
        computed: () => table_getCenterLeafHeaders(table),
      },
      // leaf columns
      table_getStartLeafColumns: {
        computed: () => table_getStartLeafColumns(table),
      },
      table_getEndLeafColumns: {
        computed: () => table_getEndLeafColumns(table),
      },
      table_getCenterLeafColumns: {
        computed: () => table_getCenterLeafColumns(table),
      },
      table_getPinnedLeafColumns: {
        fn: (position) => table_getPinnedLeafColumns(table, position),
        // must not memo here as it's just a shortcut function
      },
      // visible leaf columns
      table_getStartVisibleLeafColumns: {
        computed: () => table_getStartVisibleLeafColumns(table),
      },
      table_getCenterVisibleLeafColumns: {
        computed: () => table_getCenterVisibleLeafColumns(table),
      },
      table_getEndVisibleLeafColumns: {
        computed: () => table_getEndVisibleLeafColumns(table),
      },
      table_getPinnedVisibleLeafColumns: {
        fn: (position) => table_getPinnedVisibleLeafColumns(table, position),
        // must not memo here as it's just a shortcut function
      },
    })
  },
}

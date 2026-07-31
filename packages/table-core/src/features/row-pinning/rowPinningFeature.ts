import {
  assignPrototypeAPIs,
  assignTableAPIs,
  makeStateUpdater,
} from '../../utils'
import { row_getIsAllParentsExpanded } from '../row-expanding/rowExpandingFeature.utils'
import {
  getDefaultRowPinningState,
  row_getCanPin,
  row_getIsPinned,
  row_getPinnedIndex,
  row_pin,
  table_getCenterRows,
  table_getIsSomeRowsPinned,
  table_resetRowPinning,
  table_setRowPinning,
} from './rowPinningFeature.utils'
import type { ReadonlyAtom } from '@tanstack/store'
import type { TableFeature } from '../../types/TableFeatures'

function createLazySelector<T>(create: () => ReadonlyAtom<T>): () => T {
  let atom: ReadonlyAtom<T> | undefined
  return () => (atom ??= create()).get()
}

/**
 * Feature that adds row pinning state and APIs for top, center, and bottom rows.
 */
export const rowPinningFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      ...initialState,
      rowPinning: {
        ...getDefaultRowPinningState(),
        ...initialState.rowPinning,
      },
    }
  },

  getDefaultTableOptions: (table) => {
    return {
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  assignRowPrototype: (prototype, table) => {
    assignPrototypeAPIs('rowPinningFeature', prototype, table, {
      row_getCanPin: {
        fn: (row) => row_getCanPin(row),
      },
      row_getIsPinned: {
        fn: (row) => row_getIsPinned(row),
      },
      row_getPinnedIndex: {
        computed: (row) => row_getPinnedIndex(row),
      },
      row_pin: {
        fn: (row, position, includeLeafRows, includeParentRows) =>
          row_pin(row, position, includeLeafRows, includeParentRows),
      },
    })
  },

  constructTableAPIs: (table) => {
    const readTopPinning = createLazySelector(() =>
      table._reactivity.createReadonlyAtom(
        () => table.atoms.rowPinning?.get()?.top,
        {
          debugName: 'table/selectors/rowPinning/top',
          mode: 'memo',
        },
      ),
    )
    const readBottomPinning = createLazySelector(() =>
      table._reactivity.createReadonlyAtom(
        () => table.atoms.rowPinning?.get()?.bottom,
        {
          debugName: 'table/selectors/rowPinning/bottom',
          mode: 'memo',
        },
      ),
    )
    const getPinnedRows = (
      position: 'top' | 'bottom',
      pinnedRowIds: ReadonlyArray<string>,
    ) => {
      const visibleRows = table.getRowModel().rows
      const keepPinnedRows = table.options.keepPinnedRows ?? true
      const result: Array<any> = []

      for (let i = 0; i < pinnedRowIds.length; i++) {
        const rowId = pinnedRowIds[i]!
        let row
        if (keepPinnedRows) {
          const fullRow = table.getRow(rowId, true)
          if (row_getIsAllParentsExpanded(fullRow)) {
            row = fullRow
          }
        } else {
          row = visibleRows.find((candidate) => candidate.id === rowId)
        }
        if (!row) continue
        ;(row as any).position = position
        result.push(row)
      }

      return result
    }

    assignTableAPIs('rowPinningFeature', table, {
      table_setRowPinning: {
        fn: (updater) => table_setRowPinning(table, updater),
      },
      table_resetRowPinning: {
        fn: (defaultState) => table_resetRowPinning(table, defaultState),
      },
      table_getIsSomeRowsPinned: {
        fn: (position) => table_getIsSomeRowsPinned(table, position),
      },
      table_getTopRows: {
        computed: () => getPinnedRows('top', readTopPinning() ?? []),
      },
      table_getBottomRows: {
        computed: () => getPinnedRows('bottom', readBottomPinning() ?? []),
      },
      table_getCenterRows: {
        computed: () => table_getCenterRows(table),
      },
    })
  },
}

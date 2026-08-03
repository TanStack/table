import { assignPrototypeAPIs, assignTableAPIs } from '../../utils'
import {
  cell_getColSpan,
  cell_getIsCovered,
  cell_getRowSpan,
  table_getCellSpanIndex,
} from './cellSpanningFeature.utils'
import type { TableFeature } from '../../types/TableFeatures'

/**
 * Feature that merges adjacent cells that share a value into row-spanning
 * cells, and lets a column def declare column-spanning cells per row.
 *
 * Stateless: spans are always derived from the rows that are currently
 * rendered, so there is nothing to persist and nothing to configure beyond the
 * column defs.
 */
export const cellSpanningFeature: TableFeature = {
  getDefaultTableOptions: () => {
    return {
      enableCellSpanning: true,
    }
  },

  initRowInstanceData: (row) => {
    // Declared up front so building the index over thousands of rows does not
    // transition every row's hidden class.
    ;(row as { _cellSpanRowIndex?: number })._cellSpanRowIndex = -1
  },

  assignCellPrototype: (prototype, table) => {
    // None of these are memoized on purpose: a per-cell memo would allocate a
    // closure and a dependency array for every cell, costing more than the two
    // lookups each read performs against the table-level span index.
    assignPrototypeAPIs('cellSpanningFeature', prototype, table, {
      cell_getColSpan: {
        fn: (cell) => cell_getColSpan(cell),
      },
      cell_getIsCovered: {
        fn: (cell) => cell_getIsCovered(cell),
      },
      cell_getRowSpan: {
        fn: (cell) => cell_getRowSpan(cell),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('cellSpanningFeature', table, {
      table_getCellSpanIndex: {
        fn: () => table_getCellSpanIndex(table),
        memoDeps: () => [
          // The final, paginated row model, not `getRowsInDisplayOrder()`:
          // that reads `getPrePaginatedRowModel()` and is not invalidated by
          // the pagination atom, which would leave spans stale across pages
          // and let runs cross page boundaries.
          table.getRowModel().rows,
          // Row pinning changes which rows render and in which section.
          table.atoms.rowPinning?.get(),
          table.options.keepPinnedRows,
          // Mirrors columnVisibilityFeature's own deps rather than calling
          // getVisibleLeafColumns() here, so the index stays memoized even
          // when that feature is absent. columnPinning is included because
          // cells render in pinned order and column spans clamp to regions.
          table.atoms.columnVisibility?.get(),
          table.atoms.columnOrder?.get(),
          table.atoms.columnPinning?.get(),
          table.atoms.grouping?.get(),
          table.options.columns,
          table.options.groupedColumnMode,
          table.options.enableCellSpanning,
        ],
      },
    })
  },
}

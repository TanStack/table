import {
  assignPrototypeAPIs,
  assignTableAPIs,
  hasOwn,
  makeStateUpdater,
} from '../../utils'
import {
  column_getAfter,
  column_getStart,
  column_resetSize,
  getDefaultColumnSizingColumnDef,
  getDefaultColumnSizingState,
  header_getSize,
  header_getStart,
  table_getCenterTotalSize,
  table_getColumnOffsets,
  table_getEndTotalSize,
  table_getStartTotalSize,
  table_getTotalSize,
  table_resetColumnSizing,
  table_setColumnSizing,
} from './columnSizingFeature.utils'
import type { ReadonlyAtom } from '@tanstack/store'
import type { TableFeature } from '../../types/TableFeatures'

function createLazySelector<T>(create: () => ReadonlyAtom<T>): () => T {
  let atom: ReadonlyAtom<T> | undefined
  return () => (atom ??= create()).get()
}

function resolveColumnSize(
  column: {
    columnDef: {
      maxSize?: number
      minSize?: number
      size?: number
    }
  },
  columnSize: number | undefined,
): number {
  const defaults = getDefaultColumnSizingColumnDef()
  return Math.min(
    Math.max(
      column.columnDef.minSize ?? defaults.minSize,
      columnSize ?? column.columnDef.size ?? defaults.size,
    ),
    column.columnDef.maxSize ?? defaults.maxSize,
  )
}

/**
 * Feature that adds column sizing state, defaults, and size measurement APIs.
 */
export const columnSizingFeature: TableFeature = {
  getInitialState: (initialState) => {
    return {
      columnSizing: getDefaultColumnSizingState(),
      ...initialState,
    }
  },

  getDefaultColumnDef: () => {
    return getDefaultColumnSizingColumnDef()
  },

  getDefaultTableOptions: (table) => {
    return {
      onColumnSizingChange: makeStateUpdater('columnSizing', table),
    }
  },

  assignColumnPrototype: (prototype, table) => {
    const sizeSelectors = new WeakMap<object, () => number | undefined>()
    const readColumnSize = (column: { id: string }) => {
      let readSize = sizeSelectors.get(column)
      if (!readSize) {
        readSize = createLazySelector(() =>
          table._reactivity.createReadonlyAtom(
            () => {
              const sizing = table.atoms.columnSizing?.get()
              return sizing && hasOwn(sizing, column.id)
                ? sizing[column.id]
                : undefined
            },
            {
              debugName: `table/selectors/columnSizing/${column.id}`,
              mode: 'memo',
            },
          ),
        )
        sizeSelectors.set(column, readSize)
      }
      return readSize()
    }

    assignPrototypeAPIs('columnSizingFeature', prototype, table, {
      column_getSize: {
        computed: (column) => {
          void table.options.columns
          return resolveColumnSize(column, readColumnSize(column))
        },
      },
      // O(1) lookups into the memoized table-level offsets, so no per-column
      // memos here
      column_getStart: {
        fn: (column, position) => column_getStart(column, position),
      },
      column_getAfter: {
        fn: (column, position) => column_getAfter(column, position),
      },
      column_resetSize: {
        fn: (column) => column_resetSize(column),
      },
    })
  },

  assignHeaderPrototype: (prototype, table) => {
    const sizeSelectors = new WeakMap<object, () => number | undefined>()
    const readColumnSize = (column: { id: string }) => {
      let readSize = sizeSelectors.get(column)
      if (!readSize) {
        readSize = createLazySelector(() =>
          table._reactivity.createReadonlyAtom(
            () => {
              const sizing = table.atoms.columnSizing?.get()
              return sizing && hasOwn(sizing, column.id)
                ? sizing[column.id]
                : undefined
            },
            {
              debugName: `table/selectors/headerColumnSizing/${column.id}`,
              mode: 'memo',
            },
          ),
        )
        sizeSelectors.set(column, readSize)
      }
      return readSize()
    }

    assignPrototypeAPIs('columnSizingFeature', prototype, table, {
      header_getSize: {
        computed: (header) => {
          void table.options.columns
          if (header.column.columns.length > 0) {
            return header_getSize(header)
          }
          return resolveColumnSize(header.column, readColumnSize(header.column))
        },
      },
      header_getStart: {
        computed: (header) => header_getStart(header),
      },
    })
  },

  constructTableAPIs: (table) => {
    assignTableAPIs('columnSizingFeature', table, {
      table_getColumnOffsets: {
        computed: () => table_getColumnOffsets(table),
      },
      table_setColumnSizing: {
        fn: (updater) => table_setColumnSizing(table, updater),
      },
      table_resetColumnSizing: {
        fn: (defaultState) => table_resetColumnSizing(table, defaultState),
      },
      table_getTotalSize: {
        computed: () => table_getTotalSize(table),
      },
      table_getStartTotalSize: {
        computed: () => table_getStartTotalSize(table),
      },
      table_getCenterTotalSize: {
        computed: () => table_getCenterTotalSize(table),
      },
      table_getEndTotalSize: {
        computed: () => table_getEndTotalSize(table),
      },
    })
  },
}

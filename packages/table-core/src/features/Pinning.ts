import { TableFeature } from '../core/table'
import {
  OnChangeFn,
  Updater,
  Table,
  Column,
  Row,
  Cell,
  RowData,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type ColumnPinningPosition = false | 'left' | 'right'
export type RowPinningPosition = false | 'top' | 'bottom'

export interface ColumnPinningState {
  left?: string[]
  right?: string[]
}

export interface RowPinningState {
  bottom?: string[]
  top?: string[]
}

export interface ColumnPinningTableState {
  columnPinning: ColumnPinningState
}

export interface RowPinningTableState {
  rowPinning: RowPinningState
}

export interface ColumnPinningOptions {
  /**
   * Enables/disables column pinning for the table. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#enablecolumnpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  enableColumnPinning?: boolean
  /**
   * Enables/disables all pinning for the table. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#enablepinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  enablePinning?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#oncolumnpinningchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)
   */
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
}

export interface RowPinningOptions<TData extends RowData> {
  /**
   * Enables/disables row pinning for the table. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#enablerowpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
  /**
   * When `false`, pinned rows will not be visible if they are filtered or paginated out of the table. When `true`, pinned rows will always be visible regardless of filtering or pagination. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#keeppinnedrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  keepPinnedRows?: boolean
  /**
   * If provided, this function will be called with an `updaterFn` when `state.rowPinning` changes. This overrides the default internal state management, so you will also need to supply `state.rowPinning` from your own managed state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#onrowpinningchange)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/onrowpinningchange)
   */
  onRowPinningChange?: OnChangeFn<RowPinningState>
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface RowPinningDefaultOptions {
  onRowPinningChange: OnChangeFn<RowPinningState>
}

export interface ColumnPinningColumnDef {
  /**
   * Enables/disables column pinning for this column. Defaults to `true`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#enablepinning-1)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  enablePinning?: boolean
}

export interface ColumnPinningColumn {
  /**
   * Returns whether or not the column can be pinned.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getcanpin)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the column. (`'left'`, `'right'` or `false`)
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getispinned)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getIsPinned: () => ColumnPinningPosition
  /**
   * Returns the numeric pinned index of the column within a pinned column group.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getpinnedindex)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getPinnedIndex: () => number
  /**
   * Pins a column to the `'left'` or `'right'`, or unpins the column to the center if `false` is passed.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#pin)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  pin: (position: ColumnPinningPosition) => void
}

export interface ColumnPinningRow<TData extends RowData> {
  /**
   * Returns all center pinned (unpinned) leaf cells in the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getcentervisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getCenterVisibleCells: () => Cell<TData, unknown>[]
  /**
   * Returns all left pinned leaf cells in the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getleftvisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getLeftVisibleCells: () => Cell<TData, unknown>[]
  /**
   * Returns all right pinned leaf cells in the row.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getrightvisiblecells)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getRightVisibleCells: () => Cell<TData, unknown>[]
}

export interface RowPinningRow {
  /**
   * Returns whether or not the row can be pinned.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getcanpin-1)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getCanPin: () => boolean
  /**
   * Returns the pinned position of the row. (`'top'`, `'bottom'` or `false`)
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getispinned-1)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getIsPinned: () => RowPinningPosition
  /**
   * Returns the numeric pinned index of the row within a pinned row group.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getpinnedindex-1)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getPinnedIndex: () => number
  /**
   * Pins a row to the `'top'` or `'bottom'`, or unpins the row to the center if `false` is passed.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#pin-1)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  pin: (
    position: RowPinningPosition,
    includeLeafRows?: boolean,
    includeParentRows?: boolean
  ) => void
}

export interface ColumnPinningInstance<TData extends RowData> {
  /**
   * Returns all center pinned (unpinned) leaf columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getcenterleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getCenterLeafColumns: () => Column<TData, unknown>[]
  /**
   * Returns whether or not any columns are pinned. Optionally specify to only check for pinned columns in either the `left` or `right` position.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getissomecolumnspinned)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  /**
   * Returns all left pinned leaf columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getleftleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getLeftLeafColumns: () => Column<TData, unknown>[]
  /**
   * Returns all right pinned leaf columns.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getrightleafcolumns)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getRightLeafColumns: () => Column<TData, unknown>[]
  /**
   * Resets the **columnPinning** state to `initialState.columnPinning`, or `true` can be passed to force a default blank state reset to `{ left: [], right: [], }`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#resetcolumnpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  resetColumnPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.columnPinning` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#setcolumnpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
}

export interface RowPinningInstance<TData extends RowData> {
  _getPinnedRows: (position: 'top' | 'bottom') => Row<TData>[]
  /**
   * Returns all bottom pinned rows.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getbottomrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getBottomRows: () => Row<TData>[]
  /**
   * Returns all rows that are not pinned to the top or bottom.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getcenterrows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getCenterRows: () => Row<TData>[]
  /**
   * Returns whether or not any rows are pinned. Optionally specify to only check for pinned rows in either the `top` or `bottom` position.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#getissomerowspinned)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
  /**
   * Returns all top pinned rows.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#gettoprows)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  getTopRows: () => Row<TData>[]
  /**
   * Resets the **rowPinning** state to `initialState.rowPinning`, or `true` can be passed to force a default blank state reset to `{ top: [], bottom: [], }`.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#resetrowpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  resetRowPinning: (defaultState?: boolean) => void
  /**
   * Sets or updates the `state.rowPinning` state.
   * @link [API Docs](https://tanstack.com/table/v8/docs/api/features/pinning#setrowpinning)
   * @link [Guide](https://tanstack.com/table/v8/docs/guide/pinning)
   */
  setRowPinning: (updater: Updater<RowPinningState>) => void
}

//

const getDefaultColumnPinningState = (): ColumnPinningState => ({
  left: [],
  right: [],
})

const getDefaultRowPinningState = (): RowPinningState => ({
  top: [],
  bottom: [],
})

export const Pinning: TableFeature = {
  getInitialState: (state): ColumnPinningTableState & RowPinningState => {
    return {
      columnPinning: getDefaultColumnPinningState(),
      rowPinning: getDefaultRowPinningState(),
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ColumnPinningDefaultOptions & RowPinningDefaultOptions => {
    return {
      onColumnPinningChange: makeStateUpdater('columnPinning', table),
      onRowPinningChange: makeStateUpdater('rowPinning', table),
    }
  },

  createColumn: <TData extends RowData, TValue>(
    column: Column<TData, TValue>,
    table: Table<TData>
  ): void => {
    column.pin = position => {
      const columnIds = column
        .getLeafColumns()
        .map(d => d.id)
        .filter(Boolean) as string[]

      table.setColumnPinning(old => {
        if (position === 'right') {
          return {
            left: (old?.left ?? []).filter(d => !columnIds?.includes(d)),
            right: [
              ...(old?.right ?? []).filter(d => !columnIds?.includes(d)),
              ...columnIds,
            ],
          }
        }

        if (position === 'left') {
          return {
            left: [
              ...(old?.left ?? []).filter(d => !columnIds?.includes(d)),
              ...columnIds,
            ],
            right: (old?.right ?? []).filter(d => !columnIds?.includes(d)),
          }
        }

        return {
          left: (old?.left ?? []).filter(d => !columnIds?.includes(d)),
          right: (old?.right ?? []).filter(d => !columnIds?.includes(d)),
        }
      })
    }

    column.getCanPin = () => {
      const leafColumns = column.getLeafColumns()

      return leafColumns.some(
        d =>
          (d.columnDef.enablePinning ?? true) &&
          (table.options.enableColumnPinning ??
            table.options.enablePinning ??
            true)
      )
    }

    column.getIsPinned = () => {
      const leafColumnIds = column.getLeafColumns().map(d => d.id)

      const { left, right } = table.getState().columnPinning

      const isLeft = leafColumnIds.some(d => left?.includes(d))
      const isRight = leafColumnIds.some(d => right?.includes(d))

      return isLeft ? 'left' : isRight ? 'right' : false
    }

    column.getPinnedIndex = () => {
      const position = column.getIsPinned()

      return position
        ? table.getState().columnPinning?.[position]?.indexOf(column.id) ?? -1
        : 0
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): void => {
    row.pin = (position, includeLeafRows, includeParentRows) => {
      const leafRowIds = includeLeafRows
        ? row.getLeafRows().map(({ id }) => id)
        : []
      const parentRowIds = includeParentRows
        ? row.getParentRows().map(({ id }) => id)
        : []
      const rowIds = new Set([...parentRowIds, row.id, ...leafRowIds])

      table.setRowPinning(old => {
        if (position === 'bottom') {
          return {
            top: (old?.top ?? []).filter(d => !rowIds?.has(d)),
            bottom: [
              ...(old?.bottom ?? []).filter(d => !rowIds?.has(d)),
              ...Array.from(rowIds),
            ],
          }
        }

        if (position === 'top') {
          return {
            top: [
              ...(old?.top ?? []).filter(d => !rowIds?.has(d)),
              ...Array.from(rowIds),
            ],
            bottom: (old?.bottom ?? []).filter(d => !rowIds?.has(d)),
          }
        }

        return {
          top: (old?.top ?? []).filter(d => !rowIds?.has(d)),
          bottom: (old?.bottom ?? []).filter(d => !rowIds?.has(d)),
        }
      })
    }
    row.getCanPin = () => {
      const { enableRowPinning, enablePinning } = table.options
      if (typeof enableRowPinning === 'function') {
        return enableRowPinning(row)
      }
      return enableRowPinning ?? enablePinning ?? true
    }
    row.getIsPinned = () => {
      const rowIds = [row.id]

      const { top, bottom } = table.getState().rowPinning

      const isTop = rowIds.some(d => top?.includes(d))
      const isBottom = rowIds.some(d => bottom?.includes(d))

      return isTop ? 'top' : isBottom ? 'bottom' : false
    }
    row.getPinnedIndex = () => {
      const position = row.getIsPinned()
      if (!position) return -1

      const visiblePinnedRowIds = table
        ._getPinnedRows(position)
        ?.map(({ id }) => id)

      return visiblePinnedRowIds?.indexOf(row.id) ?? -1
    }
    row.getCenterVisibleCells = memo(
      () => [
        row._getAllVisibleCells(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allCells, left, right) => {
        const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

        return allCells.filter(d => !leftAndRight.includes(d.column.id))
      },
      {
        key:
          process.env.NODE_ENV === 'development' && 'row.getCenterVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    )
    row.getLeftVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.left, ,],
      (allCells, left) => {
        const cells = (left ?? [])
          .map(columnId => allCells.find(cell => cell.column.id === columnId)!)
          .filter(Boolean)
          .map(d => ({ ...d, position: 'left' }) as Cell<TData, unknown>)

        return cells
      },
      {
        key:
          process.env.NODE_ENV === 'development' && 'row.getLeftVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    )
    row.getRightVisibleCells = memo(
      () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
      (allCells, right) => {
        const cells = (right ?? [])
          .map(columnId => allCells.find(cell => cell.column.id === columnId)!)
          .filter(Boolean)
          .map(d => ({ ...d, position: 'right' }) as Cell<TData, unknown>)

        return cells
      },
      {
        key:
          process.env.NODE_ENV === 'development' && 'row.getRightVisibleCells',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    )
  },

  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnPinning = updater =>
      table.options.onColumnPinningChange?.(updater)

    table.resetColumnPinning = defaultState =>
      table.setColumnPinning(
        defaultState
          ? getDefaultColumnPinningState()
          : table.initialState?.columnPinning ?? getDefaultColumnPinningState()
      )

    table.getIsSomeColumnsPinned = position => {
      const pinningState = table.getState().columnPinning

      if (!position) {
        return Boolean(pinningState.left?.length || pinningState.right?.length)
      }
      return Boolean(pinningState[position]?.length)
    }

    table.getLeftLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.left],
      (allColumns, left) => {
        return (left ?? [])
          .map(columnId => allColumns.find(column => column.id === columnId)!)
          .filter(Boolean)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getLeftLeafColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    )

    table.getRightLeafColumns = memo(
      () => [table.getAllLeafColumns(), table.getState().columnPinning.right],
      (allColumns, right) => {
        return (right ?? [])
          .map(columnId => allColumns.find(column => column.id === columnId)!)
          .filter(Boolean)
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getRightLeafColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    )

    table.getCenterLeafColumns = memo(
      () => [
        table.getAllLeafColumns(),
        table.getState().columnPinning.left,
        table.getState().columnPinning.right,
      ],
      (allColumns, left, right) => {
        const leftAndRight: string[] = [...(left ?? []), ...(right ?? [])]

        return allColumns.filter(d => !leftAndRight.includes(d.id))
      },
      {
        key: process.env.NODE_ENV === 'development' && 'getCenterLeafColumns',
        debug: () => table.options.debugAll ?? table.options.debugColumns,
      }
    )

    table.setRowPinning = updater => table.options.onRowPinningChange?.(updater)

    table.resetRowPinning = defaultState =>
      table.setRowPinning(
        defaultState
          ? getDefaultRowPinningState()
          : table.initialState?.rowPinning ?? getDefaultRowPinningState()
      )

    table.getIsSomeRowsPinned = position => {
      const pinningState = table.getState().rowPinning

      if (!position) {
        return Boolean(pinningState.top?.length || pinningState.bottom?.length)
      }
      return Boolean(pinningState[position]?.length)
    }

    table._getPinnedRows = (position: 'top' | 'bottom') =>
      memo(
        () => [table.getRowModel().rows, table.getState().rowPinning[position]],
        (visibleRows, pinnedRowIds) => {
          const rows =
            table.options.keepPinnedRows ?? true
              ? //get all rows that are pinned even if they would not be otherwise visible
                //account for expanded parent rows, but not pagination or filtering
                (pinnedRowIds ?? []).map(rowId => {
                  const row = table.getRow(rowId, true)
                  return row.getIsAllParentsExpanded() ? row : null
                })
              : //else get only visible rows that are pinned
                (pinnedRowIds ?? []).map(
                  rowId => visibleRows.find(row => row.id === rowId)!
                )

          return rows
            .filter(Boolean)
            .map(d => ({ ...d, position })) as Row<TData>[]
        },
        {
          key:
            process.env.NODE_ENV === 'development' &&
            `row.get${position === 'top' ? 'Top' : 'Bottom'}Rows`,
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      )()

    table.getTopRows = () => table._getPinnedRows('top')

    table.getBottomRows = () => table._getPinnedRows('bottom')

    table.getCenterRows = memo(
      () => [
        table.getRowModel().rows,
        table.getState().rowPinning.top,
        table.getState().rowPinning.bottom,
      ],
      (allRows, top, bottom) => {
        const topAndBottom = new Set([...(top ?? []), ...(bottom ?? [])])
        return allRows.filter(d => !topAndBottom.has(d.id))
      },
      {
        key: process.env.NODE_ENV === 'development' && 'row.getCenterRows',
        debug: () => table.options.debugAll ?? table.options.debugRows,
      }
    )
  },
}

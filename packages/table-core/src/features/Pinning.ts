import { TableFeature } from '../core/table'
import {
  OnChangeFn,
  Updater,
  Table,
  Column,
  Row,
  Cell,
  RowData,
  RowModel,
} from '../types'
import { makeStateUpdater, memo } from '../utils'

export type ColumnPinningPosition = false | 'left' | 'right'
export type RowPinningPosition = false | 'top' | 'bottom'

export interface ColumnPinningState {
  left?: string[]
  right?: string[]
}

export interface RowPinningState {
  top?: string[]
  bottom?: string[]
}

export interface ColumnPinningTableState {
  columnPinning: ColumnPinningState
}

export interface RowPinningTableState {
  rowPinning: RowPinningState
}

export interface ColumnPinningOptions {
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
  enablePinning?: boolean
  enableColumnPinning?: boolean
}

export interface RowPinningOptions<TData extends RowData> {
  onRowPinningChange?: OnChangeFn<RowPinningState>
  enableRowPinning?: boolean
  persistPinnedRows?: boolean
}

export interface ColumnPinningDefaultOptions {
  onColumnPinningChange: OnChangeFn<ColumnPinningState>
}

export interface RowPinningDefaultOptions {
  onRowPinningChange: OnChangeFn<RowPinningState>
}

export interface ColumnPinningColumnDef {
  enablePinning?: boolean
}

export interface ColumnPinningColumn {
  getCanPin: () => boolean
  getPinnedIndex: () => number
  getIsPinned: () => ColumnPinningPosition
  pin: (position: ColumnPinningPosition) => void
}

export interface ColumnPinningRow<TData extends RowData> {
  getLeftVisibleCells: () => Cell<TData, unknown>[]
  getCenterVisibleCells: () => Cell<TData, unknown>[]
  getRightVisibleCells: () => Cell<TData, unknown>[]
}

export interface RowPinningRow {
  getCanPin: () => boolean
  getIsPinned: () => RowPinningPosition
  getPinnedIndex: () => number
  pin: (position: RowPinningPosition) => void
}

export interface ColumnPinningInstance<TData extends RowData> {
  setColumnPinning: (updater: Updater<ColumnPinningState>) => void
  resetColumnPinning: (defaultState?: boolean) => void
  getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
  getLeftLeafColumns: () => Column<TData, unknown>[]
  getRightLeafColumns: () => Column<TData, unknown>[]
  getCenterLeafColumns: () => Column<TData, unknown>[]
}

export interface RowPinningInstance<TData extends RowData> {
  setRowPinning: (updater: Updater<RowPinningState>) => void
  resetRowPinning: (defaultState?: boolean) => void
  getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
  getTopRows: () => Row<TData>[]
  getBottomRows: () => Row<TData>[]
  getCenterRows: () => Row<TData>[]
  _getPinnedRowModel: () => RowModel<TData>
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
  getInitialState: (state): ColumnPinningTableState & RowPinningTableState => {
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
  ): ColumnPinningColumn => {
    return {
      pin: position => {
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
      },

      getCanPin: () => {
        const leafColumns = column.getLeafColumns()

        return leafColumns.some(
          d =>
            (d.columnDef.enablePinning ?? true) &&
            (table.options.enableColumnPinning ??
              table.options.enablePinning ??
              true)
        )
      },

      getIsPinned: () => {
        const leafColumnIds = column.getLeafColumns().map(d => d.id)

        const { left, right } = table.getState().columnPinning

        const isLeft = leafColumnIds.some(d => left?.includes(d))
        const isRight = leafColumnIds.some(d => right?.includes(d))

        return isLeft ? 'left' : isRight ? 'right' : false
      },

      getPinnedIndex: () => {
        const position = column.getIsPinned()

        return position
          ? table.getState().columnPinning?.[position]?.indexOf(column.id) ?? -1
          : 0
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): ColumnPinningRow<TData> & RowPinningRow => {
    return {
      getCenterVisibleCells: memo(
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
            process.env.NODE_ENV === 'production' &&
            'row.getCenterVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),

      getLeftVisibleCells: memo(
        () => [
          row._getAllVisibleCells(),
          table.getState().columnPinning.left,
          ,
        ],
        (allCells, left) => {
          const cells = (left ?? [])
            .map(
              columnId => allCells.find(cell => cell.column.id === columnId)!
            )
            .filter(Boolean)
            .map(d => ({ ...d, position: 'left' } as Cell<TData, unknown>))

          return cells
        },
        {
          key:
            process.env.NODE_ENV === 'production' && 'row.getLeftVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),

      getRightVisibleCells: memo(
        () => [row._getAllVisibleCells(), table.getState().columnPinning.right],
        (allCells, right) => {
          const cells = (right ?? [])
            .map(
              columnId => allCells.find(cell => cell.column.id === columnId)!
            )
            .filter(Boolean)
            .map(d => ({ ...d, position: 'right' } as Cell<TData, unknown>))

          return cells
        },
        {
          key:
            process.env.NODE_ENV === 'production' && 'row.getRightVisibleCells',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),

      pin: position => {
        const leafRowIds = row.getLeafRows().map(({ id }) => id)
        const rowIds = [row.id, ...leafRowIds]

        table.setRowPinning(old => {
          if (position === 'bottom') {
            return {
              top: (old?.top ?? []).filter(d => !rowIds?.includes(d)),
              bottom: [
                ...(old?.bottom ?? []).filter(d => !rowIds?.includes(d)),
                ...rowIds,
              ],
            }
          }

          if (position === 'top') {
            return {
              top: [
                ...(old?.top ?? []).filter(d => !rowIds?.includes(d)),
                ...rowIds,
              ],
              bottom: (old?.bottom ?? []).filter(d => !rowIds?.includes(d)),
            }
          }

          return {
            top: (old?.top ?? []).filter(d => !rowIds?.includes(d)),
            bottom: (old?.bottom ?? []).filter(d => !rowIds?.includes(d)),
          }
        })
      },

      getCanPin: () => {
        return (
          table.options.enableRowPinning ?? table.options.enablePinning ?? true
        )
      },

      getIsPinned: () => {
        const rowIds = [row.id]

        const { top, bottom } = table.getState().rowPinning

        const isTop = rowIds.some(d => top?.includes(d))
        const isBottom = rowIds.some(d => bottom?.includes(d))

        return isTop ? 'top' : isBottom ? 'bottom' : false
      },

      getPinnedIndex: () => {
        const position = row.getIsPinned()

        const pinnedRowIds = position
          ? table.getState().rowPinning?.[position]
          : []
        const visiblePinnedRowIds = pinnedRowIds?.filter(rowId => {
          const parentId = table.getRow(rowId, true)?.parentId
          if (!parentId) return true
          return table.getRow(parentId, true)?.getIsExpanded()
        })

        return visiblePinnedRowIds?.indexOf(row.id) ?? -1
      },
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): ColumnPinningInstance<TData> & RowPinningInstance<TData> => {
    return {
      setColumnPinning: updater =>
        table.options.onColumnPinningChange?.(updater),

      resetColumnPinning: defaultState =>
        table.setColumnPinning(
          defaultState
            ? getDefaultColumnPinningState()
            : table.initialState?.columnPinning ??
                getDefaultColumnPinningState()
        ),

      getIsSomeColumnsPinned: position => {
        const pinningState = table.getState().columnPinning

        if (!position) {
          return Boolean(
            pinningState.left?.length || pinningState.right?.length
          )
        }
        return Boolean(pinningState[position]?.length)
      },

      getLeftLeafColumns: memo(
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
      ),

      getRightLeafColumns: memo(
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
      ),

      getCenterLeafColumns: memo(
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
      ),

      setRowPinning: updater => table.options.onRowPinningChange?.(updater),

      resetRowPinning: defaultState =>
        table.setRowPinning(
          defaultState
            ? getDefaultRowPinningState()
            : table.initialState?.rowPinning ?? getDefaultRowPinningState()
        ),

      getIsSomeRowsPinned: position => {
        const pinningState = table.getState().rowPinning

        if (!position) {
          return Boolean(
            pinningState.top?.length || pinningState.bottom?.length
          )
        }
        return Boolean(pinningState[position]?.length)
      },

      getTopRows: memo(
        () => [
          table._getPinnedRowModel().rows,
          table.getState().rowPinning.top,
        ],
        (allRows, top) => {
          const rows = (top ?? [])
            .map(rowId => allRows.find(row => row.id === rowId)!)
            .filter(Boolean)
            .map(d => ({ ...d, position: 'top' }))

          return rows
        },
        {
          key: process.env.NODE_ENV === 'production' && 'row.getTopRows',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),

      getBottomRows: memo(
        () => [
          table._getPinnedRowModel().rows,
          table.getState().rowPinning.bottom,
        ],
        (allRows, bottom) => {
          const rows = (bottom ?? [])
            .map(rowId => allRows.find(row => row.id === rowId)!)
            .filter(Boolean)
            .map(d => ({ ...d, position: 'bottom' }))

          return rows
        },
        {
          key: process.env.NODE_ENV === 'production' && 'row.getBottomRows',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),

      getCenterRows: memo(
        () => [
          table.getRowModel().rows,
          table.getState().rowPinning.top,
          table.getState().rowPinning.bottom,
        ],
        (allRows, top, bottom) => {
          const topAndBottom: string[] = [...(top ?? []), ...(bottom ?? [])]

          return allRows.filter(d => !topAndBottom.includes(d.id))
        },
        {
          key: process.env.NODE_ENV === 'development' && 'getCenterRows',
          debug: () => table.options.debugAll ?? table.options.debugRows,
        }
      ),

      _getPinnedRowModel: () => {
        return table.options.persistPinnedRows
          ? table.getPrePaginationRowModel()
          : table.getRowModel()
      },
    }
  },
}

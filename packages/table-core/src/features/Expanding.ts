import { RowModel } from '..'
import { TableFeature } from '../core/table'
import { OnChangeFn, Table, Row, Updater, RowData } from '../types'
import { makeStateUpdater } from '../utils'

export type ExpandedStateList = Record<string, boolean>
export type ExpandedState = true | Record<string, boolean>
export interface ExpandedTableState {
  expanded: ExpandedState
}

export interface ExpandedRow {
  toggleExpanded: (expanded?: boolean) => void
  getIsExpanded: () => boolean
  getCanExpand: () => boolean
  getToggleExpandedHandler: () => () => void
}

export interface ExpandedOptions<TData extends RowData> {
  manualExpanding?: boolean
  onExpandedChange?: OnChangeFn<ExpandedState>
  autoResetExpanded?: boolean
  enableExpanding?: boolean
  getExpandedRowModel?: (table: Table<any>) => () => RowModel<any>
  getIsRowExpanded?: (row: Row<TData>) => boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  paginateExpandedRows?: boolean
}

export interface ExpandedInstance<TData extends RowData> {
  _autoResetExpanded: () => void
  setExpanded: (updater: Updater<ExpandedState>) => void
  toggleAllRowsExpanded: (expanded?: boolean) => void
  resetExpanded: (defaultState?: boolean) => void
  getCanSomeRowsExpand: () => boolean
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  getIsSomeRowsExpanded: () => boolean
  getIsAllRowsExpanded: () => boolean
  getExpandedDepth: () => number
  getExpandedRowModel: () => RowModel<TData>
  _getExpandedRowModel?: () => RowModel<TData>
  getPreExpandedRowModel: () => RowModel<TData>
}

//

export const Expanding: TableFeature = {
  getInitialState: (state): ExpandedTableState => {
    return {
      expanded: {},
      ...state,
    }
  },

  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): ExpandedOptions<TData> => {
    return {
      onExpandedChange: makeStateUpdater('expanded', table),
      paginateExpandedRows: true,
    }
  },

  createTable: <TData extends RowData>(
    table: Table<TData>
  ): ExpandedInstance<TData> => {
    let registered = false
    let queued = false

    return {
      _autoResetExpanded: () => {
        if (!registered) {
          table._queue(() => {
            registered = true
          })
          return
        }

        if (
          table.options.autoResetAll ??
          table.options.autoResetExpanded ??
          !table.options.manualExpanding
        ) {
          if (queued) return
          queued = true
          table._queue(() => {
            table.resetExpanded()
            queued = false
          })
        }
      },
      setExpanded: updater => table.options.onExpandedChange?.(updater),
      toggleAllRowsExpanded: expanded => {
        if (expanded ?? !table.getIsAllRowsExpanded()) {
          table.setExpanded(true)
        } else {
          table.setExpanded({})
        }
      },
      resetExpanded: defaultState => {
        table.setExpanded(
          defaultState ? {} : table.initialState?.expanded ?? {}
        )
      },
      getCanSomeRowsExpand: () => {
        return table.getRowModel().flatRows.some(row => row.getCanExpand())
      },
      getToggleAllRowsExpandedHandler: () => {
        return (e: unknown) => {
          ;(e as any).persist?.()
          table.toggleAllRowsExpanded()
        }
      },
      getIsSomeRowsExpanded: () => {
        const expanded = table.getState().expanded
        return expanded === true || Object.values(expanded).some(Boolean)
      },
      getIsAllRowsExpanded: () => {
        const expanded = table.getState().expanded

        // If expanded is true, save some cycles and return true
        if (typeof expanded === 'boolean') {
          return expanded === true
        }

        if (!Object.keys(expanded).length) {
          return false
        }

        // If any row is not expanded, return false
        if (table.getRowModel().flatRows.some(row => !row.getIsExpanded())) {
          return false
        }

        // They must all be expanded :shrug:
        return true
      },
      getExpandedDepth: () => {
        let maxDepth = 0

        const rowIds =
          table.getState().expanded === true
            ? Object.keys(table.getRowModel().rowsById)
            : Object.keys(table.getState().expanded)

        rowIds.forEach(id => {
          const splitId = id.split('.')
          maxDepth = Math.max(maxDepth, splitId.length)
        })

        return maxDepth
      },
      getPreExpandedRowModel: () => table.getSortedRowModel(),
      getExpandedRowModel: () => {
        if (!table._getExpandedRowModel && table.options.getExpandedRowModel) {
          table._getExpandedRowModel = table.options.getExpandedRowModel(table)
        }

        if (table.options.manualExpanding || !table._getExpandedRowModel) {
          return table.getPreExpandedRowModel()
        }

        return table._getExpandedRowModel()
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    table: Table<TData>
  ): ExpandedRow => {
    return {
      toggleExpanded: expanded => {
        table.setExpanded(old => {
          const exists = old === true ? true : !!old?.[row.id]

          let oldExpanded: ExpandedStateList = {}

          if (old === true) {
            Object.keys(table.getRowModel().rowsById).forEach(rowId => {
              oldExpanded[rowId] = true
            })
          } else {
            oldExpanded = old
          }

          expanded = expanded ?? !exists

          if (!exists && expanded) {
            return {
              ...oldExpanded,
              [row.id]: true,
            }
          }

          if (exists && !expanded) {
            const { [row.id]: _, ...rest } = oldExpanded
            return rest
          }

          return old
        })
      },
      getIsExpanded: () => {
        const expanded = table.getState().expanded

        return !!(
          table.options.getIsRowExpanded?.(row) ??
          (expanded === true || expanded?.[row.id])
        )
      },
      getCanExpand: () => {
        return (
          table.options.getRowCanExpand?.(row) ??
          ((table.options.enableExpanding ?? true) && !!row.subRows?.length)
        )
      },
      getToggleExpandedHandler: () => {
        const canExpand = row.getCanExpand()

        return () => {
          if (!canExpand) return
          row.toggleExpanded()
        }
      },
    }
  },
}

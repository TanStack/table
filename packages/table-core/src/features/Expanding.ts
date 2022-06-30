import { RowModel } from '..'
import { TableFeature } from '../core/instance'
import {
  OnChangeFn,
  TableGenerics,
  Table,
  Row,
  Updater,
  RowData,
} from '../types'
import { makeStateUpdater } from '../utils'

export type ExpandedStateList = Record<string, boolean>
export type ExpandedState = true | Record<string, boolean>
export type ExpandedTableState = {
  expanded: ExpandedState
}

export type ExpandedRow = {
  toggleExpanded: (expanded?: boolean) => void
  getIsExpanded: () => boolean
  getCanExpand: () => boolean
  getToggleExpandedHandler: () => () => void
}

export type ExpandedOptions<TData extends RowData> = {
  manualExpanding?: boolean
  onExpandedChange?: OnChangeFn<ExpandedState>
  autoResetExpanded?: boolean
  enableExpanding?: boolean
  getExpandedRowModel?: (instance: Table<any>) => () => RowModel<any>
  getIsRowExpanded?: (row: Row<TData>) => boolean
  getRowCanExpand?: (row: Row<TData>) => boolean
  paginateExpandedRows?: boolean
}

export type ExpandedInstance<TData extends RowData> = {
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
    instance: Table<TData>
  ): ExpandedOptions<TData> => {
    return {
      onExpandedChange: makeStateUpdater('expanded', instance),
      paginateExpandedRows: true,
    }
  },

  createTable: <TData extends RowData>(
    instance: Table<TData>
  ): ExpandedInstance<TData> => {
    let registered = false
    let queued = false

    return {
      _autoResetExpanded: () => {
        if (!registered) {
          instance._queue(() => {
            registered = true
          })
          return
        }

        if (
          instance.options.autoResetAll ??
          instance.options.autoResetExpanded ??
          !instance.options.manualExpanding
        ) {
          if (queued) return
          queued = true
          instance._queue(() => {
            instance.resetExpanded()
            queued = false
          })
        }
      },
      setExpanded: updater => instance.options.onExpandedChange?.(updater),
      toggleAllRowsExpanded: expanded => {
        if (expanded ?? !instance.getIsAllRowsExpanded()) {
          instance.setExpanded(true)
        } else {
          instance.setExpanded({})
        }
      },
      resetExpanded: defaultState => {
        instance.setExpanded(
          defaultState ? {} : instance.initialState?.expanded ?? {}
        )
      },
      getCanSomeRowsExpand: () => {
        return instance.getRowModel().flatRows.some(row => row.getCanExpand())
      },
      getToggleAllRowsExpandedHandler: () => {
        return (e: unknown) => {
          ;(e as any).persist?.()
          instance.toggleAllRowsExpanded()
        }
      },
      getIsSomeRowsExpanded: () => {
        const expanded = instance.getState().expanded
        return expanded === true || Object.values(expanded).some(Boolean)
      },
      getIsAllRowsExpanded: () => {
        const expanded = instance.getState().expanded

        // If expanded is true, save some cycles and return true
        if (typeof expanded === 'boolean') {
          return expanded === true
        }

        if (!Object.keys(expanded).length) {
          return false
        }

        // If any row is not expanded, return false
        if (instance.getRowModel().flatRows.some(row => row.getIsExpanded())) {
          return false
        }

        // They must all be expanded :shrug:
        return true
      },
      getExpandedDepth: () => {
        let maxDepth = 0

        const rowIds =
          instance.getState().expanded === true
            ? Object.keys(instance.getRowModel().rowsById)
            : Object.keys(instance.getState().expanded)

        rowIds.forEach(id => {
          const splitId = id.split('.')
          maxDepth = Math.max(maxDepth, splitId.length)
        })

        return maxDepth
      },
      getPreExpandedRowModel: () => instance.getSortedRowModel(),
      getExpandedRowModel: () => {
        if (
          !instance._getExpandedRowModel &&
          instance.options.getExpandedRowModel
        ) {
          instance._getExpandedRowModel =
            instance.options.getExpandedRowModel(instance)
        }

        if (
          instance.options.manualExpanding ||
          !instance._getExpandedRowModel
        ) {
          return instance.getPreExpandedRowModel()
        }

        return instance._getExpandedRowModel()
      },
    }
  },

  createRow: <TData extends RowData>(
    row: Row<TData>,
    instance: Table<TData>
  ): ExpandedRow => {
    return {
      toggleExpanded: expanded => {
        instance.setExpanded(old => {
          const exists = old === true ? true : !!old?.[row.id]

          let oldExpanded: ExpandedStateList = {}

          if (old === true) {
            Object.keys(instance.getRowModel().rowsById).forEach(rowId => {
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
        const expanded = instance.getState().expanded

        return !!(
          instance.options.getIsRowExpanded?.(row) ??
          (expanded === true || expanded?.[row.id])
        )
      },
      getCanExpand: () => {
        return (
          (instance.options.getRowCanExpand?.(row) ?? true) &&
          (instance.options.enableExpanding ?? true) &&
          !!row.subRows?.length
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

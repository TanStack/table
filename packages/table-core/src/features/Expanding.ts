import { RowModel } from '..'
import { TableFeature } from '../core/instance'
import {
  OnChangeFn,
  TableGenerics,
  TableInstance,
  Row,
  Updater,
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

export type ExpandedOptions<TGenerics extends TableGenerics> = {
  manualExpanding?: boolean
  onExpandedChange?: OnChangeFn<ExpandedState>
  autoResetExpanded?: boolean
  enableExpanding?: boolean
  getExpandedRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>
  getIsRowExpanded?: (row: Row<TGenerics>) => boolean
  getRowCanExpand?: (row: Row<TGenerics>) => boolean
  paginateExpandedRows?: boolean
}

export type ExpandedInstance<TGenerics extends TableGenerics> = {
  _autoResetExpanded: () => void
  setExpanded: (updater: Updater<ExpandedState>) => void
  toggleAllRowsExpanded: (expanded?: boolean) => void
  resetExpanded: (defaultState?: boolean) => void
  getCanSomeRowsExpand: () => boolean
  getToggleAllRowsExpandedHandler: () => (event: unknown) => void
  getIsSomeRowsExpanded: () => boolean
  getIsAllRowsExpanded: () => boolean
  getExpandedDepth: () => number
  getExpandedRowModel: () => RowModel<TGenerics>
  _getExpandedRowModel?: () => RowModel<TGenerics>
  getPreExpandedRowModel: () => RowModel<TGenerics>
}

//

export const Expanding: TableFeature = {
  getInitialState: (state): ExpandedTableState => {
    return {
      expanded: {},
      ...state,
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ExpandedOptions<TGenerics> => {
    return {
      onExpandedChange: makeStateUpdater('expanded', instance),
      autoResetExpanded: true,
      paginateExpandedRows: true,
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): ExpandedInstance<TGenerics> => {
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

        if (instance.options.autoResetAll === false) {
          return
        }

        if (
          instance.options.autoResetAll === true ||
          instance.options.autoResetExpanded
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
        if (expanded === true) {
          return true
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
      getPreExpandedRowModel: () => instance.getGroupedRowModel(),
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

  createRow: <TGenerics extends TableGenerics>(
    row: Row<TGenerics>,
    instance: TableInstance<TGenerics>
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

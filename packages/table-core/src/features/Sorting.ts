import { RowModel } from '..'
import {
  BuiltInSortingFn,
  reSplitAlphaNumeric,
  sortingFns,
} from '../sortingFns'

import {
  Column,
  OnChangeFn,
  TableGenerics,
  TableInstance,
  Row,
  Updater,
  TableFeature,
} from '../types'

import { isFunction, makeStateUpdater, Overwrite } from '../utils'

export type SortDirection = 'asc' | 'desc'

export type ColumnSort = {
  id: string
  desc: boolean
}

export type SortingState = ColumnSort[]

export type SortingFn<TGenerics extends TableGenerics> = {
  (rowA: Row<TGenerics>, rowB: Row<TGenerics>, columnId: string): number
}

export type CustomSortingFns<TGenerics extends TableGenerics> = Record<
  string,
  SortingFn<TGenerics>
>

export type SortingTableState = {
  sorting: SortingState
}

export type SortingFnOption<TGenerics extends TableGenerics> =
  | 'auto'
  | BuiltInSortingFn
  | keyof TGenerics['SortingFns']
  | SortingFn<TGenerics>

export type SortingColumnDef<TGenerics extends TableGenerics> = {
  sortingFn?: SortingFnOption<Overwrite<TGenerics, { Value: any }>>
  sortDescFirst?: boolean
  enableSorting?: boolean
  enableMultiSort?: boolean
  invertSorting?: boolean
  sortUndefined?: false | -1 | 1
}

export type SortingColumn<TGenerics extends TableGenerics> = {
  getAutoSortingFn: () => SortingFn<TGenerics>
  getAutoSortDir: () => SortDirection
  getSortingFn: () => SortingFn<TGenerics>
  getCanSort: () => boolean
  getCanMultiSort: () => boolean
  getSortIndex: () => number
  getIsSorted: () => false | SortDirection
  resetSorting: () => void
  toggleSorting: (desc?: boolean, isMulti?: boolean) => void
  getToggleSortingHandler: () => undefined | ((event: unknown) => void)
}

export type SortingOptions<TGenerics extends TableGenerics> = {
  manualSorting?: boolean
  sortingFns?: TGenerics['SortingFns']
  onSortingChange?: OnChangeFn<SortingState>
  enableSorting?: boolean
  enableSortingRemoval?: boolean
  enableMultiRemove?: boolean
  enableMultiSort?: boolean
  sortDescFirst?: boolean
  getSortedRowModel?: (
    instance: TableInstance<TGenerics>
  ) => () => RowModel<TGenerics>
  maxMultiSortColCount?: number
  isMultiSortEvent?: (e: unknown) => boolean
}

export type SortingInstance<TGenerics extends TableGenerics> = {
  setSorting: (updater: Updater<SortingState>) => void
  getPreSortedRowModel: () => RowModel<TGenerics>
  getSortedRowModel: () => RowModel<TGenerics>
  _getSortedRowModel?: () => RowModel<TGenerics>
}

//

export const Sorting: TableFeature = {
  getInitialState: (state): SortingTableState => {
    return {
      sorting: [],
      ...state,
    }
  },

  getDefaultColumn: <
    TGenerics extends TableGenerics
  >(): SortingColumnDef<TGenerics> => {
    return {
      sortingFn: 'auto',
    }
  },

  getDefaultOptions: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): SortingOptions<TGenerics> => {
    return {
      onSortingChange: makeStateUpdater('sorting', instance),
      isMultiSortEvent: (e: unknown) => {
        return (e as MouseEvent).shiftKey
      },
    }
  },

  createColumn: <TGenerics extends TableGenerics>(
    column: Column<TGenerics>,
    instance: TableInstance<TGenerics>
  ): SortingColumn<TGenerics> => {
    return {
      getAutoSortingFn: () => {
        const firstRows = instance.getFilteredRowModel().flatRows.slice(100)

        let isString = false

        for (const row of firstRows) {
          const value = row?.values[column.id]

          if (Object.prototype.toString.call(value) === '[object Date]') {
            return sortingFns.datetime
          }

          if (typeof value === 'string') {
            isString = true

            if (value.split(reSplitAlphaNumeric).length > 1) {
              return sortingFns.alphanumeric
            }
          }
        }

        if (isString) {
          return sortingFns.text
        }

        return sortingFns.basic
      },
      getAutoSortDir: () => {
        const firstRow = instance.getFilteredRowModel().flatRows[0]

        const value = firstRow?.values[column.id]

        if (typeof value === 'string') {
          return 'asc'
        }

        return 'desc'
      },
      getSortingFn: () => {
        const userSortingFn = instance.options.sortingFns

        if (!column) {
          throw new Error()
        }

        return isFunction(column.sortingFn)
          ? column.sortingFn
          : column.sortingFn === 'auto'
          ? column.getAutoSortingFn()
          : (userSortingFn as Record<string, any>)?.[
              column.sortingFn as string
            ] ??
            (sortingFns[
              column.sortingFn as BuiltInSortingFn
            ] as SortingFn<TGenerics>)
      },
      toggleSorting: (desc, multi) => {
        // if (column.columns.length) {
        //   column.columns.forEach((c, i) => {
        //     if (c.id) {
        //       instance.toggleColumnSorting(c.id, undefined, multi || !!i)
        //     }
        //   })
        //   return
        // }

        instance.setSorting(old => {
          // Find any existing sorting for this column
          const existingSorting = old?.find(d => d.id === column.id)
          const existingIndex = old?.findIndex(d => d.id === column.id)
          const hasDescDefined = typeof desc !== 'undefined' && desc !== null

          let newSorting: SortingState = []

          // What should we do with this sort action?
          let sortAction

          if (column.getCanMultiSort() && multi) {
            if (existingSorting) {
              sortAction = 'toggle'
            } else {
              sortAction = 'add'
            }
          } else {
            // Normal mode
            if (old?.length && existingIndex !== old.length - 1) {
              sortAction = 'replace'
            } else if (existingSorting) {
              sortAction = 'toggle'
            } else {
              sortAction = 'replace'
            }
          }

          const sortDescFirst =
            column.sortDescFirst ??
            instance.options.sortDescFirst ??
            column.getAutoSortDir() === 'desc'

          // Handle toggle states that will remove the sorting
          if (
            sortAction === 'toggle' && // Must be toggling
            (instance.options.enableSortingRemoval ?? true) && // If enableSortRemove, enable in general
            !hasDescDefined && // Must not be setting desc
            (multi ? instance.options.enableMultiRemove ?? true : true) && // If multi, don't allow if enableMultiRemove
            (existingSorting?.desc // Finally, detect if it should indeed be removed
              ? !sortDescFirst
              : sortDescFirst)
          ) {
            sortAction = 'remove'
          }

          if (sortAction === 'replace') {
            newSorting = [
              {
                id: column.id,
                desc: hasDescDefined ? desc! : !!sortDescFirst,
              },
            ]
          } else if (sortAction === 'add' && old?.length) {
            newSorting = [
              ...old,
              {
                id: column.id,
                desc: hasDescDefined ? desc! : !!sortDescFirst,
              },
            ]
            // Take latest n columns
            newSorting.splice(
              0,
              newSorting.length -
                (instance.options.maxMultiSortColCount ??
                  Number.MAX_SAFE_INTEGER)
            )
          } else if (sortAction === 'toggle' && old?.length) {
            // This flips (or sets) the
            newSorting = old.map(d => {
              if (d.id === column.id) {
                return {
                  ...d,
                  desc: hasDescDefined ? desc! : !existingSorting?.desc,
                }
              }
              return d
            })
          } else if (sortAction === 'remove' && old?.length) {
            newSorting = old.filter(d => d.id !== column.id)
          }

          return newSorting
        })
      },

      getCanSort: () => {
        return (
          (column.enableSorting ?? true) &&
          (instance.options.enableSorting ?? true) &&
          !!column.accessorFn
        )
      },

      getCanMultiSort: () => {
        return (
          column.enableMultiSort ??
          instance.options.enableMultiSort ??
          !!column.accessorFn
        )
      },

      getIsSorted: () => {
        const columnSort = instance
          .getState()
          .sorting?.find(d => d.id === column.id)

        return !columnSort ? false : columnSort.desc ? 'desc' : 'asc'
      },

      getSortIndex: () =>
        instance.getState().sorting?.findIndex(d => d.id === column.id) ?? -1,

      resetSorting: (columnId?: string) => {
        if (columnId) {
          instance.setSorting(old =>
            old?.length ? old.filter(d => d.id !== columnId) : []
          )
        } else {
          instance.setSorting(instance.initialState?.sorting ?? [])
        }
      },

      getToggleSortingHandler: () => {
        const canSort = column.getCanSort()

        return (e: unknown) => {
          if (!canSort) return
          ;(e as any).persist?.()
          column.toggleSorting?.(
            undefined,
            column.getCanMultiSort()
              ? instance.options.isMultiSortEvent?.(e)
              : false
          )
        }
      },
    }
  },

  createInstance: <TGenerics extends TableGenerics>(
    instance: TableInstance<TGenerics>
  ): SortingInstance<TGenerics> => {
    let registered = false

    return {
      setSorting: updater => instance.options.onSortingChange?.(updater),

      getPreSortedRowModel: () => instance.getFilteredRowModel(),
      getSortedRowModel: () => {
        if (
          !instance._getSortedRowModel &&
          instance.options.getSortedRowModel
        ) {
          instance._getSortedRowModel =
            instance.options.getSortedRowModel(instance)
        }

        if (instance.options.manualSorting || !instance._getSortedRowModel) {
          return instance.getPreSortedRowModel()
        }

        return instance._getSortedRowModel()
      },
    }
  },
}

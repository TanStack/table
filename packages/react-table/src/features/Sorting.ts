import { MouseEvent, TouchEvent } from 'react'
import { RowModel } from '..'
import { BuiltInSortType, reSplitAlphaNumeric, sortTypes } from '../sortTypes'

import {
  Column,
  Getter,
  Header,
  OnChangeFn,
  PropGetterValue,
  ReactTable,
  Row,
  Updater,
} from '../types'

import {
  functionalUpdate,
  isFunction,
  makeStateUpdater,
  memo,
  propGetter,
} from '../utils'

export type SortDirection = 'asc' | 'desc'

export type ColumnSort = {
  id: string
  desc: boolean
}

export type SortingState = ColumnSort[]

export type SortingFn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> =
  {
    (
      rowA: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
      rowB: Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
      columnId: string
    ): number
  }

export type SortingTableState = {
  sorting: SortingState
}

export type SortType<TSortingFns> =
  | 'auto'
  | BuiltInSortType
  | keyof TSortingFns
  | SortingFn<any, any, any, TSortingFns, any>

export type SortingColumnDef<TFilterFns> = {
  sortType?: SortType<TFilterFns>
  sortDescFirst?: boolean
  enableSorting?: boolean
  enableMultiSort?: boolean
  defaultCanSort?: boolean
  invertSorting?: boolean
  sortUndefined?: false | -1 | 1
}

export type SortingColumn<
  _TData,
  _TValue,
  TFilterFns,
  _TSortingFns,
  _TAggregationFns
> = {
  sortType: SortType<TFilterFns>
  getCanSort: () => boolean
  getCanMultiSort: () => boolean
  getSortIndex: () => number
  getIsSorted: () => false | SortDirection
  toggleSorting: (desc?: boolean, isMulti?: boolean) => void
  getToggleSortingProps: <TGetter extends Getter<ToggleSortingProps>>(
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleSortingProps, TGetter>
}

export type SortingOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  sortTypes?: TSortingFns
  onSortingChange?: OnChangeFn<SortingState>
  autoResetSorting?: boolean
  enableSorting?: boolean
  enableSortingRemoval?: boolean
  enableMultiRemove?: boolean
  enableMultiSort?: boolean
  sortDescFirst?: boolean
  sortRowsFn?: (
    instance: ReactTable<
      TData,
      TValue,
      TFilterFns,
      TSortingFns,
      TAggregationFns
    >,
    rowModel: RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  ) => RowModel<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  maxMultiSortColCount?: number
  isMultiSortEvent?: (e: MouseEvent | TouchEvent) => boolean
}

export type ToggleSortingProps = {
  title?: string
  onClick?: (event: MouseEvent | TouchEvent) => void
}

export type SortingInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
> = {
  _notifySortingReset: () => void
  getColumnAutoSortingFn: (
    columnId: string
  ) => SortingFn<any, any, any, any, any> | undefined
  getColumnAutoSortDir: (columnId: string) => SortDirection

  getColumnSortingFn: (
    columnId: string
  ) => SortingFn<any, any, any, any, any> | undefined

  setSorting: (updater: Updater<SortingState>) => void
  toggleColumnSorting: (
    columnId: string,
    desc?: boolean,
    multi?: boolean
  ) => void
  resetSorting: () => void
  getColumnCanSort: (columnId: string) => boolean
  getColumnCanMultiSort: (columnId: string) => boolean
  getColumnIsSorted: (columnId: string) => false | 'asc' | 'desc'
  getColumnSortIndex: (columnId: string) => number
  getToggleSortingProps: <TGetter extends Getter<ToggleSortingProps>>(
    columnId: string,
    userProps?: TGetter
  ) => undefined | PropGetterValue<ToggleSortingProps, TGetter>
  getSortedRowModel: () => RowModel<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >
  getPreSortedRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreSortedFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getPreSortedRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
  getSortedRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getSortedFlatRows: () => Row<
    TData,
    TValue,
    TFilterFns,
    TSortingFns,
    TAggregationFns
  >[]
  getSortedRowsById: () => Record<
    string,
    Row<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
  >
}

//

export function getDefaultColumn<TFilterFns>(): SortingColumnDef<TFilterFns> {
  return {
    sortType: 'auto',
  }
}

export function getInitialState(): SortingTableState {
  return {
    sorting: [],
  }
}

export function getDefaultOptions<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): SortingOptions<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    onSortingChange: makeStateUpdater('sorting', instance),
    autoResetSorting: true,
    isMultiSortEvent: (e: MouseEvent | TouchEvent) => {
      return e.shiftKey
    },
  }
}

export function createColumn<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  column: Column<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>,
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): SortingColumn<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  return {
    sortType: column.sortType,
    getCanSort: () => instance.getColumnCanSort(column.id),
    getCanMultiSort: () => instance.getColumnCanMultiSort(column.id),
    getSortIndex: () => instance.getColumnSortIndex(column.id),
    getIsSorted: () => instance.getColumnIsSorted(column.id),
    toggleSorting: (desc, isMulti) =>
      instance.toggleColumnSorting(column.id, desc, isMulti),
    getToggleSortingProps: userProps =>
      instance.getToggleSortingProps(column.id, userProps),
  }
}

export function getInstance<
  TData,
  TValue,
  TFilterFns,
  TSortingFns,
  TAggregationFns
>(
  instance: ReactTable<TData, TValue, TFilterFns, TSortingFns, TAggregationFns>
): SortingInstance<TData, TValue, TFilterFns, TSortingFns, TAggregationFns> {
  let registered = false

  return {
    _notifySortingReset: () => {
      if (!registered) {
        registered = true
        return
      }

      if (instance.options.autoResetAll === false) {
        return
      }

      if (
        instance.options.autoResetAll === true ||
        instance.options.autoResetSorting
      ) {
        instance.resetSorting()
      }
    },
    getColumnAutoSortingFn: columnId => {
      const firstRows = instance.getGlobalFilteredRowModel().flatRows.slice(100)

      let isString = false

      for (const row of firstRows) {
        const value = row?.values[columnId]

        if (Object.prototype.toString.call(value) === '[object Date]') {
          return sortTypes.datetime
        }

        if (typeof value === 'string') {
          isString = true

          if (value.split(reSplitAlphaNumeric).length > 1) {
            return sortTypes.alphanumeric
          }
        }
      }

      if (isString) {
        return sortTypes.text
      }

      return sortTypes.basic
    },
    getColumnAutoSortDir: columnId => {
      const firstRow = instance.getGlobalFilteredRowModel().flatRows[0]

      const value = firstRow?.values[columnId]

      if (typeof value === 'string') {
        return 'asc'
      }

      return 'desc'
    },
    getColumnSortingFn: columnId => {
      const column = instance.getColumn(columnId)
      const userSortTypes = instance.options.sortTypes

      if (!column) {
        throw new Error()
      }

      return isFunction(column.sortType)
        ? column.sortType
        : column.sortType === 'auto'
        ? instance.getColumnAutoSortingFn(columnId)
        : (userSortTypes as Record<string, any>)?.[column.sortType as string] ??
          (sortTypes[column.sortType as BuiltInSortType] as SortingFn<
            TData,
            TValue,
            TFilterFns,
            TSortingFns,
            TAggregationFns
          >)
    },

    setSorting: updater =>
      instance.options.onSortingChange?.(
        updater,
        functionalUpdate(updater, instance.getState().sorting)
      ),

    toggleColumnSorting: (columnId, desc, multi) => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

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
        const existingSorting = old?.find(d => d.id === columnId)
        const existingIndex = old?.findIndex(d => d.id === columnId)
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
          instance.getColumnAutoSortDir(columnId) === 'desc'

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
              id: columnId,
              desc: hasDescDefined ? desc! : !!sortDescFirst,
            },
          ]
        } else if (sortAction === 'add' && old?.length) {
          newSorting = [
            ...old,
            {
              id: columnId,
              desc: hasDescDefined ? desc! : !!sortDescFirst,
            },
          ]
          // Take latest n columns
          newSorting.splice(
            0,
            newSorting.length -
              (instance.options.maxMultiSortColCount ?? Number.MAX_SAFE_INTEGER)
          )
        } else if (sortAction === 'toggle' && old?.length) {
          // This flips (or sets) the
          newSorting = old.map(d => {
            if (d.id === columnId) {
              return {
                ...d,
                desc: hasDescDefined ? desc! : !existingSorting?.desc,
              }
            }
            return d
          })
        } else if (sortAction === 'remove' && old?.length) {
          newSorting = old.filter(d => d.id !== columnId)
        }

        return newSorting
      })
    },

    getColumnCanSort: columnId => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      return (
        column.enableSorting ??
        instance.options.enableSorting ??
        column.defaultCanSort ??
        !!column.accessorFn
        // (!!column.accessorFn ||
        //   column.columns?.some(c => c.id && instance.getColumnCanSort(c.id))) ??
        // false
      )
    },

    getColumnCanMultiSort: columnId => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      return (
        column.enableMultiSort ??
        instance.options.enableMultiSort ??
        !!column.accessorFn
      )
    },

    getColumnIsSorted: columnId => {
      const columnSort = instance
        .getState()
        .sorting?.find(d => d.id === columnId)

      return !columnSort ? false : columnSort.desc ? 'desc' : 'asc'
    },

    getColumnSortIndex: columnId =>
      instance.getState().sorting?.findIndex(d => d.id === columnId) ?? -1,

    resetSorting: () => {
      instance.setSorting(instance.options?.initialState?.sorting ?? [])
    },

    getToggleSortingProps: (columnId, userProps) => {
      const column = instance.getColumn(columnId)

      if (!column) {
        throw new Error()
      }

      const canSort = column.getCanSort()

      const initialProps: ToggleSortingProps = {
        title: canSort ? 'Toggle Sorting' : undefined,
        onClick: canSort
          ? (e: MouseEvent | TouchEvent) => {
              e.persist()
              column.toggleSorting?.(
                undefined,
                column.getCanMultiSort()
                  ? instance.options.isMultiSortEvent?.(e)
                  : false
              )
            }
          : undefined,
      }

      return propGetter(initialProps, userProps)
    },

    getSortedRowModel: memo(
      () => [
        instance.getState().sorting,
        instance.getGlobalFilteredRowModel(),
        instance.options.sortRowsFn,
      ],
      (sorting, rowModel, sortingFn) => {
        if (!sortingFn || !sorting?.length) {
          return rowModel
        }

        if (process.env.NODE_ENV !== 'production' && instance.options.debug)
          console.info('Sorting...')

        return sortingFn(instance, rowModel)
      },
      {
        key: 'getSortedRowModel',
        debug: instance.options.debug,
        onChange: () => instance._notifyGroupingReset(),
      }
    ),

    getPreSortedRows: () => instance.getGlobalFilteredRowModel().rows,
    getPreSortedFlatRows: () => instance.getGlobalFilteredRowModel().flatRows,
    getPreSortedRowsById: () => instance.getGlobalFilteredRowModel().rowsById,
    getSortedRows: () => instance.getSortedRowModel().rows,
    getSortedFlatRows: () => instance.getSortedRowModel().flatRows,
    getSortedRowsById: () => instance.getSortedRowModel().rowsById,
  }
}

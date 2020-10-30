import React from 'react'

import {
  getFirstDefined,
  isFunction,
  orderBy,
  useMountedLayoutEffect,
  makeStateUpdater,
} from '../utils'

import {
  withSorting as name,
  withColumnVisibility,
  withColumnFilters,
  withGlobalFilter,
  withGrouping,
} from '../Constants'

import * as _sortTypes from '../sortTypes'
import {
  SortObj,
  Row,
  SortFn,
  UseReduceOptions,
  UseInstanceAfterState,
  UseInstanceAfterDataModel,
  DecorateColumn,
} from '../types'

const sortTypes: Record<string, SortFn> = _sortTypes

const useReduceOptions: UseReduceOptions = options => {
  return {
    onSortingChange: React.useCallback(makeStateUpdater('sorting'), []),
    autoResetSorting: true,
    isMultiSortEvent: e => e.shiftKey,
    ...options,
    initialState: {
      sorting: [],
      ...options.initialState,
    },
    defaultColumn: {
      sortType: 'basic',
      sortDescFirst: false,
      ...options.defaultColumn,
    },
  }
}

const useInstanceAfterState: UseInstanceAfterState = instance => {
  instance.setSorting = React.useCallback(
    updater => instance.options.onSortingChange?.(updater, instance),
    [instance]
  )

  const sortingResetDeps = [
    instance.options.manualSorting ? null : instance.options.data,
  ]

  // This is a tricky trick here. When we detect that the sorting should
  // reset, we can't just ONLY call `resetSorting()`, (though that's still required
  // below to ensure eventual consistency with our controlled state), but we
  // also have to override the state in the current hook call so the output
  // of the hook matches what we would expect. Sure, it causes a double render,
  // but the second render is very light, since the state is the same between the two
  React.useMemo(() => {
    if (instance.options.autoResetSorting) {
      instance.state.sorting = instance.options.initialState?.sorting ?? []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, sortingResetDeps)
  useMountedLayoutEffect(() => {
    if (instance.options.autoResetSorting) {
      instance.resetSorting()
    }
  }, sortingResetDeps)

  instance.toggleColumnSorting = React.useCallback(
    (columnId, desc, multi) => {
      if (!columnId) {
        return
      }

      instance.setSorting(old => {
        const {
          leafColumns,
          options: {
            disableMultiSort,
            disableSortRemove,
            disableMultiRemove,
            maxMultiSortColCount = Number.MAX_SAFE_INTEGER,
          },
        } = instance

        // Find the column for this columnId
        const column = leafColumns.find(d => d.id === columnId)

        if (!column) {
          return []
        }

        const { sortDescFirst } = column

        // Find any existing sorting for this column
        const existingSorting = old?.find(d => d.id === columnId)
        const existingIndex = old?.findIndex(d => d.id === columnId)
        const hasDescDefined = typeof desc !== 'undefined' && desc !== null

        let newSorting: SortObj[] = []

        // What should we do with this sort action?
        let sortAction

        if (!disableMultiSort && multi) {
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

        // Handle toggle states that will remove the sorting
        if (
          sortAction === 'toggle' && // Must be toggling
          !disableSortRemove && // If disableSortRemove, disable in general
          !hasDescDefined && // Must not be setting desc
          (multi ? !disableMultiRemove : true) && // If multi, don't allow if disableMultiRemove
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
              desc: hasDescDefined ? desc : sortDescFirst,
            },
          ]
        } else if (sortAction === 'add' && old?.length) {
          newSorting = [
            ...old,
            {
              id: columnId,
              desc: hasDescDefined ? desc : sortDescFirst,
            },
          ]
          // Take latest n columns
          newSorting.splice(0, newSorting.length - maxMultiSortColCount)
        } else if (sortAction === 'toggle' && old?.length) {
          // This flips (or sets) the
          newSorting = old.map(d => {
            if (d.id === columnId) {
              return {
                ...d,
                desc: hasDescDefined ? desc : !existingSorting?.desc,
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
    [instance]
  )

  instance.resetSorting = React.useCallback(
    () => instance.setSorting(instance.options.initialState?.sorting ?? []),
    [instance]
  )

  instance.getColumnCanSort = React.useCallback(
    columnId => {
      const column = instance.leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return (
        getFirstDefined(
          instance.options.disableSorting ? false : undefined,
          column.disableSorting ? false : undefined,
          column.defaultCanSort,
          !!column.accessor
        ) ?? false
      )
    },
    [instance]
  )

  instance.getColumnSortedIndex = React.useCallback(
    columnId => instance.state.sorting.findIndex(d => d.id === columnId),
    [instance]
  )

  instance.getColumnIsSorted = React.useCallback(
    columnId => instance.getColumnSortedIndex(columnId) > -1,
    [instance]
  )

  instance.getColumnIsSortedDesc = React.useCallback(
    columnId =>
      instance.state.sorting.find(d => d.id === columnId)?.desc ?? false,
    [instance]
  )

  instance.clearColumnSorting = React.useCallback(
    columnId => instance.setSorting(old => old.filter(d => d.id !== columnId)),
    [instance]
  )

  return instance
}

const useInstanceAfterDataModel: UseInstanceAfterDataModel = instance => {
  const {
    options: { manualSorting },
    state: { sorting },
    rows,
    flatRows,
    leafColumns,
  } = instance

  const [sortedRows, sortedFlatRows] = React.useMemo(() => {
    if (manualSorting || !sorting.length) {
      return [rows, flatRows]
    }

    if (process.env.NODE_ENV !== 'production' && instance.options.debug)
      console.info('Sorting...')

    const sortedFlatRows: Row[] = []

    // Filter out sortings that correspond to non existing columns
    const availableSorting = sorting.filter(sort =>
      leafColumns.find(col => col.id === sort.id)
    )

    const sortData = (rows: Row[]) => {
      // This will also perform a stable sorting using the row index
      // if needed.
      const sortedData = orderBy(
        rows,
        availableSorting.map(sort => {
          // Support custom sorting methods for each column
          const column = leafColumns.find(d => d.id === sort.id)

          if (!column) {
            throw new Error(
              process.env.NODE_ENV !== 'production'
                ? `React-Table: Could not find a column with id: ${sort.id} while sorting`
                : ''
            )
          }

          const { sortType } = column

          const sortFn: SortFn =
            isFunction(sortType) ||
            (instance.options.sortTypes || {})[sortType as string] ||
            sortTypes[sortType as string]

          if (!sortFn) {
            throw new Error(
              process.env.NODE_ENV !== 'production'
                ? `React-Table: Could not find a valid sortType of '${sortType}' for column '${sort.id}'.`
                : ''
            )
          }

          const isDesc = sort?.desc ?? false

          // Return the correct sortFn.
          // This function should always return in ascending order
          return (a, b) =>
            sortFn(a, b, sort.id, column?.sortInverted ? !isDesc : isDesc)
        })
      )

      // If there are sub-rows, sort them
      sortedData.forEach(row => {
        sortedFlatRows.push(row)
        if (!row.subRows || row.subRows.length <= 1) {
          return
        }
        row.subRows = sortData(row.subRows)
      })

      return sortedData
    }

    return [sortData(rows), sortedFlatRows]
  }, [manualSorting, sorting, rows, flatRows, leafColumns, instance])

  Object.assign(instance, {
    preSortedRows: rows,
    preSortedFlatRows: flatRows,
    sortedRows,
    sortedFlatRows,
    rows: sortedRows,
    flatRows: sortedFlatRows,
  })

  return instance
}

const decorateColumn: DecorateColumn = (column, { instance }) => {
  column.getCanSort = () => instance.getColumnCanSort(column.id)
  column.getSortedIndex = () => instance.getColumnSortedIndex(column.id)
  column.getIsSorted = () => instance.getColumnIsSorted(column.id)
  column.toggleSorting = (desc, multi) =>
    instance.toggleColumnSorting(column.id, desc, multi)
  column.clearSorting = () => instance.clearColumnSorting(column.id)
  column.getIsSortedDesc = () => instance.getColumnIsSortedDesc(column.id)
  column.getToggleSortingProps = ({ isMulti, ...props } = {}) => {
    const canSort = column.getCanSort?.()

    return {
      onClick: canSort
        ? (e: { persist?: any }) => {
            e.persist()
            column.toggleSorting?.(
              undefined,
              !instance.options.disableMultiSort &&
                (isMulti || instance.options.isMultiSortEvent?.(e))
            )
          }
        : undefined,
      title: canSort ? 'Toggle Sorting' : undefined,
      ...props,
    }
  }

  return column
}

export const withSorting = {
  name,
  after: [
    withColumnVisibility,
    withColumnFilters,
    withGlobalFilter,
    withGrouping,
  ],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    useInstanceAfterDataModel,
    decorateColumn,
  },
}

import React from 'react'

import {
  useGetLatest,
  getFirstDefined,
  functionalUpdate,
  isFunction,
  orderBy,
  useMountedLayoutEffect,
} from '../utils'

import {
  withSorting as name,
  withColumnVisibility,
  withColumnFilters,
  withGlobalFilter,
  withGrouping,
} from '../Constants'

import * as sortTypes from '../sortTypes'

export const withSorting = {
  name,
  after: [
    withColumnVisibility,
    withColumnFilters,
    withGlobalFilter,
    withGrouping,
  ],
  useReduceOptions,
  useInstanceAfterState,
  useInstanceAfterDataModel,
  decorateColumn,
}

function useReduceOptions(options) {
  return {
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

function useInstanceAfterState(instance) {
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  const sortingResetDeps = [
    instance.options.manualSorting ? null : instance.options.data,
  ]
  React.useMemo(() => {
    if (getInstance().options.autoResetSorting) {
      getInstance().state.sorting = getInstance().getInitialState().sorting
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, sortingResetDeps)

  useMountedLayoutEffect(() => {
    if (getInstance().options.autoResetSorting) {
      instance.resetSorting()
    }
  }, sortingResetDeps)

  instance.toggleColumnSorting = React.useCallback(
    (columnId, desc, multi) =>
      setState(
        old => {
          const {
            leafColumns,
            disableMultiSort,
            disableSortRemove,
            disableMultiRemove,
            maxMultiSortColCount = Number.MAX_SAFE_INTEGER,
          } = getInstance()

          const { sorting } = old

          // Find the column for this columnId
          const column = leafColumns.find(d => d.id === columnId)
          const { sortDescFirst } = column

          // Find any existing sorting for this column
          const existingSorting = sorting.find(d => d.id === columnId)
          const existingIndex = sorting.findIndex(d => d.id === columnId)
          const hasDescDefined = typeof desc !== 'undefined' && desc !== null

          let newSorting = []

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
            if (existingIndex !== sorting.length - 1) {
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
            ((existingSorting && // Finally, detect if it should indeed be removed
              existingSorting.desc &&
              !sortDescFirst) ||
              (!existingSorting.desc && sortDescFirst))
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
          } else if (sortAction === 'add') {
            newSorting = [
              ...sorting,
              {
                id: columnId,
                desc: hasDescDefined ? desc : sortDescFirst,
              },
            ]
            // Take latest n columns
            newSorting.splice(0, newSorting.length - maxMultiSortColCount)
          } else if (sortAction === 'toggle') {
            // This flips (or sets) the
            newSorting = sorting.map(d => {
              if (d.id === columnId) {
                return {
                  ...d,
                  desc: hasDescDefined ? desc : !existingSorting.desc,
                }
              }
              return d
            })
          } else if (sortAction === 'remove') {
            newSorting = sorting.filter(d => d.id !== columnId)
          }

          return {
            ...old,
            sorting: newSorting,
          }
        },
        {
          type: 'toggleColumnSorting',
          columnId,
          desc,
          multi,
        }
      ),
    [getInstance, setState]
  )

  instance.setSorting = React.useCallback(
    updater =>
      setState(
        old => {
          return {
            ...old,
            sorting: functionalUpdate(updater, old.sorting),
          }
        },
        {
          type: 'setSorting',
        }
      ),
    [setState]
  )

  instance.resetSorting = React.useCallback(
    () =>
      setState(
        old => {
          return {
            ...old,
            sorting: getInstance().getInitialState().sorting,
          }
        },
        {
          type: 'resetSorting',
        }
      ),
    [getInstance, setState]
  )

  instance.getColumnCanSort = React.useCallback(
    columnId => {
      const column = getInstance().leafColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        getInstance().options.disableSorting ? false : undefined,
        column.disableSorting ? false : undefined,
        column.defaultCanSort,
        !!column.accessor
      )
    },
    [getInstance]
  )

  instance.getColumnSortedIndex = React.useCallback(
    columnId => getInstance().state.sorting.findIndex(d => d.id === columnId),
    [getInstance]
  )

  instance.getColumnIsSorted = React.useCallback(
    columnId => getInstance().getColumnSortedIndex(columnId) > -1,
    [getInstance]
  )

  instance.getColumnIsSortedDesc = React.useCallback(
    columnId => getInstance().state.sorting.find(d => d.id === columnId)?.desc,
    [getInstance]
  )

  instance.clearColumnSorting = React.useCallback(
    columnId =>
      setState(
        old => {
          const { sorting } = old
          const newSorting = sorting.filter(d => d.id !== columnId)

          return {
            ...old,
            sorting: newSorting,
          }
        },
        {
          type: 'clearColumnSorting',
          columnId,
        }
      ),
    [setState]
  )
}

function useInstanceAfterDataModel(instance) {
  const {
    options: { manualSorting },
    state: { sorting },
    rows,
    flatRows,
    leafColumns,
  } = instance

  const getInstance = useGetLatest(instance)

  const [sortedRows, sortedFlatRows] = React.useMemo(() => {
    if (manualSorting || !sorting.length) {
      return [rows, flatRows]
    }

    if (process.env.NODE_ENV !== 'production' && getInstance().options.debug)
      console.info('Sorting...')

    const sortedFlatRows = []

    // Filter out sortings that correspond to non existing columns
    const availableSorting = sorting.filter(sort =>
      leafColumns.find(col => col.id === sort.id)
    )

    const sortData = rows => {
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

          const sortMethod =
            isFunction(sortType) ||
            (getInstance().options.sortTypes || {})[sortType] ||
            sortTypes[sortType]

          if (!sortMethod) {
            throw new Error(
              process.env.NODE_ENV !== 'production'
                ? `React-Table: Could not find a valid sortType of '${sortType}' for column '${sort.id}'.`
                : ''
            )
          }

          // Return the correct sortFn.
          // This function should always return in ascending order
          return (a, b) => sortMethod(a, b, sort.id, sort.desc)
        }),
        // Map the directions
        availableSorting.map(sort => {
          // Detect and use the sortInverted option
          const column = leafColumns.find(d => d.id === sort.id)

          if (column && column.sortInverted) {
            return sort.desc
          }

          return !sort.desc
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
  }, [manualSorting, sorting, rows, flatRows, leafColumns, getInstance])

  Object.assign(instance, {
    preSortedRows: rows,
    preSortedFlatRows: flatRows,
    sortedRows,
    sortedFlatRows,
    rows: sortedRows,
    flatRows: sortedFlatRows,
  })
}

function decorateColumn(column, { getInstance }) {
  column.getCanSort = () => getInstance().getColumnCanSort(column.id)
  column.getSortedIndex = () => getInstance().getColumnSortedIndex(column.id)
  column.getIsSorted = () => getInstance().getColumnIsSorted(column.id)
  column.toggleSorting = (desc, multi) =>
    getInstance().toggleColumnSorting(column.id, desc, multi)
  column.clearSorting = () => getInstance().clearColumnSorting(column.id)
  column.getIsSortedDesc = () => getInstance().getColumnIsSortedDesc(column.id)

  column.getToggleSortingProps = ({ isMulti, ...props } = {}) => {
    const canSort = column.getCanSort()

    return {
      onClick: canSort
        ? e => {
            e.persist()
            column.toggleSorting(
              undefined,
              !getInstance().options.disableMultiSort &&
                (isMulti || getInstance().options.isMultiSortEvent(e))
            )
          }
        : undefined,
      title: canSort ? 'Toggle Sorting' : undefined,
      ...props,
    }
  }
}

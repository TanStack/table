import React from 'react'

import {
  actions,
  ensurePluginOrder,
  defaultColumn,
  makePropGetter,
  useConsumeHookGetter,
  getFirstDefined,
  defaultOrderByFn,
  isFunction,
  useGetLatest,
  useMountedLayoutEffect,
} from '../utils'

import * as sortTypes from '../sortTypes'

// Actions
actions.resetSortBy = 'resetSortBy'
actions.toggleSortBy = 'toggleSortBy'
actions.clearSortBy = 'clearSortBy'

defaultColumn.sortType = 'alphanumeric'
defaultColumn.sortDescFirst = false

export const useSortBy = hooks => {
  hooks.getSortByToggleProps = [defaultGetSortByToggleProps]
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useSortBy.pluginName = 'useSortBy'

const defaultGetSortByToggleProps = (props, { instance, column }) => {
  const { isMultiSortEvent = e => e.shiftKey } = instance

  return [
    props,
    {
      onClick: column.canSort
        ? e => {
            e.persist()
            column.toggleSortBy(
              undefined,
              !instance.disableMultiSort && isMultiSortEvent(e)
            )
          }
        : undefined,
      style: {
        cursor: column.canSort ? 'pointer' : undefined,
      },
      title: column.canSort ? 'Toggle SortBy' : undefined,
    },
  ]
}

// Reducer
function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      sortBy: [],
      ...state,
    }
  }

  if (action.type === actions.resetSortBy) {
    return {
      ...state,
      sortBy: instance.initialState.sortBy || [],
    }
  }

  if (action.type === actions.clearSortBy) {
    const { sortBy } = state
    const newSortBy = sortBy.filter(d => d.id !== action.columnId)

    return {
      ...state,
      sortBy: newSortBy,
    }
  }

  if (action.type === actions.toggleSortBy) {
    const { columnId, desc, multi } = action

    const {
      flatColumns,
      disableMultiSort,
      disableSortRemove,
      disableMultiRemove,
      maxMultiSortColCount = Number.MAX_SAFE_INTEGER,
    } = instance

    const { sortBy } = state

    // Find the column for this columnId
    const column = flatColumns.find(d => d.id === columnId)
    const { sortDescFirst } = column

    // Find any existing sortBy for this column
    const existingSortBy = sortBy.find(d => d.id === columnId)
    const existingIndex = sortBy.findIndex(d => d.id === columnId)
    const hasDescDefined = typeof desc !== 'undefined' && desc !== null

    let newSortBy = []

    // What should we do with this sort action?
    let sortAction

    if (!disableMultiSort && multi) {
      if (existingSortBy) {
        sortAction = 'toggle'
      } else {
        sortAction = 'add'
      }
    } else {
      // Normal mode
      if (existingIndex !== sortBy.length - 1) {
        sortAction = 'replace'
      } else if (existingSortBy) {
        sortAction = 'toggle'
      } else {
        sortAction = 'replace'
      }
    }

    // Handle toggle states that will remove the sortBy
    if (
      sortAction === 'toggle' && // Must be toggling
      !disableSortRemove && // If disableSortRemove, disable in general
      !hasDescDefined && // Must not be setting desc
      (multi ? !disableMultiRemove : true) && // If multi, don't allow if disableMultiRemove
      ((existingSortBy && // Finally, detect if it should indeed be removed
        existingSortBy.desc &&
        !sortDescFirst) ||
        (!existingSortBy.desc && sortDescFirst))
    ) {
      sortAction = 'remove'
    }

    if (sortAction === 'replace') {
      newSortBy = [
        {
          id: columnId,
          desc: hasDescDefined ? desc : sortDescFirst,
        },
      ]
    } else if (sortAction === 'add') {
      newSortBy = [
        ...sortBy,
        {
          id: columnId,
          desc: hasDescDefined ? desc : sortDescFirst,
        },
      ]
      // Take latest n columns
      newSortBy.splice(0, newSortBy.length - maxMultiSortColCount)
    } else if (sortAction === 'toggle') {
      // This flips (or sets) the
      newSortBy = sortBy.map(d => {
        if (d.id === columnId) {
          return {
            ...d,
            desc: hasDescDefined ? desc : !existingSortBy.desc,
          }
        }
        return d
      })
    } else if (sortAction === 'remove') {
      newSortBy = sortBy.filter(d => d.id !== columnId)
    }

    return {
      ...state,
      sortBy: newSortBy,
    }
  }
}

function useInstance(instance) {
  const {
    data,
    rows,
    flatColumns,
    orderByFn = defaultOrderByFn,
    sortTypes: userSortTypes,
    manualSortBy,
    defaultCanSort,
    disableSortBy,
    flatHeaders,
    state: { sortBy },
    dispatch,
    plugins,
    autoResetSortBy = true,
  } = instance

  ensurePluginOrder(plugins, ['useFilters'], 'useSortBy', [])

  // Updates sorting based on a columnId, desc flag and multi flag
  const toggleSortBy = (columnId, desc, multi) => {
    dispatch({ type: actions.toggleSortBy, columnId, desc, multi })
  }

  // use reference to avoid memory leak in #1608
  const getInstance = useGetLatest(instance)

  const getSortByTogglePropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getSortByToggleProps'
  )

  // Add the getSortByToggleProps method to columns and headers
  flatHeaders.forEach(column => {
    const {
      accessor,
      canSort: defaultColumnCanSort,
      disableSortBy: columnDisableSortBy,
      id,
    } = column

    const canSort = accessor
      ? getFirstDefined(
          columnDisableSortBy === true ? false : undefined,
          disableSortBy === true ? false : undefined,
          true
        )
      : getFirstDefined(defaultCanSort, defaultColumnCanSort, false)

    column.canSort = canSort

    if (column.canSort) {
      column.toggleSortBy = (desc, multi) =>
        toggleSortBy(column.id, desc, multi)

      column.clearSortBy = () => {
        dispatch({ type: actions.clearSortBy, columnId: column.id })
      }
    }

    column.getSortByToggleProps = makePropGetter(getSortByTogglePropsHooks(), {
      instance: getInstance(),
      column,
    })

    const columnSort = sortBy.find(d => d.id === id)
    column.isSorted = !!columnSort
    column.sortedIndex = sortBy.findIndex(d => d.id === id)
    column.isSortedDesc = column.isSorted ? columnSort.desc : undefined
  })

  const sortedRows = React.useMemo(() => {
    if (manualSortBy || !sortBy.length) {
      return rows
    }

    // Filter out sortBys that correspond to non existing columns
    const availableSortBy = sortBy.filter(sort =>
      flatColumns.find(col => col.id === sort.id)
    )

    const sortData = rows => {
      // Use the orderByFn to compose multiple sortBy's together.
      // This will also perform a stable sorting using the row index
      // if needed.
      const sortedData = orderByFn(
        rows,
        availableSortBy.map(sort => {
          // Support custom sorting methods for each column
          const column = flatColumns.find(d => d.id === sort.id)

          if (!column) {
            throw new Error(
              `React-Table: Could not find a column with id: ${sort.id} while sorting`
            )
          }

          const { sortType } = column

          // Look up sortBy functions in this order:
          // column function
          // column string lookup on user sortType
          // column string lookup on built-in sortType
          // default function
          // default string lookup on user sortType
          // default string lookup on built-in sortType
          const sortMethod =
            isFunction(sortType) ||
            (userSortTypes || {})[sortType] ||
            sortTypes[sortType]

          if (!sortMethod) {
            throw new Error(
              `React-Table: Could not find a valid sortType of '${sortType}' for column '${sort.id}'.`
            )
          }

          // Return the correct sortFn.
          // This function should always return in ascending order
          return (a, b) => sortMethod(a, b, sort.id)
        }),
        // Map the directions
        availableSortBy.map(sort => {
          // Detect and use the sortInverted option
          const column = flatColumns.find(d => d.id === sort.id)

          if (column && column.sortInverted) {
            return sort.desc
          }

          return !sort.desc
        })
      )

      // If there are sub-rows, sort them
      sortedData.forEach(row => {
        if (!row.subRows || row.subRows.length <= 1) {
          return
        }
        row.subRows = sortData(row.subRows)
      })

      return sortedData
    }

    return sortData(rows)
  }, [manualSortBy, sortBy, rows, flatColumns, orderByFn, userSortTypes])

  const getAutoResetSortBy = useGetLatest(autoResetSortBy)

  useMountedLayoutEffect(() => {
    if (getAutoResetSortBy()) {
      dispatch({ type: actions.resetSortBy })
    }
  }, [manualSortBy ? null : data])

  Object.assign(instance, {
    preSortedRows: rows,
    sortedRows,
    rows: sortedRows,
    toggleSortBy,
  })
}

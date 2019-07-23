import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'
import * as sortTypes from '../sortTypes'
import {
  mergeProps,
  applyPropHooks,
  getFirstDefined,
  defaultOrderByFn,
  isFunction,
} from '../utils'

defaultState.sortBy = []

addActions('sortByChange')

const propTypes = {
  // General
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      sortBy: PropTypes.func,
      defaultSortDesc: PropTypes.bool,
    })
  ),
  orderByFn: PropTypes.func,
  sortTypes: PropTypes.object,
  defaultSortType: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  manualSorting: PropTypes.bool,
  disableSorting: PropTypes.bool,
  defaultSortDesc: PropTypes.bool,
  disableMultiSort: PropTypes.bool,
  disableSortRemove: PropTypes.bool,
  disableMultiRemove: PropTypes.bool,
}

export const useSortBy = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useSortBy')

  const {
    debug,
    rows,
    columns,
    orderByFn = defaultOrderByFn,
    defaultSort = 'alphanumeric',
    sortTypes: userSortTypes = {},
    manualSorting,
    disableSorting,
    defaultSortDesc,
    disableSortRemove,
    disableMultiRemove,
    disableMultiSort,
    hooks,
    state: [{ sortBy }, setState],
  } = props

  columns.forEach(column => {
    const { accessor, canSortBy } = column
    column.canSortBy = accessor
      ? getFirstDefined(
          canSortBy,
          disableSorting === true ? false : undefined,
          true
        )
      : false
  })

  // Updates sorting based on a columnID, desc flag and multi flag
  const toggleSortByID = (columnID, desc, multi) => {
    return setState(old => {
      const { sortBy } = old

      // Find the column for this columnID
      const column = columns.find(d => d.id === columnID)
      const resolvedDefaultSortDesc = getFirstDefined(
        column.defaultSortDesc,
        defaultSortDesc
      )

      // Find any existing sortBy for this column
      const existingSortBy = sortBy.find(d => d.id === columnID)
      const existingIndex = sortBy.findIndex(d => d.id == columnID)
      const hasDescDefined = typeof desc !== 'undefined' && desc !== null

      let newSortBy = []

      // What should we do with this sort action?
      let action

      if (!disableMultiSort && multi) {
        if (existingSortBy) {
          action = 'toggle'
        } else {
          action = 'add'
        }
      } else {
        // Normal mode
        if (existingIndex !== sortBy.length - 1) {
          action = 'replace'
        } else if (existingSortBy) {
          action = 'toggle'
        } else {
          action = 'replace'
        }
      }

      // Handle toggle states that will remove the sortBy
      if (
        action === 'toggle' && // Must be toggling
        !disableSortRemove && // If disableSortRemove, disable in general
        !hasDescDefined && // Must not be setting desc
        (multi ? !disableMultiRemove : true) && // If multi, don't allow if disableMultiRemove
        ((existingSortBy && // Finally, detect if it should indeed be removed
          (existingSortBy.desc && !resolvedDefaultSortDesc)) ||
          (!existingSortBy.desc && resolvedDefaultSortDesc))
      ) {
        action = 'remove'
      }

      if (action === 'replace') {
        newSortBy = [
          {
            id: columnID,
            desc: hasDescDefined ? desc : resolvedDefaultSortDesc,
          },
        ]
      } else if (action === 'add') {
        newSortBy = [
          ...sortBy,
          {
            id: columnID,
            desc: hasDescDefined ? desc : resolvedDefaultSortDesc,
          },
        ]
      } else if (action === 'toggle') {
        // This flips (or sets) the
        newSortBy = sortBy.map(d => {
          if (d.id === columnID) {
            return {
              ...d,
              desc: hasDescDefined ? desc : !existingSortBy.desc,
            }
          }
          return d
        })
      } else if (action === 'remove') {
        newSortBy = sortBy.filter(d => d.id !== columnID)
      }

      return {
        ...old,
        sortBy: newSortBy,
      }
    }, actions.sortByChange)
  }

  hooks.columns.push(columns => {
    columns.forEach(column => {
      if (column.canSortBy) {
        column.toggleSortBy = (desc, multi) =>
          toggleSortByID(column.id, desc, multi)
      }
    })
    return columns
  })

  hooks.getSortByToggleProps = []

  const addSortByToggleProps = (columns, api) => {
    columns.forEach(column => {
      const { canSortBy } = column
      column.getSortByToggleProps = props => {
        return mergeProps(
          {
            onClick: canSortBy
              ? e => {
                  e.persist()
                  column.toggleSortBy(
                    undefined,
                    !api.disableMultiSort && e.shiftKey
                  )
                }
              : undefined,
            style: {
              cursor: canSortBy ? 'pointer' : undefined,
            },
            title: 'Toggle SortBy',
          },
          applyPropHooks(api.hooks.getSortByToggleProps, column, api),
          props
        )
      }
    })
    return columns
  }

  hooks.columns.push(addSortByToggleProps)
  hooks.headers.push(addSortByToggleProps)

  // Mutate columns to reflect sorting state
  columns.forEach(column => {
    const { id } = column
    column.sorted = sortBy.find(d => d.id === id)
    column.sortedIndex = sortBy.findIndex(d => d.id === id)
    column.sortedDesc = column.sorted ? column.sorted.desc : undefined
  })

  const sortedRows = useMemo(() => {
    if (manualSorting || !sortBy.length) {
      return rows
    }
    if (debug) console.info('getSortedRows')

    const sortTypesByColumnID = {}

    columns.forEach(col => {
      sortTypesByColumnID[col.id] = col.sortBy
    })

    const sortData = rows => {
      // Use the orderByFn to compose multiple sortBy's together.
      // This will also perform a stable sorting using the row index
      // if needed.
      const sortedData = orderByFn(
        rows,
        sortBy.map(sort => {
          // Support custom sorting methods for each column
          const columnSort = sortTypesByColumnID[sort.id]

          // Look up sortBy functions in this order:
          // column function
          // column string lookup on user sortType
          // column string lookup on built-in sortType
          // default function
          // default string lookup on user sortType
          // default string lookup on built-in sortType
          const sortMethod =
            isFunction(columnSort) ||
            userSortTypes[columnSort] ||
            sortTypes[columnSort] ||
            isFunction(defaultSort) ||
            userSortTypes[defaultSort] ||
            sortTypes[defaultSort]

          // Return the correct sortFn
          return (a, b) =>
            sortMethod(a.values[sort.id], b.values[sort.id], sort.desc)
        }),
        // Map the directions
        sortBy.map(d => !d.desc)
      )

      // If there are sub-rows, sort them
      sortedData.forEach(row => {
        if (!row.subRows) {
          return
        }
        row.subRows = sortData(row.subRows)
      })

      return sortedData
    }

    return sortData(rows)
  }, [
    manualSorting,
    sortBy,
    debug,
    columns,
    rows,
    orderByFn,
    userSortTypes,
    defaultSort,
  ])

  return {
    ...props,
    rows: sortedRows,
  }
}

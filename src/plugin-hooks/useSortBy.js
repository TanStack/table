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
      sortType: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      sortDescFirst: PropTypes.bool,
      disableSorting: PropTypes.bool,
    })
  ),
  orderByFn: PropTypes.func,
  sortTypes: PropTypes.object,
  manualSorting: PropTypes.bool,
  disableSorting: PropTypes.bool,
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
    sortTypes: userSortTypes,
    manualSorting,
    disableSorting,
    disableSortRemove,
    disableMultiRemove,
    disableMultiSort,
    hooks,
    state: [{ sortBy }, setState],
    plugins,
  } = props

  // If useSortBy should probably come after useFilters for
  // the best performance, so let's hint to the user about that...
  const pluginIndex = plugins.indexOf(useSortBy)

  const useFiltersIndex = plugins.findIndex(
    plugin => plugin.name === 'useFilters'
  )

  if (useFiltersIndex > pluginIndex) {
    console.warn(
      'React Table: useSortBy should be placed before useFilters in your plugin list for better performance!'
    )
  }

  columns.forEach(column => {
    const { accessor, disableSorting: columnDisableSorting } = column
    column.canSortBy = accessor
      ? getFirstDefined(
          columnDisableSorting,
          disableSorting === true ? false : undefined,
          true
        )
      : false
  })

  // Updates sorting based on a columnID, desc flag and multi flag
  const toggleSortBy = (columnID, desc, multi) => {
    return setState(old => {
      const { sortBy } = old

      // Find the column for this columnID
      const column = columns.find(d => d.id === columnID)
      const { sortDescFirst } = column

      // Find any existing sortBy for this column
      const existingSortBy = sortBy.find(d => d.id === columnID)
      const existingIndex = sortBy.findIndex(d => d.id === columnID)
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
          (existingSortBy.desc && !sortDescFirst)) ||
          (!existingSortBy.desc && sortDescFirst))
      ) {
        action = 'remove'
      }

      if (action === 'replace') {
        newSortBy = [
          {
            id: columnID,
            desc: hasDescDefined ? desc : sortDescFirst,
          },
        ]
      } else if (action === 'add') {
        newSortBy = [
          ...sortBy,
          {
            id: columnID,
            desc: hasDescDefined ? desc : sortDescFirst,
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
          toggleSortBy(column.id, desc, multi)
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

  const sortedRows = useMemo(
    () => {
      if (manualSorting || !sortBy.length) {
        return rows
      }
      if (debug) console.info('getSortedRows')

      const sortData = rows => {
        // Use the orderByFn to compose multiple sortBy's together.
        // This will also perform a stable sorting using the row index
        // if needed.
        const sortedData = orderByFn(
          rows,
          sortBy.map(sort => {
            // Support custom sorting methods for each column
            const { sortType } = columns.find(d => d.id === sort.id)

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
              sortTypes[sortType] ||
              sortTypes.alphanumeric

            // Return the correct sortFn
            return (a, b) =>
              sortMethod(a.values[sort.id], b.values[sort.id], sort.desc)
          }),
          // Map the directions
          sortBy.map(sort => {
            // Detect and use the sortInverted option
            const { sortInverted } = columns.find(d => d.id === sort.id)

            if (sortInverted) {
              return sort.desc
            }

            return !sort.desc
          })
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
    },
    [manualSorting, sortBy, debug, columns, rows, orderByFn, userSortTypes]
  )

  return {
    ...props,
    toggleSortBy,
    rows: sortedRows,
    preSortedRows: rows,
  }
}

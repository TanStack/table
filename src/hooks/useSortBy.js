import { useMemo } from 'react'
import PropTypes from 'prop-types'

import { addActions, actions } from '../actions'
import { defaultState } from './useTableState'
import {
  mergeProps,
  applyPropHooks,
  getFirstDefined,
  defaultOrderByFn,
  defaultSortByFn,
} from '../utils'

defaultState.sortBy = []

addActions({
  sortByChange: '__sortByChange__',
})

const propTypes = {
  // General
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      sortByFn: PropTypes.func,
      defaultSortDesc: PropTypes.bool,
    })
  ),
  sortByFn: PropTypes.func,
  manualSorting: PropTypes.bool,
  disableSorting: PropTypes.bool,
  defaultSortDesc: PropTypes.bool,
  disableMultiSort: PropTypes.bool,
  disableSortRemove: PropTypes.bool,
}

export const useSortBy = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useSortBy')

  const {
    debug,
    rows,
    columns,
    orderByFn = defaultOrderByFn,
    sortByFn = defaultSortByFn,
    manualSorting,
    disableSorting,
    defaultSortDesc,
    disableSortRemove,
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
      const hasDescDefined = typeof desc !== 'undefined' && desc !== null

      let newSortBy = []

      // What should we do with this filter?
      let action

      if (!multi) {
        if (sortBy.length <= 1 && existingSortBy) {
          if (
            (existingSortBy.desc && !resolvedDefaultSortDesc) ||
            (!existingSortBy.desc && resolvedDefaultSortDesc)
          ) {
            action = disableSortRemove ? 'toggle' : 'remove'
          } else {
            action = 'toggle'
          }
        } else {
          action = 'replace'
        }
      } else {
        if (!existingSortBy) {
          action = 'add'
        } else {
          if (hasDescDefined) {
            action = 'set'
          } else {
            action = 'toggle'
          }
        }
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
      } else if (action === 'set') {
        newSortBy = sortBy.map(d => {
          if (d.id === columnID) {
            return {
              ...d,
              desc,
            }
          }
          return d
        })
      } else if (action === 'toggle') {
        newSortBy = sortBy.map(d => {
          if (d.id === columnID) {
            return {
              ...d,
              desc: !existingSortBy.desc,
            }
          }
          return d
        })
      } else if (action === 'remove') {
        newSortBy = []
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

    const sortMethodsByColumnID = {}

    columns
      .filter(col => col.sortMethod)
      .forEach(col => {
        sortMethodsByColumnID[col.id] = col.sortMethod
      })

    const sortData = rows => {
      // Use the orderByFn to compose multiple sortBy's together.
      // This will also perform a stable sorting using the row index
      // if needed.
      const sortedData = orderByFn(
        rows,
        sortBy.map(sort => {
          // Support custom sorting methods for each column
          const columnSortBy = sortMethodsByColumnID[sort.id]

          // Return the correct sortFn
          return (a, b) =>
            (columnSortBy || sortByFn)(
              a.values[sort.id],
              b.values[sort.id],
              sort.desc
            )
        }),
        // Map the directions
        sortBy.map(d => !d.desc)
      )

      // TODO: this should be optimized. Not good to loop again
      sortedData.forEach(row => {
        if (!row.subRows) {
          return
        }
        row.subRows = sortData(row.subRows)
      })

      return sortedData
    }

    return sortData(rows)
  }, [manualSorting, sortBy, debug, columns, rows, orderByFn, sortByFn])

  return {
    ...props,
    rows: sortedRows,
  }
}

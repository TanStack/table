import React from 'react'

import * as aggregations from '../aggregations'
import { actions, reducerHandlers } from '../hooks/useTable'
import {
  mergeProps,
  applyPropHooks,
  defaultGroupByFn,
  getFirstDefined,
  ensurePluginOrder,
} from '../utils'

const pluginName = 'useGroupBy'

// Actions
actions.resetGroupBy = 'resetGroupBy'
actions.toggleGroupBy = 'toggleGroupBy'

// Reducer
reducerHandlers[pluginName] = (state, action) => {
  if (action.type === actions.init) {
    return {
      groupBy: [],
      ...state,
    }
  }

  if (action.type === actions.resetGroupBy) {
    return {
      ...state,
      groupBy: [],
    }
  }

  if (action.type === actions.toggleGroupBy) {
    const { columnId, toggle } = action

    const resolvedToggle =
      typeof toggle !== 'undefined' ? toggle : !state.groupBy.includes(columnId)

    if (resolvedToggle) {
      return {
        ...state,
        groupBy: [...state.groupBy, columnId],
      }
    }

    return {
      ...state,
      groupBy: state.groupBy.filter(d => d !== columnId),
    }
  }
}

export const useGroupBy = hooks => {
  hooks.columnsBeforeHeaderGroups.push(columnsBeforeHeaderGroups)
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => {
    deps.push(instance.state.groupBy)
    return deps
  })
  hooks.useMain.push(useMain)
}

useGroupBy.pluginName = pluginName

function columnsBeforeHeaderGroups(flatColumns, { state: { groupBy } }) {
  // Sort grouped columns to the start of the column list
  // before the headers are built

  const groupByColumns = groupBy.map(g => flatColumns.find(col => col.id === g))
  const nonGroupByColumns = flatColumns.filter(col => !groupBy.includes(col.id))

  // If a groupByBoundary column is found, place the groupBy's after it
  const groupByBoundaryColumnIndex =
    flatColumns.findIndex(column => column.groupByBoundary) + 1

  return [
    ...nonGroupByColumns.slice(0, groupByBoundaryColumnIndex),
    ...groupByColumns,
    ...nonGroupByColumns.slice(groupByBoundaryColumnIndex),
  ]
}

const defaultUserAggregations = {}

function useMain(instance) {
  const {
    debug,
    rows,
    flatRows,
    flatColumns,
    flatHeaders,
    groupByFn = defaultGroupByFn,
    manualGroupBy,
    defaultCanGroupBy,
    disableGroupBy,
    aggregations: userAggregations = defaultUserAggregations,
    hooks,
    plugins,
    state: { groupBy },
    dispatch,
  } = instance

  ensurePluginOrder(plugins, [], 'useGroupBy', ['useSortBy', 'useExpanded'])

  flatColumns.forEach(column => {
    const {
      id,
      accessor,
      defaultGroupBy: defaultColumnGroupBy,
      disableGroupBy: columnDisableGroupBy,
    } = column
    column.isGrouped = groupBy.includes(id)
    column.groupedIndex = groupBy.indexOf(id)

    column.canGroupBy = accessor
      ? getFirstDefined(
          columnDisableGroupBy === true ? false : undefined,
          disableGroupBy === true ? false : undefined,
          true
        )
      : getFirstDefined(defaultColumnGroupBy, defaultCanGroupBy, false)

    if (column.canGroupBy) {
      column.toggleGroupBy = () => toggleGroupBy(column.id)
    }

    column.Aggregated = column.Aggregated || column.Cell
  })

  const toggleGroupBy = (columnId, toggle) => {
    dispatch({ type: actions.toggleGroupBy, columnId, toggle })
  }

  hooks.getGroupByToggleProps = []

  // use reference to avoid memory leak in #1608
  const instanceRef = React.useRef()
  instanceRef.current = instance

  flatHeaders.forEach(header => {
    const { canGroupBy } = header
    header.getGroupByToggleProps = props => {
      return mergeProps(
        {
          onClick: canGroupBy
            ? e => {
                e.persist()
                header.toggleGroupBy()
              }
            : undefined,
          style: {
            cursor: canGroupBy ? 'pointer' : undefined,
          },
          title: 'Toggle GroupBy',
        },
        applyPropHooks(
          instanceRef.current.hooks.getGroupByToggleProps,
          header,
          instanceRef.current
        ),
        props
      )
    }
  })

  hooks.prepareRow.push(row => {
    row.cells.forEach(cell => {
      // Grouped cells are in the groupBy and the pivot cell for the row
      cell.isGrouped = cell.column.isGrouped && cell.column.id === row.groupByID
      // Repeated cells are any columns in the groupBy that are not grouped
      cell.isRepeatedValue = !cell.isGrouped && cell.column.isGrouped
      // Aggregated cells are not grouped, not repeated, but still have subRows
      cell.isAggregated =
        !cell.isGrouped && !cell.isRepeatedValue && row.canExpand
    })
    return row
  })

  const [groupedRows, groupedFlatRows] = React.useMemo(() => {
    if (manualGroupBy || !groupBy.length) {
      return [rows, flatRows]
    }

    if (process.env.NODE_ENV !== 'production' && debug)
      console.info('getGroupedRows')
    // Find the columns that can or are aggregating

    // Uses each column to aggregate rows into a single value
    const aggregateRowsToValues = (rows, isAggregated) => {
      const values = {}

      flatColumns.forEach(column => {
        // Don't aggregate columns that are in the groupBy
        if (groupBy.includes(column.id)) {
          values[column.id] = rows[0] ? rows[0].values[column.id] : null
          return
        }

        const columnValues = rows.map(d => d.values[column.id])

        let aggregator = column.aggregate

        if (Array.isArray(aggregator)) {
          if (aggregator.length !== 2) {
            console.info({ column })
            throw new Error(
              `React Table: Complex aggregators must have 2 values, eg. aggregate: ['sum', 'count']. More info above...`
            )
          }
          if (isAggregated) {
            aggregator = aggregator[1]
          } else {
            aggregator = aggregator[0]
          }
        }

        let aggregateFn =
          typeof aggregator === 'function'
            ? aggregator
            : userAggregations[aggregator] || aggregations[aggregator]

        if (aggregateFn) {
          values[column.id] = aggregateFn(columnValues, rows, isAggregated)
        } else if (aggregator) {
          console.info({ column })
          throw new Error(
            `React Table: Invalid aggregate option for column listed above`
          )
        } else {
          values[column.id] = null
        }
      })
      return values
    }

    let groupedFlatRows = []

    // Recursively group the data
    const groupRecursively = (rows, depth = 0, parentPath = []) => {
      // This is the last level, just return the rows
      if (depth >= groupBy.length) {
        rows.forEach(row => {
          row.path = [...parentPath, ...row.path]
        })
        groupedFlatRows = groupedFlatRows.concat(rows)
        return rows
      }

      const columnId = groupBy[depth]

      // Group the rows together for this level
      let groupedRows = groupByFn(rows, columnId)

      // Recurse to sub rows before aggregation
      groupedRows = Object.entries(groupedRows).map(
        ([groupByVal, subRows], index) => {
          const path = [...parentPath, `${columnId}:${groupByVal}`]

          subRows = groupRecursively(subRows, depth + 1, path)

          const values = aggregateRowsToValues(subRows, depth < groupBy.length)

          const row = {
            isAggregated: true,
            groupByID: columnId,
            groupByVal,
            values,
            subRows,
            depth,
            index,
            path,
          }

          groupedFlatRows.push(row)

          return row
        }
      )

      return groupedRows
    }

    const groupedRows = groupRecursively(rows)

    // Assign the new data
    return [groupedRows, groupedFlatRows]
  }, [
    manualGroupBy,
    groupBy,
    debug,
    rows,
    flatRows,
    flatColumns,
    userAggregations,
    groupByFn,
  ])

  return {
    ...instance,
    toggleGroupBy,
    rows: groupedRows,
    flatRows: groupedFlatRows,
    preGroupedRows: rows,
  }
}

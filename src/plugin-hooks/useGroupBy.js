import { useMemo } from 'react'

import * as aggregations from '../aggregations'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTable'
import {
  mergeProps,
  applyPropHooks,
  defaultGroupByFn,
  getFirstDefined,
  ensurePluginOrder,
} from '../utils'

defaultState.groupBy = []

addActions('toggleGroupBy')

export const useGroupBy = hooks => {
  hooks.columnsBeforeHeaderGroups.push(columnsBeforeHeaderGroups)
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => {
    deps.push(instance.state.groupBy)
    return deps
  })
  hooks.useMain.push(useMain)
}

useGroupBy.pluginName = 'useGroupBy'

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

function useMain(instance) {
  const {
    debug,
    rows,
    flatColumns,
    flatHeaders,
    groupByFn = defaultGroupByFn,
    manualGroupBy,
    defaultCanGroupBy,
    disableGroupBy,
    aggregations: userAggregations = {},
    hooks,
    plugins,
    state: { groupBy },
    setState,
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

  const toggleGroupBy = (id, toggle) => {
    return setState(old => {
      const resolvedToggle =
        typeof toggle !== 'undefined' ? toggle : !groupBy.includes(id)
      if (resolvedToggle) {
        return {
          ...old,
          groupBy: [...groupBy, id],
        }
      }
      return {
        ...old,
        groupBy: groupBy.filter(d => d !== id),
      }
    }, actions.toggleGroupBy)
  }

  hooks.getGroupByToggleProps = []

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
        applyPropHooks(instance.hooks.getGroupByToggleProps, header, instance),
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

  const groupedRows = useMemo(() => {
    if (manualGroupBy || !groupBy.length) {
      return rows
    }

    if (process.env.NODE_ENV === 'development' && debug)
      console.info('getGroupedRows')
    // Find the columns that can or are aggregating

    // Uses each column to aggregate rows into a single value
    const aggregateRowsToValues = (rows, isSourceRows) => {
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
          if (isSourceRows) {
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
          values[column.id] = aggregateFn(columnValues, rows)
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

    // Recursively group the data
    const groupRecursively = (rows, depth = 0, parentPath = []) => {
      // This is the last level, just return the rows
      if (depth >= groupBy.length) {
        return rows
      }

      const columnID = groupBy[depth]

      // Group the rows together for this level
      let groupedRows = groupByFn(rows, columnID)

      // Recurse to sub rows before aggregation
      groupedRows = Object.entries(groupedRows).map(
        ([groupByVal, subRows], index) => {
          const path = [...parentPath, `${columnID}:${groupByVal}`]

          subRows = groupRecursively(subRows, depth + 1, path)

          const values = aggregateRowsToValues(
            subRows,
            depth + 1 >= groupBy.length
          )

          const row = {
            isAggregated: true,
            groupByID: columnID,
            groupByVal,
            values,
            subRows,
            depth,
            index,
            path,
          }

          return row
        }
      )

      return groupedRows
    }

    // Assign the new data
    return groupRecursively(rows)
  }, [
    manualGroupBy,
    groupBy,
    debug,
    rows,
    flatColumns,
    userAggregations,
    groupByFn,
  ])

  return {
    ...instance,
    toggleGroupBy,
    rows: groupedRows,
    preGroupedRows: rows,
  }
}

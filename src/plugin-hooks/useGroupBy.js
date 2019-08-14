import { useMemo } from 'react'
import PropTypes from 'prop-types'

import * as aggregations from '../aggregations'
import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'
import {
  mergeProps,
  applyPropHooks,
  defaultGroupByFn,
  getFirstDefined,
} from '../utils'

defaultState.groupBy = []

addActions('toggleGroupBy')

const propTypes = {
  // General
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      aggregate: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.func, PropTypes.string])
        ),
      ]),
      disableGrouping: PropTypes.bool,
      Aggregated: PropTypes.any,
    })
  ),
  groupByFn: PropTypes.func,
  manualGrouping: PropTypes.bool,
  disableGrouping: PropTypes.bool,
  aggregations: PropTypes.object,
}

export const useGroupBy = hooks => {
  hooks.columnsBeforeHeaderGroups.push(columnsBeforeHeaderGroups)
  hooks.columnsBeforeHeaderGroupsDeps.push((deps, instance) => {
    deps.push(instance.state[0].groupBy)
    return deps
  })
  hooks.useMain.push(useMain)
}

useGroupBy.pluginName = 'useGroupBy'

function columnsBeforeHeaderGroups(columns, { state: [{ groupBy }] }) {
  // Sort grouped columns to the start of the column list
  // before the headers are built
  return [
    ...groupBy.map(g => columns.find(col => col.id === g)),
    ...columns.filter(col => !groupBy.includes(col.id)),
  ]
}

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useGroupBy')

  const {
    debug,
    rows,
    columns,
    headers,
    groupByFn = defaultGroupByFn,
    manualGroupBy,
    disableGrouping,
    aggregations: userAggregations = {},
    hooks,
    state: [{ groupBy }, setState],
  } = instance

  columns.forEach(column => {
    const { id, accessor, disableGrouping: columnDisableGrouping } = column
    column.grouped = groupBy.includes(id)
    column.groupedIndex = groupBy.indexOf(id)

    column.canGroupBy = accessor
      ? getFirstDefined(
          columnDisableGrouping,
          disableGrouping === true ? false : undefined,
          true
        )
      : false

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

  //
  ;[...columns, ...headers].forEach(column => {
    const { canGroupBy } = column
    column.getGroupByToggleProps = props => {
      return mergeProps(
        {
          onClick: canGroupBy
            ? e => {
                e.persist()
                column.toggleGroupBy()
              }
            : undefined,
          style: {
            cursor: canGroupBy ? 'pointer' : undefined,
          },
          title: 'Toggle GroupBy',
        },
        applyPropHooks(instance.hooks.getGroupByToggleProps, column, instance),
        props
      )
    }
  })

  hooks.prepareRow.push(row => {
    row.cells.forEach(cell => {
      // Grouped cells are in the groupBy and the pivot cell for the row
      cell.grouped = cell.column.grouped && cell.column.id === row.groupByID
      // Repeated cells are any columns in the groupBy that are not grouped
      cell.repeatedValue = !cell.grouped && cell.column.grouped
      // Aggregated cells are not grouped, not repeated, but still have subRows
      cell.aggregated = !cell.grouped && !cell.repeatedValue && row.canExpand
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

      columns.forEach(column => {
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
          const path = [...parentPath, groupByVal]

          subRows = groupRecursively(subRows, depth + 1, path)

          const values = aggregateRowsToValues(
            subRows,
            depth + 1 >= groupBy.length
          )

          const row = {
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
    columns,
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

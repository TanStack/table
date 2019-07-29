import React from 'react'
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
      aggregate: PropTypes.func,
      disableGrouping: PropTypes.bool,
      Aggregated: PropTypes.any,
    })
  ),
  groupByFn: PropTypes.func,
  manualGrouping: PropTypes.bool,
  disableGrouping: PropTypes.bool,
  aggregations: PropTypes.object,
}

export const useGroupBy = props => {
  PropTypes.checkPropTypes(propTypes, props, 'property', 'useGroupBy')

  const {
    debug,
    rows,
    columns,
    groupByFn = defaultGroupByFn,
    manualGroupBy,
    disableGrouping,
    aggregations: userAggregations = {},
    hooks,
    state: [{ groupBy }, setState],
  } = props

  // Sort grouped columns to the start of the column list
  // before the headers are built
  hooks.columnsBeforeHeaderGroups.push(columns => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return React.useMemo(
      () => [
        ...groupBy.map(g => columns.find(col => col.id === g)),
        ...columns.filter(col => !groupBy.includes(col.id)),
      ],
      [columns]
    )
  })

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

  hooks.columns.push(columns => {
    columns.forEach(column => {
      if (column.canGroupBy) {
        column.toggleGroupBy = () => toggleGroupBy(column.id)
      }
    })
    return columns
  })

  hooks.getGroupByToggleProps = []

  const addGroupByToggleProps = (columns, api) => {
    columns.forEach(column => {
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
          applyPropHooks(api.hooks.getGroupByToggleProps, column, api),
          props
        )
      }
    })
    return columns
  }

  hooks.columns.push(addGroupByToggleProps)
  hooks.headers.push(addGroupByToggleProps)

  const groupedRows = useMemo(
    () => {
      if (manualGroupBy || !groupBy.length) {
        return rows
      }
      if (debug) console.info('getGroupedRows')
      // Find the columns that can or are aggregating

      // Uses each column to aggregate rows into a single value
      const aggregateRowsToValues = rows => {
        const values = {}
        columns.forEach(column => {
          const columnValues = rows.map(d => d.values[column.id])
          let aggregate =
            userAggregations[column.aggregate] ||
            aggregations[column.aggregate] ||
            column.aggregate
          if (typeof aggregate === 'function') {
            values[column.id] = aggregate(columnValues, rows)
          } else if (aggregate) {
            throw new Error(
              `Invalid aggregate "${aggregate}" passed to column with ID: "${
                column.id
              }"`
            )
          } else {
            values[column.id] = columnValues[0]
          }
        })
        return values
      }

      // Recursively group the data
      const groupRecursively = (rows, groupBy, depth = 0) => {
        // This is the last level, just return the rows
        if (depth >= groupBy.length) {
          return rows
        }

        // Group the rows together for this level
        let groupedRows = Object.entries(groupByFn(rows, groupBy[depth])).map(
          ([groupByVal, subRows], index) => {
            // Recurse to sub rows before aggregation
            subRows = groupRecursively(subRows, groupBy, depth + 1)

            const values = aggregateRowsToValues(subRows)

            const row = {
              groupByID: groupBy[depth],
              groupByVal,
              values,
              subRows,
              depth,
              index,
            }
            return row
          }
        )

        return groupedRows
      }

      // Assign the new data
      return groupRecursively(rows, groupBy)
    },
    [manualGroupBy, groupBy, debug, rows, columns, userAggregations, groupByFn]
  )

  return {
    ...props,
    toggleGroupBy,
    rows: groupedRows,
    preGroupedRows: rows,
  }
}

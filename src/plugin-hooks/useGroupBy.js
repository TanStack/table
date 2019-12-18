import React from 'react'

import * as aggregations from '../aggregations'
import {
  actions,
  makePropGetter,
  defaultGroupByFn,
  getFirstDefined,
  ensurePluginOrder,
  useMountedLayoutEffect,
  useGetLatest,
} from '../utils'
import { useConsumeHookGetter } from '../publicUtils'

// Actions
actions.resetGroupBy = 'resetGroupBy'
actions.toggleGroupBy = 'toggleGroupBy'

export const useGroupBy = hooks => {
  hooks.getGroupByToggleProps = [defaultGetGroupByToggleProps]
  hooks.stateReducers.push(reducer)
  hooks.flatColumnsDeps.push((deps, { instance }) => [
    ...deps,
    instance.state.groupBy,
  ])
  hooks.flatColumns.push(flatColumns)
  hooks.useInstance.push(useInstance)
}

useGroupBy.pluginName = 'useGroupBy'

const defaultGetGroupByToggleProps = (props, { header }) => [
  props,
  {
    onClick: header.canGroupBy
      ? e => {
          e.persist()
          header.toggleGroupBy()
        }
      : undefined,
    style: {
      cursor: header.canGroupBy ? 'pointer' : undefined,
    },
    title: 'Toggle GroupBy',
  },
]

// Reducer
function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      groupBy: [],
      ...state,
    }
  }

  if (action.type === actions.resetGroupBy) {
    return {
      ...state,
      groupBy: instance.initialState.groupBy || [],
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

function flatColumns(
  flatColumns,
  {
    instance: {
      state: { groupBy },
    },
  }
) {
  // Sort grouped columns to the start of the column list
  // before the headers are built

  const groupByColumns = groupBy
    .map(g => flatColumns.find(col => col.id === g))
    .filter(col => !!col)
  const nonGroupByColumns = flatColumns.filter(col => !groupBy.includes(col.id))

  flatColumns = [...groupByColumns, ...nonGroupByColumns]

  flatColumns.forEach(column => {
    column.isGrouped = groupBy.includes(column.id)
    column.groupedIndex = groupBy.indexOf(column.id)
  })

  return flatColumns
}

const defaultUserAggregations = {}

function useInstance(instance) {
  const {
    data,
    rows,
    flatRows,
    flatColumns,
    flatHeaders,
    groupByFn = defaultGroupByFn,
    manualGroupBy,
    aggregations: userAggregations = defaultUserAggregations,
    hooks,
    plugins,
    state: { groupBy },
    dispatch,
    autoResetGroupBy = true,
    manaulGroupBy,
    disableGroupBy,
    defaultCanGroupBy,
  } = instance

  ensurePluginOrder(plugins, [], 'useGroupBy', ['useSortBy', 'useExpanded'])

  const getInstance = useGetLatest(instance)

  flatColumns.forEach(column => {
    const {
      accessor,
      defaultGroupBy: defaultColumnGroupBy,
      disableGroupBy: columnDisableGroupBy,
    } = column

    column.canGroupBy = accessor
      ? getFirstDefined(
          columnDisableGroupBy === true ? false : undefined,
          disableGroupBy === true ? false : undefined,
          true
        )
      : getFirstDefined(defaultColumnGroupBy, defaultCanGroupBy, false)

    if (column.canGroupBy) {
      column.toggleGroupBy = () => instance.toggleGroupBy(column.id)
    }

    column.Aggregated = column.Aggregated || column.Cell
  })

  const toggleGroupBy = (columnId, toggle) => {
    dispatch({ type: actions.toggleGroupBy, columnId, toggle })
  }

  const getGroupByTogglePropsHooks = useConsumeHookGetter(
    getInstance().hooks,
    'getGroupByToggleProps'
  )

  flatHeaders.forEach(header => {
    header.getGroupByToggleProps = makePropGetter(
      getGroupByTogglePropsHooks(),
      { instance: getInstance(), header }
    )
  })

  hooks.prepareRow.push(row => {
    row.allCells.forEach(cell => {
      // Grouped cells are in the groupBy and the pivot cell for the row
      cell.isGrouped = cell.column.isGrouped && cell.column.id === row.groupByID
      // Repeated cells are any columns in the groupBy that are not grouped
      cell.isRepeatedValue = !cell.isGrouped && cell.column.isGrouped
      // Aggregated cells are not grouped, not repeated, but still have subRows
      cell.isAggregated =
        !cell.isGrouped && !cell.isRepeatedValue && row.canExpand
    })
  })

  const [groupedRows, groupedFlatRows] = React.useMemo(() => {
    if (manualGroupBy || !groupBy.length) {
      return [rows, flatRows]
    }

    // Ensure that the list of filtered columns exist
    const existingGroupBy = groupBy.filter(g =>
      flatColumns.find(col => col.id === g)
    )

    // Find the columns that can or are aggregating
    // Uses each column to aggregate rows into a single value
    const aggregateRowsToValues = (rows, isAggregated) => {
      const values = {}

      flatColumns.forEach(column => {
        // Don't aggregate columns that are in the groupBy
        if (existingGroupBy.includes(column.id)) {
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
    const groupRecursively = (rows, depth = 0, parentId) => {
      // This is the last level, just return the rows
      if (depth === existingGroupBy.length) {
        return rows
      }

      const columnId = existingGroupBy[depth]

      // Group the rows together for this level
      let groupedRows = groupByFn(rows, columnId)

      // Recurse to sub rows before aggregation
      groupedRows = Object.entries(groupedRows).map(
        ([groupByVal, subRows], index) => {
          let id = `${columnId}:${groupByVal}`
          id = parentId ? `${parentId}>${id}` : id

          subRows = groupRecursively(subRows, depth + 1, id)

          const values = aggregateRowsToValues(
            subRows,
            depth < existingGroupBy.length
          )

          const row = {
            id,
            isGrouped: true,
            groupByID: columnId,
            groupByVal,
            values,
            subRows,
            depth,
            index,
          }

          groupedFlatRows.push(row, ...subRows)

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
    rows,
    flatRows,
    flatColumns,
    userAggregations,
    groupByFn,
  ])

  const getAutoResetGroupBy = useGetLatest(autoResetGroupBy)

  useMountedLayoutEffect(() => {
    if (getAutoResetGroupBy()) {
      dispatch({ type: actions.resetGroupBy })
    }
  }, [dispatch, manaulGroupBy ? null : data])

  Object.assign(instance, {
    preGroupedRows: rows,
    preGroupedFlatRow: flatRows,
    groupedRows,
    groupedFlatRows,
    rows: groupedRows,
    flatRows: groupedFlatRows,
    toggleGroupBy,
  })
}

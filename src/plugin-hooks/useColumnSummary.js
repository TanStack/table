import React from 'react'

import { actions, functionalUpdate } from '../publicUtils'
import { getFirstDefined } from '../utils'
import * as aggregations from '../aggregations'

// Actions
actions.resetColumnSummary = 'resetColumnSummary'
actions.setColumnSummary = 'setColumnSummary'

export const useColumnSummary = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)
}

useColumnSummary.pluginName = 'useColumnSummary'

const defaultUserColumnSummaryFns = {}
const defaultColumnSummaryFn = 'count'

// Reducer
function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      columnSummary: {},
      ...state,
    }
  }

  if (action.type === actions.resetColumnSummary) {
    return {
      ...state,
      columnSummary: instance.initialState.columnSummary || {},
    }
  }

  if (action.type === actions.setColumnSummary) {
    return {
      ...state,
      columnSummary: functionalUpdate(
        action.columnSummary,
        state.columnSummary
      ),
    }
  }
}

function useInstance(instance) {
  const {
    state: { columnSummary },
    allColumns,
    rows,
    columnSummaryFns: userColumnSummaryFns = defaultUserColumnSummaryFns,
    dispatch,
    disableColumnSummary,
  } = instance

  const setColumnSummary = React.useCallback(
    columnSummary => {
      return dispatch({ type: actions.setColumnSummary, columnSummary })
    },
    [dispatch]
  )

  React.useMemo(() => {
    allColumns.forEach(column => {
      const { id, accessor, columnSummaryFn = defaultColumnSummaryFn } = column

      // Determine if a column has summary
      column.hasColumnSummary = accessor
        ? getFirstDefined(
            column.disableColumnSummary === true ? false : undefined,
            disableColumnSummary === true ? false : undefined,
            true
          )
        : false

      let columnSummaryType = columnSummary[id] || columnSummaryFn

      let summaryFn =
        typeof columnSummaryType === 'function'
          ? columnSummaryType
          : userColumnSummaryFns[columnSummaryType] ||
            aggregations[columnSummaryType]

      let columnSummaryValue = null

      if (summaryFn) {
        columnSummaryValue = summaryFn(rows.map(d => d.values[column.id]))
      } else if (columnSummaryType) {
        console.info({ column })
        throw new Error(
          `React Table: Invalid columnSummary function provided for column listed above`
        )
      }

      column.columnSummary = {
        type: columnSummaryType,
        value: columnSummaryValue,
      }

      // console.log(column);

      column.setColumnSummary = data => {
        setColumnSummary({ ...columnSummary, [id]: data })
      }
    })
  }, [
    allColumns,
    setColumnSummary,
    columnSummary,
    userColumnSummaryFns,
    rows,
    disableColumnSummary,
  ])

  Object.assign(instance, {
    setColumnSummary,
  })
}

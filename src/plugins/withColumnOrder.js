import React from 'react'

import { useGetLatest, functionalUpdate } from '../utils'

import { withColumnOrder as name, withColumnVisibility } from '../Constants'

export const withColumnOrder = {
  name,
  after: [withColumnVisibility],
  useReduceOptions,
  useInstanceAfterState,
  useReduceLeafColumns,
}

function useReduceOptions(options) {
  return {
    ...options,
    initialState: {
      columnOrder: [],
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const { setState } = instance

  const getInstance = useGetLatest(instance)

  instance.resetColumnOrder = React.useCallback(
    () =>
      setState(
        old => ({
          ...old,
          columnOrder: getInstance().initialState.columnOrder || [],
        }),
        {
          type: 'resetColumnOrder',
        }
      ),
    [getInstance, setState]
  )

  instance.setColumnOrder = React.useCallback(
    columnOrder =>
      setState(
        old => ({
          ...old,
          columnOrder: functionalUpdate(columnOrder, old.columnOrder),
        }),
        {
          type: 'setColumnOrder',
        }
      ),
    [setState]
  )
}

function useReduceLeafColumns(leafColumns, { getInstance }) {
  const {
    state: { columnOrder },
  } = getInstance()

  return React.useMemo(() => {
    // Sort grouped columns to the start of the column list
    // before the headers are built
    let orderedColumns = []

    // If there is no order, return the normal columns
    if (!columnOrder?.length) {
      orderedColumns = leafColumns
    } else {
      const columnOrderCopy = [...columnOrder]

      // If there is an order, make a copy of the columns
      const leafColumnsCopy = [...leafColumns]

      // And make a new ordered array of the columns

      // Loop over the columns and place them in order into the new array
      while (leafColumnsCopy.length && columnOrderCopy.length) {
        const targetColumnId = columnOrderCopy.shift()
        const foundIndex = leafColumnsCopy.findIndex(
          d => d.id === targetColumnId
        )
        if (foundIndex > -1) {
          orderedColumns.push(leafColumnsCopy.splice(foundIndex, 1)[0])
        }
      }

      // If there are any columns left, add them to the end
      orderedColumns = [...orderedColumns, ...leafColumnsCopy]
    }

    return orderedColumns
  }, [columnOrder, leafColumns])
}

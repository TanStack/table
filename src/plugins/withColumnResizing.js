import React from 'react'

import { useGetLatest, getFirstDefined } from '../utils'

export const withColumnResizing = {
  useOptions,
  useInstanceAfterState,
  useInstanceFinal,
}

function useOptions(options) {
  return {
    ...options,
    initialState: {
      columnResizing: {
        columnWidths: {},
      },
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  const getInstance = useGetLatest(instance)

  instance.getColumnCanResize = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        column.disableResizing === true ? false : undefined,
        getInstance().options.disableResizing === true ? false : undefined,
        true
      )
    },
    [getInstance]
  )

  instance.getColumnWidth = React.useCallback(
    columnId => {
      const column = getInstance().flatColumns.find(d => d.id === columnId)

      if (!column) {
        return
      }

      return (
        getInstance().state.columnResizing.columnWidths[columnId] ||
        column.width
      )
    },
    [getInstance]
  )

  instance.getColumnIsResizing = React.useCallback(
    columnId => {
      return getInstance().state.columnResizing.isResizingColumn === columnId
    },
    [getInstance]
  )
}

function useInstanceFinal(instance) {
  const getInstance = useGetLatest(instance)
}

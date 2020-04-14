import React from 'react'

import {
  functionalUpdate,
  useMountedLayoutEffect,
  useGetLatest,
} from '../publicUtils'

const defaultInitialRowStateAccessor = originalRow => ({})
const defaultInitialCellStateAccessor = originalRow => ({})

export const useRowState = hooks => {
  hooks.getInitialState.push(getInitialState)
  hooks.useInstance.push(useInstance)
  hooks.prepareRow.push(prepareRow)
}

useRowState.pluginName = 'useRowState'

function getInitialState(state) {
  return {
    rowState: {},
    ...state,
  }
}

function useInstance(instance) {
  const { autoResetRowState = true, data, setState } = instance

  const getInstance = useGetLatest(instance)

  const setRowState = React.useCallback(
    (rowId, value) =>
      setState(old => {
        const {
          initialRowStateAccessor = defaultInitialRowStateAccessor,
          rowsById,
        } = getInstance()

        const oldRowState =
          typeof old.rowState[rowId] !== 'undefined'
            ? old.rowState[rowId]
            : initialRowStateAccessor(rowsById[rowId].original)

        return {
          ...old,
          rowState: {
            ...old.rowState,
            [rowId]: functionalUpdate(value, oldRowState),
          },
        }
      }),
    [getInstance, setState]
  )

  const setCellState = React.useCallback(
    (rowId, columnId, value) =>
      setState(old => {
        const {
          initialRowStateAccessor = defaultInitialRowStateAccessor,
          initialCellStateAccessor = defaultInitialCellStateAccessor,
          rowsById,
        } = getInstance()

        const oldRowState =
          typeof old.rowState[rowId] !== 'undefined'
            ? old.rowState[rowId]
            : initialRowStateAccessor(rowsById[rowId].original)

        const oldCellState =
          typeof oldRowState?.cellState?.[columnId] !== 'undefined'
            ? oldRowState.cellState[columnId]
            : initialCellStateAccessor(rowsById[rowId].original)

        return {
          ...old,
          rowState: {
            ...old.rowState,
            [rowId]: {
              ...oldRowState,
              cellState: {
                ...(oldRowState.cellState || {}),
                [columnId]: functionalUpdate(value, oldCellState),
              },
            },
          },
        }
      }),
    [getInstance, setState]
  )

  const resetRowState = React.useCallback(
    () =>
      setState(old => ({
        ...old,
        rowState: getInstance().initialState.rowState || {},
      })),
    [getInstance, setState]
  )

  const getAutoResetRowState = useGetLatest(autoResetRowState)

  useMountedLayoutEffect(() => {
    if (getAutoResetRowState()) {
      resetRowState()
    }
  }, [data])

  Object.assign(instance, {
    setRowState,
    setCellState,
  })
}

function prepareRow(row, { instance }) {
  const {
    initialRowStateAccessor = defaultInitialRowStateAccessor,
    initialCellStateAccessor = defaultInitialCellStateAccessor,
    state: { rowState },
  } = instance

  if (row.original) {
    row.state =
      typeof rowState[row.id] !== 'undefined'
        ? rowState[row.id]
        : initialRowStateAccessor(row.original)

    row.setState = updater => {
      return instance.setRowState(row.id, updater)
    }

    row.cells.forEach(cell => {
      if (!row.state.cellState) {
        row.state.cellState = {}
      }

      cell.state =
        typeof row.state.cellState[cell.column.id] !== 'undefined'
          ? row.state.cellState[cell.column.id]
          : initialCellStateAccessor(row.original)

      cell.setState = updater => {
        return instance.setCellState(row.id, cell.column.id, updater)
      }
    })
  }
}

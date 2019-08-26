import React from 'react'
import PropTypes from 'prop-types'

import { addActions, actions } from '../actions'
import { defaultState } from '../hooks/useTableState'

defaultState.rowState = {}

addActions('setRowState', 'setCellState')

const propTypes = {
  initialRowStateAccessor: PropTypes.func,
}

export const useRowState = hooks => {
  hooks.useMain.push(useMain)
}

useRowState.pluginName = 'useRowState'

function useMain(instance) {
  PropTypes.checkPropTypes(propTypes, instance, 'property', 'useRowState')

  const {
    hooks,
    rows,
    initialRowStateAccessor,
    state: [{ rowState }, setState],
  } = instance

  const setRowState = React.useCallback(
    (path, updater, action = actions.setRowState) => {
      const pathKey = path.join('.')
      return setState(old => {
        return {
          ...old,
          rowState: {
            ...old.rowState,
            [pathKey]:
              typeof updater === 'function'
                ? updater(old.rowState[pathKey])
                : updater,
          },
        }
      }, action)
    },
    [setState]
  )

  const setCellState = React.useCallback(
    (rowPath, columnID, updater) => {
      return setRowState(
        rowPath,
        old => {
          return {
            ...old,
            cellState: {
              ...old.cellState,
              [columnID]:
                typeof updater === 'function'
                  ? updater(old.cellState[columnID])
                  : updater,
            },
          }
        },
        actions.setCellState
      )
    },
    [setRowState]
  )

  const rowsMountedRef = React.useRef()

  // When data changes, reset row and cell state
  React.useEffect(() => {
    if (rowsMountedRef.current) {
      setState(old => {
        return {
          ...old,
          rowState: {},
        }
      }, actions.setRowState)
    }

    rowsMountedRef.current = true
  }, [rows, setState])

  hooks.prepareRow.push(row => {
    const pathKey = row.path.join('.')

    if (row.original) {
      row.state =
        (typeof rowState[pathKey] !== 'undefined'
          ? rowState[pathKey]
          : initialRowStateAccessor && initialRowStateAccessor(row)) || {}

      row.setState = updater => {
        return setRowState(row.path, updater)
      }

      row.cells.forEach(cell => {
        cell.state = row.state.cellState || {}

        cell.setState = updater => {
          return setCellState(row.path, cell.column.id, updater)
        }
      })
    }

    return row
  })

  return {
    ...instance,
    setRowState,
    setCellState,
  }
}

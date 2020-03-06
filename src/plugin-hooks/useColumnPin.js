import React from 'react'

import { functionalUpdate, defaultColumn, actions } from '../publicUtils'
import { getFirstDefined, makeHeaderGroups } from '../utils'

// Actions
actions.resetColumnPin = 'resetColumnPin'
actions.setColumnPin = 'setColumnPin'

const COLUMN_PINS = {
  LEFT: 'LEFT',
  CENTER: 'CENTER',
  RIGHT: 'RIGHT',
}

defaultColumn.pinType = COLUMN_PINS.CENTER

export const useColumnPin = hooks => {
  hooks.stateReducers.push(reducer)
  hooks.useInstance.push(useInstance)

  hooks.headerGroups.push(headerGroups)
  hooks.headerGroupsDeps.push((deps, { instance }) => [
    ...deps,
    instance.state.columnPin,
  ])

  hooks.columnOrderForCells.push(columnOrderForCells)
  hooks.columnOrderForCellsDeps.push((deps, { instance }) => [
    ...deps,
    instance.state.columnPin,
  ])

  hooks.getTableProps.push((props, { instance }) => [
    props,
    {
      style: {
        overflow: 'auto',
        display: 'block',
        position: 'relative',
      },
    },
  ])

  hooks.getHeaderProps.push((props, { column, instance }) => [
    props,
    {
      style: getCellStyles(column, instance),
    },
  ])

  hooks.getCellProps.push((props, { cell, instance }) => [
    props,
    {
      style: getCellStyles(cell.column, instance),
    },
  ])
}

useColumnPin.pluginName = 'useColumnPin'

function headerGroups(headerGroups, instance) {
  let scanColumns = getColumnOrderByPin(instance.allColumns)

  return makeHeaderGroups(
    scanColumns,
    defaultColumn,
    column => ({ pinType: column.pinType }),
    (latestParentColumn, newParent) =>
      latestParentColumn.pinType === newParent.pinType
  )
}

function columnOrderForCells(columnOrderForCells, instance) {
  return getColumnOrderByPin(columnOrderForCells)
}

function reducer(state, action, previousState, instance) {
  if (action.type === actions.init) {
    return {
      columnPin: {},
      ...state,
    }
  }

  if (action.type === actions.resetColumnPin) {
    return {
      ...state,
      columnPin: instance.initialState.columnPin || {},
    }
  }

  if (action.type === actions.setColumnPin) {
    return {
      ...state,
      columnPin: functionalUpdate(action.columnPin, state.columnPin),
    }
  }
}

function useInstance(instance) {
  const {
    dispatch,
    allColumns,
    disablePinning,
    state: { columnPin },
  } = instance

  const setColumnPin = React.useCallback(
    columnPin => {
      return dispatch({ type: actions.setColumnPin, columnPin })
    },
    [dispatch]
  )

  allColumns.forEach(column => {
    const { disablePinning: columnDisablePinning, accessor } = column

    const canPin = accessor
      ? getFirstDefined(
          columnDisablePinning === true ? false : undefined,
          disablePinning === true ? false : undefined,
          true
        )
      : false

    column.canPin = canPin

    column.pinType = columnPin[column.id] || COLUMN_PINS.CENTER

    column.setColumnPin = pinType => {
      column.pinType = pinType
      setColumnPin({
        ...columnPin,
        [column.id]: pinType,
      })
    }

    // console.log(column.id, column.pinType)

    column.toggleColumnPin = pinType => {
      let setPinValue =
        column.pinType === pinType ? COLUMN_PINS.CENTER : pinType
      column.setColumnPin(setPinValue)
    }
  })

  Object.assign(instance, {
    setColumnPin,
  })
}

function getColumnOrderByPin(columns) {
  const pinMap = {
    LEFT: [],
    CENTER: [],
    RIGHT: [],
  }

  columns.forEach(col => {
    pinMap[col.pinType].push(col)
  })

  return [...pinMap.LEFT, ...pinMap.CENTER, ...pinMap.RIGHT]
}

function getCellStyles(column, instance) {
  return {
    position: column.pinType !== COLUMN_PINS.CENTER ? 'sticky' : '',
    left: column.pinType === COLUMN_PINS.LEFT ? column.totalLeft + 'px' : '',
    right:
      column.pinType === COLUMN_PINS.RIGHT
        ? instance.totalColumnsWidth -
          (column.totalLeft + column.totalWidth) +
          'px'
        : '',
    width: column.totalWidth + 'px',
    minWidth: column.totalWidth + 'px',
    maxWidth: column.totalWidth + 'px',
    zIndex: 10,
  }
}

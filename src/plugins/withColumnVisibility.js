import React from 'react'

import { getFirstDefined, makeStateUpdater } from '../utils'

import { withColumnVisibility as name } from '../Constants'

export const withColumnVisibility = {
  name,
  after: [],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    useInstanceAfterDataModel,
    decorateColumn,
    useReduceLeafColumns,
  },
}

function useReduceOptions(options) {
  return {
    onColumnVisibilityChange: React.useCallback(
      makeStateUpdater('columnVisibility'),
      []
    ),
    ...options,
    initialState: {
      columnVisibility: {},
      ...options.initialState,
    },
  }
}

function useInstanceAfterState(instance) {
  instance.setColumnVisibility = React.useCallback(
    updater => instance.options.onColumnVisibilityChange(updater, instance),
    [instance]
  )

  instance.toggleColumnVisibility = React.useCallback(
    (columnId, value) => {
      value = getFirstDefined(value, !instance.getColumnIsVisible(columnId))

      if (instance.getColumnCanHide(columnId)) {
        instance.setColumnVisibility(old => ({
          ...old,
          [columnId]: value,
        }))
      }
    },
    [instance]
  )

  instance.toggleAllColumnsVisible = React.useCallback(
    value => {
      value = getFirstDefined(value, !instance.getIsAllColumnsVisible())

      instance.setColumnVisibility(
        instance.preVisibleLeafColumns.reduce(
          (obj, column) => ({
            ...obj,
            [column.id]: !value ? !column.getCanHide() : value,
          }),
          {}
        )
      )
    },
    [instance]
  )

  instance.getColumnIsVisible = React.useCallback(
    columnId => {
      const column = instance.allColumns.find(d => d.id === columnId)

      if (!column) {
        return true
      }

      return getFirstDefined(
        instance.state.columnVisibility[columnId],
        column.defaultIsVisible,
        true
      )
    },
    [instance.allColumns, instance.state.columnVisibility]
  )

  instance.getColumnCanHide = React.useCallback(
    columnId => {
      const column = instance.allColumns.find(d => d.id === columnId)

      if (!column) {
        return false
      }

      return getFirstDefined(
        instance.options.disabledHiding ? false : undefined,
        column.disableHiding ? false : undefined,
        column.defaultCanHide,
        true
      )
    },
    [instance.allColumns, instance.options.disabledHiding]
  )

  instance.getIsAllColumnsVisible = React.useCallback(
    () =>
      !instance.preVisibleLeafColumns.some(column => !column.getIsVisible()),
    [instance.preVisibleLeafColumns]
  )

  instance.getIsSomeColumnsVisible = React.useCallback(
    () => instance.preVisibleLeafColumns.some(column => column.getIsVisible()),
    [instance.preVisibleLeafColumns]
  )
}

function useInstanceAfterDataModel(instance) {
  instance.getToggleAllColumnsVisibilityProps = React.useCallback(
    (props = {}) => {
      return {
        onChange: e => {
          instance.toggleAllColumnsVisible(e.target.checked)
        },
        title: 'Toggle visibility for all columns',
        checked: instance.getIsAllColumnsVisible(),
        indeterminate:
          !instance.getIsAllColumnsVisible() &&
          instance.getIsSomeColumnsVisible(),
        ...props,
      }
    },
    [instance]
  )
}

function decorateColumn(column, { instance }) {
  column.getCanHide = () => instance.getColumnCanHide(column.id)
  column.getIsVisible = () => instance.getColumnIsVisible(column.id)
  column.toggleVisibility = value =>
    instance.toggleColumnVisibility(column.id, value)

  column.getToggleVisibilityProps = (props = {}) => ({
    type: 'checkbox',
    onChange: e => {
      column.toggleVisibility(e.target.checked)
    },
    checked: column.getIsVisible(),
    title: 'Toggle Column Visible',
    ...props,
  })
}

function useReduceLeafColumns(leafColumns, { instance }) {
  const { getColumnIsVisible } = instance

  instance.preVisibleLeafColumns = React.useMemo(
    () => leafColumns.filter(column => column.getCanHide()),
    [leafColumns]
  )

  return React.useMemo(() => {
    return leafColumns.filter(column => getColumnIsVisible(column.id))
  }, [getColumnIsVisible, leafColumns])
}

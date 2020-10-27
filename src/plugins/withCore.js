import React from 'react'

import { makeRenderer } from '../utils'

export const withCore = {
  name: 'withCore',
  after: [],
  plugs: {
    useReduceOptions,
    useInstanceAfterState,
    decorateHeader,
    decorateRow,
    decorateCell,
    useInstanceAfterDataModel,
  },
}

function useReduceOptions(options) {
  return {
    initialState: {},
    state: {},
    onStateChange: d => d,
    getSubRows: row => row.subRows || [],
    getRowId: (row, index, parent) =>
      `${parent ? [parent.id, index].join('.') : index}`,
    enableFilters: true,
    filterFromChildrenUp: true,
    paginateExpandedRows: true,
    ...options,
  }
}

function useInstanceAfterState(instance) {
  instance.reset = React.useCallback(() => {
    const { setState, getInitialState } = instance
    setState(getInitialState(), {
      type: 'reset',
    })
  }, [instance])

  instance.getColumnWidth = React.useCallback(
    columnId => {
      const column = instance.leafColumns.find(d => d.id === columnId)

      if (!column) {
        return
      }

      return Math.min(Math.max(column.minWidth, column.width), column.maxWidth)
    },
    [instance.leafColumns]
  )

  instance.getTotalWidth = React.useCallback(() => {
    return instance.leafColumns.reduce(
      (sum, column) => sum + column.getWidth(),
      0
    )
  }, [instance.leafColumns])
}

function decorateHeader(header, { instance }) {
  header.render = header.isPlaceholder
    ? () => null
    : makeRenderer(instance, {
        column: header.column,
      })

  // Give columns/headers a default getHeaderProps
  header.getHeaderProps = (props = {}) =>
    instance.plugs.reduceHeaderProps(
      {
        key: header.id,
        role: 'columnheader',
        ...props,
      },
      { instance, header }
    )

  // Give columns/headers a default getFooterProps
  header.getFooterProps = (props = {}) =>
    instance.plugs.reduceFooterProps(
      {
        key: header.id,
        role: 'columnfooter',
        ...props,
      },
      {
        instance,
        header,
      }
    )

  header.getWidth = () => {
    let sum = 0

    const recurse = header => {
      if (header.subHeaders?.length) {
        header.subHeaders.forEach(recurse)
      } else {
        sum += header.column.getWidth()
      }
    }

    recurse(header)

    return sum
  }
}

function decorateRow(row, { instance }) {
  row.getRowProps = (props = {}) =>
    instance.plugs.reduceRowProps(
      { key: row.id, role: 'row', ...props },
      { instance, row }
    )
}

function decorateCell(cell, { instance }) {
  cell.getCellProps = (props = {}) =>
    instance.plugs.reduceCellProps(
      {
        key: cell.id,
        role: 'gridcell',
        ...props,
      },
      {
        instance,
        cell,
      }
    )
}

function useInstanceAfterDataModel(instance) {
  instance.getTableHeadProps = (props = {}) =>
    instance.plugs.reduceTableHeadProps({ ...props }, { instance })
  instance.getTableFooterProps = (props = {}) =>
    instance.plugs.reduceTableFooterProps({ ...props }, { instance })
  instance.getTableBodyProps = (props = {}) =>
    instance.plugs.reduceTableBodyProps(
      { role: 'rowgroup', ...props },
      { instance }
    )
  instance.getTableProps = (props = {}) =>
    instance.plugs.reduceTableProps({ role: 'table', ...props }, { instance })
}

import React from 'react'

import { useGetLatest, makeRenderer } from '../utils'

export const withCore = {
  name: 'withCore',
  after: [],
  useInstanceAfterState,
  decorateHeader,
  decorateRow,
  decorateCell,
  useInstanceAfterDataModel,
}

function useInstanceAfterState(instance) {
  const getInstance = useGetLatest(instance)

  instance.reset = React.useCallback(() => {
    const { setState, getInitialState } = instance
    setState(getInitialState(), {
      type: 'reset',
    })
  }, [instance])

  instance.getColumnWidth = React.useCallback(
    columnId => {
      const column = getInstance().leafColumns.find(d => d.id === columnId)

      if (!column) {
        return
      }

      return Math.min(Math.max(column.minWidth, column.width), column.maxWidth)
    },
    [getInstance]
  )

  instance.getTotalWidth = React.useCallback(() => {
    return getInstance().visibleColumns.reduce(
      (sum, column) => sum + column.getWidth(),
      0
    )
  }, [getInstance])
}

function decorateHeader(header, { getInstance }) {
  header.render = header.isPlaceholder
    ? () => null
    : makeRenderer(getInstance, {
        column: header.column,
      })

  // Give columns/headers a default getHeaderProps
  header.getHeaderProps = (props = {}) =>
    getInstance().plugs.reduceHeaderProps(
      {
        role: 'columnheader',
        ...props,
      },
      { getInstance, header }
    )

  // Give columns/headers a default getFooterProps
  header.getFooterProps = (props = {}) =>
    getInstance().plugs.reduceFooterProps(
      {
        role: 'columnfooter',
        ...props,
      },
      {
        getInstance,
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

function decorateRow(row, { getInstance }) {
  row.getRowProps = (props = {}) =>
    getInstance().plugs.reduceRowProps(
      { role: 'row', ...props },
      { getInstance, row }
    )
}

function decorateCell(cell, { getInstance }) {
  cell.getCellProps = (props = {}) =>
    getInstance().plugs.reduceCellProps(
      {
        role: 'gridcell',
        ...props,
      },
      {
        getInstance,
        cell,
      }
    )
}

function useInstanceAfterDataModel(instance) {
  const getInstance = useGetLatest(instance)
  instance.getTableHeadProps = (props = {}) =>
    getInstance().plugs.reduceTableHeadProps({ ...props }, { getInstance })
  instance.getTableFooterProps = (props = {}) =>
    getInstance().plugs.reduceTableFooterProps({ ...props }, { getInstance })
  instance.getTableBodyProps = (props = {}) =>
    getInstance().plugs.reduceTableBodyProps(
      { role: 'rowgroup', ...props },
      { getInstance }
    )
  instance.getTableProps = (props = {}) =>
    getInstance().plugs.reduceTableProps(
      { role: 'table', ...props },
      { getInstance }
    )
}

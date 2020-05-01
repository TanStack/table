import React from 'react'

import { useGetLatest } from '../utils'

export const withCore = {
  useInstanceAfterState,
  decorateRow,
  decorateCell,
  useInstanceFinal,
}

function useInstanceAfterState(instance) {
  instance.reset = React.useCallback(() => {
    const { setState, getInitialState } = instance
    setState(getInitialState(), {
      type: 'reset',
    })
  }, [instance])
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

function useInstanceFinal(instance) {
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

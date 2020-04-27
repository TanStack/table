import React from 'react'

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

function decorateRow(row) {
  row.getRowProps = (props = {}) => ({ role: 'row', ...props })
}

function decorateCell(cell) {
  cell.getCellProps = (props = {}) => ({
    role: 'cell',
    ...props,
  })
}

function useInstanceFinal(instance) {
  instance.getTableHeadProps = (props = {}) => ({ ...props })
  instance.getTableFooterProps = (props = {}) => ({ ...props })
  instance.getTableBodyProps = (props = {}) => ({ role: 'rowgroup', ...props })
  instance.getTableProps = (props = {}) => ({ role: 'table', ...props })
}

import React from 'react'
import {
  Plugin,
  TableInstance,
  TableOptions,
  Header,
  Row,
  Cell,
} from '../types'

import { makeRenderer } from '../utils'

export const withCore: Plugin = {
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

function useReduceOptions(options: any): TableOptions {
  return {
    initialState: {},
    state: {},
    onStateChange: d => d,
    getSubRows: row => row.subRows || [],
    getRowId: (_row, index, parent) =>
      `${parent ? [parent.id, index].join('.') : index}`,
    enableFilters: true,
    filterFromChildrenUp: true,
    paginateExpandedRows: true,
    ...options,
  }
}

function useInstanceAfterState(instance: TableInstance) {
  instance.reset = React.useCallback(() => {
    // It's possible that in the future, this function is pluggable
    // and allows other plugins to add their own reset functionality
    instance.setState(instance.options.initialState)
  }, [instance])

  instance.getColumnWidth = React.useCallback(
    columnId => {
      const column = instance.leafColumns.find(d => d.id === columnId)

      if (!column) {
        return 0
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

  return instance
}

function decorateHeader(
  header: Header,
  { instance }: { instance: TableInstance }
) {
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

    const recurse = (header: Header) => {
      if (header.subHeaders.length) {
        header.subHeaders.forEach(recurse)
      } else {
        sum += header.column.getWidth()
      }
    }

    recurse(header)

    return sum
  }

  return header
}

function decorateRow(row: Row, { instance }: { instance: TableInstance }) {
  row.getRowProps = (props = {}) =>
    instance.plugs.reduceRowProps(
      { key: row.id, role: 'row', ...props },
      { instance, row }
    )

  return row
}

function decorateCell(cell: Cell, { instance }: { instance: TableInstance }) {
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

  return cell
}

function useInstanceAfterDataModel(instance: TableInstance) {
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

  return instance
}

import React from 'react'
import { useTable, useColumnOrder } from 'react-table'
import makeData from './makeData'
import DraggableHeader from './DraggableHeader'
import styled from 'styled-components'
import withScrolling from 'react-dnd-scrolling'
import update from 'immutability-helper'

const ScrollingComponent = withScrolling('div')

const Styles = styled.div`
  overflow: auto;
  margin: 1rem;
  max-height: 35rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        border-right: 0;
      }
    }
  }
`

const initialColumnOrder = [
  'lastName',
  'firstName',
  'age',
  'visits',
  'status',
  'progress',
  'thoughts',
  'projects',
  'strength',
  'velocity',
  'friends',
]

export default function Table() {
  const data = React.useMemo(() => makeData(500), [])

  const columns = React.useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName',
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
      },
      {
        Header: 'Age',
        accessor: 'age',
      },
      {
        Header: 'Visits',
        accessor: 'visits',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Profile Progress',
        accessor: 'progress',
      },
      {
        Header: 'Thoughts',
        accessor: 'thoughts',
      },
      {
        Header: 'Projects',
        accessor: 'projects',
      },
      {
        Header: 'Strength',
        accessor: 'strength',
      },

      {
        Header: 'Velocity',
        accessor: 'velocity',
      },
      {
        Header: 'Friends',
        accessor: 'friends',
      },
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setColumnOrder,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        columnOrder: initialColumnOrder,
      },
    },
    useColumnOrder
  )

  const reoder = (item, newIndex) => {
    const { index: currentIndex } = item

    const dragRecord = state.columnOrder[currentIndex]

    setColumnOrder(
      update(state.columnOrder, {
        $splice: [
          [currentIndex, 1],
          [newIndex, 0, dragRecord],
        ],
      })
    )
  }

  return (
    <ScrollingComponent>
      <Styles>
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, i) => (
                  <DraggableHeader
                    reoder={reoder}
                    key={column.id}
                    column={column}
                    index={i}
                  />
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </Styles>
    </ScrollingComponent>
  )
}

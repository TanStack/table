import React from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, useRowSpan } from 'react-table'

import makeData from './makeData'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

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

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    spanRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSpan
  )

  const preparedRows = rows.map((row, i) => {
    prepareRow(row);
    return spanRow(row, i);
  })

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {preparedRows.map(
            (row, i) => {
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    if (!cell.isRowSpanned) {
                      return (
                        <td rowspan={cell.rowSpan}
                        {...cell.getCellProps()}>{cell.render('Cell')}
                        </td>
                      )
                    } else {
                      return null;
                    }
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
    </>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'first',
            enableRowSpan: true
          },
          {
            Header: 'Middle Name',
            accessor: 'middle',
            enableRowSpan: true
          },
          {
            Header: 'Last Name',
            accessor: 'last',
            enableRowSpan: true
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(100), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App

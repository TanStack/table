import React from 'react'
import styled from 'styled-components'
import { useTable, useColumns, useRows } from 'react-table'

import olympicWinnersSmall from './data/olympicWinnersSmall.json'

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

const data = olympicWinnersSmall.slice(0, 100)

function Table() {
  const columns = React.useMemo(
    () => [
      { Header: 'Athlete', accessor: 'athlete' },
      { Header: 'Country', accessor: 'country' },
      { Header: 'Age', accessor: 'age' },
      { Header: 'Bronze', accessor: 'bronze' },
      { Header: 'Date', accessor: 'date' },
      { Header: 'Gold', accessor: 'gold' },
      { Header: 'Silver', accessor: 'silver' },
      { Header: 'Sport', accessor: 'sport' },
      { Header: 'Total', accessor: 'total' },
      { Header: 'Year', accessor: 'year' },
    ],
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useColumns,
    useRows
  )

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getRowProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {rows.map(
          (row, i) =>
            prepareRow(row) || (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
        )}
      </tbody>
    </table>
  )
}

function App() {
  return (
    <Styles>
      <Table />
    </Styles>
  )
}

export default App

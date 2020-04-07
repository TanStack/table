import React from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'

import makeData from './makeData'

const Styles = styled.div`
  padding: 1rem;

  .user {
    background-color: blue;
    color: white;
  }

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

// Create a default prop getter
const defaultPropGetter = () => ({})

// Expose some prop getters for headers, rows and cells, or more if you want!
function Table({
  columns,
  data,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                // Return an array of prop objects and react-table will merge them appropriately
                {...column.getHeaderProps([
                  {
                    className: column.className,
                    style: column.style,
                  },
                  getColumnProps(column),
                  getHeaderProps(column),
                ])}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            // Merge user row props in
            <tr {...row.getRowProps(getRowProps(row))}>
              {row.cells.map(cell => {
                return (
                  <td
                    // Return an array of prop objects and react-table will merge them appropriately
                    {...cell.getCellProps([
                      {
                        className: cell.column.className,
                        style: cell.column.style,
                      },
                      getColumnProps(cell.column),
                      getCellProps(cell),
                    ])}
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
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
            accessor: 'firstName',
            className: 'user',
            style: {
              fontWeight: 'bolder',
            },
          },
        ],
      },
      {
        Header: 'Scores',
        columns: [
          {
            Header: 'Day 1',
            accessor: 'score0',
          },
          {
            Header: 'Day 2',
            accessor: 'score1',
          },
          {
            Header: 'Day 3',
            accessor: 'score2',
          },
          {
            Header: 'Day 4',
            accessor: 'score3',
          },
          {
            Header: 'Day 5',
            accessor: 'score4',
          },
          {
            Header: 'Day 6',
            accessor: 'score5',
          },
          {
            Header: 'Day 7',
            accessor: 'score6',
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(20), [])

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        getHeaderProps={column => ({
          onClick: () => alert('Header!'),
        })}
        getColumnProps={column => ({
          onClick: () => alert('Column!'),
        })}
        getRowProps={row => ({
          style: {
            background: row.index % 2 === 0 ? 'rgba(0,0,0,.1)' : 'white',
          },
        })}
        getCellProps={cellInfo => ({
          style: {
            backgroundColor: `hsl(${120 * ((120 - cellInfo.value) / 120) * -1 +
              120}, 100%, 67%)`,
          },
        })}
      />
    </Styles>
  )
}

export default App

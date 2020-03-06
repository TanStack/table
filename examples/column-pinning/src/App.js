import React from 'react'
import styled from 'styled-components'
import { useTable, useColumnPin } from 'react-table'

import makeData from './makeData'

const Styles = styled.div`
  padding: 1rem;

  * {
    box-sizing: border-box;
  }

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 700px;

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
      background: #fff;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const instance = useTable(
    {
      columns,
      data,
    },
    useColumnPin
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
  } = instance

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => {
                return (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    {column.canPin && (
                      <div>
                        {column.pinType !== 'LEFT' && (
                          <button
                            onClick={() => {
                              column.setColumnPin('LEFT')
                            }}
                          >
                            {'<='}
                          </button>
                        )}
                        {column.pinType !== 'CENTER' && (
                          <button
                            onClick={() => {
                              column.setColumnPin('CENTER')
                            }}
                          >
                            Clear
                          </button>
                        )}
                        {column.pinType !== 'RIGHT' && (
                          <button
                            onClick={() => {
                              column.setColumnPin('RIGHT')
                            }}
                          >
                            {'=>'}
                          </button>
                        )}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)

            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        <pre>
          <code>{JSON.stringify(state.columnPin, null, 2)}</code>
        </pre>
        <pre>
          <code>{JSON.stringify(state.columnOrder, null, 2)}</code>
        </pre>
      </div>
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
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
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
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(10), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App

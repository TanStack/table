import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useTable, useStream } from 'react-table'
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

function Table({ columns, data, streamInfo }) {
  const { isLoading, isStreaming, totalRecords } = streamInfo
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          {isStreaming ? (
            <progress value={data.length / totalRecords} />
          ) : data.length ? (
            'Loaded!'
          ) : null}
          <table {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>
                      {column.render('Header')}
                    </th>
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
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </>
      )}
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

  // const data = React.useMemo(() => makeData(20), [])

  const { rows: data, isStreaming, totalRecords, isLoading } = useStream(
    useCallback(() => makeData(20), [])
  )

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        streamInfo={{ isStreaming, totalRecords, isLoading }}
      />
    </Styles>
  )
}

export default App

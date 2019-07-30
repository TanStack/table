import React from 'react'
import styled from 'styled-components'
import { useTable, useExpanded } from 'react-table'

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

function Table({ columns: userColumns, data, SubComponent }) {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    columns,
    state: [{ expanded }],
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded
  )

  return (
    <>
      <pre>
        <code>{JSON.stringify({ expanded }, null, 2)}</code>
      </pre>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
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
                <>
                  <tr {...row.getRowProps()}>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                  {!row.subRows.length && row.isExpanded ? (
                    <tr>
                      <td colSpan={columns.length}>{SubComponent({ row })}</td>
                    </tr>
                  ) : null}
                </>
              )
          )}
        </tbody>
      </table>
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
    </>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        Cell: ({ row }) => (
          <span
            style={{
              cursor: 'pointer',
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={() => row.toggleExpanded()}
          >
            {row.isExpanded ? '👇' : '👉'}
          </span>
        ),
      },
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

  const data = React.useMemo(() => makeData(5, 5, 5), [])

  return (
    <Styles>
      <Table
        columns={columns}
        data={data}
        SubComponent={({ row }) => (
          <pre>
            <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
          </pre>
        )}
      />
    </Styles>
  )
}

export default App

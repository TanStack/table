import React from 'react'
import styled from 'styled-components'
import { useTable, useColumnSummary } from 'react-table'

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

    tfoot {
      tr:first-child {
        td {
          border-top: 2px solid black;
        }
      }
      font-weight: bolder;
    }
  }
`

// Define a default UI for column summaries
function DefaultColumnSummary({ column: { columnSummary, setColumnSummary } }) {
  const summaryFns = [
    'count',
    'uniqueCount',
    'sum',
    'min',
    'max',
    'median',
    'average',
    'minMax',
  ]

  return (
    <div>
      <select
        value={columnSummary.type}
        onChange={e => {
          setColumnSummary(e.target.value)
        }}
      >
        {summaryFns.map((option, i) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <small> {columnSummary.value}</small>
    </div>
  )
}

// Define a Column Summary UI for `Status` column
function StatusColumnSummary({ column: { columnSummary, setColumnSummary } }) {
  const summaryFns = ['count', 'uniqueCount', 'customSummaryFn']

  return (
    <div>
      <select
        value={columnSummary.type}
        onChange={e => {
          setColumnSummary(e.target.value)
        }}
      >
        {summaryFns.map((option, i) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <small> {columnSummary.value}</small>
    </div>
  )
}

// Custom column summary functions
const columnSummaryFns = {
  customSummaryFn: (values = []) => {
    let obj = {}
    values.forEach(value => {
      obj[value] = obj[value] ? ++obj[value] : 1
    })

    let arr = []
    for (let k in obj) {
      arr.push(obj[k] + '-' + k.slice(0, 1).toUpperCase())
    }
    return arr.join('; ')
  },
}

function Table({ columns, data }) {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Column Summary UI
      ColumnSummary: DefaultColumnSummary,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    state: { columnSummary },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      columnSummaryFns,
    },
    useColumnSummary
  )

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <>
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            </>
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
        <tfoot>
          {footerGroups.slice(0, 1).map(group => (
            <tr {...group.getFooterGroupProps()}>
              {group.headers.map(column => (
                <td {...column.getFooterProps()}>
                  {column.hasColumnSummary && column.render('ColumnSummary')}
                </td>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div>
        <pre>{JSON.stringify(columnSummary, null, 2)}</pre>
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
            columnSummaryFn: 'uniqueCount',
            ColumnSummary: ({ column: { columnSummary } }) => (
              <small>Unique Count: {columnSummary.value}</small>
            ),
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            disableColumnSummary: true,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            columnSummaryFn: 'average',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            columnSummaryFn: 'max',
          },
          {
            Header: 'Status',
            accessor: 'status',
            columnSummaryFn: 'customSummaryFn',
            ColumnSummary: StatusColumnSummary,
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            columnSummaryFn: 'min',
          },
        ],
      },
    ],
    []
  )

  const data = React.useMemo(() => makeData(8), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App

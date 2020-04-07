import React from 'react'
import styled from 'styled-components'
import { useTable, useAbsoluteLayout } from 'react-table'

import makeData from './makeData'

const Styles = styled.div`
  padding: 1rem;

  * {
    box-sizing: border-box;
  }

  .table {
    border: 1px solid #000;
    max-width: 700px;
    overflow-x: auto;
  }

  .header {
    font-weight: bold;
  }

  .rows {
    overflow-y: auto;
  }

  .row {
    border-bottom: 1px solid #000;
    height: 32px;

    &.body {
      :last-child {
        border: 0;
      }
    }
  }

  .cell {
    height: 100%;
    line-height: 30px;
    border-right: 1px solid #000;
    padding-left: 5px;

    :last-child {
      border: 0;
    }
  }
`

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useAbsoluteLayout
  )

  // Render the UI for your table
  return (
    <div {...getTableProps()} className="table">
      <div>
        {headerGroups.map(headerGroup => (
          <div
            {...headerGroup.getHeaderGroupProps()}
            className="row header-group"
          >
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="cell header">
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="rows" {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <div {...row.getRowProps()} className="row body">
              {row.cells.map((cell, index) => (
                <div {...cell.getCellProps()} key={index} className="cell">
                  {cell.render('Cell')}
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
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
            width: 50,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            width: 60,
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

  const data = React.useMemo(() => makeData(20), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App

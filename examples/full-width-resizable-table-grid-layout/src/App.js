import React from 'react'
import styled from 'styled-components'
import {
  useTable,
  useResizeColumns,
  useGridLayout
} from 'react-table'

import makeData from './makeData'

const Styles = styled.div`
  padding: 1rem;
  ${'' /* These styles are suggested for the table fill all available space in its containing element */}
  display: block;
  ${'' /* These styles are required for a horizontaly scrollable table overflow */}
  overflow: auto;

  .table {
    border: 1px solid black;
    background-color: black;
    grid-gap: 1px;

    .cell,
    .header {
      padding: 0.5rem;
      background-color: white;

      .resizer {
        right: 0;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 1;
        ${'' /* prevents from scrolling while dragging on touch devices */}
        touch-action :none;
  
        &.isResizing {
          background: red;
        }
      }
    }
  }
`

function Table({ columns, data }) {
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data
    },
    useResizeColumns,
    useGridLayout,
  )

  return (
    <div {...getTableProps()} className="table">
      {headerGroups.map(headerGroup => (
        headerGroup.headers.map(column => (
          <div key={column.id} {...column.getHeaderProps()} className="cell header">
            {column.render('Header')}
            {column.canResize && (
              <div
                {...column.getResizerProps()}
                className={`resizer ${
                  column.isResizing ? 'isResizing' : ''
                  }`}
              />
            )}
          </div>
        ))
      ))}
      {rows.map(row =>
        prepareRow(row) || (
          row.cells.map(cell => (
            <div {...cell.getCellProps()} className="cell">
              {cell.render('Cell')}
            </div>
          ))
        )
      )}
    </div>
  )
}

function App() {
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
        width: 50,
        align: 'right',
      },
      {
        Header: 'Visits',
        accessor: 'visits',
        width: 50,
        align: 'right',
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

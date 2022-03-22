import React from 'react'

import {
  DataTable,
  DataTableCell,
  DataTableHeadCell,
  DataTableRow,
  DataTableBody,
  DataTableContent,
  DataTableHead,
} from '@rmwc/data-table'

import { useTable } from 'react-table'

import makeData from './makeData'

import '@material/data-table/dist/mdc.data-table.css'
import '@rmwc/data-table/data-table.css'
import '@rmwc/icon/icon.css'

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <DataTable {...getTableProps()}>
      <DataTableHead>
        {headerGroups.map(headerGroup => (
          <DataTableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <DataTableHeadCell {...column.getHeaderProps()}>
                {column.render('Header')}
              </DataTableHeadCell>
            ))}
          </DataTableRow>
        ))}
      </DataTableHead>
      <DataTableBody>
        <DataTableContent>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <DataTableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <DataTableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </DataTableCell>
                  )
                })}
              </DataTableRow>
            )
          })}
        </DataTableContent>
      </DataTableBody>
    </DataTable>
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

  const data = React.useMemo(() => makeData(20), [])

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  )
}

export default App

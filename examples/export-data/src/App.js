import React from 'react'
import styled from 'styled-components'
import { useTable, useSortBy, useFilters, useExportData } from 'react-table'
import Papa from 'papaparse'
import XLSX from 'xlsx'

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

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

const defaultColumn = {
  Filter: DefaultColumnFilter,
}

function getExportFileBlob({ columns, data, fileType, fileName }) {
  if (fileType === 'csv') {
    // CSV example
    const headerNames = columns.map(col => col.exportValue)
    const csvString = Papa.unparse({ fields: headerNames, data })
    return new Blob([csvString], { type: 'text/csv' })
  } else if (fileType === 'xlsx') {
    // XLSX example

    const header = columns.map(c => c.exportValue)
    const compatibleData = data.map(row => {
      const obj = {}
      header.forEach((col, index) => {
        obj[col] = row[index]
      })
      return obj
    })

    let wb = XLSX.utils.book_new()
    let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
      header,
    })
    XLSX.utils.book_append_sheet(wb, ws1, 'React Table Data')
    XLSX.writeFile(wb, `${fileName}.xlsx`)

    // Returning false as downloading of file is already taken care of
    return false
  }

  // Other formats goes here
  return null
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    exportData,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      getExportFileBlob,
    },
    useFilters,
    useSortBy,
    useExportData
  )

  return (
    <>
      <button
        onClick={() => {
          exportData('csv', true)
        }}
      >
        Export All as CSV
      </button>
      <button
        onClick={() => {
          exportData('csv', false)
        }}
      >
        Export Current View as CSV
      </button>

      <button
        onClick={() => {
          exportData('xlsx', true)
        }}
      >
        Export All as xlsx
      </button>
      <button
        onClick={() => {
          exportData('xlsx', false)
        }}
      >
        Export Current View as xlsx
      </button>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <div>
                    {column.canFilter ? column.render('Filter') : null}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                </th>
              ))}
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
      <br />
      <div>Showing the first 20 results of {rows.length} rows</div>
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

  const data = React.useMemo(() => makeData(20), [])

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default App

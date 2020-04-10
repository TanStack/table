import React from 'react'

import { render, fireEvent } from '../../../test-utils/react-testing'
import { useTable } from '../../hooks/useTable'
import { useSortBy } from '../useSortBy'
import { useExportData } from '../useExportData'

const data = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 29,
    visits: 100,
    status: 'In Relationship',
    progress: 80,
  },
  {
    firstName: 'derek',
    lastName: 'perkins',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'bergevin',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

function Table({ columns, data }) {
  const [testData, setTestData] = React.useState({})

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
      getExportFileBlob: ({ columns, data, fileType, fileName }) => {
        const columnValue = columns.map(c => c.exportValue)
        setTestData({ columnValue, data, fileType, fileName })
        return false
      },
      getExportFileName: ({ all }) => {
        return `${all ? 'exported-all' : 'current-view-only'}`
      },
    },
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
        Export All
      </button>
      <button
        onClick={() => {
          exportData('csv', false)
        }}
      >
        Export Current View
      </button>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                // Add the sorting props to control sorting. For this example so as to check currentView download
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) =>
              prepareRow(row) || (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )
          )}
        </tbody>
      </table>
      <pre>Test Data = {JSON.stringify(testData, null, 2)}</pre>
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
            getColumnExportValue: col => `Modified ${col.Header}`,
            getCellExportValue: (row, column) => `${row.values[column.id]}..`,
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
            disableExport: true,
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            disableExport: true,
          },
        ],
      },
    ],
    []
  )

  return <Table columns={columns} data={data} />
}

test('renders a exportable table', () => {
  const rendered = render(<App />)

  // Clicking to sort column, so as to verify `All` and `current` view functionality
  fireEvent.click(rendered.getByText('First Name'))

  // Export All
  fireEvent.click(rendered.getByText('Export All'))

  expect(rendered.queryByText(/Test Data /).textContent).toMatchInlineSnapshot(`
    "Test Data = {
      \\"columnValue\\": [
        \\"First Name\\",
        \\"Modified Last Name\\",
        \\"Age\\",
        \\"Visits\\"
      ],
      \\"data\\": [
        [
          \\"tanner\\",
          \\"linsley..\\",
          29,
          100
        ],
        [
          \\"derek\\",
          \\"perkins..\\",
          40,
          40
        ],
        [
          \\"joe\\",
          \\"bergevin..\\",
          45,
          20
        ]
      ],
      \\"fileType\\": \\"csv\\",
      \\"fileName\\": \\"exported-all\\"
    }"
  `)

  // Export current view
  fireEvent.click(rendered.getByText('Export Current View'))

  expect(rendered.queryByText(/Test Data /).textContent).toMatchInlineSnapshot(`
    "Test Data = {
      \\"columnValue\\": [
        \\"First Name\\",
        \\"Modified Last Name\\",
        \\"Age\\",
        \\"Visits\\"
      ],
      \\"data\\": [
        [
          \\"derek\\",
          \\"perkins..\\",
          40,
          40
        ],
        [
          \\"joe\\",
          \\"bergevin..\\",
          45,
          20
        ],
        [
          \\"tanner\\",
          \\"linsley..\\",
          29,
          100
        ]
      ],
      \\"fileType\\": \\"csv\\",
      \\"fileName\\": \\"current-view-only\\"
    }"
  `)
})

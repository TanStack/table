import '@testing-library/react/cleanup-after-each'
import '@testing-library/jest-dom/extend-expect'
// NOTE: jest-dom adds handy assertions to Jest and is recommended, but not required

import React from 'react'
import { render } from '@testing-library/react'
import useTable from '../../hooks/useTable'
import useSortBy from '../useSortBy'

const data = React.useMemo(
  () => [
    {
      firstName: 'tanner',
      lastName: 'linsley',
      age: 29,
      visits: 100,
      status: 'In Relationship',
      progress: 50,
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
  ],
  []
)

const defaultColumn = {
  Cell: ({ value, column: { id } }) => `${id}: ${value}`,
}

function Table({ columns, data }) {
  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useSortBy
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render('Header')}
                {/* Add a sort direction indicator */}
                <span>
                  {column.sorted ? (column.sortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
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
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
        )}
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

  return <Table columns={columns} data={data} />
}

test('renders a sortable table', () => {
  const { getAllByText } = render(<App />)

  const firstNames = getAllByText('firstName')

  console.log(firstNames)

  // expect(getByText('tanner')).toBeInTheDocument()
  // expect(getByText('linsley')).toBeInTheDocument()
  // expect(getByText('29')).toBeInTheDocument()
  // expect(getByText('100')).toBeInTheDocument()
  // expect(getByText('In Relationship')).toBeInTheDocument()
  // expect(getByText('50')).toBeInTheDocument()
})

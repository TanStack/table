import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useTable } from '../../hooks/useTable'
import { useFilters } from '../useFilters'
import { useGlobalFilter } from '../useGlobalFilter'

const data = [
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
  {
    firstName: 'jaylen',
    lastName: 'linsley',
    age: 26,
    visits: 99,
    status: 'In Relationship',
    progress: 70,
  },
]

const defaultColumn = {
  Cell: ({ cell: { value }, column: { id } }) => `${id}: ${value}`,
  Filter: ({ column: { filterValue, setFilter } }) => (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder="Search..."
    />
  ),
}

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    flatColumns,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useGlobalFilter
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                {column.canFilter ? column.render('Filter') : null}
              </th>
            ))}
          </tr>
        ))}
        <tr>
          <th
            colSpan={flatColumns.length}
            style={{
              textAlign: 'left',
            }}
          >
            <span>
              <input
                value={state.globalFilter || ''}
                onChange={e => {
                  setGlobalFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
                }}
                placeholder={`Global search...`}
                style={{
                  fontSize: '1.1rem',
                  border: '0',
                }}
              />
            </span>
          </th>
        </tr>
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) =>
            prepareRow(row) || (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
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

test('renders a filterable table', () => {
  const { getAllByPlaceholderText, getByPlaceholderText, asFragment } = render(
    <App />
  )

  const globalFilterInput = getByPlaceholderText('Global search...')
  const filterInputs = getAllByPlaceholderText('Search...')

  const beforeFilter = asFragment()

  fireEvent.change(filterInputs[1], { target: { value: 'l' } })

  const afterFilter1 = asFragment()

  fireEvent.change(filterInputs[1], { target: { value: 'er' } })

  const afterFilter2 = asFragment()

  fireEvent.change(filterInputs[1], { target: { value: '' } })

  const afterFilter3 = asFragment()

  fireEvent.change(globalFilterInput, { target: { value: 'li' } })

  const afterFilter4 = asFragment()

  expect(beforeFilter).toMatchSnapshot()
  expect(afterFilter1).toMatchSnapshot()
  expect(afterFilter2).toMatchSnapshot()
  expect(afterFilter3).toMatchSnapshot()
  expect(afterFilter4).toMatchSnapshot()
})

import React from 'react'
import { render, fireEvent } from '../../../test-utils/react-testing'
import { useTable } from '../../hooks/useTable'
import { useFilters } from '../useFilters'
import { useGlobalFilter } from '../useGlobalFilter'

const makeData = () => [
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

function App() {
  const [data, setData] = React.useState(makeData)
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
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

  const reset = () => setData(makeData())

  return (
    <>
      <button onClick={reset}>Reset Data</button>
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
              colSpan={visibleColumns.length}
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
    </>
  )
}

test('renders a filterable table', async () => {
  const rendered = render(<App />)

  const resetButton = rendered.getByText('Reset Data')
  const globalFilterInput = rendered.getByPlaceholderText('Global search...')
  const filterInputs = rendered.getAllByPlaceholderText('Search...')

  fireEvent.change(filterInputs[1], { target: { value: 'l' } })
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual(['firstName: tanner', 'firstName: jaylen'])

  fireEvent.change(filterInputs[1], { target: { value: 'er' } })
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual(['firstName: derek', 'firstName: joe'])

  fireEvent.change(filterInputs[2], { target: { value: 'nothing' } })
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual([])

  fireEvent.change(filterInputs[1], { target: { value: '' } })
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual([])

  fireEvent.change(filterInputs[2], { target: { value: '' } })
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual([
    'firstName: tanner',
    'firstName: derek',
    'firstName: joe',
    'firstName: jaylen',
  ])

  fireEvent.change(globalFilterInput, { target: { value: 'li' } })
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual(['firstName: tanner', 'firstName: joe', 'firstName: jaylen'])

  fireEvent.click(resetButton)
  expect(
    rendered
      .queryAllByRole('row')
      .slice(3)
      .map(row => Array.from(row.children)[0].textContent)
  ).toEqual([
    'firstName: tanner',
    'firstName: derek',
    'firstName: joe',
    'firstName: jaylen',
  ])
})

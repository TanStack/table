import '@testing-library/react/cleanup-after-each'
import '@testing-library/jest-dom/extend-expect'

import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useTable } from '../../hooks/useTable'
import { useRowSelect } from '../useRowSelect'

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

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    state: [{ selectedRows }],
  } = useTable(
    {
      columns,
      data,
    },
    useRowSelect
  )

  // Render the UI for your table
  return (
    <>
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
      <p>Selected Rows: {selectedRows.length}</p>
      <pre>
        <code>{JSON.stringify({ selectedRows }, null, 2)}</code>
      </pre>
    </>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      // Let's make a column for selection
      {
        id: 'selection',
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <label>
              <input type="checkbox" {...getToggleAllRowsSelectedProps()} />{' '}
              Select All
            </label>
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div>
            <label>
              <input type="checkbox" {...row.getToggleRowSelectedProps()} />{' '}
              Select Row
            </label>
          </div>
        ),
      },
      {
        id: 'selectedStatus',
        Cell: ({ row }) => (
          <div>{row.selected ? 'Selected' : 'Not Selected'}</div>
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

  return <Table columns={columns} data={data} />
}

test('renders a table with seletable rows', () => {
  const { getByLabelText, getAllByLabelText, asFragment } = render(<App />)

  const fragment1 = asFragment()

  fireEvent.click(getByLabelText('Select All'))

  const fragment2 = asFragment()

  fireEvent.click(getByLabelText('Select All'))

  const fragment3 = asFragment()

  fireEvent.click(getAllByLabelText('Select Row')[0])
  fireEvent.click(getAllByLabelText('Select Row')[2])

  const fragment4 = asFragment()

  expect(fragment1).toMatchDiffSnapshot(fragment2)
  expect(fragment2).toMatchDiffSnapshot(fragment3)
  expect(fragment3).toMatchDiffSnapshot(fragment4)
})

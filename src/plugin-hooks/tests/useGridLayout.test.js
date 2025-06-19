import React from 'react'
import { useTable } from '../../hooks/useTable'
import { useGridLayout } from '../useGridLayout'
import { render } from '../../../test-utils/react-testing'

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
    age: 30,
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
    const defaultColumn = React.useMemo(
      () => ({
        minWidth: 30,
        width: 'auto',
        maxWidth: 400,
      }),
      []
    )

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useGridLayout
  )

  return (
    <div {...getTableProps()} className="table">
      {headerGroups.map(headerGroup =>
        headerGroup.headers.map(column => (
          <div
            key={column.id}
            {...column.getHeaderProps()}
            className="cell header"
          >
            {column.render('Header')}
          </div>
        ))
      )}
      {rows.map(
        row =>
          prepareRow(row) ||
          row.cells.map(cell => (
            <div {...cell.getCellProps()} className="cell">
              {cell.render('Cell')}
            </div>
          ))
      )}
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
            width: 'auto',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            width: 350,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            minWidth: 300,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            maxWidth: 150,
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

test('renders a table', () => {
  const rendered = render(<App />)

  const [table] = rendered.queryAllByRole('table')

  expect(table.getAttribute('style')).toEqual(
    'display: grid; grid-template-columns: auto 350px auto auto auto auto;'
  )
})

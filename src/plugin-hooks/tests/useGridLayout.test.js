import React from 'react'
import { useTable } from '../../hooks/useTable'
import { useGridLayout } from '../useGridLayout'
import { render, fireEvent } from '../../../test-utils/react-testing'

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
  const {
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
    toggleHideColumn,
  } = useTable(
    {
      columns,
      data,
    },
    useGridLayout
  )

  const testHiddenColumn = () => {
    toggleHideColumn('visits')
  }

  return (
    <>
      <button onClick={() => testHiddenColumn({})}>Hide Test Column</button>
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
    </>
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
        width: '4rem',
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
    []
  )

  return <Table columns={columns} data={data} />
}

test('renders a table', () => {
  render(<App />)
})

test('respects column.width', () => {
  const rendered = render(<App />)
  const [table] = rendered.queryAllByRole('table')

  expect(table.getAttribute('style')).toEqual(
    'display: grid; grid-template-columns: auto auto 4rem auto auto auto;'
  )
})

test('respects hidden columns', () => {
  const rendered = render(<App />)
  const [table] = rendered.queryAllByRole('table')

  fireEvent.click(rendered.getByText('Hide Test Column'))

  expect(table.getAttribute('style')).toEqual(
    'display: grid; grid-template-columns: auto auto 4rem auto auto;'
  )
})

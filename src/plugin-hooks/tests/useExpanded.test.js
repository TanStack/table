import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useTable } from '../../hooks/useTable'
import { useExpanded } from '../useExpanded'

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

const data = makeData()

data[0].subRows = makeData()
data[0].subRows[0].subRows = makeData()
data[0].subRows[0].subRows[0].subRows = makeData()

function Table({ columns: userColumns, data, SubComponent }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    flatColumns,
    state: { expanded },
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded
  )

  return (
    <>
      <pre>
        <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
      </pre>
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
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            const { key, ...rowProps } = row.getRowProps()
            return (
              <React.Fragment key={key}>
                <tr {...rowProps}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
                {!row.subRows.length && row.isExpanded ? (
                  <tr>
                    <td colSpan={flatColumns.length}>
                      {SubComponent({ row })}
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: () => null,
        id: 'expander',
        Cell: ({ row }) => (
          <span
            style={{
              cursor: 'pointer',
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={() => row.toggleExpanded()}
          >
            {row.isExpanded ? '👇' : '👉'}
          </span>
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

  return (
    <Table
      columns={columns}
      data={data}
      SubComponent={({ row }) => (
        <pre>
          <code>{JSON.stringify({ values: row.values }, null, 2)}</code>
        </pre>
      )}
    />
  )
}

test('renders an expandable table', () => {
  const { getAllByText, asFragment } = render(<App />)

  let expandButtons = getAllByText('👉')

  const before = asFragment()

  fireEvent.click(expandButtons[0])

  const after1 = asFragment()

  expandButtons = getAllByText('👉')
  fireEvent.click(expandButtons[0])

  const after2 = asFragment()

  expandButtons = getAllByText('👉')
  fireEvent.click(expandButtons[0])

  const after3 = asFragment()

  expandButtons = getAllByText('👉')
  fireEvent.click(expandButtons[0])

  const after4 = asFragment()

  expandButtons = getAllByText('👇')
  expandButtons.reverse().forEach(button => {
    fireEvent.click(button)
  })

  const after5 = asFragment()

  expect(before).toMatchDiffSnapshot(after1)
  expect(after1).toMatchDiffSnapshot(after2)
  expect(after2).toMatchDiffSnapshot(after3)
  expect(after3).toMatchDiffSnapshot(after4)
  expect(after4).toMatchDiffSnapshot(after5)
})

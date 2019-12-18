import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { useTable } from '../../hooks/useTable'
import { useGroupBy } from '../useGroupBy'
import { useExpanded } from '../useExpanded'

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
  Filter: ({ filterValue, setFilter }) => (
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
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        groupBy: ["Column Doesn't Exist"],
      },
    },
    useGroupBy,
    useExpanded
  )

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>
                {column.canGroupBy ? (
                  // If the column can be grouped, let's add a toggle
                  <span {...column.getGroupByToggleProps()}>
                    {column.isGrouped ? '🛑' : '👊'}
                  </span>
                ) : null}
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
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        <>
                          <span
                            style={{
                              cursor: 'pointer',
                            }}
                            onClick={() => row.toggleExpanded()}
                          >
                            {row.isExpanded ? '👇' : '👉'}
                          </span>
                          {cell.render('Cell')} ({row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        cell.render('Aggregated')
                      ) : cell.isRepeatedValue ? null : (
                        cell.render('Cell')
                      )}
                    </td>
                  )
                })}
              </tr>
            )
        )}
      </tbody>
    </table>
  )
}

function roundedMedian(values) {
  let min = values[0] || ''
  let max = values[0] || ''

  values.forEach(value => {
    min = Math.min(min, value)
    max = Math.max(max, value)
  })

  return Math.round((min + max) / 2)
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
            aggregate: ['sum', 'count'],
            Aggregated: ({ cell: { value } }) => `${value} Names`,
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
            aggregate: ['sum', 'uniqueCount'],
            Aggregated: ({ cell: { value } }) => `${value} Unique Names`,
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
            aggregate: 'average',
            Aggregated: ({ cell: { value } }) => `${value} (avg)`,
          },
          {
            Header: 'Visits',
            accessor: 'visits',
            aggregate: 'sum',
            Aggregated: ({ cell: { value } }) => `${value} (total)`,
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
            aggregate: roundedMedian,
            Aggregated: ({ cell: { value } }) => `${value} (med)`,
          },
        ],
      },
    ],
    []
  )

  return <Table columns={columns} data={data} />
}

test('renders a groupable table', () => {
  const { getAllByText, asFragment } = render(<App />)

  const groupByButtons = getAllByText('👊')

  const beforeGrouping = asFragment()

  fireEvent.click(groupByButtons[1])

  const afterGrouping1 = asFragment()

  fireEvent.click(groupByButtons[3])

  const afterGrouping2 = asFragment()

  expect(beforeGrouping).toMatchDiffSnapshot(afterGrouping1)
  expect(afterGrouping1).toMatchDiffSnapshot(afterGrouping2)
})

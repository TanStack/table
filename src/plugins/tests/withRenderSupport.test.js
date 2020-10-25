import React from 'react'
import { render } from '@testing-library/react'
import { useTable } from '../../hooks/useTable'
import {withRenderSupport} from "../withRenderSupport";

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
]

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
  } = useTable({
    columns,
    data,
    plugins: [
        withRenderSupport
    ],
  })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(headerCell => (
              <th {...headerCell.getHeaderProps()}>
                {headerCell.Renderer()}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(
          (row, i) => (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}><cell.Renderer /></td>
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
        Header: "Name",
        columns: [
          {
            accessor: 'firstName',
          },
          {
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: "Info",
        columns: [
          {
            accessor: 'age',
          },
          {
            accessor: 'visits',
          },
          {
            accessor: 'status',
          },
          {
            id: 'my-progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  )

  return <Table columns={columns} data={data} />
}

describe('withRenderSupport', () => {
    test('renders a basic table', () => {
      const rtl = render(<App />)

      // test header rendering
      expect(rtl.getByText('age')).toBeInTheDocument()
      expect(rtl.getByText('visits')).toBeInTheDocument()
      expect(rtl.getByText('status')).toBeInTheDocument()
      expect(rtl.getByText('my-progress')).toBeInTheDocument()

      // test value cell rendering
      expect(rtl.getByText('tanner')).toBeInTheDocument()
      expect(rtl.getByText('linsley')).toBeInTheDocument()
      expect(rtl.getByText('29')).toBeInTheDocument()
      expect(rtl.getByText('100')).toBeInTheDocument()
      expect(rtl.getByText('In Relationship')).toBeInTheDocument()
      expect(rtl.getByText('50')).toBeInTheDocument()
    })
    test( 'renders according to user column definition', () => {
      const rtl = render(<Table data={data}
          columns={[
              {
                Header: 'Name',
                columns: [
                  {
                    Header: 'First Name',
                    accessor: 'firstName',
                    Cell: (cell) => "first name: " + cell.value
                  },
                  {
                    Header: 'Last Name',
                    accessor: 'lastName',
                    Cell: (cell) => "last name: " + cell.value
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
            ]}
      />)

      // test header rendering
      expect(rtl.getByText('Info')).toBeInTheDocument()
      expect(rtl.getByText('Profile Progress')).toBeInTheDocument()
      expect(rtl.getByText('First Name')).toBeInTheDocument()

      expect(rtl.getByText('first name: tanner')).toBeInTheDocument()
      expect(rtl.getByText('last name: linsley')).toBeInTheDocument()
    })

})


import { useTable } from '../useTable'
import { getHeaderIds, getRowValues } from '../../../test-utils'
import { renderHook } from '@testing-library/react-hooks'

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

const columns = [
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
]

describe('useTable', () => {
  it('renders a basic table', () => {
    const { result } = renderHook(
      ({ initialValue }) => useTable(initialValue),
      {
        initialProps: {
          initialValue: {
            data,
            columns,
          },
        },
      }
    )

    expect(getHeaderIds(result.current)).toEqual([
      ['Name', 'Info'],
      ['firstName', 'lastName', 'age', 'visits', 'status', 'progress'],
    ])

    expect(getRowValues(result.current)).toEqual([
      ['tanner', 'linsley', 29, 100, 'In Relationship', 50],
      ['derek', 'perkins', 40, 40, 'Single', 80],
      ['joe', 'bergevin', 45, 20, 'Complicated', 10],
    ])
  })
})

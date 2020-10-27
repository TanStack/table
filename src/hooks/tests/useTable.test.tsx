import React from 'react'
import { render } from '@testing-library/react'
import { useTable } from '../useTable'

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
    const states = []

    function App() {
      // Use the state and functions returned from useTable to build your UI
      const instance = useTable({
        columns,
        data,
      })

      states.push(instance)

      return null
    }

    const rtl = render(<App />)

    expect(states.length).toBe(1)
  })
})

import * as React from 'react'

import { act, renderHook } from '@testing-library/react-hooks'
import * as RTL from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  createTable,
  useTableInstance,
  getCoreRowModel,
} from '@tanstack/react-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const table = createTable().setRowType<Person>()

const defaultData: Person[] = [
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

const defaultColumns = [
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  table.createGroup({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      table.createGroup({
        header: 'More Info',
        columns: [
          table.createDataColumn('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          table.createDataColumn('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          table.createDataColumn('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]

describe('core', () => {
  it('renders a table with markup', () => {
    const Table = () => {
      const [data] = React.useState<Person[]>(() => [...defaultData])
      const [columns] = React.useState<typeof defaultColumns>(() => [
        ...defaultColumns,
      ])
      const [columnVisibility, setColumnVisibility] = React.useState({})

      const rerender = React.useReducer(() => ({}), {})[1]

      const instance = useTableInstance(table, {
        data,
        columns,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
          columnVisibility,
        },
        getCoreRowModel: getCoreRowModel(),
        // debug: true,
      })

      return (
        <div className="p-2">
          <table>
            <thead>
              {instance.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : header.renderHeader()}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {instance.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{cell.renderCell()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {instance.getFooterGroups().map(footerGroup => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : header.renderFooter()}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
          <div className="h-4" />
          <button onClick={() => rerender()} className="border p-2">
            Rerender
          </button>
        </div>
      )
    }

    // let api: any;

    const rendered = RTL.render(<Table />)

    // RTL.screen.logTestingPlaygroundURL()

    RTL.screen.getByRole('table')
    expect(RTL.screen.getAllByRole('rowgroup').length).toEqual(3)
    expect(RTL.screen.getAllByRole('row').length).toEqual(9)
    expect(RTL.screen.getAllByRole('columnheader').length).toEqual(24)
    expect(RTL.screen.getAllByRole('cell').length).toEqual(18)

    expect(
      Array.from(rendered.container.querySelectorAll('thead > tr')).map(d =>
        Array.from(d.querySelectorAll('th')).map(d => [
          d.innerHTML,
          d.getAttribute('colspan'),
        ])
      )
    ).toMatchSnapshot()

    expect(
      Array.from(rendered.container.querySelectorAll('tbody > tr')).map(d =>
        Array.from(d.querySelectorAll('td')).map(d => d.innerHTML)
      )
    ).toMatchSnapshot()

    expect(
      Array.from(rendered.container.querySelectorAll('tfoot > tr')).map(d =>
        Array.from(d.querySelectorAll('th')).map(d => [
          d.innerHTML,
          d.getAttribute('colspan'),
        ])
      )
    ).toMatchSnapshot()
  })

  it('has a stable api', () => {
    const { result } = renderHook(() => {
      const rerender = React.useReducer(() => ({}), {})[1]

      const instance = useTableInstance(table, {
        data: defaultData,
        columns: defaultColumns,
        getCoreRowModel: getCoreRowModel(),
      })

      return {
        instance,
        rerender,
      }
    })

    const prev = result.current

    act(() => {
      result.current.rerender()
    })

    const next = result.current

    expect(prev).toStrictEqual(next)
  })

  it('can return the rowModel', () => {
    const { result } = renderHook(() => {
      const rerender = React.useReducer(() => ({}), {})[1]

      const instance = useTableInstance(table, {
        data: defaultData,
        columns: defaultColumns,
        getCoreRowModel: getCoreRowModel(),
      })

      return {
        instance,
        rerender,
      }
    })

    const rowModel = result.current.instance.getRowModel()

    expect(rowModel.rows.length).toEqual(3)
    expect(rowModel.flatRows.length).toEqual(3)
    expect(rowModel.rowsById['2']?.original).toEqual(defaultData[2])
  })
})

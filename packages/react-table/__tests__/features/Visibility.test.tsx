import * as React from 'react'

// import { renderHook } from '@testing-library/react-hooks'
import * as RTL from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  createTable,
  useTableInstance,
  getCoreRowModelSync,
} from '@tanstack/react-table'

type Row = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const table = createTable<{ Row: Row }>()

const defaultData: Row[] = [
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

const defaultColumns = table.createColumns([
  table.createGroup({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      table.createDataColumn('firstName', {
        cell: info => info.value,
        footer: props => props.column.id,
      }),
      table.createDataColumn(row => row.lastName, {
        id: 'lastName',
        cell: info => info.value,
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
])

describe('useTableInstance', () => {
  it('can toggle column visibility', () => {
    const Table = () => {
      const [data] = React.useState<Row[]>(() => [...defaultData])
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
        getCoreRowModel: getCoreRowModelSync(),
        // debug: true,
      })

      return (
        <div className="p-2">
          <div className="inline-block border border-black shadow rounded">
            <div className="px-1 border-b border-black">
              <label>
                <input {...instance.getToggleAllColumnsVisibilityProps()} />{' '}
                Toggle All
              </label>
            </div>
            {instance.getAllLeafColumns().map(column => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input {...column.getToggleVisibilityProps()} /> {column.id}
                  </label>
                </div>
              )
            })}
          </div>
          <div className="h-4" />
          <table {...instance.getTableProps()}>
            <thead>
              {instance.getHeaderGroups().map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(header => (
                    <th {...header.getHeaderProps()}>
                      {header.isPlaceholder ? null : header.renderHeader()}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...instance.getTableBodyProps()}>
              {instance.getRowModel().rows.map(row => (
                <tr {...row.getRowProps()}>
                  {row.getVisibleCells().map(cell => (
                    <td {...cell.getCellProps()}>{cell.renderCell()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {instance.getFooterGroups().map(footerGroup => (
                <tr {...footerGroup.getFooterGroupProps()}>
                  {footerGroup.headers.map(header => (
                    <th {...header.getFooterProps()}>
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

    let snapIndex = 0

    const snap = (name: string) => {
      expect({
        headers: Array.from(
          rendered.container.querySelectorAll('thead > tr')
        ).map(d =>
          Array.from(d.querySelectorAll('th')).map(d => [
            d.innerHTML,
            d.getAttribute('colspan'),
          ])
        ),
        rows: Array.from(rendered.container.querySelectorAll('tbody > tr')).map(
          d => Array.from(d.querySelectorAll('td')).map(d => d.innerHTML)
        ),
        footers: Array.from(
          rendered.container.querySelectorAll('tfoot > tr')
        ).map(d =>
          Array.from(d.querySelectorAll('th')).map(d => [
            d.innerHTML,
            d.getAttribute('colspan'),
          ])
        ),
      }).toMatchSnapshot(`${snapIndex++} - ${name}`)
    }

    RTL.fireEvent.click(rendered.getByLabelText('Toggle All'))

    snap('after toggling all off')

    RTL.fireEvent.click(rendered.getByLabelText('Toggle All'))

    snap('after toggling all on')

    RTL.fireEvent.click(rendered.getByLabelText('firstName'))

    snap('after toggling firstName off')

    RTL.fireEvent.click(rendered.getByLabelText('firstName'))
    RTL.fireEvent.click(rendered.getByLabelText('visits'))
    RTL.fireEvent.click(rendered.getByLabelText('status'))
    RTL.fireEvent.click(rendered.getByLabelText('progress'))

    snap('after toggling More Info off')
  })
})

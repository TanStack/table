import * as React from 'react'

// import { renderHook } from '@testing-library/react-hooks'
import * as RTL from '@testing-library/react'
import { createTable } from '@tanstack/react-table'
import { act, renderHook } from '@testing-library/react-hooks'

type Row = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const table = createTable<Row>()

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
        header: <span>Last Name</span>,
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

describe('core', () => {
  it('renders a table with markup', () => {
    const Table = () => {
      const [data] = React.useState<Row[]>(() => [...defaultData])
      const [columns] = React.useState<typeof defaultColumns>(() => [
        ...defaultColumns,
      ])
      const [columnVisibility, setColumnVisibility] = React.useState({})

      const rerender = React.useReducer(() => ({}), {})[1]

      const instance = table.useTable({
        data,
        columns,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
          columnVisibility,
        },
        // debug: true,
      })

      return (
        <div className="p-2">
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

    // RTL.screen.logTestingPlaygroundURL();

    RTL.screen.getByRole('table')
    expect(RTL.screen.getAllByRole('rowgroup').length).toEqual(3)
    expect(RTL.screen.getAllByRole('row').length).toEqual(9)
    expect(RTL.screen.getAllByRole('columnheader').length).toEqual(12)
    expect(RTL.screen.getAllByRole('columnfooter').length).toEqual(12)
    expect(RTL.screen.getAllByRole('gridcell').length).toEqual(18)

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

      const instance = table.useTable({
        data: defaultData,
        columns: defaultColumns,
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

      const instance = table.useTable({
        data: defaultData,
        columns: defaultColumns,
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

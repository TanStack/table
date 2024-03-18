import '@builder.io/qwik/qwikloader.js'

import { $, render } from '@builder.io/qwik'
import './index.css'

import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  useQwikTable,
} from '../../../../packages/qwik-table/src/index'

import { component$ } from '@builder.io/qwik'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Person[] = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
  {
    firstName: 'Anxhi',
    lastName: 'Rroshi',
    age: 21,
    visits: 1,
    status: 'Unknown',
    progress: 99,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.group({
    id: 'hello',
    header: () => <span>Hello</span>,
    // footer: props => props.column.id,
    columns: [
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      columnHelper.group({
        header: 'More Info',
        columns: [
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]

const App = component$(() => {
  const table = useQwikTable({
    columns,
    data: defaultData,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  })

  return (
    <div>
      <table class="table">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const { column } = header
                const id = column.id
                return (
                  <th
                    key={id}
                    onClick$={$(() => {
                      const thisCol = table.getColumn(id)!
                      thisCol.toggleSorting()
                    })}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={99}>
              <div class="flex w-full justify-end">
                <div class="join">
                  <button
                    class="btn join-item"
                    onClick$={$(() => {
                      if (!table.getCanPreviousPage()) return
                      table.previousPage()
                    })}
                  >
                    Left
                  </button>
                  <button class="btn join-item">
                    Page {(table.getState().pagination.pageIndex || 0) + 1} of{' '}
                    {table.getPageCount()}
                  </button>
                  <button
                    class="btn join-item"
                    onClick$={$(() => {
                      if (!table.getCanNextPage()) return
                      table.nextPage()
                    })}
                  >
                    Right
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
})

render(document.getElementById('app') as HTMLElement, <App />)

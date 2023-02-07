import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'

type Person = {
  a: string
  b: string
  c: string
  d: string
  e: string
  f: string
  g: string
  h: string
  i: string
  j: string
}

const defaultColumns: ColumnDef<Person>[] = [
  {
    header: 'a-level-1',
    rowSpanGrow: 0,
    columns: [
      {
        accessorKey: 'a',
        rowSpanGrow: 1
      },
    ],
  },
  {
    header: 'b-level-1',
    rowSpanGrow: 1,
    columns: [
      {
        accessorKey: 'b-level-2',
        columns: [
          {
            accessorKey: 'b-level-3',
            columns: [
              {
                accessorKey: 'b',
                rowSpanGrow: 0
              },
            ],
          },
        ],
      },
    ],
  },
  {
    header: 'c-level-1',
    columns: [
      {
        accessorKey: 'c-level-2',
        columns: [
          {
            accessorKey: 'c-level-3',
            columns: [
              {
                accessorKey: 'c-level-4',
                columns: [
                  {
                    accessorKey: 'c',
                    rowSpanGrow: 0
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    accessorKey: 'd-level-1',
    columns: [
      {
        accessorKey: 'd-level-2',
        columns: [
          {
            accessorKey: 'd-level-3',
            columns: [
              {
                accessorKey: 'd-level-4',
                columns: [
                  {
                    accessorKey: 'd-level-5',
                    columns: [
                      {
                        accessorKey: 'd',
                        rowSpanGrow: 0
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    accessorKey: 'e',
    rowSpanGrow: 1
  }
]

function App() {
  const [data, setData] = React.useState(() => makeData(20))
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ])
  const [columnVisibility, setColumnVisibility] = React.useState({})

  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <div className="inline-block border border-black shadow rounded">
        <div className="px-1 border-b border-black">
          <label>
            <input
              {...{
                type: 'checkbox',
                checked: table.getIsAllColumnsVisible(),
                onChange: table.getToggleAllColumnsVisibilityHandler(),
              }}
            />{' '}
            Toggle All
          </label>
        </div>
        {table.getAllLeafColumns().map(column => {
          return (
            <div key={column.id} className="px-1">
              <label>
                <input
                  {...{
                    type: 'checkbox',
                    checked: column.getIsVisible(),
                    onChange: column.getToggleVisibilityHandler(),
                  }}
                />{' '}
                {column.id}
              </label>
            </div>
          )
        })}
      </div>
      <div className="h-4" />
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                if (header.isCover) {
                  return null
                }
                return (
                  <th
                    key={header.id}
                    rowSpan={header.rowSpan}
                    colSpan={header.colSpan}
                  >
                    {flexRender(
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
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
      <div className="h-4" />
      <pre>{JSON.stringify(table.getState().columnVisibility, null, 2)}</pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

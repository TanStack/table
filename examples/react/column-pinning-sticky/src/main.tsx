import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { makeData, Person } from './makeData'
import { faker } from '@faker-js/faker'

const defaultColumns: ColumnDef<Person>[] = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: info => info.getValue(),
    footer: props => props.column.id,
    size: 180,
  },
  {
    accessorFn: row => row.lastName,
    id: 'lastName',
    cell: info => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: props => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'age',
    id: 'age',
    header: 'Age',
    footer: props => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: 'Visits',
    footer: props => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: props => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    footer: props => props.column.id,
    size: 180,
  },
]

function App() {
  const [data, setData] = React.useState(() => makeData(30))
  const [columns] = React.useState(() => [...defaultColumns])

  const rerender = () => setData(() => makeData(30))

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    columnResizeMode: 'onChange',
  })

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map(d => d.id))
    )
  }

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
      <div className="flex flex-wrap gap-2">
        <button onClick={() => rerender()} className="border p-1">
          Regenerate
        </button>
        <button onClick={() => randomizeColumns()} className="border p-1">
          Shuffle Columns
        </button>
      </div>
      <div className="h-4" />
      <div className="table-container">
        <table
          className="border-2"
          style={{
            width: table.getTotalSize(),
          }}
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  const { column } = header
                  const isPinned = column.getIsPinned()
                  const isLastLeftPinnedColumn =
                    isPinned === 'left' && column.getIsLastColumn('left')
                  const isFirstRightPinnedColumn =
                    isPinned === 'right' && column.getIsFirstColumn('right')
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        borderRight: isLastLeftPinnedColumn
                          ? '2px solid red'
                          : undefined,
                        borderLeft: isFirstRightPinnedColumn
                          ? '2px solid blue'
                          : undefined,
                        left:
                          isPinned === 'left'
                            ? `${column.getStart('left')}px`
                            : undefined,
                        right:
                          isPinned === 'right'
                            ? `${column.getAfter('right')}px`
                            : undefined,
                        opacity: isPinned ? 0.95 : 1,
                        position: isPinned ? 'sticky' : 'relative',
                        width: column.getSize(),
                        zIndex: isPinned ? 1 : 0,
                      }}
                    >
                      <div className="whitespace-nowrap">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}{' '}
                        {/* Demo getIndex */}
                        {column.getIndex(column.getIsPinned() || 'center')}
                      </div>
                      {!header.isPlaceholder && header.column.getCanPin() && (
                        <div className="flex gap-1 justify-center">
                          {header.column.getIsPinned() !== 'left' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('left')
                              }}
                            >
                              {'<='}
                            </button>
                          ) : null}
                          {header.column.getIsPinned() ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin(false)
                              }}
                            >
                              X
                            </button>
                          ) : null}
                          {header.column.getIsPinned() !== 'right' ? (
                            <button
                              className="border rounded px-2"
                              onClick={() => {
                                header.column.pin('right')
                              }}
                            >
                              {'=>'}
                            </button>
                          ) : null}
                        </div>
                      )}
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${
                            header.column.getIsResizing() ? 'isResizing' : ''
                          }`,
                        }}
                      />
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  const { column } = cell
                  const isPinned = column.getIsPinned()
                  const isLastLeftPinnedColumn =
                    isPinned === 'left' && column.getIsLastColumn('left')
                  const isFirstRightPinnedColumn =
                    isPinned === 'right' && column.getIsFirstColumn('right')

                  return (
                    <td
                      key={cell.id}
                      style={{
                        borderRight: isLastLeftPinnedColumn
                          ? '2px solid red'
                          : undefined,
                        borderLeft: isFirstRightPinnedColumn
                          ? '2px solid blue'
                          : undefined,
                        left:
                          isPinned === 'left'
                            ? `${column.getStart('left')}px`
                            : undefined,
                        right:
                          isPinned === 'right'
                            ? `${column.getAfter('right')}px`
                            : undefined,
                        opacity: isPinned ? 0.95 : 1,
                        position: isPinned ? 'sticky' : 'relative',
                        width: column.getSize(),
                        zIndex: isPinned ? 1 : 0,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre>{JSON.stringify(table.getState().columnPinning, null, 2)}</pre>
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

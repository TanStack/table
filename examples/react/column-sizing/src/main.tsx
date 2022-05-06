import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import {
  createTable,
  useTableInstance,
  ColumnResizeMode,
  getCoreRowModelSync,
} from '@tanstack/react-table'

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
]

let table = createTable().setRowType<Person>()

const defaultColumns = [
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
]

function App() {
  const [data, setData] = React.useState(() => [...defaultData])
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ])

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>('onChange')

  const rerender = React.useReducer(() => ({}), {})[1]

  const instance = useTableInstance(table, {
    data,
    columns,
    columnResizeMode,
    getCoreRowModel: getCoreRowModelSync(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })

  return (
    <div className="p-2">
      <select
        value={columnResizeMode}
        onChange={e => setColumnResizeMode(e.target.value as ColumnResizeMode)}
        className="border p-2 border-black rounded"
      >
        <option value="onEnd">Resize: "onEnd"</option>
        <option value="onChange">Resize: "onChange"</option>
      </select>
      <div className="h-4" />
      <div className="text-xl">{'<table/>'}</div>
      <div className="overflow-x-auto">
        <table
          {...{
            style: {
              width: instance.getTotalSize(),
            },
          }}
        >
          <thead>
            {instance.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  instance.getState().columnSizingInfo
                                    .deltaOffset
                                }px)`
                              : '',
                        },
                      }}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {instance.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td
                    {...{
                      style: {
                        width: cell.column.getSize(),
                      },
                    }}
                  >
                    {cell.renderCell()}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="h-4" />
      <div className="text-xl">{'<div/> (relative)'}</div>
      <div className="overflow-x-auto">
        <div
          {...{
            className: 'divTable',
            style: {
              width: instance.getTotalSize(),
            },
          }}
        >
          <div className="thead">
            {instance.getHeaderGroups().map(headerGroup => (
              <div
                {...{
                  className: 'tr',
                }}
              >
                {headerGroup.headers.map(header => (
                  <div
                    {...{
                      className: 'th',
                      style: {
                        width: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                    <div
                      {...{
                        className: `resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  instance.getState().columnSizingInfo
                                    .deltaOffset
                                }px)`
                              : '',
                        },
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            {...{
              className: 'tbody',
            }}
          >
            {instance.getRowModel().rows.map(row => (
              <div
                {...{
                  className: 'tr',
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <div
                    {...{
                      className: 'td',
                      style: {
                        width: cell.column.getSize(),
                      },
                    }}
                  >
                    {cell.renderCell()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <div className="text-xl">{'<div/> (absolute positioning)'}</div>
      <div className="overflow-x-auto">
        <div
          {...{
            className: 'divTable',
            style: {
              width: instance.getTotalSize(),
            },
          }}
        >
          <div className="thead">
            {instance.getHeaderGroups().map(headerGroup => (
              <div
                {...{
                  className: 'tr',
                  style: {
                    position: 'relative',
                  },
                }}
              >
                {headerGroup.headers.map(header => (
                  <div
                    {...{
                      className: 'th',
                      style: {
                        position: 'absolute',
                        left: header.getStart(),
                        width: header.getSize(),
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  instance.getState().columnSizingInfo
                                    .deltaOffset
                                }px)`
                              : '',
                        },
                      }}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            {...{
              className: 'tbody',
            }}
          >
            {instance.getRowModel().rows.map(row => (
              <div
                {...{
                  className: 'tr',
                  style: {
                    position: 'relative',
                  },
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <div
                    {...{
                      className: 'td',
                      style: {
                        position: 'absolute',
                        left: cell.column.getStart(),
                        width: cell.column.getSize(),
                      },
                    }}
                  >
                    {cell.renderCell()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
      <pre>
        {JSON.stringify(
          {
            columnSizing: instance.getState().columnSizing,
            columnSizingInfo: instance.getState().columnSizingInfo,
          },
          null,
          2
        )}
      </pre>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

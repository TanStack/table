import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'

import { createTable } from '@tanstack/react-table'
import { ColumnResizeMode } from '@tanstack/react-table/build/types/features/ColumnSizing'

type Row = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Row[] = [
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

let table = createTable()
  .RowType<Row>()
  .AggregationFns({
    testAggregationFn: (rows: Row[]) =>
      rows.reduce((acc, row) => acc + row.age, 0),
  })

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

function App() {
  const [data, setData] = React.useState<Row[]>(() => [...defaultData])
  const [columns] = React.useState<typeof defaultColumns>(() => [
    ...defaultColumns,
  ])

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>('onChange')

  const rerender = React.useReducer(() => ({}), {})[1]

  const instance = table.useTable({
    data,
    columns,
    // debug: true,
    columnResizeMode,
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
          {...instance.getTableProps({
            style: {
              width: instance
                .getHeaderGroups()[0]
                .headers.reduce((acc, header) => {
                  return acc + header.getWidth()
                }, 0),
            },
          })}
        >
          <thead>
            {instance.getHeaderGroups().map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(header => (
                  <th
                    {...header.getHeaderProps(props => ({
                      ...props,
                      style: {
                        ...props.style,
                        width: header.getWidth(),
                      },
                    }))}
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                    <div
                      {...header.column.getResizerProps(props => ({
                        ...props,
                        className: `${props.className} resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          ...props.style,
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  instance.getState().columnSizingInfo
                                    .deltaOffset
                                }px)`
                              : '',
                        },
                      }))}
                    />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...instance.getTableBodyProps()}>
            {instance.getRows().map(row => (
              <tr {...row.getRowProps()}>
                {row.getVisibleCells().map(cell => (
                  <td
                    {...cell.getCellProps(props => ({
                      ...props,
                      style: {
                        ...props.style,
                        width: cell.column.getWidth(),
                      },
                    }))}
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
      <div className="text-xl">{'<div/>'}</div>
      <div className="overflow-x-auto">
        <div
          {...instance.getTableProps({
            className: 'divTable',
            style: {
              width: instance.getTableWidth(),
            },
          })}
        >
          <div className="thead">
            {instance.getHeaderGroups().map(headerGroup => (
              <div
                {...headerGroup.getHeaderGroupProps({
                  className: 'tr',
                })}
              >
                {headerGroup.headers.map(header => (
                  <div
                    {...header.getHeaderProps(props => ({
                      ...props,
                      className: 'th',
                      style: {
                        ...props.style,
                        width: header.getWidth(),
                      },
                    }))}
                  >
                    {header.isPlaceholder ? null : header.renderHeader()}
                    <div
                      {...header.column.getResizerProps(props => ({
                        ...props,
                        className: `${props.className} resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`,
                        style: {
                          ...props.style,
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  instance.getState().columnSizingInfo
                                    .deltaOffset
                                }px)`
                              : '',
                        },
                      }))}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div
            {...instance.getTableBodyProps({
              className: 'tbody',
            })}
          >
            {instance.getRows().map(row => (
              <div
                {...row.getRowProps({
                  className: 'tr',
                })}
              >
                {row.getVisibleCells().map(cell => (
                  <div
                    {...cell.getCellProps(props => ({
                      ...props,
                      className: 'td',
                      style: {
                        ...props.style,
                        width: cell.column.getWidth(),
                      },
                    }))}
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

ReactDOM.render(<App />, document.getElementById('root'))

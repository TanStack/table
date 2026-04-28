import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { makeData } from './makeData'
import type {
  ColumnResizeDirection,
  ColumnResizeMode,
} from '@tanstack/react-table'
import type { Person } from './makeData'
import './index.css'

const _features = tableFeatures({ columnResizingFeature, columnSizingFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.group({
    header: 'Name',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('firstName', {
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: (props) => props.column.id,
      }),
    ]),
  }),
  columnHelper.group({
    header: 'Info',
    footer: (props) => props.column.id,
    columns: columnHelper.columns([
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: (props) => props.column.id,
      }),
      columnHelper.group({
        header: 'More Info',
        columns: columnHelper.columns([
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('status', {
            header: 'Status',
            footer: (props) => props.column.id,
          }),
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: (props) => props.column.id,
          }),
        ]),
      }),
    ]),
  }),
])

function App() {
  const [data, setData] = React.useState(() => makeData(10))
  const refreshData = () => setData(makeData(10))
  const stressTest = () => setData(makeData(100))

  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>('onChange')

  const [columnResizeDirection, setColumnResizeDirection] =
    React.useState<ColumnResizeDirection>('ltr')

  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useTable(
    {
      _features,
      _rowModels: {},
      columns,
      data,
      columnResizeMode,
      columnResizeDirection,
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  return (
    <div className="p-2">
      <div>
        <button onClick={() => refreshData()} className="border p-2">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} className="border p-2">
          Stress Test (100 rows)
        </button>
      </div>
      <div className="h-4" />
      <select
        value={columnResizeMode}
        onChange={(e) =>
          setColumnResizeMode(e.target.value as ColumnResizeMode)
        }
        className="border p-2 border-black rounded"
      >
        <option value="onEnd">Resize: "onEnd"</option>
        <option value="onChange">Resize: "onChange"</option>
      </select>
      <select
        value={columnResizeDirection}
        onChange={(e) =>
          setColumnResizeDirection(e.target.value as ColumnResizeDirection)
        }
        className="border p-2 border-black rounded"
      >
        <option value="ltr">Resize Direction: "ltr"</option>
        <option value="rtl">Resize Direction: "rtl"</option>
      </select>
      <div style={{ direction: table.options.columnResizeDirection }}>
        <div className="h-4" />
        <div className="text-xl">{'<table/>'}</div>
        <div className="overflow-x-auto">
          <table style={{ width: table.getCenterTotalSize() }}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          table.options.columnResizeDirection
                        } ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                        style={{
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  (table.options.columnResizeDirection === 'rtl'
                                    ? -1
                                    : 1) *
                                  (table.store.state.columnResizing
                                    .deltaOffset ?? 0)
                                }px)`
                              : '',
                        }}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      <table.FlexRender cell={cell} />
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
          <div className="divTable" style={{ width: table.getTotalSize() }}>
            <div className="thead">
              {table.getHeaderGroups().map((headerGroup) => (
                <div key={headerGroup.id} className="tr">
                  {headerGroup.headers.map((header) => (
                    <div
                      key={header.id}
                      className="th"
                      style={{
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          table.options.columnResizeDirection
                        } ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                        style={{
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  (table.options.columnResizeDirection === 'rtl'
                                    ? -1
                                    : 1) *
                                  (table.store.state.columnResizing
                                    .deltaOffset ?? 0)
                                }px)`
                              : '',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="tbody">
              {table.getRowModel().rows.map((row) => (
                <div key={row.id} className="tr">
                  {row.getAllCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="td"
                      style={{
                        width: cell.column.getSize(),
                      }}
                    >
                      <table.FlexRender cell={cell} />
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
            className="divTable"
            style={{
              width: table.getTotalSize(),
            }}
          >
            <div className="thead">
              {table.getHeaderGroups().map((headerGroup) => (
                <div
                  key={headerGroup.id}
                  className="tr"
                  style={{
                    position: 'relative',
                  }}
                >
                  {headerGroup.headers.map((header) => (
                    <div
                      key={header.id}
                      className="th"
                      style={{
                        position: 'absolute',
                        left: header.getStart(),
                        width: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                      <div
                        onDoubleClick={() => header.column.resetSize()}
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          table.options.columnResizeDirection
                        } ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                        style={{
                          transform:
                            columnResizeMode === 'onEnd' &&
                            header.column.getIsResizing()
                              ? `translateX(${
                                  (table.options.columnResizeDirection === 'rtl'
                                    ? -1
                                    : 1) *
                                  (table.store.state.columnResizing
                                    .deltaOffset ?? 0)
                                }px)`
                              : '',
                        }}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="tbody">
              {table.getRowModel().rows.map((row) => (
                <div
                  key={row.id}
                  className="tr"
                  style={{
                    position: 'relative',
                  }}
                >
                  {row.getAllCells().map((cell) => (
                    <div
                      key={cell.id}
                      className="td"
                      style={{
                        position: 'absolute',
                        left: cell.column.getStart(),
                        width: cell.column.getSize(),
                      }}
                    >
                      <table.FlexRender cell={cell} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
      <table.Subscribe selector={(state) => state}>
        {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
      </table.Subscribe>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

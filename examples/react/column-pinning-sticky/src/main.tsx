import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { faker } from '@faker-js/faker'
import { makeData } from './makeData'
import type { Column, ColumnDef } from '@tanstack/react-table'
import type { CSSProperties } from 'react'
import type { Person } from './makeData'
import './index.css'

const _features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

// These are the important styles to make sticky column pinning work!
// Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
// View the index.css file for more needed styles such as border-collapse: separate
const getCommonPinningStyles = (
  column: Column<typeof _features, Person>,
): CSSProperties => {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-4px 0 4px -4px gray inset'
      : isFirstRightPinnedColumn
        ? '4px 0 4px -4px gray inset'
        : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? 'sticky' : 'relative',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0,
  }
}

const defaultColumns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'age',
    id: 'age',
    header: 'Age',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'visits',
    id: 'visits',
    header: 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'status',
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  },
  {
    accessorKey: 'progress',
    id: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
  },
]

function App() {
  const [data, setData] = React.useState(() => makeData(30))
  const [columns] = React.useState(() => [...defaultColumns])

  const refreshData = () => setData(makeData(30))
  const stressTest = () => setData(makeData(100_000))

  const table = useTable(
    {
      _features,
      _rowModels: {},
      columns,
      data,
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      columnResizeMode: 'onChange',
    },
    (state) => state,
  )

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <table.Subscribe
      selector={(state) => ({
        columnVisibility: state.columnVisibility,
        columnOrder: state.columnOrder,
        columnPinning: state.columnPinning,
        columnSizing: state.columnSizing,
        columnResizing: state.columnResizing,
      })}
    >
      {(_topLevelState) => (
        <div className="p-2">
          <div className="inline-block border border-black shadow rounded">
            <div className="px-1 border-b border-black">
              <label>
                <input
                  type="checkbox"
                  checked={table.getIsAllColumnsVisible()}
                  onChange={table.getToggleAllColumnsVisibilityHandler()}
                />{' '}
                Toggle All
              </label>
            </div>
            {table.getAllLeafColumns().map((column) => {
              return (
                <div key={column.id} className="px-1">
                  <label>
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={column.getToggleVisibilityHandler()}
                    />{' '}
                    {column.id}
                  </label>
                </div>
              )
            })}
          </div>
          <div className="h-4" />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => refreshData()} className="border p-1">
              Regenerate Data
            </button>
            <button onClick={() => stressTest()} className="border p-1">
              Stress Test (100k rows)
            </button>
            <button onClick={() => randomizeColumns()} className="border p-1">
              Shuffle Columns
            </button>
          </div>
          <div className="h-4" />
          <div className="table-container">
            <table
              style={{
                width: table.getTotalSize(),
              }}
            >
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const { column } = header

                      return (
                        <table.Subscribe
                          // subscribe only to the column resizing and sizing state changes
                          selector={(state) => ({
                            isResizingColumn:
                              state.columnResizing.isResizingColumn ===
                              column.id,
                            columnSize: state.columnSizing[column.id],
                          })}
                        >
                          {() => (
                            <th
                              key={header.id}
                              colSpan={header.colSpan}
                              // IMPORTANT: This is where the magic happens!
                              style={{ ...getCommonPinningStyles(column) }}
                            >
                              <div className="whitespace-nowrap">
                                {header.isPlaceholder ? null : (
                                  <>
                                    <table.FlexRender header={header} />{' '}
                                  </>
                                )}
                                {/* Demo getIndex behavior */}
                                {column.getIndex(
                                  column.getIsPinned() || 'center',
                                )}
                              </div>
                              {!header.isPlaceholder &&
                                header.column.getCanPin() && (
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
                                onDoubleClick={() => header.column.resetSize()}
                                onMouseDown={header.getResizeHandler()}
                                onTouchStart={header.getResizeHandler()}
                                className={`resizer ${
                                  header.column.getIsResizing()
                                    ? 'isResizing'
                                    : ''
                                }`}
                              />
                            </th>
                          )}
                        </table.Subscribe>
                      )
                    })}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      const { column } = cell
                      return (
                        <table.Subscribe
                          // subscribe only to the column resizing and sizing state changes
                          selector={(state) => ({
                            isResizingColumn:
                              state.columnResizing.isResizingColumn ===
                              column.id,
                            columnSize: state.columnSizing[column.id],
                          })}
                        >
                          {() => (
                            <td
                              key={cell.id}
                              // IMPORTANT: This is where the magic happens!
                              style={{ ...getCommonPinningStyles(column) }}
                            >
                              <table.FlexRender cell={cell} />
                            </td>
                          )}
                        </table.Subscribe>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <table.Subscribe selector={(state) => state}>
            {(state) => <pre>{JSON.stringify(state, null, 2)}</pre>}
          </table.Subscribe>
        </div>
      )}
    </table.Subscribe>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

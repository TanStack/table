import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { faker } from '@faker-js/faker'
import { makeData } from './makeData'
import type { Column } from '@tanstack/react-table'
import type { CSSProperties } from 'react'
import type { Person } from './makeData'
import './index.css'

const features = tableFeatures({
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()
// These are the important styles to make sticky column pinning work!
// Apply styles like this using your CSS strategy of choice with this kind of logic to head cells, data cells, footer cells, etc.
// View the index.css file for more needed styles such as border-collapse: collapse
const getCommonPinningStyles = (
  column: Column<typeof features, Person>,
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

const defaultColumns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    id: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('age', {
    id: 'age',
    header: 'Age',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('visits', {
    id: 'visits',
    header: 'Visits',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('status', {
    id: 'status',
    header: 'Status',
    footer: (props) => props.column.id,
    size: 180,
  }),
  columnHelper.accessor('progress', {
    id: 'progress',
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 180,
  }),
])

function App() {
  const [data, setData] = React.useState(() => makeData(20))
  const [columns] = React.useState(() => [...defaultColumns])

  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  const table = useTable(
    {
      features,
      columns,
      data,
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
      columnResizeMode: 'onChange',
    },
    (state) => state, // default selector
  )

  const randomizeColumns = () => {
    table.setColumnOrder(
      faker.helpers.shuffle(table.getAllLeafColumns().map((d) => d.id)),
    )
  }

  return (
    <div className="demo-root">
      <div className="column-toggle-panel">
        <div className="column-toggle-panel-header">
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
            <div key={column.id} className="column-toggle-row">
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
      <div className="spacer-md" />
      <div className="button-row">
        <button
          onClick={() => refreshData()}
          className="demo-button demo-button-sm"
        >
          Regenerate Data
        </button>
        <button
          onClick={() => stressTest()}
          className="demo-button demo-button-sm"
        >
          Stress Test (1k rows)
        </button>
        <button
          onClick={() => randomizeColumns()}
          className="demo-button demo-button-sm"
        >
          Shuffle Columns
        </button>
      </div>
      <div className="spacer-md" />
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
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      // IMPORTANT: This is where the magic happens!
                      style={{ ...getCommonPinningStyles(column) }}
                    >
                      <div className="nowrap">
                        {header.isPlaceholder ? null : (
                          <>
                            <table.FlexRender header={header} />{' '}
                          </>
                        )}
                        {/* Demo getIndex behavior */}
                        {column.getIndex(column.getIsPinned() || 'center')}
                      </div>
                      {!header.isPlaceholder && header.column.getCanPin() && (
                        <div className="pin-actions">
                          {header.column.getIsPinned() !== 'left' ? (
                            <button
                              className="pin-button"
                              onClick={() => {
                                header.column.pin('left')
                              }}
                            >
                              {'<='}
                            </button>
                          ) : null}
                          {header.column.getIsPinned() ? (
                            <button
                              className="pin-button"
                              onClick={() => {
                                header.column.pin(false)
                              }}
                            >
                              X
                            </button>
                          ) : null}
                          {header.column.getIsPinned() !== 'right' ? (
                            <button
                              className="pin-button"
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
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`}
                      />
                    </th>
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
                    <td
                      key={cell.id}
                      // IMPORTANT: This is where the magic happens!
                      style={{ ...getCommonPinningStyles(column) }}
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <pre>{JSON.stringify(table.state, null, 2)}</pre>
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

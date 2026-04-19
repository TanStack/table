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
import type { Person } from './makeData'
import './index.css'

const _features = tableFeatures({ columnSizingFeature, columnResizingFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    header: 'First Name',
    size: 150,
  }),
  columnHelper.accessor('lastName', {
    cell: (info) => info.getValue(),
    header: 'Last Name',
    size: 150,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    size: 80,
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
    size: 100,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    size: 150,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    size: 180,
  }),
])

function App() {
  const [data] = React.useState(() => makeData(20))
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = React.useState(0)

  // Track container width with ResizeObserver
  React.useEffect(() => {
    const container = tableContainerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width)
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  const table = useTable(
    {
      _features,
      _rowModels: {},
      columns,
      data,
      defaultColumn: {
        minSize: 50,
        maxSize: 800,
      },
      columnResizeMode: 'onChange',
    },
    (state) => ({
      columnSizing: state.columnSizing,
      columnResizing: state.columnResizing,
    }),
  )

  const visibleColumns = table.getVisibleLeafColumns()
  const totalColumnsWidth = table.getTotalSize()

  // Determine if the last column should stretch to fill remaining space
  const shouldExtendLastColumn = totalColumnsWidth < containerWidth

  // Compute the width for each column, stretching the last one if needed
  const getColumnWidth = React.useCallback(
    (columnId: string, index: number, baseWidth: number) => {
      if (shouldExtendLastColumn && index === visibleColumns.length - 1) {
        const otherColumnsWidth = visibleColumns
          .slice(0, -1)
          .reduce((sum, col) => sum + col.getSize(), 0)
        return Math.max(baseWidth, containerWidth - otherColumnsWidth)
      }
      return baseWidth
    },
    [shouldExtendLastColumn, visibleColumns, containerWidth],
  )

  // Pre-compute column sizes as CSS variables for performant resizing
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: Record<string, number> = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]
      const width = getColumnWidth(
        header.column.id,
        i,
        header.column.getSize(),
      )
      colSizes[`--header-${header.id}-size`] = width
      colSizes[`--col-${header.column.id}-size`] = width
    }
    return colSizes
  }, [table.state.columnResizing, table.state.columnSizing, getColumnWidth])

  // Table width: always at least the container width
  const tableWidth = Math.max(totalColumnsWidth, containerWidth)

  return (
    <div className="p-2">
      <h3>Full-Width Column Resizing</h3>
      <p>
        The table fills its container. The last column stretches to fill any
        remaining space. Try resizing individual columns — the last column
        adjusts automatically. Resize the browser window to see the table adapt.
      </p>
      <div className="h-4" />
      <div ref={tableContainerRef} className="table-container">
        <div
          className="divTable"
          style={{
            ...columnSizeVars,
            width: tableWidth,
          }}
        >
          <div className="thead" style={{ position: 'sticky', top: 0 }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="tr">
                {headerGroup.headers.map((header, index) => (
                  <div
                    key={header.id}
                    className="th"
                    style={{
                      width: `calc(var(--header-${header.id}-size) * 1px)`,
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
                        header.column.getIsResizing() ? 'isResizing' : ''
                      }`}
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
                      width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                    }}
                  >
                    {cell.renderValue<string>()}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-4" />
      <pre style={{ fontSize: '12px' }}>
        {JSON.stringify(
          {
            containerWidth,
            totalColumnsWidth,
            shouldExtendLastColumn,
            columnSizing: table.state.columnSizing,
          },
          null,
          2,
        )}
      </pre>
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

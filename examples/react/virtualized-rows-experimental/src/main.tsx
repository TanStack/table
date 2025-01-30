import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  Table,
  useReactTable,
} from '@tanstack/react-table'
import {
  useVirtualizer,
  VirtualItem,
  Virtualizer,
} from '@tanstack/react-virtual'
import { makeData, Person } from './makeData'

//This is a dynamic row height example, which is more complicated, but allows for a more realistic table.
//See https://tanstack.com/virtual/v3/docs/examples/react/table for a simpler fixed row height example.
function App() {
  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
      },
      {
        accessorKey: 'firstName',
        cell: info => info.getValue(),
      },
      {
        accessorFn: row => row.lastName,
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
      },
      {
        accessorKey: 'age',
        header: () => 'Age',
        size: 50,
      },
      {
        accessorKey: 'visits',
        header: () => <span>Visits</span>,
        size: 50,
      },
      {
        accessorKey: 'status',
        header: 'Status',
      },
      {
        accessorKey: 'progress',
        header: 'Profile Progress',
        size: 80,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: info => info.getValue<Date>().toLocaleString(),
        size: 250,
      },
    ],
    []
  )

  const [data, _setData] = React.useState(() => makeData(50_000))

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  //The virtualizer needs to know the scrollable container element
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  //All important CSS styles are included as inline styles for this example. This is not recommended for your code.
  return (
    <div className="app">
      {process.env.NODE_ENV === 'development' ? (
        <p>
          <strong>Notice:</strong> You are currently running React in
          development mode. Virtualized rendering performance will be slightly
          degraded until this application is built for production.
        </p>
      ) : null}
      ({data.length} rows)
      <div
        className="container"
        ref={tableContainerRef}
        style={{
          overflow: 'auto', //our scrollable table container
          position: 'relative', //needed for sticky header
          height: '800px', //should be a fixed height
        }}
      >
        {/* Even though we're still using sematic table tags, we must use CSS grid and flexbox for dynamic row heights */}
        <table style={{ display: 'grid' }}>
          <thead
            style={{
              display: 'grid',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}
          >
            {table.getHeaderGroups().map(headerGroup => (
              <tr
                key={headerGroup.id}
                style={{ display: 'flex', width: '100%' }}
              >
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      style={{
                        display: 'flex',
                        width: header.getSize(),
                      }}
                    >
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <TableBodyWrapper
            table={table}
            tableContainerRef={tableContainerRef}
          />
        </table>
      </div>
    </div>
  )
}

interface TableBodyWrapperProps {
  table: Table<Person>
  tableContainerRef: React.RefObject<HTMLDivElement>
}

function TableBodyWrapper({ table, tableContainerRef }: TableBodyWrapperProps) {
  const rowRefsMap = React.useRef<Map<number, HTMLTableRowElement>>(new Map())

  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  })

  return (
    <>
      <RowScroller
        rowRefsMap={rowRefsMap}
        rowVirtualizer={rowVirtualizer}
        table={table}
      />
      <TableBody
        rowRefsMap={rowRefsMap}
        rowVirtualizer={rowVirtualizer}
        table={table}
      />
    </>
  )
}

interface RowScrollerProps {
  table: Table<Person>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  rowRefsMap: React.MutableRefObject<Map<number, HTMLTableRowElement>>
}

function RowScroller({ rowVirtualizer, rowRefsMap }: RowScrollerProps) {
  const virtualRows = rowVirtualizer.getVirtualItems() // TODO subscribe to everything as currently implemented

  virtualRows.forEach(virtualRow => {
    const rowRef = rowRefsMap.current.get(virtualRow.index)
    if (!rowRef) return <></>
    rowRef.style.transform = `translateY(${virtualRow.start}px)`
  })

  return <></>
}

interface TableBodyProps {
  table: Table<Person>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
  rowRefsMap: React.MutableRefObject<Map<number, HTMLTableRowElement>>
}

function TableBody({ rowVirtualizer, table, rowRefsMap }: TableBodyProps) {
  const { rows } = table.getRowModel()
  const virtualRows = rowVirtualizer.getVirtualItems() // TODO only subscribe to when rows are added or removed

  return (
    <tbody
      style={{
        display: 'grid',
        height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
        position: 'relative', //needed for absolute positioning of rows
      }}
    >
      {virtualRows.map(virtualRow => {
        const row = rows[virtualRow.index] as Row<Person>
        return (
          <TableBodyRowMemo
            key={row.id}
            row={row}
            rowRefsMap={rowRefsMap}
            rowVirtualizer={rowVirtualizer}
            virtualRow={virtualRow}
          />
        )
      })}
    </tbody>
  )
}

// test out when the table is re-rendered
// const TableBodyMemo = React.memo(
//   TableBody,
//   (prev, next) => prev.table.options.data === next.table.options.data
// ) as typeof TableBody

interface TableBodyRowProps {
  row: Row<Person>
  virtualRow: VirtualItem<HTMLTableRowElement>
  rowRefsMap: React.MutableRefObject<Map<number, HTMLTableRowElement>>
  rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}

function TableBodyRow({
  row,
  virtualRow,
  rowRefsMap,
  rowVirtualizer,
}: TableBodyRowProps) {
  return (
    <tr
      data-index={virtualRow.index} //needed for dynamic row height measurement
      ref={node => {
        if (node && virtualRow) {
          rowVirtualizer.measureElement(node)
          rowRefsMap.current.set(virtualRow.index, node)
        }
      }} //measure dynamic row height
      key={row.id}
      style={{
        display: 'flex',
        position: 'absolute',
        // transform: `translateY(${virtualRow.start}px)`, // no more transform from react, now done in RowScroller
        width: '100%',
      }}
    >
      {row.getVisibleCells().map(cell => {
        return (
          <td
            key={cell.id}
            style={{
              display: 'flex',
              width: cell.column.getSize(),
            }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        )
      })}
    </tr>
  )
}

// test out when rows don't re-render at all (future TanStack Virtual release can make this unnecessary)
const TableBodyRowMemo = React.memo(
  TableBodyRow,
  (prev, next) => prev.row === next.row
) as typeof TableBodyRow

const rootElement = document.getElementById('root')

if (!rootElement) throw new Error('Failed to find the root element')

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

import React from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useWindowVirtualizer } from '@tanstack/react-virtual'

import { Person } from './makeData'

type WindowHeightTableProps = {
  // The data to render
  data: any
  // The columns to render
  columns: ColumnDef<Person>[]
}

/**
 * Renders full window height virtualised table
 */
export function WindowHeightTable({ data, columns }: WindowHeightTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // Get offset from top of window to ensure space is left for any
  // html elements above the table
  const tableOffsetRef = React.useRef(0)
  React.useLayoutEffect(() => {
    tableOffsetRef.current = tableContainerRef.current?.offsetTop ?? 0
  }, [])

  const { rows } = table.getRowModel()
  const rowVirtualizer = useWindowVirtualizer({
    count: rows.length,
    scrollMargin: tableOffsetRef.current,
    estimateSize: () => 54,
    overscan: 10,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()

  // We need to add a padding row at top that grows as we scroll down to ensure
  // the table scrolls down with the page
  const paddingTop =
    virtualRows.length > 0
      ? virtualRows?.[0]?.start
        ? virtualRows?.[0]?.start - tableOffsetRef.current
        : 0 || 0
      : 0

  return (
    <div
      ref={tableContainerRef}
      className="container"
      style={{
        // Need to add 52px to totalSize to account for header height + container border top and bottom
        height: rowVirtualizer.getTotalSize() + 52,
      }}
    >
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
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
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map(virtualRow => {
            const row = rows[virtualRow.index] as Row<Person>
            return (
              <tr
                key={row.id}
                ref={rowVirtualizer.measureElement}
                data-index={row.index}
              >
                {row.getVisibleCells().map(cell => {
                  return (
                    <td
                      key={cell.id}
                      style={{ width: cell.getContext().column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

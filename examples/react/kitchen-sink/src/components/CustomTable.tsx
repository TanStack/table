import { flexRender, RowData, Table } from '@tanstack/react-table'
import React from 'react'
import Filter from './Filter'
import TablePins from './TablePins'

type TableGroup = 'center' | 'left' | 'right'

function getTableHeaderGroup(tg?: TableGroup) {
  if (tg === 'left')
    return ['getLeftHeaderGroups', 'getLeftVisibleCells', 'getLeftFooterGroups']
  if (tg === 'right')
    return [
      'getRightHeaderGroups',
      'getRightVisibleCells',
      'getRightFooterGroups',
    ]
  return ['getHeaderGroups', 'getVisibleCells', 'getFooterGroups']
}

type Props<T extends RowData> = {
  table: Table<T>
  tableGroup?: TableGroup
}

export function CustomTable<T extends RowData>({
  table,
  tableGroup,
}: Props<T>) {
  const [headerGroups, visibleCells, footerGroup] =
    getTableHeaderGroup(tableGroup)

  return (
    <table>
      <thead>
        {table[headerGroups]().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th
                className="relative"
                key={header.id}
                style={{
                  width: header.getSize(),
                }}
                colSpan={header.colSpan}
              >
                {header.isPlaceholder ? null : (
                  <>
                    <div>
                      {header.column.getCanGroup() ? (
                        // If the header can be grouped, let's add a toggle
                        <button
                          onClick={header.column.getToggleGroupingHandler()}
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          {header.column.getIsGrouped()
                            ? `🛑(${header.column.getGroupedIndex()})`
                            : `👊`}
                        </button>
                      ) : null}{' '}
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}{' '}
                      <button
                        onClick={header.column.getToggleSortingHandler()}
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                      >
                        {{
                          asc: '🔼',
                          desc: '🔽',
                        }[header.column.getIsSorted() as string] ?? '📶'}
                      </button>
                    </div>
                    {header.column.getCanFilter() ? (
                      <div>
                        <Filter column={header.column} table={table} />
                      </div>
                    ) : null}
                  </>
                )}
                <div
                  className="absolute right-0 top-0 h-full w-1 bg-blue-300 select-none touch-none hover:bg-blue-500 cursor-col-resize"
                  onMouseDown={header.getResizeHandler()}
                  onTouchStart={header.getResizeHandler()}
                />
                {!header.isPlaceholder && header.column.getCanPin() && (
                  <TablePins
                    isPinned={header.column.getIsPinned()}
                    pin={header.column.pin}
                  />
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row[visibleCells]().map(cell => (
              <td
                key={cell.id}
                style={{
                  width: cell.column.getSize(),
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table[footerGroup]().map(footerGroup => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map(header => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  )
}

export default CustomTable

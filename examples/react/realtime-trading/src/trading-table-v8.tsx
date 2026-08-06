'use no memo'

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table-v8'
import { memo } from 'react'
import {
  TradingRow,
  readMeasuredRows,
  tradingColumns,
  useCoreTableState,
} from './trading-table-shared'
import { useV8TradingTableRuntime } from './core/use-trading-table-runtime'

export const V8TradingTable = memo(function V8TradingTable() {
  const props = useV8TradingTableRuntime()
  const coreTableState = useCoreTableState(props)
  const table = useReactTable({
    columns: tradingColumns,
    data: props.quotes,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row) => row.id,
    state: coreTableState,
  })
  const rows = readMeasuredRows('v8', () => table.getRowModel().rows)

  return (
    <div className="table-scroll" data-table-adapter="v8">
      <table style={{ width: table.getTotalSize() }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  {!header.isPlaceholder &&
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <TradingRow key={row.id} quote={row.original}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{ width: cell.column.getSize() }}
                  className={
                    cell.column.id !== 'symbol' &&
                    cell.column.id !== 'venue'
                      ? 'numeric-cell'
                      : undefined
                  }
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </TradingRow>
          ))}
        </tbody>
      </table>
    </div>
  )
})

import { createTable } from '@tanstack/solid-table'
import { createMemo } from 'solid-js'
import { createTradingColumns } from './table-config/trading-columns'
import { tradingTableFeatures } from './trading-table-features'
import type { Accessor } from 'solid-js'
import type { MarketQuote } from '../feed/market-data'
import type { RendererMode } from './table-config/trading-columns'

export interface CreateTradingTableModelOptions {
  quotes: Accessor<Array<MarketQuote>>
  rendererMode: Accessor<RendererMode>
  onSelectSymbol: (symbol: string) => void
}

/**
 * Owns the TanStack Table model and the computations derived from table atoms.
 * Consumers can subscribe to rows, columns, or layout independently.
 */
export function createTradingTableModel(
  options: CreateTradingTableModelOptions,
) {
  const columns = createMemo(() =>
    createTradingColumns({
      rendererMode: options.rendererMode(),
      onSelectSymbol: options.onSelectSymbol,
    }),
  )
  const table = createTable({
    key: 'solid-realtime-trading',
    features: tradingTableFeatures,
    columnResizeMode: 'onChange',
    defaultColumn: { minSize: 56, maxSize: 800 },
    autoResetCellSelection: false,
    get columns() {
      return columns()
    },
    get data() {
      return options.quotes()
    },
    getRowId: (row) => row.id,
  })
  const rows = createMemo(() => table.getRowModel().rows)
  const tableStyle = createMemo(() => {
    void table.atoms.columnSizing.get()
    void table.atoms.columnOrder.get()

    const style: Record<string, string> = {
      width: `${table.getTotalSize()}px`,
    }
    for (const header of table.getFlatHeaders()) {
      style[`--header-${header.id}-size`] = `${header.getSize()}`
      style[`--col-${header.column.id}-size`] = `${header.column.getSize()}`
    }
    return style
  })

  return { columns, rows, table, tableStyle }
}

export type TradingTableModel = ReturnType<typeof createTradingTableModel>

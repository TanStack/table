import { renderComponent } from '@tanstack/svelte-table'
import DayChangeCell from './DayChangeCell.svelte'
import LastPriceCell from './LastPriceCell.svelte'
import PercentChangeCell from './PercentChangeCell.svelte'
import SparklineCell from './SparklineCell.svelte'
import { recordCellRender } from './quote-cells'
import type { MarketQuote } from '../../feed/market-data'

export type RendererMode = 'stable' | 'swap'
export interface CoreTableState {
  sorting: Array<{ id: string; desc: boolean }>
  columnFilters: Array<{ id: string; value: unknown }>
}

interface TradingCellContext {
  row: { original: MarketQuote }
}

export interface TradingColumnDefinition {
  id: string
  header: string
  size?: number
  columns?: Array<TradingColumnDefinition>
  accessorFn?: (row: MarketQuote) => unknown
  enableSorting?: boolean
  filterFn?: 'includesString'
  sortFn?: 'basic'
  cell?: (context: TradingCellContext) => unknown
}

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const tradingColumns: Array<TradingColumnDefinition> = [
  {
    id: 'instrument',
    header: 'Instrument',
    columns: [
      {
        id: 'market',
        header: 'Market',
        size: 72,
        accessorFn: (row) => row.venue,
        cell: ({ row }) => recordCellRender('Market', row.original.venue),
      },
      {
        id: 'name',
        header: 'Name',
        size: 180,
        accessorFn: (row) => row.company,
        cell: ({ row }) => recordCellRender('Name', row.original.company),
      },
      {
        id: 'symbol',
        header: 'Symbol',
        size: 92,
        accessorFn: (row) => row.symbol,
        filterFn: 'includesString',
        cell: ({ row }) => recordCellRender('Symbol', row.original.symbol),
      },
    ],
  },
  {
    id: 'priceAndChange',
    header: 'Price & Change',
    columns: [
      {
        id: 'price',
        header: 'Price',
        size: 96,
        accessorFn: (row) => row.price,
        sortFn: 'basic',
        cell: ({ row }) =>
          recordCellRender(
            'Last',
            renderComponent(LastPriceCell, { quote: row.original }),
          ),
      },
      {
        id: 'change',
        header: 'Chg',
        size: 94,
        accessorFn: getDayChange,
        cell: ({ row }) =>
          recordCellRender(
            'Change',
            renderComponent(DayChangeCell, { quote: row.original }),
          ),
      },
      {
        id: 'changePercent',
        header: 'Chg%',
        size: 90,
        accessorFn: getDayChangePercent,
        cell: ({ row }) =>
          recordCellRender(
            'ChangePercent',
            renderComponent(PercentChangeCell, {
              value: getDayChangePercent(row.original),
            }),
          ),
      },
    ],
  },
  {
    id: 'orderBook',
    header: 'Order Book',
    columns: [
      {
        id: 'bid',
        header: 'Bid',
        size: 90,
        accessorFn: (row) => row.bid,
        cell: ({ row }) => recordCellRender('Bid', row.original.bid.toFixed(2)),
      },
      {
        id: 'bidSize',
        header: 'Bid Vol',
        size: 100,
        accessorFn: (row) => row.bidSize,
        cell: ({ row }) =>
          recordCellRender(
            'BidVolume',
            compactFormatter.format(row.original.bidSize),
          ),
      },
      {
        id: 'ask',
        header: 'Ask',
        size: 90,
        accessorFn: (row) => row.ask,
        cell: ({ row }) => recordCellRender('Ask', row.original.ask.toFixed(2)),
      },
      {
        id: 'askSize',
        header: 'Ask Vol',
        size: 100,
        accessorFn: (row) => row.askSize,
        cell: ({ row }) =>
          recordCellRender(
            'AskVolume',
            compactFormatter.format(row.original.askSize),
          ),
      },
    ],
  },
  {
    id: 'session',
    header: 'Session',
    columns: [
      {
        id: 'open',
        header: 'Open',
        size: 90,
        accessorFn: (row) => row.open,
        cell: ({ row }) =>
          recordCellRender('Open', row.original.open.toFixed(2)),
      },
      {
        id: 'high',
        header: 'High',
        size: 90,
        accessorFn: (row) => row.high,
        cell: ({ row }) =>
          recordCellRender('High', row.original.high.toFixed(2)),
      },
      {
        id: 'low',
        header: 'Low',
        size: 90,
        accessorFn: (row) => row.low,
        cell: ({ row }) => recordCellRender('Low', row.original.low.toFixed(2)),
      },
    ],
  },
  {
    id: 'chart',
    header: 'Chart',
    columns: [
      {
        id: 'history',
        header: 'Intraday',
        size: 150,
        enableSorting: false,
        cell: ({ row }) =>
          recordCellRender(
            'Intraday',
            renderComponent(SparklineCell, { values: row.original.history }),
          ),
      },
    ],
  },
]

export const rowModelDiagnostics = {
  hasMeasurement: false,
  calls: 0,
  totalDurationMs: 0,
  maxDurationMs: 0,
  lastRowCount: 0,
}
export const TRADING_COLUMN_COUNT = 14

export function readMeasuredRows<Row>(readRows: () => Array<Row>): Array<Row> {
  const start = performance.now()
  const rows = readRows()
  const end = performance.now()
  const duration = end - start
  rowModelDiagnostics.calls++
  rowModelDiagnostics.hasMeasurement = true
  rowModelDiagnostics.totalDurationMs += duration
  rowModelDiagnostics.maxDurationMs = Math.max(
    rowModelDiagnostics.maxDurationMs,
    duration,
  )
  rowModelDiagnostics.lastRowCount = rows.length
  if ((rowModelDiagnostics.calls - 1) % 20 === 0) {
    try {
      performance.measure('tanstack-row-model', {
        start,
        end,
        detail: { rowCount: rows.length },
      })
      if (rowModelDiagnostics.calls % 20_000 === 0) {
        performance.clearMeasures('tanstack-row-model')
      }
    } catch {
      /* User Timing Level 3 is optional. */
    }
  }
  return rows
}

export function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}
export function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0
    ? 0
    : (getDayChange(quote) / quote.previousClose) * 100
}

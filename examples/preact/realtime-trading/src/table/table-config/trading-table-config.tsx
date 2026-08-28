import { useSelector } from '@tanstack/preact-store'
import { useTradingShellController } from '../../shell/trading-shell-context'
import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells'
import type { ComponentChildren } from 'preact'
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
  cell?: (context: TradingCellContext) => ComponentChildren
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
          recordCellRender('Last', <LastPriceCell quote={row.original} />),
      },
      {
        id: 'change',
        header: 'Chg',
        size: 94,
        accessorFn: (row) => getDayChange(row),
        cell: ({ row }) =>
          recordCellRender('Change', <DayChangeCell quote={row.original} />),
      },
      {
        id: 'changePercent',
        header: 'Chg%',
        size: 90,
        accessorFn: (row) => getDayChangePercent(row),
        cell: ({ row }) =>
          recordCellRender(
            'ChangePercent',
            <PercentChangeCell value={getDayChangePercent(row.original)} />,
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
            <SparklineCell values={row.original.history} />,
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

  if (rowModelDiagnostics.calls % 1_000 === 0) {
    performance.clearMeasures('tanstack-row-model')
  }
  if ((rowModelDiagnostics.calls - 1) % 20 === 0) {
    try {
      performance.measure('tanstack-row-model', {
        start,
        end,
        detail: { rowCount: rows.length },
      })
    } catch {
      // User Timing Level 3 detail is not implemented in every browser.
    }
  }

  return rows
}

function LastPriceCell(props: { quote: MarketQuote }) {
  const { selectSymbol } = useTradingShellController().actions
  return (
    <PriceCell
      price={props.quote.price}
      move={getDayChange(props.quote)}
      onSelect={() => selectSymbol(props.quote.symbol)}
    />
  )
}

function DayChangeCell(props: { quote: MarketQuote }) {
  const { rendererMode } = useTradingShellController().renderAtoms
  const mode = useSelector(rendererMode)
  const change = getDayChange(props.quote)
  if (mode === 'stable') {
    return <StableMoveCell move={change} />
  }
  return change >= 0 ? (
    <UpMoveCell move={change} />
  ) : (
    <DownMoveCell move={change} />
  )
}

export function TradingRow(props: {
  quote: MarketQuote
  children: ComponentChildren
  rowSelected: boolean
}) {
  const { selectedSymbol } = useTradingShellController().renderAtoms
  const selected = useSelector(
    selectedSymbol,
    (symbol) => symbol === props.quote.symbol,
  )
  return (
    <tr
      data-symbol={props.quote.symbol}
      data-row-id={props.quote.id}
      data-symbol-selected={selected ? 'true' : undefined}
      title={props.quote.company}
      aria-selected={props.rowSelected}
    >
      {props.children}
    </tr>
  )
}

function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}

function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0
    ? 0
    : (getDayChange(quote) / quote.previousClose) * 100
}

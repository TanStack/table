import { useMemo } from 'react'
import { useSelector } from '@tanstack/react-store'
import {
  DepthCell,
  DownMoveCell,
  PriceCell,
  QuoteAgeCell,
  SparklineCell,
  SpreadCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells'
import {
  useTradingShellController,
} from './shell/trading-shell-context'
import type { ReactNode } from 'react'
import type { MarketQuote } from './market-data'

export type RendererMode = 'stable' | 'swap'
export type TableAdapter = 'local' | 'v8'
export type CoreRowModelMode = 'none' | 'sort' | 'filter' | 'sort-filter'

export interface TradingTableProps {
  quotes: Array<MarketQuote>
  coreRowModelMode: CoreRowModelMode
  coreFilterValue: string
}

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
  size: number
  accessorFn?: (row: MarketQuote) => unknown
  filterFn?: 'includesString'
  sortFn?: 'basic'
  cell: (context: TradingCellContext) => ReactNode
}

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const currencyFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
  style: 'currency',
  currency: 'USD',
})

export const tradingColumns: Array<TradingColumnDefinition> = [
  {
    id: 'symbol',
    header: 'Ticker',
    size: 90,
    accessorFn: (row) => row.symbol,
    filterFn: 'includesString',
    cell: ({ row }) => recordCellRender('Ticker', row.original.symbol),
  },
  {
    id: 'venue',
    header: 'Venue',
    size: 70,
    cell: ({ row }) => recordCellRender('Venue', row.original.venue),
  },
  {
    id: 'bid',
    header: 'Bid',
    size: 90,
    cell: ({ row }) =>
      recordCellRender('Bid', row.original.bid.toFixed(2)),
  },
  {
    id: 'ask',
    header: 'Ask',
    size: 90,
    cell: ({ row }) =>
      recordCellRender('Ask', row.original.ask.toFixed(2)),
  },
  {
    id: 'spread',
    header: 'Spread',
    size: 95,
    cell: ({ row }) =>
      recordCellRender(
        'Spread',
        <SpreadCell bid={row.original.bid} ask={row.original.ask} />,
      ),
  },
  {
    id: 'price',
    header: 'Last',
    size: 100,
    accessorFn: (row) => row.price,
    sortFn: 'basic',
    cell: ({ row }) =>
      recordCellRender('Last', <LastPriceCell quote={row.original} />),
  },
  {
    id: 'lastMove',
    header: 'Last Move',
    size: 105,
    cell: ({ row }) =>
      recordCellRender('LastMove', <LastMoveCell quote={row.original} />),
  },
  {
    id: 'lastSize',
    header: 'Last Qty',
    size: 90,
    cell: ({ row }) =>
      recordCellRender(
        'LastQty',
        compactFormatter.format(row.original.lastSize),
      ),
  },
  {
    id: 'depth',
    header: 'Bid / Ask Qty',
    size: 145,
    cell: ({ row }) =>
      recordCellRender(
        'Depth',
        <DepthCell
          bidSize={row.original.bidSize}
          askSize={row.original.askSize}
        />,
      ),
  },
  {
    id: 'age',
    header: 'Quote Age',
    size: 85,
    cell: ({ row }) =>
      recordCellRender('QuoteAge', <AgeCell quote={row.original} />),
  },
  {
    id: 'change',
    header: 'Day %',
    size: 90,
    cell: ({ row }) =>
      recordCellRender(
        'DayChange',
        formatDayChange(row.original.price, row.original.open),
      ),
  },
  {
    id: 'volume',
    header: 'Total Qty',
    size: 100,
    cell: ({ row }) =>
      recordCellRender(
        'TotalQty',
        compactFormatter.format(row.original.volume),
      ),
  },
  {
    id: 'turnover',
    header: 'Traded Value',
    size: 115,
    cell: ({ row }) =>
      recordCellRender(
        'TradedValue',
        currencyFormatter.format(row.original.turnover),
      ),
  },
  {
    id: 'history',
    header: 'Intraday',
    size: 150,
    cell: ({ row }) =>
      recordCellRender(
        'Intraday',
        <SparklineCell values={row.original.history} />,
      ),
  },
]

export const rowModelDiagnostics = {
  hasMeasurement: false,
  calls: 0,
  totalDurationMs: 0,
  maxDurationMs: 0,
  lastRowCount: 0,
}

export const TRADING_COLUMN_COUNT = tradingColumns.length

export function getCoreTableState(props: TradingTableProps) {
  const sorts =
    props.coreRowModelMode === 'sort' ||
    props.coreRowModelMode === 'sort-filter'
  const filters =
    (props.coreRowModelMode === 'filter' ||
      props.coreRowModelMode === 'sort-filter') &&
    props.coreFilterValue.trim().length > 0

  return {
    sorting: sorts ? [{ id: 'price', desc: true }] : [],
    columnFilters: filters
      ? [{ id: 'symbol', value: props.coreFilterValue.trim() }]
      : [],
  } satisfies CoreTableState
}

export function useCoreTableState(props: TradingTableProps) {
  return useMemo(
    () => getCoreTableState(props),
    [props.coreFilterValue, props.coreRowModelMode],
  )
}

export function readMeasuredRows<Row>(
  adapter: TableAdapter,
  readRows: () => Array<Row>,
): Array<Row> {
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

  try {
    performance.measure('tanstack-row-model', {
      start,
      end,
      detail: { adapter, rowCount: rows.length },
    })
    if (rowModelDiagnostics.calls % 1_000 === 0) {
      performance.clearMeasures('tanstack-row-model')
    }
  } catch {
    // User Timing Level 3 detail is not implemented in every browser.
  }

  return rows
}

function LastPriceCell(props: { quote: MarketQuote }) {
  const { selectSymbol } = useTradingShellController().actions
  return (
    <PriceCell
      price={props.quote.price}
      move={props.quote.lastMove}
      onSelect={() => selectSymbol(props.quote.symbol)}
    />
  )
}

function LastMoveCell(props: { quote: MarketQuote }) {
  const { rendererMode } = useTradingShellController().renderAtoms
  const mode = useSelector(rendererMode)
  if (mode === 'stable') {
    return <StableMoveCell move={props.quote.lastMove} />
  }
  return props.quote.lastMove >= 0 ? (
    <UpMoveCell move={props.quote.lastMove} />
  ) : (
    <DownMoveCell move={props.quote.lastMove} />
  )
}

function AgeCell(props: { quote: MarketQuote }) {
  const { quoteAge } = useTradingShellController().renderAtoms
  const { enabled, clock } = useSelector(quoteAge)
  return (
    <QuoteAgeCell
      ageMs={
        enabled
          ? Math.max(0, clock - props.quote.lastUpdatedAt)
          : 0
      }
    />
  )
}

export function TradingRow(props: {
  quote: MarketQuote
  children: ReactNode
}) {
  const { selectedSymbol } = useTradingShellController().renderAtoms
  const selected = useSelector(
    selectedSymbol,
    (symbol) => symbol === props.quote.symbol,
  )
  return (
    <tr
      className={selected ? 'is-selected' : undefined}
      data-symbol={props.quote.symbol}
      data-row-id={props.quote.id}
      title={props.quote.company}
    >
      {props.children}
    </tr>
  )
}

function formatDayChange(price: number, open: number): string {
  const change = (price / open - 1) * 100
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}

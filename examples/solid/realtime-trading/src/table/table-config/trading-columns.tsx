import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells'
import type { JSX } from 'solid-js'
import type { MarketQuote } from '../../feed/market-data'
import type { VirtualScrollMode } from '../trading-row-virtualizer'

export type RendererMode = 'stable' | 'swap'

export interface TradingTableProps {
  quotes: Array<MarketQuote>
  rendererMode: RendererMode
  selectedSymbol: string | null
  virtualScrollMode: VirtualScrollMode
  onSelectSymbol: (symbol: string) => void
  onRenderedRowCount: (count: number) => void
}

interface TradingCellContext {
  row: { original: MarketQuote }
}

interface TradingColumnDefinition {
  id: string
  header: string
  size?: number
  columns?: Array<TradingColumnDefinition>
  accessorFn?: (row: MarketQuote) => unknown
  enableSorting?: boolean
  cell?: (context: TradingCellContext) => JSX.Element
}

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
export function createTradingColumns(
  props: TradingTableProps,
): Array<TradingColumnDefinition> {
  return [
    {
      id: 'instrument',
      header: 'Instrument',
      columns: [
        {
          id: 'market',
          header: 'Market',
          size: 72,
          accessorFn: (row) => row.venue,
          cell: ({ row }) =>
            recordCellRender('Market', () => row.original.venue),
        },
        {
          id: 'name',
          header: 'Name',
          size: 180,
          accessorFn: (row) => row.company,
          cell: ({ row }) =>
            recordCellRender('Name', () => row.original.company),
        },
        {
          id: 'symbol',
          header: 'Symbol',
          size: 92,
          accessorFn: (row) => row.symbol,
          cell: ({ row }) =>
            recordCellRender('Symbol', () => row.original.symbol),
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
          cell: ({ row }) =>
            recordCellRender('Last', () => {
              const change = getDayChange(row.original)
              return (
                <PriceCell
                  price={row.original.price}
                  move={change}
                  onSelect={() => props.onSelectSymbol(row.original.symbol)}
                />
              )
            }),
        },
        {
          id: 'change',
          header: 'Chg',
          size: 94,
          accessorFn: (row) => getDayChange(row),
          cell: ({ row }) =>
            recordCellRender('Change', () => {
              const move = getDayChange(row.original)
              if (props.rendererMode === 'stable') {
                return <StableMoveCell move={move} />
              }
              return move >= 0 ? (
                <UpMoveCell move={move} />
              ) : (
                <DownMoveCell move={move} />
              )
            }),
        },
        {
          id: 'changePercent',
          header: 'Chg%',
          size: 90,
          accessorFn: (row) => getDayChangePercent(row),
          cell: ({ row }) =>
            recordCellRender('ChangePercent', () => (
              <PercentChangeCell value={getDayChangePercent(row.original)} />
            )),
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
          cell: ({ row }) =>
            recordCellRender('Bid', () => row.original.bid.toFixed(2)),
        },
        {
          id: 'bidSize',
          header: 'Bid Vol',
          size: 100,
          accessorFn: (row) => row.bidSize,
          cell: ({ row }) =>
            recordCellRender('BidVolume', () =>
              compactFormatter.format(row.original.bidSize),
            ),
        },
        {
          id: 'ask',
          header: 'Ask',
          size: 90,
          accessorFn: (row) => row.ask,
          cell: ({ row }) =>
            recordCellRender('Ask', () => row.original.ask.toFixed(2)),
        },
        {
          id: 'askSize',
          header: 'Ask Vol',
          size: 100,
          accessorFn: (row) => row.askSize,
          cell: ({ row }) =>
            recordCellRender('AskVolume', () =>
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
            recordCellRender('Open', () => row.original.open.toFixed(2)),
        },
        {
          id: 'high',
          header: 'High',
          size: 90,
          accessorFn: (row) => row.high,
          cell: ({ row }) =>
            recordCellRender('High', () => row.original.high.toFixed(2)),
        },
        {
          id: 'low',
          header: 'Low',
          size: 90,
          accessorFn: (row) => row.low,
          cell: ({ row }) =>
            recordCellRender('Low', () => row.original.low.toFixed(2)),
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
            recordCellRender('Intraday', () => (
              <SparklineCell values={row.original.history} />
            )),
        },
      ],
    },
  ]
}

function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}

function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0
    ? 0
    : (getDayChange(quote) / quote.previousClose) * 100
}

export const TRADING_COLUMN_COUNT = 14

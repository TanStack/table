import { flexRenderComponent } from '@tanstack/angular-table'
import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
} from './quote-cells'
import type { ColumnDef, TableFeatures } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'
import type { TradingColumnState } from './trading-column-types'

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function createTradingColumns(
  state: TradingColumnState,
): Array<ColumnDef<TableFeatures, MarketQuote, unknown>> {
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
          cell: ({ row }) => row.original.venue,
        },
        {
          id: 'name',
          header: 'Name',
          size: 180,
          accessorFn: (row) => row.company,
          cell: ({ row }) => row.original.company,
        },
        {
          id: 'symbol',
          header: 'Symbol',
          size: 92,
          accessorFn: (row) => row.symbol,
          cell: ({ row }) => row.original.symbol,
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
          cell: ({ row }) => {
            const change = getDayChange(row.original)
            return flexRenderComponent(PriceCell, {
              inputs: { price: row.original.price, move: change },
              outputs: {
                select: () => state.selectSymbol(row.original.symbol),
              },
            })
          },
        },
        {
          id: 'change',
          header: 'Chg',
          size: 94,
          accessorFn: (row) => getDayChange(row),
          cell: ({ row }) => {
            const move = getDayChange(row.original)
            if (state.rendererMode() === 'stable') {
              return flexRenderComponent(StableMoveCell, {
                inputs: { move },
              })
            }
            return flexRenderComponent(move >= 0 ? UpMoveCell : DownMoveCell, {
              inputs: { move },
            })
          },
        },
        {
          id: 'changePercent',
          header: 'Chg%',
          size: 90,
          accessorFn: (row) => getDayChangePercent(row),
          cell: ({ row }) =>
            flexRenderComponent(PercentChangeCell, {
              inputs: { value: getDayChangePercent(row.original) },
            }),
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
          cell: ({ row }) => row.original.bid.toFixed(2),
        },
        {
          id: 'bidSize',
          header: 'Bid Vol',
          size: 100,
          accessorFn: (row) => row.bidSize,
          cell: ({ row }) => compactFormatter.format(row.original.bidSize),
        },
        {
          id: 'ask',
          header: 'Ask',
          size: 90,
          accessorFn: (row) => row.ask,
          cell: ({ row }) => row.original.ask.toFixed(2),
        },
        {
          id: 'askSize',
          header: 'Ask Vol',
          size: 100,
          accessorFn: (row) => row.askSize,
          cell: ({ row }) => compactFormatter.format(row.original.askSize),
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
          cell: ({ row }) => row.original.open.toFixed(2),
        },
        {
          id: 'high',
          header: 'High',
          size: 90,
          accessorFn: (row) => row.high,
          cell: ({ row }) => row.original.high.toFixed(2),
        },
        {
          id: 'low',
          header: 'Low',
          size: 90,
          accessorFn: (row) => row.low,
          cell: ({ row }) => row.original.low.toFixed(2),
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
            flexRenderComponent(SparklineCell, {
              inputs: { values: row.original.history },
            }),
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

import { flexRenderComponent } from '@tanstack/angular-table-beta'
import {
  DepthCell,
  DownMoveCell,
  PriceCell,
  QuoteAgeCell,
  SparklineCell,
  SpreadCell,
  StableMoveCell,
  UpMoveCell,
} from './quote-cells'
import type {
  ColumnDef,
  TableFeatures,
} from '@tanstack/angular-table-beta'
import type { MarketQuote } from './market-data'
import type { TradingColumnState } from './trading-column-types'

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

export function createBetaTradingColumns(
  state: TradingColumnState,
): Array<ColumnDef<TableFeatures, MarketQuote, unknown>> {
  return [
    {
      id: 'symbol',
      header: 'Ticker',
      size: 90,
      cell: ({ row }) => row.original.symbol,
    },
    {
      id: 'venue',
      header: 'Venue',
      size: 70,
      cell: ({ row }) => row.original.venue,
    },
    {
      id: 'bid',
      header: 'Bid',
      size: 90,
      cell: ({ row }) => row.original.bid.toFixed(2),
    },
    {
      id: 'ask',
      header: 'Ask',
      size: 90,
      cell: ({ row }) => row.original.ask.toFixed(2),
    },
    {
      id: 'spread',
      header: 'Spread',
      size: 95,
      cell: ({ row }) =>
        flexRenderComponent(SpreadCell, {
          inputs: {
            bid: row.original.bid,
            ask: row.original.ask,
          },
        }),
    },
    {
      id: 'price',
      header: 'Last',
      size: 100,
      cell: ({ row }) =>
        flexRenderComponent(PriceCell, {
          inputs: {
            price: row.original.price,
            move: row.original.lastMove,
          },
          outputs: {
            select: () => state.selectSymbol(row.original.symbol),
          },
        }),
    },
    {
      id: 'lastMove',
      header: 'Last Move',
      size: 105,
      cell: ({ row }) => {
        const move = row.original.lastMove
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
      id: 'lastSize',
      header: 'Last Qty',
      size: 90,
      cell: ({ row }) => compactFormatter.format(row.original.lastSize),
    },
    {
      id: 'depth',
      header: 'Bid / Ask Qty',
      size: 145,
      cell: ({ row }) =>
        flexRenderComponent(DepthCell, {
          inputs: {
            bidSize: row.original.bidSize,
            askSize: row.original.askSize,
          },
        }),
    },
    {
      id: 'age',
      header: 'Quote Age',
      size: 85,
      cell: ({ row }) =>
        flexRenderComponent(QuoteAgeCell, {
          inputs: {
            ageMs: state.updateQuoteAges()
              ? Math.max(
                  0,
                  state.quoteClock() - row.original.lastUpdatedAt,
                )
              : 0,
          },
        }),
    },
    {
      id: 'change',
      header: 'Day %',
      size: 90,
      cell: ({ row }) => {
        const change = (row.original.price / row.original.open - 1) * 100
        const sign = change >= 0 ? '+' : ''
        return `${sign}${change.toFixed(2)}%`
      },
    },
    {
      id: 'volume',
      header: 'Total Qty',
      size: 100,
      cell: ({ row }) => compactFormatter.format(row.original.volume),
    },
    {
      id: 'turnover',
      header: 'Traded Value',
      size: 115,
      cell: ({ row }) => currencyFormatter.format(row.original.turnover),
    },
    {
      id: 'history',
      header: 'Intraday',
      size: 150,
      cell: ({ row }) =>
        flexRenderComponent(SparklineCell, {
          inputs: { values: row.original.history },
        }),
    },
  ]
}

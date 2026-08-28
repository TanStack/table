import {
  createColumnHelper,
  flexRenderComponent,
} from '@tanstack/angular-table'
import { tradingFeatures } from '../trading-features'
import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
} from './quote-cells'
import type { MarketQuote } from '../../feed/market-data'
import type { TradingColumnState } from './trading-column-types'

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const columnHelper = createColumnHelper<typeof tradingFeatures, MarketQuote>()

export function createTradingColumns(state: TradingColumnState) {
  return columnHelper.columns([
    columnHelper.group({
      id: 'instrument',
      header: 'Instrument',
      columns: columnHelper.columns([
        columnHelper.accessor('venue', {
          id: 'market',
          header: 'Market',
          size: 72,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('company', {
          id: 'name',
          header: 'Name',
          size: 180,
          cell: (info) => info.getValue(),
        }),
        columnHelper.accessor('symbol', {
          header: 'Symbol',
          size: 92,
          cell: (info) => info.getValue(),
        }),
      ]),
    }),
    columnHelper.group({
      id: 'priceAndChange',
      header: 'Price & Change',
      columns: columnHelper.columns([
        columnHelper.accessor('price', {
          header: 'Price',
          size: 96,
          cell: (info) => {
            const change = getDayChange(info.row.original)
            return flexRenderComponent(PriceCell, {
              inputs: { price: info.getValue(), move: change },
              outputs: {
                select: () => state.selectSymbol(info.row.original.symbol),
              },
            })
          },
        }),
        columnHelper.accessor((row) => getDayChange(row), {
          id: 'change',
          header: 'Chg',
          size: 94,
          cell: (info) => {
            const move = info.getValue()
            if (state.rendererMode() === 'stable') {
              return flexRenderComponent(StableMoveCell, {
                inputs: { move },
              })
            }
            return flexRenderComponent(move >= 0 ? UpMoveCell : DownMoveCell, {
              inputs: { move },
            })
          },
        }),
        columnHelper.accessor((row) => getDayChangePercent(row), {
          id: 'changePercent',
          header: 'Chg%',
          size: 90,
          cell: (info) =>
            flexRenderComponent(PercentChangeCell, {
              inputs: { value: info.getValue() },
            }),
        }),
      ]),
    }),
    columnHelper.group({
      id: 'orderBook',
      header: 'Order Book',
      columns: columnHelper.columns([
        columnHelper.accessor('bid', {
          header: 'Bid',
          size: 90,
          cell: (info) => info.getValue().toFixed(2),
        }),
        columnHelper.accessor('bidSize', {
          header: 'Bid Vol',
          size: 100,
          cell: (info) => compactFormatter.format(info.getValue()),
        }),
        columnHelper.accessor('ask', {
          header: 'Ask',
          size: 90,
          cell: (info) => info.getValue().toFixed(2),
        }),
        columnHelper.accessor('askSize', {
          header: 'Ask Vol',
          size: 100,
          cell: (info) => compactFormatter.format(info.getValue()),
        }),
      ]),
    }),
    columnHelper.group({
      id: 'session',
      header: 'Session',
      columns: columnHelper.columns([
        columnHelper.accessor('open', {
          header: 'Open',
          size: 90,
          cell: (info) => info.getValue().toFixed(2),
        }),
        columnHelper.accessor('high', {
          header: 'High',
          size: 90,
          cell: (info) => info.getValue().toFixed(2),
        }),
        columnHelper.accessor('low', {
          header: 'Low',
          size: 90,
          cell: (info) => info.getValue().toFixed(2),
        }),
      ]),
    }),
    columnHelper.group({
      id: 'chart',
      header: 'Chart',
      columns: columnHelper.columns([
        columnHelper.accessor('history', {
          header: 'Intraday',
          size: 150,
          enableSorting: false,
          cell: (info) =>
            flexRenderComponent(SparklineCell, {
              inputs: { values: info.getValue() },
            }),
        }),
      ]),
    }),
  ])
}

function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}

function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0
    ? 0
    : (getDayChange(quote) / quote.previousClose) * 100
}

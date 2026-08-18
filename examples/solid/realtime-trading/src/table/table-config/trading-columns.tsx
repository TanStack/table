import {
  AskCellRenderer,
  AskVolumeCellRenderer,
  BidCellRenderer,
  BidVolumeCellRenderer,
  HighCellRenderer,
  LowCellRenderer,
  MarketCellRenderer,
  NameCellRenderer,
  OpenCellRenderer,
  PercentChangeCellRenderer,
  SparklineCellRenderer,
  StableMoveCellRenderer,
  SwappingMoveCellRenderer,
  SymbolCellRenderer,
  createPriceCellRenderer,
} from './quote-cell-renderers'
import { getDayChange, getDayChangePercent } from './market-quote-values'
import type { JSX } from 'solid-js'
import type { MarketQuote } from '../../feed/market-data'
import type { TradingCellContext } from '../trading-table-features'

export type RendererMode = 'stable' | 'swap'

export interface TradingColumnOptions {
  rendererMode: RendererMode
  onSelectSymbol: (symbol: string) => void
}

export interface TradingColumnDefinition {
  id: string
  header: string
  size?: number
  columns?: Array<TradingColumnDefinition>
  accessorFn?: (row: MarketQuote) => unknown
  enableSorting?: boolean
  cell?: (context: TradingCellContext) => JSX.Element
}

export type TradingColumnSet = Array<TradingColumnDefinition>

export function createTradingColumns(
  options: TradingColumnOptions,
): TradingColumnSet {
  const priceCell = createPriceCellRenderer(options.onSelectSymbol)
  const changeCell =
    options.rendererMode === 'stable'
      ? StableMoveCellRenderer
      : SwappingMoveCellRenderer

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
          cell: MarketCellRenderer,
        },
        {
          id: 'name',
          header: 'Name',
          size: 180,
          accessorFn: (row) => row.company,
          cell: NameCellRenderer,
        },
        {
          id: 'symbol',
          header: 'Symbol',
          size: 92,
          accessorFn: (row) => row.symbol,
          cell: SymbolCellRenderer,
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
          cell: priceCell,
        },
        {
          id: 'change',
          header: 'Chg',
          size: 94,
          accessorFn: (row) => getDayChange(row),
          cell: changeCell,
        },
        {
          id: 'changePercent',
          header: 'Chg%',
          size: 90,
          accessorFn: (row) => getDayChangePercent(row),
          cell: PercentChangeCellRenderer,
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
          cell: BidCellRenderer,
        },
        {
          id: 'bidSize',
          header: 'Bid Vol',
          size: 100,
          accessorFn: (row) => row.bidSize,
          cell: BidVolumeCellRenderer,
        },
        {
          id: 'ask',
          header: 'Ask',
          size: 90,
          accessorFn: (row) => row.ask,
          cell: AskCellRenderer,
        },
        {
          id: 'askSize',
          header: 'Ask Vol',
          size: 100,
          accessorFn: (row) => row.askSize,
          cell: AskVolumeCellRenderer,
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
          cell: OpenCellRenderer,
        },
        {
          id: 'high',
          header: 'High',
          size: 90,
          accessorFn: (row) => row.high,
          cell: HighCellRenderer,
        },
        {
          id: 'low',
          header: 'Low',
          size: 90,
          accessorFn: (row) => row.low,
          cell: LowCellRenderer,
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
          cell: SparklineCellRenderer,
        },
      ],
    },
  ]
}

export const TRADING_COLUMN_COUNT = 14

import { createColumnHelper } from '@tanstack/solid-table'
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
import { tradingTableFeatures } from '../trading-table-features'
import type { MarketQuote } from '../../feed/market-data'

export type RendererMode = 'stable' | 'swap'

export interface TradingColumnOptions {
  rendererMode: RendererMode
  onSelectSymbol: (symbol: string) => void
}

const columnHelper = createColumnHelper<
  typeof tradingTableFeatures,
  MarketQuote
>()

export function createTradingColumns(options: TradingColumnOptions) {
  const priceCell = createPriceCellRenderer(options.onSelectSymbol)
  const changeCell =
    options.rendererMode === 'stable'
      ? StableMoveCellRenderer
      : SwappingMoveCellRenderer

  return columnHelper.columns([
    columnHelper.group({
      id: 'instrument',
      header: 'Instrument',
      columns: columnHelper.columns([
        columnHelper.accessor('venue', {
          id: 'market',
          header: 'Market',
          size: 72,
          cell: MarketCellRenderer,
        }),
        columnHelper.accessor('company', {
          id: 'name',
          header: 'Name',
          size: 180,
          cell: NameCellRenderer,
        }),
        columnHelper.accessor('symbol', {
          header: 'Symbol',
          size: 92,
          cell: SymbolCellRenderer,
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
          cell: priceCell,
        }),
        columnHelper.accessor((row) => getDayChange(row), {
          id: 'change',
          header: 'Chg',
          size: 94,
          cell: changeCell,
        }),
        columnHelper.accessor((row) => getDayChangePercent(row), {
          id: 'changePercent',
          header: 'Chg%',
          size: 90,
          cell: PercentChangeCellRenderer,
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
          cell: BidCellRenderer,
        }),
        columnHelper.accessor('bidSize', {
          header: 'Bid Vol',
          size: 100,
          cell: BidVolumeCellRenderer,
        }),
        columnHelper.accessor('ask', {
          header: 'Ask',
          size: 90,
          cell: AskCellRenderer,
        }),
        columnHelper.accessor('askSize', {
          header: 'Ask Vol',
          size: 100,
          cell: AskVolumeCellRenderer,
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
          cell: OpenCellRenderer,
        }),
        columnHelper.accessor('high', {
          header: 'High',
          size: 90,
          cell: HighCellRenderer,
        }),
        columnHelper.accessor('low', {
          header: 'Low',
          size: 90,
          cell: LowCellRenderer,
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
          cell: SparklineCellRenderer,
        }),
      ]),
    }),
  ])
}

export type TradingColumnSet = ReturnType<typeof createTradingColumns>

export const TRADING_COLUMN_COUNT = 14

import {
  createSortedRowModel,
  stockFeatures,
  tableFeatures,
} from '@tanstack/solid-table'
import type { Cell, Header, Row, SolidTable } from '@tanstack/solid-table'
import type { MarketQuote } from '../feed/market-data'

export const tradingTableFeatures = tableFeatures({
  ...stockFeatures,
  sortedRowModel: createSortedRowModel(),
})

export type TradingTableFeatures = typeof tradingTableFeatures
export type TradingTableInstance = SolidTable<TradingTableFeatures, MarketQuote>
export type TradingRow = Row<TradingTableFeatures, MarketQuote>
export type TradingCell = Cell<TradingTableFeatures, MarketQuote, unknown>
export type TradingCellContext = ReturnType<TradingCell['getContext']>
export type TradingHeader = Header<TradingTableFeatures, MarketQuote, unknown>

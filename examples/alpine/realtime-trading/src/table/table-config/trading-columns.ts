import { recordCellRender, sparklineMarkup } from './quote-cells'
import type { ColumnDef, TableFeatures } from '@tanstack/alpine-table'
import type { MarketQuote } from '../../feed/market-data'

export type RendererMode = 'stable' | 'swap'
export interface CoreTableState { sorting: Array<{ id: string; desc: boolean }>; columnFilters: Array<{ id: string; value: unknown }> }
interface CellContext { row: { original: MarketQuote } }
interface Definition { id: string; header: string; size?: number; columns?: Array<Definition>; accessorFn?: (row: MarketQuote) => unknown; enableSorting?: boolean; filterFn?: 'includesString'; sortFn?: 'basic'; cell?: (context: CellContext) => unknown }
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const safe = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')

export function createTradingColumns<TFeatures extends TableFeatures>(getRendererMode: () => RendererMode): Array<ColumnDef<TFeatures, MarketQuote>> {
  const columns: Array<Definition> = [
    { id: 'instrument', header: 'Instrument', columns: [
      { id: 'market', header: 'Market', size: 72, accessorFn: (row) => row.venue, cell: ({ row }) => recordCellRender('Market', safe(row.original.venue)) },
      { id: 'name', header: 'Name', size: 180, accessorFn: (row) => row.company, cell: ({ row }) => recordCellRender('Name', safe(row.original.company)) },
      { id: 'symbol', header: 'Symbol', size: 92, accessorFn: (row) => row.symbol, filterFn: 'includesString', cell: ({ row }) => recordCellRender('Symbol', safe(row.original.symbol)) },
    ] },
    { id: 'priceAndChange', header: 'Price & Change', columns: [
      { id: 'price', header: 'Price', size: 96, accessorFn: (row) => row.price, sortFn: 'basic', cell: ({ row }) => recordCellRender('Last', `<quote-price-cell price="${row.original.price}" move="${getDayChange(row.original)}"></quote-price-cell>`) },
      { id: 'change', header: 'Chg', size: 94, accessorFn: getDayChange, cell: ({ row }) => recordCellRender('Change', moveMarkup(getRendererMode(), getDayChange(row.original))) },
      { id: 'changePercent', header: 'Chg%', size: 90, accessorFn: getDayChangePercent, cell: ({ row }) => recordCellRender('ChangePercent', `<quote-percent-change value="${getDayChangePercent(row.original)}"></quote-percent-change>`) },
    ] },
    { id: 'orderBook', header: 'Order Book', columns: [
      { id: 'bid', header: 'Bid', size: 90, accessorFn: (row) => row.bid, cell: ({ row }) => recordCellRender('Bid', row.original.bid.toFixed(2)) },
      { id: 'bidSize', header: 'Bid Vol', size: 100, accessorFn: (row) => row.bidSize, cell: ({ row }) => recordCellRender('BidVolume', compact.format(row.original.bidSize)) },
      { id: 'ask', header: 'Ask', size: 90, accessorFn: (row) => row.ask, cell: ({ row }) => recordCellRender('Ask', row.original.ask.toFixed(2)) },
      { id: 'askSize', header: 'Ask Vol', size: 100, accessorFn: (row) => row.askSize, cell: ({ row }) => recordCellRender('AskVolume', compact.format(row.original.askSize)) },
    ] },
    { id: 'session', header: 'Session', columns: [
      { id: 'open', header: 'Open', size: 90, accessorFn: (row) => row.open, cell: ({ row }) => recordCellRender('Open', row.original.open.toFixed(2)) },
      { id: 'high', header: 'High', size: 90, accessorFn: (row) => row.high, cell: ({ row }) => recordCellRender('High', row.original.high.toFixed(2)) },
      { id: 'low', header: 'Low', size: 90, accessorFn: (row) => row.low, cell: ({ row }) => recordCellRender('Low', row.original.low.toFixed(2)) },
    ] },
    { id: 'chart', header: 'Chart', columns: [{ id: 'history', header: 'Intraday', size: 150, enableSorting: false, cell: ({ row }) => recordCellRender('Intraday', sparklineMarkup(row.original.history)) }] },
  ]
  return columns as unknown as Array<ColumnDef<TFeatures, MarketQuote>>
}
function moveMarkup(mode: RendererMode, move: number) { if (mode === 'stable') return `<quote-stable-move move="${move}"></quote-stable-move>`; return move >= 0 ? `<quote-up-move move="${move}"></quote-up-move>` : `<quote-down-move move="${move}"></quote-down-move>` }
export const rowModelDiagnostics = { hasMeasurement: false, calls: 0, totalDurationMs: 0, maxDurationMs: 0, lastRowCount: 0 }
export const TRADING_COLUMN_COUNT = 14
export function readMeasuredRows<Row>(readRows: () => Array<Row>): Array<Row> { const start = performance.now(); const rows = readRows(); const end = performance.now(); const duration = end - start; rowModelDiagnostics.calls++; rowModelDiagnostics.hasMeasurement = true; rowModelDiagnostics.totalDurationMs += duration; rowModelDiagnostics.maxDurationMs = Math.max(rowModelDiagnostics.maxDurationMs, duration); rowModelDiagnostics.lastRowCount = rows.length; try { performance.measure('tanstack-row-model', { start, end, detail: { rowCount: rows.length } }) } catch { /* optional */ } return rows }
export function getDayChange(quote: MarketQuote): number { return quote.price - quote.previousClose }
export function getDayChangePercent(quote: MarketQuote): number { return quote.previousClose === 0 ? 0 : (getDayChange(quote) / quote.previousClose) * 100 }

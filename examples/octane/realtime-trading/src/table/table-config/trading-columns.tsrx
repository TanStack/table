import { createColumnHelper } from '@tanstack/octane-table'
import { tradingFeatures } from '../trading-features'
import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells.tsrx'
import type { MarketQuote } from '../../feed/market-data'
import type { TradingBenchmarkController } from '../../benchmark/trading-benchmark-controller'

export type RendererMode = 'stable' | 'swap'
export interface CoreTableState {
  sorting: Array<{ id: string; desc: boolean }>
  columnFilters: Array<{ id: string; value: unknown }>
}

const compact = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const columnHelper = createColumnHelper<typeof tradingFeatures, MarketQuote>()

export function createTradingColumns(
  controller: TradingBenchmarkController,
  rendererMode: RendererMode,
) {
  return columnHelper.columns([
    columnHelper.group({
      id: 'instrument',
      header: 'Instrument',
      columns: columnHelper.columns([
        columnHelper.accessor('venue', {
          id: 'market',
          header: 'Market',
          size: 72,
          cell: (info) => recordCellRender('Market', info.getValue()),
        }),
        columnHelper.accessor('company', {
          id: 'name',
          header: 'Name',
          size: 180,
          cell: (info) => recordCellRender('Name', info.getValue()),
        }),
        columnHelper.accessor('symbol', {
          header: 'Symbol',
          size: 92,
          filterFn: 'includesString',
          cell: (info) => recordCellRender('Symbol', info.getValue()),
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
          sortFn: 'basic',
          cell: (info) =>
            recordCellRender(
              'Last',
              <PriceCell
                price={info.getValue()}
                move={getDayChange(info.row.original)}
                onSelect={() => controller.actions.selectSymbol(info.row.original.symbol)}
              />,
            ),
        }),
        columnHelper.accessor(getDayChange, {
          id: 'change',
          header: 'Chg',
          size: 94,
          cell: (info) =>
            recordCellRender(
              'Change',
              <MoveCell mode={rendererMode} move={info.getValue()} />,
            ),
        }),
        columnHelper.accessor(getDayChangePercent, {
          id: 'changePercent',
          header: 'Chg%',
          size: 90,
          cell: (info) =>
            recordCellRender(
              'ChangePercent',
              <PercentChangeCell value={info.getValue()} />,
            ),
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
          cell: (info) => recordCellRender('Bid', info.getValue().toFixed(2)),
        }),
        columnHelper.accessor('bidSize', {
          header: 'Bid Vol',
          size: 100,
          cell: (info) =>
            recordCellRender('BidVolume', compact.format(info.getValue())),
        }),
        columnHelper.accessor('ask', {
          header: 'Ask',
          size: 90,
          cell: (info) => recordCellRender('Ask', info.getValue().toFixed(2)),
        }),
        columnHelper.accessor('askSize', {
          header: 'Ask Vol',
          size: 100,
          cell: (info) =>
            recordCellRender('AskVolume', compact.format(info.getValue())),
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
          cell: (info) => recordCellRender('Open', info.getValue().toFixed(2)),
        }),
        columnHelper.accessor('high', {
          header: 'High',
          size: 90,
          cell: (info) => recordCellRender('High', info.getValue().toFixed(2)),
        }),
        columnHelper.accessor('low', {
          header: 'Low',
          size: 90,
          cell: (info) => recordCellRender('Low', info.getValue().toFixed(2)),
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
            recordCellRender('Intraday', <SparklineCell values={info.getValue()} />),
        }),
      ]),
    }),
  ])
}

function MoveCell({ mode, move }: { mode: RendererMode; move: number }) @{
  if (mode === 'stable') return <StableMoveCell move={move} />
  if (move >= 0) return <UpMoveCell move={move} />
  <DownMoveCell move={move} />
}

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
  rowModelDiagnostics.maxDurationMs = Math.max(rowModelDiagnostics.maxDurationMs, duration)
  rowModelDiagnostics.lastRowCount = rows.length
  if (rowModelDiagnostics.calls % 20 !== 0) return rows
  try {
    performance.measure('tanstack-row-model', { start, end, detail: { rowCount: rows.length } })
    if (rowModelDiagnostics.calls % 20_000 === 0) performance.clearMeasures('tanstack-row-model')
  } catch { /* optional User Timing detail */ }
  return rows
}

export function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}

export function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0 ? 0 : (getDayChange(quote) / quote.previousClose) * 100
}

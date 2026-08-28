import { createColumnHelper } from '@tanstack/react-table'
import { useSelector } from '@tanstack/react-store'
import { useTradingShellController } from '../../shell/trading-shell-context'
import { tradingFeatures } from '../trading-features'
import {
  DownMoveCell,
  PercentChangeCell,
  PriceCell,
  SparklineCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells'
import type { ReactNode } from 'react'
import type { MarketQuote } from '../../feed/market-data'

export type RendererMode = 'stable' | 'swap'
export interface CoreTableState {
  sorting: Array<{ id: string; desc: boolean }>
  columnFilters: Array<{ id: string; value: unknown }>
}

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
})
const columnHelper = createColumnHelper<typeof tradingFeatures, MarketQuote>()

export const tradingColumns = columnHelper.columns([
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
          recordCellRender('Last', <LastPriceCell quote={info.row.original} />),
      }),
      columnHelper.accessor((row) => getDayChange(row), {
        id: 'change',
        header: 'Chg',
        size: 94,
        cell: (info) =>
          recordCellRender(
            'Change',
            <DayChangeCell quote={info.row.original} />,
          ),
      }),
      columnHelper.accessor((row) => getDayChangePercent(row), {
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
          recordCellRender(
            'BidVolume',
            compactFormatter.format(info.getValue()),
          ),
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
          recordCellRender(
            'AskVolume',
            compactFormatter.format(info.getValue()),
          ),
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
          recordCellRender(
            'Intraday',
            <SparklineCell values={info.getValue()} />,
          ),
      }),
    ]),
  }),
])

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
  rowModelDiagnostics.maxDurationMs = Math.max(
    rowModelDiagnostics.maxDurationMs,
    duration,
  )
  rowModelDiagnostics.lastRowCount = rows.length

  if (rowModelDiagnostics.calls % 1_000 === 0) {
    performance.clearMeasures('tanstack-row-model')
  }
  if ((rowModelDiagnostics.calls - 1) % 20 === 0) {
    try {
      performance.measure('tanstack-row-model', {
        start,
        end,
        detail: { rowCount: rows.length },
      })
    } catch {
      // User Timing Level 3 detail is not implemented in every browser.
    }
  }

  return rows
}

function LastPriceCell(props: { quote: MarketQuote }) {
  const { selectSymbol } = useTradingShellController().actions
  return (
    <PriceCell
      price={props.quote.price}
      move={getDayChange(props.quote)}
      onSelect={() => selectSymbol(props.quote.symbol)}
    />
  )
}

function DayChangeCell(props: { quote: MarketQuote }) {
  const { rendererMode } = useTradingShellController().renderAtoms
  const mode = useSelector(rendererMode)
  const change = getDayChange(props.quote)
  if (mode === 'stable') {
    return <StableMoveCell move={change} />
  }
  return change >= 0 ? (
    <UpMoveCell move={change} />
  ) : (
    <DownMoveCell move={change} />
  )
}

export function TradingRow(props: {
  quote: MarketQuote
  children: ReactNode
  rowSelected: boolean
  virtualRow?: { index: number; start: number }
}) {
  const { selectedSymbol } = useTradingShellController().renderAtoms
  const selected = useSelector(
    selectedSymbol,
    (symbol) => symbol === props.quote.symbol,
  )
  return (
    <tr
      className={props.virtualRow ? 'virtual-table-row' : undefined}
      style={
        props.virtualRow
          ? { transform: `translateY(${props.virtualRow.start}px)` }
          : undefined
      }
      data-virtual-index={props.virtualRow?.index}
      data-symbol={props.quote.symbol}
      data-row-id={props.quote.id}
      data-symbol-selected={selected ? 'true' : undefined}
      title={props.quote.company}
      aria-selected={props.rowSelected}
    >
      {props.children}
    </tr>
  )
}

function getDayChange(quote: MarketQuote): number {
  return quote.price - quote.previousClose
}

function getDayChangePercent(quote: MarketQuote): number {
  return quote.previousClose === 0
    ? 0
    : (getDayChange(quote) / quote.previousClose) * 100
}

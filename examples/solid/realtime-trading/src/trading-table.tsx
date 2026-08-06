import {
  createSolidTable,
  flexRender as flexRenderV8,
  getCoreRowModel,
} from '@tanstack/solid-table-v8'
import { FlexRender, createTable, stockFeatures } from '@tanstack/solid-table'
import { For, Show } from 'solid-js'
import {
  DepthCell,
  DownMoveCell,
  PriceCell,
  QuoteAgeCell,
  SparklineCell,
  SpreadCell,
  StableMoveCell,
  UpMoveCell,
  recordCellRender,
} from './quote-cells'
import type { JSX } from 'solid-js'
import type { MarketQuote } from './market-data'

export type RendererMode = 'stable' | 'swap'
export type TableAdapter = 'local' | 'v8'

export interface TradingTableProps {
  quotes: Array<MarketQuote>
  rendererMode: RendererMode
  updateQuoteAges: boolean
  quoteClock: number
  selectedSymbol: string | null
  onSelectSymbol: (symbol: string) => void
}

interface TradingCellContext {
  row: { original: MarketQuote }
}

interface TradingColumnDefinition {
  id: string
  header: string
  size: number
  cell: (context: TradingCellContext) => JSX.Element
}

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

function createTradingColumns(
  props: TradingTableProps,
): Array<TradingColumnDefinition> {
  return [
    {
      id: 'symbol',
      header: 'Ticker',
      size: 90,
      cell: ({ row }) =>
        recordCellRender('Ticker', () => row.original.symbol),
    },
    {
      id: 'venue',
      header: 'Venue',
      size: 70,
      cell: ({ row }) => recordCellRender('Venue', () => row.original.venue),
    },
    {
      id: 'bid',
      header: 'Bid',
      size: 90,
      cell: ({ row }) =>
        recordCellRender('Bid', () => row.original.bid.toFixed(2)),
    },
    {
      id: 'ask',
      header: 'Ask',
      size: 90,
      cell: ({ row }) =>
        recordCellRender('Ask', () => row.original.ask.toFixed(2)),
    },
    {
      id: 'spread',
      header: 'Spread',
      size: 95,
      cell: ({ row }) =>
        recordCellRender('Spread', () => (
          <SpreadCell bid={row.original.bid} ask={row.original.ask} />
        )),
    },
    {
      id: 'price',
      header: 'Last',
      size: 100,
      cell: ({ row }) =>
        recordCellRender('Last', () => (
          <PriceCell
            price={row.original.price}
            move={row.original.lastMove}
            onSelect={() => props.onSelectSymbol(row.original.symbol)}
          />
        )),
    },
    {
      id: 'lastMove',
      header: 'Last Move',
      size: 105,
      cell: ({ row }) =>
        recordCellRender('LastMove', () => {
          const move = row.original.lastMove
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
      id: 'lastSize',
      header: 'Last Qty',
      size: 90,
      cell: ({ row }) =>
        recordCellRender('LastQty', () =>
          compactFormatter.format(row.original.lastSize),
        ),
    },
    {
      id: 'depth',
      header: 'Bid / Ask Qty',
      size: 145,
      cell: ({ row }) =>
        recordCellRender('Depth', () => (
          <DepthCell
            bidSize={row.original.bidSize}
            askSize={row.original.askSize}
          />
        )),
    },
    {
      id: 'age',
      header: 'Quote Age',
      size: 85,
      cell: ({ row }) =>
        recordCellRender('QuoteAge', () => (
          <QuoteAgeCell
            ageMs={
              props.updateQuoteAges
                ? Math.max(0, props.quoteClock - row.original.lastUpdatedAt)
                : 0
            }
          />
        )),
    },
    {
      id: 'change',
      header: 'Day %',
      size: 90,
      cell: ({ row }) =>
        recordCellRender('DayChange', () => {
          const change = (row.original.price / row.original.open - 1) * 100
          return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
        }),
    },
    {
      id: 'volume',
      header: 'Total Qty',
      size: 100,
      cell: ({ row }) =>
        recordCellRender('TotalQty', () =>
          compactFormatter.format(row.original.volume),
        ),
    },
    {
      id: 'turnover',
      header: 'Traded Value',
      size: 115,
      cell: ({ row }) =>
        recordCellRender('TradedValue', () =>
          currencyFormatter.format(row.original.turnover),
        ),
    },
    {
      id: 'history',
      header: 'Intraday',
      size: 150,
      cell: ({ row }) =>
        recordCellRender('Intraday', () => (
          <SparklineCell values={row.original.history} />
        )),
    },
  ]
}

export function LocalTradingTable(props: TradingTableProps) {
  const columns = createTradingColumns(props)
  const table = createTable({
    key: 'solid-realtime-trading-local',
    features: stockFeatures,
    columns,
    get data() {
      return props.quotes
    },
    getRowId: (row) => row.id,
  })

  return (
    <div class="table-scroll" data-table-adapter="local">
      <table style={{ width: `${table.getTotalSize()}px` }}>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th style={{ width: `${header.getSize()}px` }}>
                      <Show when={!header.isPlaceholder}>
                        <FlexRender header={header} />
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr
                classList={{
                  'is-selected': props.selectedSymbol === row.original.symbol,
                }}
                data-symbol={row.original.symbol}
                data-row-id={row.original.id}
                title={row.original.company}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td
                      style={{ width: `${cell.column.getSize()}px` }}
                      classList={{
                        'numeric-cell':
                          cell.column.id !== 'symbol' &&
                          cell.column.id !== 'venue',
                      }}
                    >
                      <FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  )
}

export function V8TradingTable(props: TradingTableProps) {
  const columns = createTradingColumns(props)
  const table = createSolidTable({
    columns,
    get data() {
      return props.quotes
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  })

  return (
    <div class="table-scroll" data-table-adapter="v8">
      <table style={{ width: `${table.getTotalSize()}px` }}>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th style={{ width: `${header.getSize()}px` }}>
                      <Show when={!header.isPlaceholder}>
                        {flexRenderV8(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </Show>
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows}>
            {(row) => (
              <tr
                classList={{
                  'is-selected': props.selectedSymbol === row.original.symbol,
                }}
                data-symbol={row.original.symbol}
                data-row-id={row.original.id}
                title={row.original.company}
              >
                <For each={row.getVisibleCells()}>
                  {(cell) => (
                    <td
                      style={{ width: `${cell.column.getSize()}px` }}
                      classList={{
                        'numeric-cell':
                          cell.column.id !== 'symbol' &&
                          cell.column.id !== 'venue',
                      }}
                    >
                      {flexRenderV8(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  )
}

export const TRADING_COLUMN_COUNT = 14

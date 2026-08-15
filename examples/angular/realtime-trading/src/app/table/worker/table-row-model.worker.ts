import {
  createFilteredRowModel,
  createSortedRowModel,
  stockFeatures,
  tableFeatures,
} from '@tanstack/angular-table'
import {
  initTableWorker,
  workerRowModelsFeature,
} from '@tanstack/angular-table/experimental-worker-plugin'
import type { ColumnDef } from '@tanstack/angular-table'
import type { MarketQuote } from '../../feed/market-data'

const workerFeatures = tableFeatures({
  ...stockFeatures,
  workerRowModelsFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
})

// The worker only computes row models, so it needs portable accessors but none
// of the Angular render components used by the visible table.
const workerColumns: Array<
  ColumnDef<typeof workerFeatures, MarketQuote, unknown>
> = [
  { id: 'market', accessorFn: (row) => row.venue },
  { id: 'name', accessorFn: (row) => row.company },
  { id: 'symbol', accessorFn: (row) => row.symbol },
  { id: 'price', accessorFn: (row) => row.price },
  {
    id: 'change',
    accessorFn: (row) => row.price - row.previousClose,
  },
  {
    id: 'changePercent',
    accessorFn: (row) =>
      row.previousClose === 0
        ? 0
        : ((row.price - row.previousClose) / row.previousClose) * 100,
  },
  { id: 'bid', accessorFn: (row) => row.bid },
  { id: 'bidSize', accessorFn: (row) => row.bidSize },
  { id: 'ask', accessorFn: (row) => row.ask },
  { id: 'askSize', accessorFn: (row) => row.askSize },
  { id: 'open', accessorFn: (row) => row.open },
  { id: 'high', accessorFn: (row) => row.high },
  { id: 'low', accessorFn: (row) => row.low },
  {
    id: 'history',
    accessorFn: (row) => row.history,
    enableSorting: false,
  },
]

initTableWorker({
  features: workerFeatures,
  columns: workerColumns,
  getRowId: (row) => row.id,
})

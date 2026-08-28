import {
  createColumnHelper,
  createFilteredRowModel,
  createSortedRowModel,
  stockFeatures,
  tableFeatures,
} from '@tanstack/angular-table'
import {
  initTableWorker,
  workerRowModelsFeature,
} from '@tanstack/angular-table/experimental-worker-plugin'
import type { MarketQuote } from '../../feed/market-data'

const workerFeatures = tableFeatures({
  ...stockFeatures,
  workerRowModelsFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
})
const columnHelper = createColumnHelper<typeof workerFeatures, MarketQuote>()

// The worker only computes row models, so it needs portable accessors but none
// of the Angular render components used by the visible table.
const workerColumns = columnHelper.columns([
  columnHelper.accessor('venue', { id: 'market' }),
  columnHelper.accessor('company', { id: 'name' }),
  columnHelper.accessor('symbol', {}),
  columnHelper.accessor('price', {}),
  columnHelper.accessor((row) => row.price - row.previousClose, {
    id: 'change',
  }),
  columnHelper.accessor(
    (row) =>
      row.previousClose === 0
        ? 0
        : ((row.price - row.previousClose) / row.previousClose) * 100,
    { id: 'changePercent' },
  ),
  columnHelper.accessor('bid', {}),
  columnHelper.accessor('bidSize', {}),
  columnHelper.accessor('ask', {}),
  columnHelper.accessor('askSize', {}),
  columnHelper.accessor('open', {}),
  columnHelper.accessor('high', {}),
  columnHelper.accessor('low', {}),
  columnHelper.accessor('history', { enableSorting: false }),
])

initTableWorker({
  features: workerFeatures,
  columns: workerColumns,
  getRowId: (row) => row.id,
})

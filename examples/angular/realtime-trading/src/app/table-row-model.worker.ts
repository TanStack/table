import {
  createFilteredRowModel,
  stockFeatures,
  tableFeatures,
} from '@tanstack/angular-table'
import {
  initTableWorker,
  workerRowModelsFeature,
} from '@tanstack/angular-table/experimental-worker-plugin'
import type { ColumnDef } from '@tanstack/angular-table'
import type { MarketQuote } from './market-data'

const workerFeatures = tableFeatures({
  ...stockFeatures,
  workerRowModelsFeature,
  filteredRowModel: createFilteredRowModel(),
})

// The worker only computes row models, so it needs portable accessors but none
// of the Angular render components used by the visible table.
const workerColumns: Array<
  ColumnDef<typeof workerFeatures, MarketQuote, unknown>
> = [
  { accessorKey: 'symbol' },
  { accessorKey: 'venue' },
  { accessorKey: 'bid' },
  { accessorKey: 'ask' },
  { accessorKey: 'price' },
  { accessorKey: 'lastMove' },
  { accessorKey: 'bidSize' },
  { accessorKey: 'askSize' },
  { accessorKey: 'lastSize' },
  { accessorKey: 'lastUpdatedAt' },
  { accessorKey: 'open' },
  { accessorKey: 'volume' },
  { accessorKey: 'turnover' },
  { accessorKey: 'history' },
]

initTableWorker({
  features: workerFeatures,
  columns: workerColumns,
  getRowId: (row) => row.id,
})

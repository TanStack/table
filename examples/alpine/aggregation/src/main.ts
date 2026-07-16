import Alpine from 'alpinejs'
import {
  FlexRender,
  rowAggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/alpine-table'
import { makeData } from './makeData'
import './index.css'
import type { Sale } from './makeData'
import type { Table } from '@tanstack/alpine-table'

type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
type AggregationTableMeta = { rowSource: RowSource }
const features = tableFeatures({
  rowAggregationFeature,
  columnFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  aggregationFns: {
    count: aggregationFn_count,
    extent: aggregationFn_extent,
    mean: aggregationFn_mean,
    sum: aggregationFn_sum,
  },
  tableMeta: metaHelper<AggregationTableMeta>(),
})
const columnHelper = createColumnHelper<typeof features, Sale>()
function getAggregationRows(table: Table<typeof features, Sale>) {
  const source = table.options.meta?.rowSource
  if (source === 'all') return table.getCoreRowModel().rows
  if (source === 'page') return table.getRowModel().rows
  if (source === 'selected') return table.getFilteredSelectedRowModel().rows
  if (source === 'custom') return table.getCoreRowModel().rows.slice(0, 3)
  return undefined
}
function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(' – ')
  if (value && typeof value === 'object')
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${formatValue(entry)}`)
      .join(', ')
  if (typeof value === 'number')
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return String(value ?? '—')
}
const columns = columnHelper.columns([
  columnHelper.display({ id: 'select' }),
  columnHelper.accessor('category', {
    header: 'Category',
    filterFn: 'includesString',
  }),
  columnHelper.accessor('item', {
    header: 'Item',
    footer: ({ table }) => `${table.options.meta?.rowSource} total`,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    aggregationFn: 'sum',
    cell: ({ getValue }) => getValue<number>().toLocaleString(),
    footer: ({ column, table }) =>
      formatValue(
        column.getAggregationValue({ rows: getAggregationRows(table) }),
      ),
  }),
  columnHelper.accessor('score', {
    header: 'Score',
    aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
    footer: ({ column, table }) =>
      formatValue(
        column.getAggregationValue({ rows: getAggregationRows(table) }),
      ),
  }),
])

Alpine.data('table', () => {
  const local = Alpine.reactive({
    data: makeData(10_000),
    rowSource: 'filtered' as RowSource,
  })
  const table = createTable({
    features,
    columns,
    get data() {
      return local.data
    },
    get meta() {
      return { rowSource: local.rowSource }
    },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    debugTable: true,
    debugColumns: true,
  })
  return {
    table,
    FlexRender,
    pageSizes: [10, 20, 30, 40, 50],
    get rowSource() {
      return local.rowSource
    },
    set rowSource(value: RowSource) {
      local.rowSource = value
    },
    goToPage(value: string) {
      table.setPageIndex(value ? Number(value) - 1 : 0)
    },
    refreshData() {
      local.data = makeData(10_000)
    },
    stressTest() {
      local.data = makeData(200_000)
    },
  }
})
window.Alpine = Alpine
Alpine.start()

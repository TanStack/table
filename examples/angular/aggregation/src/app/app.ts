import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import {
  FlexRender,
  rowAggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  injectTable,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/angular-table'
import { makeData } from './makeData'
import type { ColumnDef, Table } from '@tanstack/angular-table'
import type { Sale } from './makeData'

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
const columns: Array<ColumnDef<typeof features, Sale>> = [
  { id: 'select' },
  { accessorKey: 'category', header: 'Category', filterFn: 'includesString' },
  {
    accessorKey: 'item',
    header: 'Item',
    footer: ({ table }) => `${table.options.meta?.rowSource} total`,
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    aggregationFn: 'sum',
    cell: ({ getValue }) => getValue<number>().toLocaleString(),
    footer: ({ column, table }) =>
      formatValue(
        column.getAggregationValue({ rows: getAggregationRows(table) }),
      ),
  },
  {
    accessorKey: 'score',
    header: 'Score',
    aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }],
    footer: ({ column, table }) =>
      formatValue(
        column.getAggregationValue({ rows: getAggregationRows(table) }),
      ),
  },
]

@Component({
  selector: 'app-root',
  imports: [FlexRender],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  readonly data = signal<Array<Sale>>(makeData(10_000))
  readonly rowSource = signal<RowSource>('filtered')
  readonly pageSizes = [10, 20, 30, 40, 50]
  readonly table = injectTable<typeof features, Sale>(() => ({
    features,
    columns,
    data: this.data(),
    meta: { rowSource: this.rowSource() },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    // manualAggregation: true, // supply aggregate values yourself instead of calculating them locally
    debugTable: true,
    debugColumns: true,
  }))
  stringifiedState() {
    return JSON.stringify(this.table.store.get(), null, 2)
  }
  refreshData = () => this.data.set(makeData(10_000))
  stressTest = () => this.data.set(makeData(1_000_000))
  onCategoryInput(event: Event) {
    this.table
      .getColumn('category')
      ?.setFilterValue((event.target as HTMLInputElement).value)
  }
  onRowSourceChange(event: Event) {
    this.rowSource.set((event.target as HTMLSelectElement).value as RowSource)
  }
  onPageInputChange(event: Event) {
    const value = (event.target as HTMLInputElement).value
    this.table.setPageIndex(value ? Number(value) - 1 : 0)
  }
  onPageSizeChange(event: Event) {
    this.table.setPageSize(Number((event.target as HTMLSelectElement).value))
  }
}

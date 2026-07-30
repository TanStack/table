<script lang="ts">
  import { FlexRender, rowAggregationFeature, aggregationFn_count, aggregationFn_extent, aggregationFn_mean, aggregationFn_sum, columnFilteringFeature, createColumnHelper, createFilteredRowModel, createPaginatedRowModel, createTable, filterFn_includesString, metaHelper, rowPaginationFeature, rowSelectionFeature, tableFeatures } from '@tanstack/svelte-table'
  import { makeData } from './makeData'
  import type { Sale } from './makeData'
  import type { Table } from '@tanstack/svelte-table'
  import './index.css'
  type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
  type AggregationTableMeta = { rowSource: RowSource }
  const features = tableFeatures({
    rowAggregationFeature, columnFilteringFeature, rowPaginationFeature, rowSelectionFeature,
    filteredRowModel: createFilteredRowModel(), paginatedRowModel: createPaginatedRowModel(),
    filterFns: { includesString: filterFn_includesString },
    aggregationFns: { count: aggregationFn_count, extent: aggregationFn_extent, mean: aggregationFn_mean, sum: aggregationFn_sum },
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
    if (value && typeof value === 'object') return Object.entries(value).map(([key, entry]) => `${key}: ${formatValue(entry)}`).join(', ')
    if (typeof value === 'number') return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    return String(value ?? '—')
  }
  let data = $state(makeData(10_000))
  let rowSource = $state<RowSource>('filtered')
  const columns = columnHelper.columns([
    columnHelper.display({ id: 'select' }),
    columnHelper.accessor('category', { header: 'Category', filterFn: 'includesString' }),
    columnHelper.accessor('item', { header: 'Item', footer: ({ table }) => `${table.options.meta?.rowSource} total` }),
    columnHelper.accessor('amount', { header: 'Amount', aggregationFn: 'sum', cell: ({ getValue }) => getValue<number>().toLocaleString(), footer: ({ column, table }) => formatValue(column.getAggregationValue({ rows: getAggregationRows(table) })) }),
    columnHelper.accessor('score', { header: 'Score', aggregationFn: ['count', 'mean', { id: 'range', aggregationFn: 'extent' }], footer: ({ column, table }) => formatValue(column.getAggregationValue({ rows: getAggregationRows(table) })) }),
  ])
  const table = createTable({
    features, columns,
    get data() { return data },
    get meta() { return { rowSource } },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } }, debugTable: true, debugColumns: true,
  }, state => state)
  function changeRowSource(value: RowSource) {
    rowSource = value
    table.setOptions((previous) => ({ ...previous, meta: { rowSource: value } }))
  }
</script>

<div class="demo-root">
  <h1>Aggregation without grouping</h1>
  <p>Amount uses a scalar <code>sum</code>. Score runs count, mean, and range together and returns a keyed object.</p>
  <div><button onclick={() => data = makeData(10_000)}>Regenerate Data</button><button onclick={() => data = makeData(1_000_000)}>Stress Test (1M rows)</button></div>
  <div class="spacer-sm"></div>
  <div class="controls">
    <label>Category filter: <input value={(table.getColumn('category')?.getFilterValue() ?? '') as string} oninput={(event) => table.getColumn('category')?.setFilterValue(event.currentTarget.value)} /></label>
    <label>Total rows: <select value={rowSource} onchange={(event) => changeRowSource(event.currentTarget.value as RowSource)}><option value="filtered">Filtered rows</option><option value="all">All rows</option><option value="page">Visible page</option><option value="selected">Filtered selected rows</option><option value="custom">First three core rows</option></select></label>
  </div>
  <div class="spacer-sm"></div>
  <table>
    <thead>{#each table.getHeaderGroups() as group (group.id)}<tr>{#each group.headers as header (header.id)}<th>{#if header.column.id === 'select'}<input type="checkbox" checked={table.getIsAllPageRowsSelected()} onchange={() => table.toggleAllPageRowsSelected()} />{:else if !header.isPlaceholder}<FlexRender {header} />{/if}</th>{/each}</tr>{/each}</thead>
    <tbody>{#each table.getRowModel().rows as row (row.id)}<tr>{#each row.getAllCells() as cell (cell.id)}<td class:numeric={cell.column.id === 'amount'}>{#if cell.column.id === 'select'}<input type="checkbox" checked={row.getIsSelected()} onchange={() => row.toggleSelected()} />{:else}<FlexRender {cell} />{/if}</td>{/each}</tr>{/each}</tbody>
    <tfoot>{#each table.getFooterGroups() as group (group.id)}<tr>{#each group.headers as header (header.id)}<th colspan={header.colSpan}>{#if !header.isPlaceholder}<FlexRender footer={header} />{/if}</th>{/each}</tr>{/each}</tfoot>
  </table>
  <div class="spacer-sm"></div>
  <div class="controls"><button class="demo-button demo-button-sm" onclick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'<<'}</button><button class="demo-button demo-button-sm" onclick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button><button class="demo-button demo-button-sm" onclick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button><button class="demo-button demo-button-sm" onclick={() => table.lastPage()} disabled={!table.getCanNextPage()}>{'>>'}</button>
    <span class="inline-controls"><div>Page</div><strong>{(table.state.pagination.pageIndex + 1).toLocaleString()} of {table.getPageCount().toLocaleString()}</strong></span>
    <span class="inline-controls">| Go to page:<input type="number" min="1" max={table.getPageCount()} value={table.state.pagination.pageIndex + 1} oninput={(event) => table.setPageIndex(event.currentTarget.value ? Number(event.currentTarget.value) - 1 : 0)} class="page-size-input" /></span>
    <select value={table.state.pagination.pageSize} onchange={(event) => table.setPageSize(Number(event.currentTarget.value))}>{#each [10,20,30,40,50] as size}<option value={size}>Show {size}</option>{/each}</select>
  </div>
  <div>Showing {table.getRowModel().rows.length.toLocaleString()} of {table.getRowCount().toLocaleString()} Rows</div><pre data-testid="table-state">{JSON.stringify(table.state, null, 2)}</pre>
</div>

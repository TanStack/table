import {
  aggregationFeature,
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
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Sale } from './makeData'
import type { Table } from '@tanstack/solid-table'

type RowSource = 'all' | 'custom' | 'filtered' | 'page' | 'selected'
type AggregationTableMeta = { rowSource: RowSource }
const features = tableFeatures({
  aggregationFeature,
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
function getAggregationRows(
  table: Table<typeof features, Sale>,
  source = table.options.meta?.rowSource,
) {
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

function App() {
  const [data, setData] = createSignal(makeData(10_000))
  const [rowSource, setRowSource] = createSignal<RowSource>('filtered')
  const columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      filterFn: 'includesString',
    }),
    columnHelper.accessor('item', {
      header: 'Item',
      footer: () => `${rowSource()} total`,
    }),
    columnHelper.accessor('amount', {
      header: 'Amount',
      aggregationFn: 'sum',
      cell: ({ getValue }) => getValue<number>().toLocaleString(),
      footer: ({ column, table }) =>
        formatValue(
          column.getAggregationValue(getAggregationRows(table, rowSource())),
        ),
    }),
    columnHelper.accessor('score', {
      header: 'Score',
      aggregationFn: [
        'count',
        'mean',
        { id: 'range', aggregationFn: 'extent' },
      ],
      footer: ({ column, table }) =>
        formatValue(
          column.getAggregationValue(getAggregationRows(table, rowSource())),
        ),
    }),
  ])
  const table = createTable({
    features,
    columns,
    get data() {
      return data()
    },
    get meta() {
      return { rowSource: rowSource() }
    },
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
    debugTable: true,
    debugColumns: true,
  })
  const changeRowSource = (value: RowSource) => {
    setRowSource(value)
    table.setOptions((previous) => ({
      ...previous,
      meta: { rowSource: value },
    }))
  }
  const changeData = (value: Array<Sale>) => {
    setData(value)
    table.setOptions((previous) => ({ ...previous, data: value }))
  }
  return (
    <div class="demo-root">
      <h1>Aggregation without grouping</h1>
      <p>
        Amount uses a scalar <code>sum</code>. Score runs count, mean, and range
        together and returns a keyed object.
      </p>
      <div>
        <button onClick={() => changeData(makeData(10_000))}>
          Regenerate Data
        </button>
        <button onClick={() => changeData(makeData(200_000))}>
          Stress Test (200k rows)
        </button>
      </div>
      <div class="spacer-sm" />
      <div class="controls">
        <label>
          Category filter:{' '}
          <input
            value={
              (table.getColumn('category')?.getFilterValue() ?? '') as string
            }
            onInput={(event) =>
              table
                .getColumn('category')
                ?.setFilterValue(event.currentTarget.value)
            }
          />
        </label>
        <label>
          Total rows:{' '}
          <select
            value={rowSource()}
            onChange={(event) =>
              changeRowSource(event.currentTarget.value as RowSource)
            }
          >
            <option value="filtered">Filtered rows</option>
            <option value="all">All rows</option>
            <option value="page">Visible page</option>
            <option value="selected">Filtered selected rows</option>
            <option value="custom">First three core rows</option>
          </select>
        </label>
      </div>
      <div class="spacer-sm" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(group) => (
              <tr>
                <For each={group.headers}>
                  {(header) => (
                    <th>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
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
              <tr>
                <For each={row.getAllCells()}>
                  {(cell) => (
                    <td
                      class={
                        cell.column.id === 'amount' ? 'numeric' : undefined
                      }
                    >
                      <table.FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <For each={table.getFooterGroups()}>
            {(group) => (
              <tr>
                <For each={group.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : header.column.id ===
                        'item' ? (
                        `${rowSource()} total`
                      ) : header.column.id === 'amount' ||
                        header.column.id === 'score' ? (
                        formatValue(
                          header.column.getAggregationValue(
                            getAggregationRows(table, rowSource()),
                          ),
                        )
                      ) : (
                        <table.FlexRender footer={header} />
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tfoot>
      </table>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(table.atoms.pagination.get().pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.atoms.pagination.get().pageIndex + 1}
            onInput={(event) =>
              table.setPageIndex(
                event.currentTarget.value
                  ? Number(event.currentTarget.value) - 1
                  : 0,
              )
            }
            class="page-size-input"
          />
        </span>
        <select
          value={table.atoms.pagination.get().pageSize}
          onChange={(event) =>
            table.setPageSize(Number(event.currentTarget.value))
          }
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(size) => <option value={size}>Show {size}</option>}
          </For>
        </select>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre>{JSON.stringify(table.store.get(), null, 2)}</pre>
    </div>
  )
}
export default App

import { render } from 'preact'
import { useMemo, useState } from 'preact/hooks'
import './index.css'
import {
  rowAggregationFeature,
  aggregationFn_count,
  aggregationFn_extent,
  aggregationFn_mean,
  aggregationFn_sum,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { Table } from '@tanstack/preact-table'
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

const columnHelper = createColumnHelper<typeof features, Sale>()

function getAggregationRows(table: Table<typeof features, Sale>) {
  const rowSource = table.options.meta?.rowSource
  if (rowSource === 'all') return table.getCoreRowModel().rows
  if (rowSource === 'page') return table.getRowModel().rows
  if (rowSource === 'selected') return table.getFilteredSelectedRowModel().rows
  if (rowSource === 'custom') return table.getCoreRowModel().rows.slice(0, 3)
  return undefined
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(formatValue).join(' – ')
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, entry]) => `${key}: ${formatValue(entry)}`)
      .join(', ')
  }
  if (typeof value === 'number')
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  return String(value ?? '—')
}

function App() {
  const [data, setData] = useState(() => makeData(10_000))
  const [rowSource, setRowSource] = useState<RowSource>('filtered')
  const columns = useMemo(
    () =>
      columnHelper.columns([
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
          aggregationFn: [
            'count',
            'mean',
            { id: 'range', aggregationFn: 'extent' },
          ],
          footer: ({ column, table }) =>
            formatValue(
              column.getAggregationValue({ rows: getAggregationRows(table) }),
            ),
        }),
      ]),
    [],
  )

  const table = useTable(
    {
      features,
      columns,
      data,
      meta: { rowSource },
      initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
      // manualAggregation: true, // supply aggregate values yourself instead of calculating them locally
      debugTable: true,
      debugColumns: true,
    },
    (state) => state, // default selector
  )

  return (
    <div className="demo-root">
      <h1>Aggregation without grouping</h1>
      <p>
        Amount uses a scalar <code>sum</code>. Score runs count, mean, and range
        together and returns a keyed object.
      </p>
      <div>
        <button onClick={() => setData(makeData(10_000))}>
          Regenerate Data
        </button>
        <button onClick={() => setData(makeData(1_000_000))}>
          Stress Test (1M rows)
        </button>
      </div>
      <div className="spacer-sm" />
      <div className="controls">
        <label>
          Category filter:{' '}
          <input
            value={
              (table.getColumn('category')?.getFilterValue() ?? '') as string
            }
            onChange={(event) =>
              table
                .getColumn('category')
                ?.setFilterValue(event.currentTarget.value)
            }
          />
        </label>
        <label>
          Total rows:{' '}
          <select
            value={rowSource}
            onChange={(event) =>
              setRowSource(event.currentTarget.value as RowSource)
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
      <div className="spacer-sm" />
      <table>
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  className={
                    cell.column.id === 'amount' ? 'numeric' : undefined
                  }
                >
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender footer={header} />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="spacer-sm" />
      <div className="controls">
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(table.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.state.pagination.pageIndex + 1}
            onInput={(event) =>
              table.setPageIndex(
                event.currentTarget.value
                  ? Number(event.currentTarget.value) - 1
                  : 0,
              )
            }
            className="page-size-input"
          />
        </span>
        <select
          value={table.state.pagination.pageSize}
          onChange={(event) =>
            table.setPageSize(Number(event.currentTarget.value))
          }
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {table.getRowCount().toLocaleString()} Rows
      </div>
      <pre data-testid="table-state">
        {JSON.stringify(table.state, null, 2)}
      </pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
render(<App />, rootElement)

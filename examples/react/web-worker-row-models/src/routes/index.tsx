import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useTable } from '@tanstack/react-table'
import {
  createTableWorker,
  createWorkerRowModel,
} from '@tanstack/react-table/experimental-worker-plugin'
import { makeData } from '../makeData'
import { columnHelper, columns, sharedFeatures } from '../tableConfig'
import type { HTMLProps } from 'react'

// =====================================================================
// Route (SSR entry) — data is generated only on the server (server fn)
// and serialized to the client so hydration sees the same rows. The
// server has no Worker global, so the worker plugin's SSR guard makes
// the server render pre-stage (unprocessed) rows; after hydration the
// client worker takes over and processes them.
// =====================================================================

const getInitialData = createServerFn({ method: 'GET' }).handler(() =>
  makeData(10_000),
)

export const Route = createFileRoute('/')({
  loader: () => getInitialData(),
  component: App,
})

// One handle per table worker; every offloaded stage shares it, so filtering,
// grouping, and sorting cost a single worker and one round trip per change.
// Module scope is safe on the server: the worker is only created lazily on
// the client (and never at all when `Worker` is undefined).
const tableWorker = createTableWorker({
  createWorker: () =>
    new Worker(new URL('../table.worker.ts', import.meta.url), {
      type: 'module',
    }),
})

// Same features as the worker's shadow table, but with the filtered, grouped,
// and sorted stages swapped for worker-backed ones. Expanding and pagination
// stay on the main thread (cheap, downstream); row selection is pure state.
const features: typeof sharedFeatures = {
  ...sharedFeatures,
  filteredRowModel: createWorkerRowModel(tableWorker, 'filtered'),
  groupedRowModel: createWorkerRowModel(tableWorker, 'grouped'),
  sortedRowModel: createWorkerRowModel(tableWorker, 'sorted'),
}

// Row selection lives entirely on the main thread: a display column with no
// accessor never affects processing, so the worker does not need to know
// about it.
const selectionCell = ({ row }: { row: any }) => (
  <IndeterminateCheckbox
    checked={row.getIsSelected()}
    disabled={!row.getCanSelect()}
    indeterminate={row.getIsSomeSelected()}
    onChange={row.getToggleSelectedHandler()}
  />
)

const selectionColumn = columnHelper.display({
  id: 'select',
  header: ({ table }) => (
    <IndeterminateCheckbox
      checked={table.getIsAllRowsSelected()}
      indeterminate={table.getIsSomeRowsSelected()}
      onChange={table.getToggleAllRowsSelectedHandler()}
    />
  ),
  cell: selectionCell,
  // Group rows render this column as an aggregated cell; selecting a group
  // selects all of its leaf rows.
  aggregatedCell: selectionCell,
})

const allColumns = [selectionColumn, ...columns]

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!)

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + ' sortable-header'}
      {...rest}
    />
  )
}

/**
 * A requestAnimationFrame-driven dot that freezes if (and only if) the main
 * thread is blocked. Purely for demo purposes.
 */
function JankMeter() {
  const dotRef = React.useRef<HTMLDivElement>(null)
  const stallRef = React.useRef<HTMLSpanElement>(null)

  React.useEffect(() => {
    if (dotRef.current) {
      dotRef.current.dataset.hydrated = 'true'
    }

    let last = performance.now()
    let rafId = 0
    const tick = () => {
      const now = performance.now()
      const gap = now - last
      last = now
      if (gap > 100 && stallRef.current) {
        stallRef.current.textContent = `last main-thread stall: ${Math.round(gap)} ms`
      }
      if (dotRef.current) {
        const x = Math.abs(((now / 6) % 420) - 210)
        dotRef.current.style.transform = `translateX(${x}px)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div className="jank-meter">
      <div className="jank-track">
        <div ref={dotRef} className="jank-dot" />
      </div>
      <span ref={stallRef} className="jank-stall">
        no main-thread stalls yet
      </span>
    </div>
  )
}

function App() {
  const initialData = Route.useLoaderData()
  const [data, setData] = React.useState(initialData)
  // Regenerating on the client is fine post-hydration (faker runs in the
  // browser); only the initial dataset must be server-generated so the
  // server HTML and the hydrating client render identical rows.
  const refreshData = () => setData(makeData(10_000))
  const stressTest = () => setData(makeData(1_000_000))

  // A completely normal table: no manual* flags, no postMessage in app code.
  const table = useTable(
    {
      features,
      columns: allColumns,
      data,
      debugTable: true,
    },
    (state) => state, // default selector
  )

  const isPending = table.state.workerRowModels.isPending
  const globalFilter = (table.state.globalFilter as string | undefined) ?? ''
  const selectedCount = table.getSelectedRowIds().length

  return (
    <div className="demo-root">
      <JankMeter />
      <div className="spacer-md" />
      <div className="controls">
        <input
          value={globalFilter}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          placeholder="Search name or status..."
          className="search-input"
        />
        <button onClick={() => refreshData()} className="demo-button">
          Regenerate Data
        </button>
        <button onClick={() => stressTest()} className="demo-button">
          Stress Test (1M rows)
        </button>
        {isPending ? (
          <span className="pending-label">processing...</span>
        ) : null}
      </div>
      <div className="spacer-sm" />
      <div>
        {table.getFilteredRowModel().rows.length.toLocaleString()} of{' '}
        {data.length.toLocaleString()} rows | {selectedCount.toLocaleString()}{' '}
        selected
      </div>
      <div className="spacer-md" />
      <table className={isPending ? 'table-stale' : undefined}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {header.column.getCanGroup() ? (
                        // If the header can be grouped, add a toggle. The
                        // grouping itself happens in the worker.
                        <button
                          onClick={header.column.getToggleGroupingHandler()}
                          className="sortable-header"
                        >
                          {header.column.getIsGrouped()
                            ? `🛑(${header.column.getGroupedIndex()}) `
                            : `👊 `}
                        </button>
                      ) : null}{' '}
                      <span
                        className={
                          header.column.getCanSort() ? 'sortable-header' : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        <table.FlexRender header={header} />
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    </div>
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
                  style={{
                    background: cell.getIsGrouped()
                      ? '#0aff0082'
                      : cell.getIsAggregated()
                        ? '#ffa50078'
                        : cell.getIsPlaceholder()
                          ? '#ff000042'
                          : 'white',
                  }}
                >
                  {cell.getIsGrouped() ? (
                    // Grouped cell: expander + group value + leaf count
                    <button
                      onClick={row.getToggleExpandedHandler()}
                      style={{
                        cursor: row.getCanExpand() ? 'pointer' : 'normal',
                      }}
                    >
                      {row.getIsExpanded() ? '👇' : '👉'}{' '}
                      <table.FlexRender cell={cell} /> (
                      {row.subRows.length.toLocaleString()})
                    </button>
                  ) : cell.getIsAggregated() ? (
                    <table.FlexRender cell={cell} />
                  ) : cell.getIsPlaceholder() ? null : (
                    <table.FlexRender cell={cell} />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="spacer-sm" />
      <div className="controls">
        <button
          className="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
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
          disabled={!table.getCanLastPage()}
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
        <select
          value={table.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

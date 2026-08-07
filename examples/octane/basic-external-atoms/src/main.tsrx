import { createRoot, useState } from 'octane'
import { useCreateAtom } from '@tanstack/octane-store'
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  useTable,
} from '@tanstack/octane-table'
import type { PaginationState, SortingState } from '@tanstack/octane-table'
import { makeData } from './makeData'
import './index.css'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
})

const columnHelper = createColumnHelper<typeof features, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('firstName', { header: 'First Name', cell: (info) => String(info.getValue()) }),
  columnHelper.accessor('lastName', { header: 'Last Name', cell: (info) => String(info.getValue()) }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])
const pageSizes = [10, 20, 30, 40, 50]

function App() @{
  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(1_000_000))

  // Create stable external atoms for the individual state slices you want to
  // own. The table still creates internal base atoms for everything else.
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Pass the per-slice external atoms directly. The Octane adapter subscribes
  // through table.store, so no separate useSelector call is needed here.
  const table = useTable(
    {
      debugTable: true,
      features,
      columns,
      data,
      atoms: {
        sorting: sortingAtom,
        pagination: paginationAtom,
      },
    },
    (state) => state, // default selector
  )
  const paginationState = table.state.pagination

  <div className="demo-root">
    <div>
      <button onClick={refreshData} className="demo-button">
        Regenerate Data
      </button>
      <button onClick={stressTest} className="demo-button">
        Stress Test (1M rows)
      </button>
    </div>
    <div className="spacer-md" />
    <table>
      <thead>
        @for (const headerGroup of table.getHeaderGroups(); key headerGroup.id) {
          <tr>
            @for (const header of headerGroup.headers; key header.id) {
              <th colSpan={header.colSpan}>
                {header.isPlaceholder ? null : <div
                  className={header.column.getCanSort() ? 'sortable-header' : ''}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <table.FlexRender header={header} />
                  {header.column.getIsSorted() === 'asc'
                    ? ' 🔼'
                    : header.column.getIsSorted() === 'desc'
                      ? ' 🔽'
                      : null}
                </div>}
              </th>
            }
          </tr>
        }
      </thead>
      <tbody>
        @for (const row of table.getRowModel().rows; key row.id) {
          <tr>
            @for (const cell of row.getAllCells(); key cell.id) {
              <td><table.FlexRender cell={cell} /></td>
            }
          </tr>
        }
      </tbody>
    </table>
    <div className="spacer-sm" />
    <div className="controls">
      <button className="demo-button demo-button-sm" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>{'<<'}</button>
      <button className="demo-button demo-button-sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{'<'}</button>
      <button className="demo-button demo-button-sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{'>'}</button>
      <button className="demo-button demo-button-sm" onClick={() => table.lastPage()} disabled={!table.getCanLastPage()}>{'>>'}</button>
      <span className="inline-controls">
        <div>Page</div>
        <strong>{String(paginationState.pageIndex + 1)} of {String(table.getPageCount())}</strong>
      </span>
      <span className="inline-controls">
        | Go to page:
        <input
          type="number"
          min="1"
          max={table.getPageCount()}
          value={paginationState.pageIndex + 1}
          onInput={(event) => {
            const value = event.currentTarget.value
            table.setPageIndex(value ? Number(value) - 1 : 0)
          }}
          className="page-size-input"
        />
      </span>
      <select
        value={paginationState.pageSize}
        onChange={(event) => table.setPageSize(Number(event.currentTarget.value))}
      >
        @for (const pageSize of pageSizes; key pageSize) {
          <option value={pageSize}>Show {String(pageSize)}</option>
        }
      </select>
    </div>
    <div className="spacer-md" />
    <pre data-testid="table-state">{JSON.stringify(table.state, null, 2)}</pre>
  </div>
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
createRoot(rootElement).render(App)

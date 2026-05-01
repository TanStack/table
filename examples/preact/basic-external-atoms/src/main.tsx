import { render } from 'preact'
import { useReducer, useState } from 'preact/hooks'
import './index.css'
import { useCreateAtom, useSelector } from '@tanstack/preact-store'
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/preact-table'
import { makeData } from './makeData'
import type { PaginationState, SortingState } from '@tanstack/preact-table'

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

function App() {
  const [data, setData] = useState(() => makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))

  const rerender = useReducer(() => ({}), {})[1]

  // Create stable external atoms for the individual state slices you want to
  // own. The table still creates internal base atoms for everything else.
  const sortingAtom = useCreateAtom<SortingState>([])
  const paginationAtom = useCreateAtom<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  // Subscribe to each atom independently — fine-grained reactivity.
  const sorting = useSelector(sortingAtom, (s) => s)
  const pagination = useSelector(paginationAtom, (s) => s)

  // Create the table and pass your per-slice external atoms.
  const table = useTable({
    _features,
    _rowModels: {
      sortedRowModel: createSortedRowModel(sortFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    columns,
    data,
    atoms: {
      sorting: sortingAtom,
      pagination: paginationAtom,
    },
    debugTable: pagination.pageIndex > 2,
  })

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort() ? 'sortable-header' : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <table.FlexRender header={header} />
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
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
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
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
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="inline-controls">
          <div>Page</div>
          <strong>
            {(pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={pagination.pageIndex + 1}
            onChange={(e) => {
              const page = (e.target as HTMLInputElement).value
                ? Number((e.target as HTMLInputElement).value) - 1
                : 0
              table.setPageIndex(page)
            }}
            className="page-size-input"
          />
        </span>
        <select
          value={pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number((e.target as HTMLInputElement).value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div className="spacer-md" />
      <button onClick={() => rerender(0)} className="demo-button">
        Rerender
      </button>
      <pre>{JSON.stringify({ sorting, pagination }, null, 2)}</pre>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(<App />, rootElement)

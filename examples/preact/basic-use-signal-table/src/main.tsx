import { render } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { signal } from '@preact/signals'
import { TanStackDevtools } from '@tanstack/preact-devtools'
import './index.css'
import {
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from '@tanstack/preact-table'
import { signalAtom, useSignalTable } from '@tanstack/preact-table/signals'
import {
  tableDevtoolsPlugin,
  useTanStackTableDevtools,
} from '@tanstack/preact-table-devtools'
import { makeData } from './makeData'
import type { PreactSignalTable } from '@tanstack/preact-table/signals'
import type {
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/preact-table'
import type { Person } from './makeData'

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    text: sortFn_text,
  },
})

// Plain module-scope signals own the table state — no hooks, no providers.
// `signalAtom` wraps each one in the store Atom interface so the table can
// read and write them, while your own code keeps using `.value`.
const data = signal(makeData(1_000))
const sorting = signal<SortingState>([])
const pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 })
const rowSelection = signal<RowSelectionState>({})

const columnHelper = createColumnHelper<typeof features, Person>()

// Keep columns (and other non-primitive options) referentially stable —
// module scope here — so per-render option churn never invalidates the
// table's signal graph.
const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  }),
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

// Any component that reads a signal (directly via `.value`, or indirectly
// through a table API call) during render auto-subscribes to it. The console
// logs in each component make that visible: sorting a column re-renders the
// header and body but not the selection summary; checking a row does the
// reverse. The App component itself never re-renders.

function App() {
  console.log('App render')

  const table = useSignalTable({
    key: 'basic-use-signal-table', // needed for devtools
    debugTable: true,
    features,
    columns,
    data: data.value,
    atoms: {
      sorting: signalAtom(sorting),
      pagination: signalAtom(pagination),
      rowSelection: signalAtom(rowSelection),
    },
  })

  useTanStackTableDevtools(table)

  return (
    <div className="demo-root">
      <div>
        <button onClick={() => (data.value = makeData(1_000))}>
          Regenerate Data
        </button>
        <button onClick={() => (data.value = makeData(100_000))}>
          Stress Test (100k rows)
        </button>
      </div>
      <SelectionSummary />
      <table>
        <TableHead table={table} />
        <TableBody table={table} />
      </table>
      <div className="spacer-sm" />
      <PaginationControls table={table} />
      <div className="spacer-md" />
      <TableStateDump table={table} />
    </div>
  )
}

/** Reads the raw external signals — never touches the table instance. */
function SelectionSummary() {
  const selectedCount = Object.keys(rowSelection.value).length

  return (
    <div className="demo-note">
      {selectedCount.toLocaleString()} of {data.value.length.toLocaleString()}{' '}
      rows selected
    </div>
  )
}

function TableHead({
  table,
}: {
  table: PreactSignalTable<typeof features, Person>
}) {
  console.log('TableHead render')

  return (
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
  )
}

function TableBody({
  table,
}: {
  table: PreactSignalTable<typeof features, Person>
}) {
  console.log('TableBody render')

  return (
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
  )
}

function PaginationControls({
  table,
}: {
  table: PreactSignalTable<typeof features, Person>
}) {
  console.log('PaginationControls render')

  const { pageIndex, pageSize } = pagination.value

  return (
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
          {(pageIndex + 1).toLocaleString()} of{' '}
          {table.getPageCount().toLocaleString()}
        </strong>
      </span>
      <span className="inline-controls">
        | Go to page:
        <input
          type="number"
          min="1"
          max={table.getPageCount()}
          defaultValue={pageIndex + 1}
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
        value={pageSize}
        onChange={(e) => {
          table.setPageSize(Number((e.target as HTMLInputElement).value))
        }}
      >
        {[10, 20, 30, 40, 50].map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Reads every state slice through the aggregate store, so it re-renders on any change. */
function TableStateDump({
  table,
}: {
  table: PreactSignalTable<typeof features, Person>
}) {
  return (
    <pre data-testid="table-state">
      {JSON.stringify(table.store.state, null, 2)}
    </pre>
  )
}

function IndeterminateCheckbox({
  indeterminate,
  checked,
  disabled,
  onChange,
}: {
  indeterminate?: boolean
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
}) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !checked && indeterminate
    }
  }, [ref, indeterminate, checked])

  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
  )
}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

render(
  <>
    <App />
    <TanStackDevtools plugins={[tableDevtoolsPlugin()]} />
  </>,
  rootElement,
)

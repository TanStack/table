import { For, Show, createEffect, createSignal } from 'solid-js'
import { useTanStackTableDevtools } from '@tanstack/solid-table-devtools'
import {
  FlexRender,
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { makeData } from './makeData'
import type {
  Column,
  ColumnDef,
  SolidTable,
  Table,
} from '@tanstack/solid-table'
import type { Person } from './makeData'
import './index.css'

export const _features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
})

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))
  const [enableRowSelection, setEnableRowSelection] = createSignal(true)

  const tableRef: { current?: SolidTable<typeof _features, Person> } = {}

  const columns: Array<ColumnDef<typeof _features, Person>> = [
    {
      id: 'select',
      header: () => (
        <IndeterminateCheckbox
          checked={tableRef.current!.getIsAllRowsSelected()}
          indeterminate={tableRef.current!.getIsSomeRowsSelected()}
          onChange={tableRef.current!.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => {
        return (
          <div class="column-toggle-row">
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />
          </div>
        )
      },
    },
    {
      header: 'Name',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'firstName',
          cell: (info) => info.getValue(),
          footer: (props) => props.column.id,
        },
        {
          accessorFn: (row) => row.lastName,
          id: 'lastName',
          cell: (info) => info.getValue(),
          header: () => <span>Last Name</span>,
          footer: (props) => props.column.id,
        },
      ],
    },
    {
      header: 'Info',
      footer: (props) => props.column.id,
      columns: [
        {
          accessorKey: 'age',
          header: () => 'Age',
          footer: (props) => props.column.id,
        },
        {
          header: 'More Info',
          columns: [
            {
              accessorKey: 'visits',
              header: () => <span>Visits</span>,
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'status',
              header: 'Status',
              footer: (props) => props.column.id,
            },
            {
              accessorKey: 'progress',
              header: 'Profile Progress',
              footer: (props) => props.column.id,
            },
          ],
        },
      ],
    },
  ]

  const table = createTable({
    _features,
    _rowModels: {
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
    },
    get data() {
      return data()
    },
    columns,
    getRowId: (row) => row.id,
    get enableRowSelection() {
      return enableRowSelection()
    },
    debugTable: true,
  })
  tableRef.current = table
  useTanStackTableDevtools(table, 'Row Selection Example')

  return (
    <div class="demo-root">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <div>
        <input
          value={table.store.state.globalFilter ?? ''}
          onInput={(e) => table.setGlobalFilter(e.target.value)}
          class="summary-panel"
          placeholder="Search all columns..."
        />
      </div>
      <div class="spacer-sm" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      <Show when={!header.isPlaceholder}>
                        <>
                          <FlexRender header={header} />
                          <Show when={header.column.getCanFilter()}>
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          </Show>
                        </>
                      </Show>
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
                    <td>
                      <FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
        <tfoot>
          <tr>
            <td class="cell-padding">
              <IndeterminateCheckbox
                checked={table.getIsAllPageRowsSelected()}
                indeterminate={table.getIsSomePageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
              />
            </td>
            <td colSpan={20}>
              Page Rows ({table.getRowModel().rows.length.toLocaleString()})
            </td>
          </tr>
        </tfoot>
      </table>
      <div class="spacer-sm" />
      <div class="controls">
        <button
          class="demo-button demo-button-sm"
          onClick={() => table.setPageIndex(0)}
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
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span class="inline-controls">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="inline-controls">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.store.state.pagination.pageIndex + 1}
            onInput={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            class="page-size-input"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option value={pageSize}>Show {pageSize}</option>
          ))}
        </select>
      </div>
      <br />
      <div>
        {Object.keys(table.store.state.rowSelection).length.toLocaleString()} of{' '}
        {table.getPreFilteredRowModel().rows.length.toLocaleString()} Total Rows
        Selected
      </div>
      <hr />
      <br />
      <div>
        <button
          class="demo-button demo-button-spaced"
          onClick={() =>
            console.info(
              'table.getSelectedRowModel().flatRows',
              table.getSelectedRowModel().flatRows,
            )
          }
        >
          Log table.getSelectedRowModel().flatRows
        </button>
        <button
          class="demo-button demo-button-spaced"
          onClick={() => setEnableRowSelection((prev) => !prev)}
        >
          {enableRowSelection() ? 'Disable' : 'Enable'} Row Selection
        </button>
      </div>
      <div>
        <label>Row Selection State:</label>
        <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
      </div>
    </div>
  )
}

function Filter(props: {
  column: Column<typeof _features, Person>
  table: Table<typeof _features, Person>
}) {
  const firstValue = props.table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(props.column.id)

  return typeof firstValue === 'number' ? (
    <div class="filter-row">
      <input
        type="number"
        value={((props.column.getFilterValue() as any)?.[0] ?? '') as string}
        onInput={(e) =>
          props.column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        class="filter-input"
      />
      <input
        type="number"
        value={((props.column.getFilterValue() as any)?.[1] ?? '') as string}
        onInput={(e) =>
          props.column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        class="filter-input"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(props.column.getFilterValue() ?? '') as string}
      onInput={(e) => props.column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      class="filter-select"
    />
  )
}

function IndeterminateCheckbox(props: {
  indeterminate?: boolean
  class?: string
  checked?: boolean
  disabled?: boolean
  onChange?: (event: Event) => void
}) {
  let ref: HTMLInputElement | undefined

  createEffect(() => {
    if (typeof props.indeterminate === 'boolean' && ref) {
      ref.indeterminate = !props.checked && props.indeterminate
    }
  })

  return (
    <input
      type="checkbox"
      ref={ref}
      class={(props.class ?? '') + ' sortable-header'}
      checked={props.checked}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  )
}

export default App

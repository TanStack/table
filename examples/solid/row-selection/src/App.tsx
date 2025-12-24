import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  flexRender,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createEffect, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type {
  ColumnDef,
  Column,
  Table,
  SolidTable,
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
  const refreshData = () => setData(makeData(100_000)) // stress test

  // Create table first with a placeholder for columns
  let table: SolidTable<typeof _features, Person>

  const columns: Array<ColumnDef<typeof _features, Person>> = [
    {
      id: 'select',
      header: () => {
        return (
          <table.Subscribe selector={(state) => state.rowSelection}>
            {() => (
              <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
              />
            )}
          </table.Subscribe>
        )
      },
      cell: ({ row }) => (
        <div class="px-1">
          <IndeterminateCheckbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        </div>
      ),
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

  table = createTable({
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
    enableRowSelection: true, // enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    debugTable: true,
  })

  return (
    // <table.Subscribe
    //   selector={(state) => ({
    //     // don't include row selection state to optimize re-renders
    //     columnFilters: state.columnFilters,
    //     globalFilter: state.globalFilter,
    //     pagination: state.pagination,
    //   })}
    // >
    //   {(state) => (
    <div class="p-2">
      <div>
        <table.Subscribe
          selector={(state) => ({ globalFilter: state.globalFilter })}
        >
          {(state) => (
            <input
              value={state().globalFilter ?? ''}
              onInput={(e) => table.setGlobalFilter(e.target.value)}
              class="p-2 font-lg shadow border border-block"
              placeholder="Search all columns..."
            />
          )}
        </table.Subscribe>
      </div>
      <div class="h-2" />
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
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
              <table.Subscribe
                selector={(state) => state.rowSelection[row.id]} // only re-render row when row selection changes (could down move to cell render too)
              >
                {() => (
                  <tr>
                    <For each={row.getAllCells()}>
                      {(cell) => (
                        <td>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </table.Subscribe>
            )}
          </For>
        </tbody>
        <tfoot>
          <tr>
            <td class="p-1">
              <table.Subscribe selector={(state) => state.rowSelection}>
                {() => (
                  <IndeterminateCheckbox
                    checked={table.getIsAllPageRowsSelected()}
                    indeterminate={table.getIsSomePageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                  />
                )}
              </table.Subscribe>
            </td>
            <td colSpan={20}>Page Rows ({table.getRowModel().rows.length})</td>
          </tr>
        </tfoot>
      </table>
      <div class="h-2" />
      <div class="flex items-center gap-2">
        <button
          class="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          class="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          class="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          class="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <table.Subscribe
          selector={(state) => ({ pagination: state.pagination })}
        >
          {(state) => (
            <>
              <span class="flex items-center gap-1">
                <div>Page</div>
                <strong>
                  {state().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </span>
              <span class="flex items-center gap-1">
                | Go to page:
                <input
                  type="number"
                  min="1"
                  max={table.getPageCount()}
                  value={state().pagination.pageIndex + 1}
                  onInput={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0
                    table.setPageIndex(page)
                  }}
                  class="border p-1 rounded w-16"
                />
              </span>
              <select
                value={state().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(
                    Number((e.target as HTMLSelectElement).value),
                  )
                }}
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option value={pageSize}>Show {pageSize}</option>
                ))}
              </select>
            </>
          )}
        </table.Subscribe>
      </div>
      <br />
      <div>
        <table.Subscribe
          selector={(state) => ({
            numSelected: Object.keys(state.rowSelection).length,
          })}
        >
          {(state) => <>{state().numSelected} of </>}
        </table.Subscribe>
        {table.getPreFilteredRowModel().rows.length} Total Rows Selected
      </div>
      <hr />
      <br />
      <div>
        <button class="border rounded p-2 mb-2" onClick={() => refreshData()}>
          Refresh Data
        </button>
      </div>
      <div>
        <button
          class="border rounded p-2 mb-2"
          onClick={() =>
            console.info(
              'table.getSelectedRowModel().flatRows',
              table.getSelectedRowModel().flatRows,
            )
          }
        >
          Log table.getSelectedRowModel().flatRows
        </button>
      </div>
      <div>
        <label>Row Selection State:</label>
        <table.Subscribe selector={(state) => state}>
          {(state) => <pre>{JSON.stringify(state(), null, 2)}</pre>}
        </table.Subscribe>
      </div>
    </div>
    //   )}
    // </table.Subscribe>
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
    <div class="flex space-x-2">
      <input
        type="number"
        value={((props.column.getFilterValue() as any)?.[0] ?? '') as string}
        onInput={(e) =>
          props.column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        class="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((props.column.getFilterValue() as any)?.[1] ?? '') as string}
        onInput={(e) =>
          props.column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        class="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(props.column.getFilterValue() ?? '') as string}
      onInput={(e) => props.column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      class="w-36 border shadow rounded"
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
      class={(props.class ?? '') + ' cursor-pointer'}
      checked={props.checked}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  )
}

export default App

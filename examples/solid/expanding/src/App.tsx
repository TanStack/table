import {
  columnFilteringFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  createTable,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createEffect, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type { Column, Table } from '@tanstack/solid-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

function App() {
  const [data, setData] = createSignal(makeData(100, 5, 3))
  const refreshData = () => setData(makeData(100, 5, 3))
  const stressTest = () => setData(makeData(1_000, 5, 3))

  const columns = columnHelper.columns([
    columnHelper.accessor('firstName', {
      header: ({ table }) => (
        <>
          <IndeterminateCheckbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />{' '}
          <button onClick={table.getToggleAllRowsExpandedHandler()}>
            {table.getIsAllRowsExpanded() ? '👇' : '👉'}
          </button>{' '}
          First Name
        </>
      ),
      cell: ({ row, getValue }) => (
        <div style={{ 'padding-left': `${row.depth * 2}rem` }}>
          <div>
            <IndeterminateCheckbox
              checked={row.getIsSelected()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
            />{' '}
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                style={{ cursor: 'pointer' }}
              >
                {row.getIsExpanded() ? '👇' : '👉'}
              </button>
            ) : (
              '🔵'
            )}{' '}
            {getValue<string>()}
          </div>
        </div>
      ),
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'lastName',
      cell: (info) => info.getValue(),
      header: () => <span>Last Name</span>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      footer: (props) => props.column.id,
      filterFn: 'between',
    }),
    columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (props) => props.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (props) => props.column.id,
    }),
  ])

  const table = createTable({
    _features,
    _rowModels: {
      expandedRowModel: createExpandedRowModel(),
      filteredRowModel: createFilteredRowModel(filterFns),
      paginatedRowModel: createPaginatedRowModel(),
      sortedRowModel: createSortedRowModel(sortFns),
    },
    columns,
    get data() {
      return data()
    },
    getSubRows: (row) => row.subRows,
    debugTable: true,
  })

  return (
    <div class="p-2">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1k roots)</button>
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
                        <div>
                          <table.FlexRender header={header} />
                          <Show when={header.column.getCanFilter()}>
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          </Show>
                        </div>
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
                      <table.FlexRender cell={cell} />
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
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
        <span class="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {(table.store.state.pagination.pageIndex + 1).toLocaleString()} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span class="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            value={table.store.state.pagination.pageIndex + 1}
            onInput={(e) => {
              const page = e.currentTarget.value
                ? Number(e.currentTarget.value) - 1
                : 0
              table.setPageIndex(page)
            }}
            class="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.store.state.pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.currentTarget.value))
          }}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<typeof _features, Person>
  table: Table<typeof _features, Person>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = () => column.getFilterValue()

  return typeof firstValue === 'number' ? (
    <div class="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue() as [number, number] | undefined)?.[0] ?? ''}
        onInput={(e) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            e.currentTarget.value,
            old?.[1],
          ])
        }
        placeholder="Min"
        class="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue() as [number, number] | undefined)?.[1] ?? ''}
        onInput={(e) =>
          column.setFilterValue((old: [number, number] | undefined) => [
            old?.[0],
            e.currentTarget.value,
          ])
        }
        placeholder="Max"
        class="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue() ?? '') as string}
      onInput={(e) => column.setFilterValue(e.currentTarget.value)}
      placeholder="Search..."
      class="w-36 border shadow rounded"
    />
  )
}

function IndeterminateCheckbox(props: {
  indeterminate?: boolean
  checked?: boolean
  className?: string
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
      class={`${props.className ?? ''} cursor-pointer`}
      checked={props.checked}
      onChange={props.onChange}
    />
  )
}

export default App

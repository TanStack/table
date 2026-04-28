import {
  columnFilteringFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createTable,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createMemo, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type {
  Column,
  ExpandedState,
  Row,
  RowPinningState,
  Table,
} from '@tanstack/solid-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  rowPaginationFeature,
})

function App() {
  const [rowPinning, setRowPinning] = createSignal<RowPinningState>({
    top: [],
    bottom: [],
  })
  const [expanded, setExpanded] = createSignal<ExpandedState>({})

  const [keepPinnedRows, setKeepPinnedRows] = createSignal(true)
  const [includeLeafRows, setIncludeLeafRows] = createSignal(true)
  const [includeParentRows, setIncludeParentRows] = createSignal(false)
  const [copyPinnedRows, setCopyPinnedRows] = createSignal(false)

  const [data, setData] = createSignal(makeData(1_000, 2, 2))
  const refreshData = () => setData(makeData(1_000, 2, 2))
  const stressTest = () => setData(makeData(100_000, 2, 2))

  const columns = createMemo(() => [
    {
      id: 'pin',
      header: () => 'Pin',
      cell: ({ row }: { row: Row<typeof _features, Person> }) =>
        row.getIsPinned() ? (
          <button
            onClick={() =>
              row.pin(false, includeLeafRows(), includeParentRows())
            }
          >
            ❌
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() =>
                row.pin('top', includeLeafRows(), includeParentRows())
              }
            >
              ⬆️
            </button>
            <button
              onClick={() =>
                row.pin('bottom', includeLeafRows(), includeParentRows())
              }
            >
              ⬇️
            </button>
          </div>
        ),
    },
    {
      accessorKey: 'firstName',
      header: ({ table }: { table: Table<typeof _features, Person> }) => (
        <>
          <button onClick={table.getToggleAllRowsExpandedHandler()}>
            {table.getIsAllRowsExpanded() ? '👇' : '👉'}
          </button>{' '}
          First Name
        </>
      ),
      cell: ({
        row,
        getValue,
      }: {
        row: Row<typeof _features, Person>
        getValue: () => unknown
      }) => (
        <div style={{ 'padding-left': `${row.depth * 2}rem` }}>
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
          {getValue() as string}
        </div>
      ),
      footer: (props: any) => props.column.id,
    },
    {
      accessorFn: (row: Person) => row.lastName,
      id: 'lastName',
      cell: (info: any) => info.getValue(),
      header: () => <span>Last Name</span>,
    },
    { accessorKey: 'age', header: () => 'Age', size: 50 },
    { accessorKey: 'visits', header: () => <span>Visits</span>, size: 50 },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'progress', header: 'Profile Progress', size: 80 },
  ])

  const table = createTable(
    {
      debugTable: true,
      _features,
      _rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        expandedRowModel: createExpandedRowModel(),
        paginatedRowModel: createPaginatedRowModel(),
      },
      get columns() {
        return columns()
      },
      get data() {
        return data()
      },
      initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
      get state() {
        return {
          expanded: expanded(),
          rowPinning: rowPinning(),
        }
      },
      onExpandedChange: setExpanded,
      onRowPinningChange: setRowPinning,
      getSubRows: (row) => row.subRows,
      get keepPinnedRows() {
        return keepPinnedRows()
      },
      debugAll: true,
    },
    (state) => state,
  )

  return (
    <div class="app">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <div class="p-2 container">
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
                            <table.FlexRender header={header} />
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
            <For each={table.getTopRows()}>
              {(row) => <PinnedRow row={row} table={table} />}
            </For>
            <For
              each={
                copyPinnedRows()
                  ? table.getRowModel().rows
                  : table.getCenterRows()
              }
            >
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
            <For each={table.getBottomRows()}>
              {(row) => <PinnedRow row={row} table={table} />}
            </For>
          </tbody>
        </table>
      </div>

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
          onChange={(e) => table.setPageSize(Number(e.currentTarget.value))}
        >
          <For each={[10, 20, 30, 40, 50]}>
            {(pageSize) => <option value={pageSize}>Show {pageSize}</option>}
          </For>
        </select>
      </div>
      <div class="h-2" />
      <hr />
      <br />
      <div class="flex flex-col gap-2 align-center vertical">
        <div>
          <input
            type="checkbox"
            checked={keepPinnedRows()}
            onChange={() => setKeepPinnedRows(!keepPinnedRows())}
          />
          <label class="ml-2">
            Keep/Persist Pinned Rows across Pagination and Filtering
          </label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={includeLeafRows()}
            onChange={() => setIncludeLeafRows(!includeLeafRows())}
          />
          <label class="ml-2">Include Leaf Rows When Pinning Parent</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={includeParentRows()}
            onChange={() => setIncludeParentRows(!includeParentRows())}
          />
          <label class="ml-2">Include Parent Rows When Pinning Child</label>
        </div>
        <div>
          <input
            type="checkbox"
            checked={copyPinnedRows()}
            onChange={() => setCopyPinnedRows(!copyPinnedRows())}
          />
          <label class="ml-2">Duplicate/Keep Pinned Rows in main table</label>
        </div>
      </div>
      <div>{JSON.stringify(rowPinning(), null, 2)}</div>
    </div>
  )
}

function PinnedRow(props: {
  row: Row<typeof _features, Person>
  table: Table<typeof _features, Person>
}) {
  return (
    <tr
      style={{
        'background-color': 'lightblue',
        position: 'sticky',
        top:
          props.row.getIsPinned() === 'top'
            ? `${props.row.getPinnedIndex() * 26 + 48}px`
            : undefined,
        bottom:
          props.row.getIsPinned() === 'bottom'
            ? `${(props.table.getBottomRows().length - 1 - props.row.getPinnedIndex()) * 26}px`
            : undefined,
      }}
    >
      <For each={props.row.getAllCells()}>
        {(cell) => (
          <td>
            <props.table.FlexRender cell={cell} />
          </td>
        )}
      </For>
    </tr>
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

  return typeof firstValue === 'number' ? (
    <div class="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? '') as string}
        onInput={(e) =>
          column.setFilterValue((old: any) => [e.currentTarget.value, old?.[1]])
        }
        placeholder="Min"
        class="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? '') as string}
        onInput={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.currentTarget.value])
        }
        placeholder="Max"
        class="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? '') as string}
      onInput={(e) => column.setFilterValue(e.currentTarget.value)}
      placeholder="Search..."
      class="w-36 border shadow rounded"
    />
  )
}

export default App

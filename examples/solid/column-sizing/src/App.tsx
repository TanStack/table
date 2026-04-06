import {
  columnSizingFeature,
  createColumnHelper,
  createTable,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, createSignal } from 'solid-js'

const _features = tableFeatures({ columnSizingFeature })

type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const defaultData: Array<Person> = [
  {
    firstName: 'tanner',
    lastName: 'linsley',
    age: 24,
    visits: 100,
    status: 'In Relationship',
    progress: 50,
  },
  {
    firstName: 'tandy',
    lastName: 'miller',
    age: 40,
    visits: 40,
    status: 'Single',
    progress: 80,
  },
  {
    firstName: 'joe',
    lastName: 'dirte',
    age: 45,
    visits: 20,
    status: 'Complicated',
    progress: 10,
  },
]

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
    size: 120,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => <span>Last Name</span>,
    footer: (props) => props.column.id,
    size: 120,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
    size: 100,
  }),
  columnHelper.accessor('visits', {
    header: () => <span>Visits</span>,
    footer: (props) => props.column.id,
    size: 80,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    footer: (props) => props.column.id,
    size: 200,
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
    footer: (props) => props.column.id,
    size: 200,
  }),
])

function App() {
  const [data] = createSignal([...defaultData])

  const table = createTable(
    {
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data()
      },
      debugTable: true,
      debugHeaders: true,
      debugColumns: true,
    },
    (state) => state,
  )

  return (
    <div class="p-2">
      <div class="flex flex-wrap gap-2">
        <div class="text-xl">{'Initial Column Sizes'}</div>
        <br />
        <For each={table.getAllColumns()}>
          {(column) => (
            <div>
              <label>
                {column.id}
                <input
                  type="number"
                  value={column.getSize()}
                  onInput={(e) => {
                    table.setColumnSizing({
                      ...table.store.state.columnSizing,
                      [column.id]: Number(e.currentTarget.value),
                    })
                  }}
                  class="border rounded p-1 w-24 ml-2"
                />
              </label>
            </div>
          )}
        </For>
      </div>
      <div class="flex gap-2" />
      <div class="h-4" />
      <div class="text-xl">{'<table/>'}</div>
      <div class="overflow-x-auto">
        <table
          style={{
            width: `${table.getCenterTotalSize()}px`,
          }}
        >
          <thead>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <tr>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <th
                        colSpan={header.colSpan}
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        <div />
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
                      <td style={{ width: `${cell.column.getSize()}px` }}>
                        <table.FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
      <div class="h-4" />
      <div class="text-xl">{'<div/> (relative)'}</div>
      <div class="overflow-x-auto">
        <div class="divTable" style={{ width: `${table.getTotalSize()}px` }}>
          <div class="thead">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <div class="tr">
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <div
                        class="th"
                        style={{ width: `${header.getSize()}px` }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        <div />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
          <div class="tbody">
            <For each={table.getRowModel().rows}>
              {(row) => (
                <div class="tr">
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <div
                        class="td"
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="h-4" />
      <div class="text-xl">{'<div/> (absolute positioning)'}</div>
      <div class="overflow-x-auto">
        <div class="divTable" style={{ width: `${table.getTotalSize()}px` }}>
          <div class="thead">
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <div class="tr" style={{ position: 'relative' }}>
                  <For each={headerGroup.headers}>
                    {(header) => (
                      <div
                        class="th"
                        style={{
                          position: 'absolute',
                          left: `${header.getStart()}px`,
                          width: `${header.getSize()}px`,
                        }}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                        <div />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
          <div class="tbody">
            <For each={table.getRowModel().rows}>
              {(row) => (
                <div class="tr" style={{ position: 'relative' }}>
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <div
                        class="td"
                        style={{
                          position: 'absolute',
                          left: `${cell.column.getStart()}px`,
                          width: `${cell.column.getSize()}px`,
                        }}
                      >
                        <table.FlexRender cell={cell} />
                      </div>
                    )}
                  </For>
                </div>
              )}
            </For>
          </div>
        </div>
      </div>
      <div class="h-4" />
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App

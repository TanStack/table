import {
  FlexRender,
  columnFacetingFeature,
  columnFilteringFeature,
  createFacetedMinMaxValues,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createTable,
  filterFns,
  globalFilteringFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { debounce } from '@solid-primitives/scheduled'
import { For, createSignal } from 'solid-js'
import { makeData } from './makeData'
import ColumnFilter from './ColumnFilter'
import type { Person } from './makeData'
import type { ColumnDef } from '@tanstack/solid-table'

export const _features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  columnFacetingFeature,
})

const columns: Array<ColumnDef<typeof _features, Person>> = [
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

function App() {
  const [data, setData] = createSignal(makeData(1_000))
  const refreshData = () => setData(makeData(1_000))
  const stressTest = () => setData(makeData(100_000))

  const table = createTable({
    _features,
    _rowModels: {
      facetedRowModel: createFacetedRowModel(),
      facetedMinMaxValues: createFacetedMinMaxValues(),
      facetedUniqueValues: createFacetedUniqueValues(),
      filteredRowModel: createFilteredRowModel(filterFns),
    },
    get data() {
      return data()
    },
    columns,
    globalFilterFn: 'includesString',
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  const debounceSetGlobalFilter = debounce((value: string) => {
    table.setGlobalFilter(value)
  }, 500)

  return (
    <div class="p-2">
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (100k rows)</button>
      </div>
      <input
        class="p-2 font-lg shadow border border-block"
        value={table.store.state.globalFilter ?? ''}
        onInput={(e) => debounceSetGlobalFilter(e.currentTarget.value)}
        placeholder="Search all columns..."
      />
      <div class="h-2" />
      <table>
        <thead>
          <For each={table.getHeaderGroups()}>
            {(headerGroup) => (
              <tr>
                <For each={headerGroup.headers}>
                  {(header) => (
                    <th colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <FlexRender header={header} />
                          {header.column.getCanFilter() ? (
                            <div>
                              <ColumnFilter
                                column={header.column}
                                table={table}
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )}
                </For>
              </tr>
            )}
          </For>
        </thead>
        <tbody>
          <For each={table.getRowModel().rows.slice(0, 10)}>
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
      </table>
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
      <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
    </div>
  )
}

export default App

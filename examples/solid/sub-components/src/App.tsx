import {
  createColumnHelper,
  createExpandedRowModel,
  createTable,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/solid-table'
import { For, Show, createSignal } from 'solid-js'
import { makeData } from './makeData'
import type {
  ColumnDef,
  Row,
  RowData,
  TableFeatures,
} from '@tanstack/solid-table'
import type { Person } from './makeData'

const _features = tableFeatures({ rowExpandingFeature })

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'expander',
    header: () => null,
    cell: ({ row }) => (
      <Show when={row.getCanExpand()} fallback={<span>🔵</span>}>
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
          {row.getIsExpanded() ? '👇' : '👉'}
        </button>
      </Show>
    ),
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: ({ row, getValue }) => (
      <div style={{ 'padding-left': `${row.depth * 2}rem` }}>
        {getValue<string>()}
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

type TableProps<TFeatures extends TableFeatures, TData extends RowData> = {
  data: Array<TData>
  columns: Array<ColumnDef<TFeatures, TData>>
  renderSubComponent: (props: { row: Row<TFeatures, TData> }) => any
  getRowCanExpand: (row: Row<TFeatures, TData>) => boolean
}

function TableComponent(props: TableProps<typeof _features, Person>) {
  const table = createTable({
    debugTable: true,
    _features,
    _rowModels: {
      expandedRowModel: createExpandedRowModel(),
    },
    columns: props.columns,
    get data() {
      return props.data
    },
    getRowCanExpand: props.getRowCanExpand,
  })

  return (
    <div class="demo-root">
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
                        <div>
                          <table.FlexRender header={header} />
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
              <>
                <tr>
                  <For each={row.getAllCells()}>
                    {(cell) => (
                      <td>
                        <table.FlexRender cell={cell} />
                      </td>
                    )}
                  </For>
                </tr>
                <Show when={row.getIsExpanded()}>
                  <tr>
                    <td colSpan={row.getAllCells().length}>
                      {props.renderSubComponent({ row })}
                    </td>
                  </tr>
                </Show>
              </>
            )}
          </For>
        </tbody>
      </table>
      <div class="spacer-sm" />
      <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
    </div>
  )
}

const renderSubComponent = ({
  row,
}: {
  row: Row<typeof _features, Person>
}) => (
  <pre style={{ 'font-size': '10px' }}>
    <code>{JSON.stringify(row.original, null, 2)}</code>
  </pre>
)

function App() {
  const [data, setData] = createSignal(makeData(20))
  const refreshData = () => setData(makeData(20))
  const stressTest = () => setData(makeData(1_000))

  return (
    <>
      <div>
        <button onClick={() => refreshData()}>Regenerate Data</button>
        <button onClick={() => stressTest()}>Stress Test (1k rows)</button>
      </div>
      <TableComponent
        columns={columns}
        data={data()}
        getRowCanExpand={() => true}
        renderSubComponent={renderSubComponent}
      />
    </>
  )
}

export default App

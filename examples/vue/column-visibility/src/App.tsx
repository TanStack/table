import { defineComponent, ref } from 'vue'
import {
  FlexRender,
  columnVisibilityFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData } from './makeData'
import type {
  Cell,
  Column,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/vue-table'
import type { Person } from './makeData'

const _features = tableFeatures({ columnVisibilityFeature })

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

export default defineComponent({
  name: 'ColumnVisibilityExample',
  setup() {
    const data = ref(makeData(20))

    const refreshData = () => {
      data.value = makeData(20)
    }

    const stressTest = () => {
      data.value = makeData(1_000)
    }

    const table = useTable({
      debugTable: true,
      _features,
      columns,
      get data() {
        return data.value
      },
    })

    return () => (
      <div class="p-2">
        <div class="flex flex-wrap gap-2">
          <button class="border p-2" onClick={refreshData}>
            Regenerate Data
          </button>
          <button class="border p-2" onClick={stressTest}>
            Stress Test (1k rows)
          </button>
        </div>
        <div class="h-4" />
        <div class="inline-block border border-black shadow rounded">
          <div class="px-1 border-b border-black">
            <label>
              <input
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
                type="checkbox"
              />{' '}
              Toggle All
            </label>
          </div>
          {table
            .getAllLeafColumns()
            .map((column: Column<typeof _features, Person>) => (
              <div class="px-1" key={column.id}>
                <label>
                  <input
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    type="checkbox"
                  />{' '}
                  {column.id}
                </label>
              </div>
            ))}
        </div>
        <div class="h-4" />
        <table>
          <thead>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<typeof _features, Person>) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<typeof _features, Person, unknown>) => (
                      <th key={header.id} colspan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <FlexRender header={header} />
                        )}
                      </th>
                    ),
                  )}
                </tr>
              ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.map((row: Row<typeof _features, Person>) => (
                <tr key={row.id}>
                  {row
                    .getVisibleCells()
                    .map((cell: Cell<typeof _features, Person, unknown>) => (
                      <td key={cell.id}>
                        <FlexRender cell={cell} />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
          <tfoot>
            {table
              .getFooterGroups()
              .map((footerGroup: HeaderGroup<typeof _features, Person>) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map(
                    (header: Header<typeof _features, Person, unknown>) => (
                      <th key={header.id} colspan={header.colSpan}>
                        {header.isPlaceholder ? null : (
                          <FlexRender footer={header} />
                        )}
                      </th>
                    ),
                  )}
                </tr>
              ))}
          </tfoot>
        </table>
        <div class="h-4" />
        <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
      </div>
    )
  },
})

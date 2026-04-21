import { defineComponent, ref } from 'vue'
import { FlexRender, tableFeatures, useTable } from '@tanstack/vue-table'
import type {
  Cell,
  ColumnDef,
  Header,
  HeaderGroup,
  Row,
} from '@tanstack/vue-table'

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
  {
    firstName: 'kevin',
    lastName: 'vandy',
    age: 12,
    visits: 100,
    status: 'Single',
    progress: 70,
  },
]

const _features = tableFeatures({})

const columns: Array<ColumnDef<typeof _features, Person>> = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorFn: (row) => row.lastName,
    id: 'lastName',
    header: () => <span>Last Name</span>,
    cell: (info) => <i>{info.getValue<string>()}</i>,
  },
  {
    accessorFn: (row) => Number(row.age),
    id: 'age',
    header: () => 'Age',
    cell: (info) => info.renderValue(),
  },
  {
    accessorKey: 'visits',
    header: () => <span>Visits</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'progress',
    header: 'Profile Progress',
  },
]

export default defineComponent({
  name: 'BasicUseTableExample',
  setup() {
    const data = ref([...defaultData])

    const table = useTable({
      debugTable: true,
      _features,
      _rowModels: {},
      columns,
      get data() {
        return data.value
      },
    })

    const rerender = () => {
      data.value = [...defaultData]
    }

    return () => (
      <div class="p-2">
        <table>
          <thead>
            {table
              .getHeaderGroups()
              .map((headerGroup: HeaderGroup<typeof _features, Person>) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(
                    (header: Header<typeof _features, Person, unknown>) => (
                      <th key={header.id}>
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
                    .getAllCells()
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
                      <th key={header.id}>
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
        <button onClick={rerender} class="border p-2">
          Rerender
        </button>
      </div>
    )
  },
})

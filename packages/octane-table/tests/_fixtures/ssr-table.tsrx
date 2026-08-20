import {
  createColumnHelper,
  flexRender,
  stockFeatures,
  useTable,
} from '@tanstack/octane-table'

type Person = { name: string; age: number }

const data: Array<Person> = [{ name: 'Ada', age: 37 }]
const columnHelper = createColumnHelper<typeof stockFeatures, Person>()
const columns = columnHelper.columns([
  columnHelper.accessor('name', {
    header: () => <strong>Person</strong>,
    cell: (info) => <em>{String(info.getValue())}</em>,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: (info) => String(info.getValue()),
  }),
])

export function SsrTable() @{
  const table = useTable({
    features: stockFeatures,
    data,
    columns,
    state: {
      pagination: { pageIndex: 2, pageSize: 10 },
    },
  })
  const row = table.getRowModel().rows[0]!
  const header = table.getHeaderGroups()[0]!.headers[0]!

  <section>
    <output id="ssr-state">{String(table.state.pagination.pageIndex)}</output>
    <div id="ssr-direct">
      {flexRender(header.column.columnDef.header, header.getContext())}
    </div>
    <table>
      <tbody>
        <tr>
          @for (const cell of row.getAllCells(); key cell.id) {
            <td><table.FlexRender cell={cell} /></td>
          }
        </tr>
      </tbody>
    </table>
  </section>
}

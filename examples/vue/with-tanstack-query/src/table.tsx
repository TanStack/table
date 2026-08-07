import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/vue-table'
import type {
  Cell,
  Header,
  HeaderGroup,
  Row,
  VueTable,
} from '@tanstack/vue-table'
import type { Person } from './fetchData'

export const features = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  // Server-side filtering, sorting, and pagination do not need client row models.
})

const columnHelper = createColumnHelper<typeof features, Person>()

export const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
  columnHelper.accessor('visits', { header: 'Visits' }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('progress', { header: 'Profile Progress' }),
])

export function PersonTable(props: {
  table: VueTable<typeof features, Person>
}) {
  const table = props.table
  return (
    <table>
      <thead>
        {table
          .getHeaderGroups()
          .map((headerGroup: HeaderGroup<typeof features, Person>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(
                (header: Header<typeof features, Person, unknown>) => (
                  <th key={header.id} colspan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        class={
                          header.column.getCanSort() ? 'sortable-header' : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <FlexRender header={header} />
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ),
              )}
            </tr>
          ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row: Row<typeof features, Person>) => (
          <tr key={row.id}>
            {row
              .getAllCells()
              .map((cell: Cell<typeof features, Person, unknown>) => (
                <td key={cell.id}>
                  <FlexRender cell={cell} />
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function PageSizeSelect(props: {
  pageSize: number
  onPageSizeChange: (pageSize: number) => void
}) {
  return (
    <select
      aria-label="Rows per page"
      value={props.pageSize}
      onChange={(event: Event) =>
        props.onPageSizeChange(
          Number((event.currentTarget as HTMLSelectElement).value),
        )
      }
    >
      {[10, 20, 30, 40, 50].map((pageSize) => (
        <option key={pageSize} value={pageSize}>
          Show {pageSize}
        </option>
      ))}
      <option value={Infinity}>Show All</option>
    </select>
  )
}

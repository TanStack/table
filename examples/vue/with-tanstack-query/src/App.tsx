import { computed, defineComponent, ref, watchEffect } from 'vue'
import { createAtom, useSelector } from '@tanstack/vue-store'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import {
  FlexRender,
  createColumnHelper,
  rowPaginationFeature,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { fetchData } from './fetchData'
import type { Person } from './fetchData'
import type { Cell, Header, HeaderGroup, Row } from '@tanstack/vue-table'

const _features = tableFeatures({
  rowPaginationFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: 'Age',
  }),
  columnHelper.accessor('visits', {
    header: 'Visits',
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

const paginationAtom = createAtom({
  pageIndex: 0,
  pageSize: 10,
})

export default defineComponent({
  name: 'WithTanStackQueryExample',
  setup() {
    const pagination = useSelector(paginationAtom)
    const defaultData: Array<Person> = []

    const dataQuery = useQuery(() => ({
      queryKey: ['data', pagination.value],
      queryFn: () => fetchData(pagination.value),
      placeholderData: keepPreviousData,
    }))

    const tableData = computed<Array<Person>>(
      () => dataQuery.data.value?.rows ?? defaultData,
    )

    const rowCount = ref(0)

    watchEffect(() => {
      const nextRowCount = dataQuery.data.value?.rowCount
      if (nextRowCount != null) {
        rowCount.value = nextRowCount
      }
    })

    const table = useTable({
      _features,
      _rowModels: {},
      columns,
      data: tableData,
      rowCount,
      atoms: {
        pagination: paginationAtom,
      },
      manualPagination: true,
      debugTable: true,
    })

    return () => (
      <div class="demo-root">
        <div class="spacer-sm" />
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
                    .getAllCells()
                    .map((cell: Cell<typeof _features, Person, unknown>) => (
                      <td key={cell.id}>
                        <FlexRender cell={cell} />
                      </td>
                    ))}
                </tr>
              ))}
          </tbody>
        </table>
        <div class="spacer-sm" />
        <div class="controls">
          <button
            class="demo-button demo-button-sm"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            class="demo-button demo-button-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            class="demo-button demo-button-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            class="demo-button demo-button-sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span class="inline-controls">
            <div>Page</div>
            <strong>
              {(pagination.value.pageIndex + 1).toLocaleString()} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={pagination.value.pageIndex + 1}
              onInput={(event: Event) => {
                const target = event.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              class="page-size-input"
            />
          </span>
          <select
            value={pagination.value.pageSize}
            onChange={(event: Event) => {
              const target = event.currentTarget as HTMLSelectElement
              table.setPageSize(Number(target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
          {dataQuery.isFetching.value ? 'Loading...' : null}
        </div>
        <div>
          Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
          {dataQuery.data.value?.rowCount.toLocaleString()} Rows
        </div>
        <pre>{JSON.stringify({ pagination: pagination.value }, null, 2)}</pre>
      </div>
    )
  },
})

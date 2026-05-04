import { defineComponent, ref } from 'vue'
import { createAtom, useSelector } from '@tanstack/vue-store'
import {
  FlexRender,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData } from './makeData'
import type {
  Cell,
  Header,
  HeaderGroup,
  PaginationState,
  Row,
  SortingState,
} from '@tanstack/vue-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
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

export default defineComponent({
  name: 'BasicExternalAtomsExample',
  setup() {
    const data = ref(makeData(1_000))

    const refreshData = () => {
      data.value = makeData(1_000)
    }

    const stressTest = () => {
      data.value = makeData(200_000)
    }

    const sortingAtom = createAtom<SortingState>([])
    const paginationAtom = createAtom<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })

    const sorting = useSelector(sortingAtom)
    const pagination = useSelector(paginationAtom)

    const table = useTable({
      _features,
      _rowModels: {
        sortedRowModel: createSortedRowModel(sortFns),
        paginatedRowModel: createPaginatedRowModel(),
      },
      columns,
      get data() {
        return data.value
      },
      atoms: {
        sorting: sortingAtom,
        pagination: paginationAtom,
      },
      debugTable: true,
    })

    return () => (
      <div class="demo-root">
        <div class="button-row">
          <button class="demo-button" onClick={refreshData}>
            Regenerate Data
          </button>
          <button class="demo-button" onClick={stressTest}>
            Stress Test (200k rows)
          </button>
        </div>
        <div class="spacer-md" />
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
                          <div
                            class={
                              header.column.getCanSort()
                                ? 'sortable-header'
                                : ''
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
            onClick={() => table.setPageIndex(0)}
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
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
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
        </div>
        <div class="spacer-md" />
        <pre>
          {JSON.stringify(
            { sorting: sorting.value, pagination: pagination.value },
            null,
            2,
          )}
        </pre>
      </div>
    )
  },
})

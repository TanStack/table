import { defineComponent, ref, watchEffect } from 'vue'
import {
  FlexRender,
  columnFilteringFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
  useTable,
} from '@tanstack/vue-table'
import { makeData } from './makeData'
import type {
  Cell,
  Column,
  Header,
  HeaderGroup,
  Row,
  Table,
} from '@tanstack/vue-table'
import type { Person } from './makeData'

const _features = tableFeatures({
  columnFilteringFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSortingFeature,
  rowSelectionFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const IndeterminateCheckbox = defineComponent({
  name: 'IndeterminateCheckbox',
  props: {
    checked: Boolean,
    indeterminate: Boolean,
    onChange: Function,
    className: String,
  },
  setup(props) {
    const inputRef = ref<HTMLInputElement | null>(null)

    watchEffect(() => {
      if (inputRef.value) {
        inputRef.value.indeterminate = !props.checked && !!props.indeterminate
      }
    })

    return () => (
      <input
        ref={inputRef}
        type="checkbox"
        class={`${props.className ?? ''} cursor-pointer`}
        checked={props.checked}
        onChange={props.onChange as any}
      />
    )
  },
})

function renderFilter(
  column: Column<typeof _features, Person>,
  table: Table<typeof _features, Person>,
) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  if (typeof firstValue === 'number') {
    return (
      <div class="flex space-x-2">
        <input
          type="number"
          value={(columnFilterValue as [number, number] | undefined)?.[0] ?? ''}
          onInput={(event: Event) =>
            column.setFilterValue((old: [number, number] | undefined) => {
              const target = event.currentTarget as HTMLInputElement
              return [target.value, old?.[1]]
            })
          }
          placeholder="Min"
          class="w-24 border shadow rounded"
        />
        <input
          type="number"
          value={(columnFilterValue as [number, number] | undefined)?.[1] ?? ''}
          onInput={(event: Event) =>
            column.setFilterValue((old: [number, number] | undefined) => {
              const target = event.currentTarget as HTMLInputElement
              return [old?.[0], target.value]
            })
          }
          placeholder="Max"
          class="w-24 border shadow rounded"
        />
      </div>
    )
  }

  return (
    <input
      type="text"
      value={columnFilterValue ?? ''}
      onInput={(event: Event) =>
        column.setFilterValue((event.currentTarget as HTMLInputElement).value)
      }
      placeholder="Search..."
      class="w-36 border shadow rounded"
    />
  )
}

export default defineComponent({
  name: 'ExpandingExample',
  setup() {
    const data = ref(makeData(100, 5, 3))
    const refreshData = () => {
      data.value = makeData(100, 5, 3)
    }
    const stressTest = () => {
      data.value = makeData(10_000, 5, 3)
    }

    const columns = columnHelper.columns([
      columnHelper.accessor('firstName', {
        header: ({ table }) => (
          <>
            <IndeterminateCheckbox
              checked={table.getIsAllRowsSelected()}
              indeterminate={table.getIsSomeRowsSelected()}
              onChange={table.getToggleAllRowsSelectedHandler()}
            />{' '}
            <button onClick={table.getToggleAllRowsExpandedHandler()}>
              {table.getIsAllRowsExpanded() ? '👇' : '👉'}
            </button>{' '}
            First Name
          </>
        ),
        cell: ({ row, getValue }) => (
          <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
            <div>
              <IndeterminateCheckbox
                checked={row.getIsSelected()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
              />{' '}
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
              {getValue<string>()}
            </div>
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
        filterFn: 'between',
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

    const table = useTable({
      _features,
      _rowModels: {
        expandedRowModel: createExpandedRowModel(),
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
        sortedRowModel: createSortedRowModel(sortFns),
      },
      columns,
      get data() {
        return data.value
      },
      getSubRows: (row: Person) => row.subRows,
      debugTable: true,
    })

    return () => (
      <div class="p-2">
        <div class="flex flex-wrap gap-2">
          <button class="border p-2" onClick={refreshData}>
            Regenerate Data
          </button>
          <button class="border p-2" onClick={stressTest}>
            Stress Test (10k rows)
          </button>
        </div>
        <div class="h-2" />
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
                          <div>
                            <FlexRender header={header} />
                            {header.column.getCanFilter() ? (
                              <div>{renderFilter(header.column, table)}</div>
                            ) : null}
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
              onInput={(event: Event) => {
                const target = event.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              class="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.store.state.pagination.pageSize}
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
        <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
        <pre>{JSON.stringify(table.store.state, null, 2)}</pre>
      </div>
    )
  },
})

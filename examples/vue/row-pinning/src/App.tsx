import { defineComponent, ref } from 'vue'
import {
  FlexRender,
  columnFilteringFeature,
  columnSizingFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  filterFns,
  rowExpandingFeature,
  rowPaginationFeature,
  rowPinningFeature,
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

const features = tableFeatures({
  rowPinningFeature,
  rowExpandingFeature,
  columnFilteringFeature,
  columnSizingFeature,
  rowPaginationFeature,
  filteredRowModel: createFilteredRowModel(),
  expandedRowModel: createExpandedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns,
})

const columnHelper = createColumnHelper<typeof features, Person>()

function renderFilter(
  column: Column<typeof features, Person>,
  table: Table<typeof features, Person>,
) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  if (typeof firstValue === 'number') {
    return (
      <div class="filter-row">
        <input
          type="number"
          value={(columnFilterValue as [string, string] | undefined)?.[0] ?? ''}
          onInput={(event: Event) =>
            column.setFilterValue((old: [string, string] | undefined) => {
              const target = event.currentTarget as HTMLInputElement
              return [target.value, old?.[1]]
            })
          }
          placeholder="Min"
          class="filter-input"
        />
        <input
          type="number"
          value={(columnFilterValue as [string, string] | undefined)?.[1] ?? ''}
          onInput={(event: Event) =>
            column.setFilterValue((old: [string, string] | undefined) => {
              const target = event.currentTarget as HTMLInputElement
              return [old?.[0], target.value]
            })
          }
          placeholder="Max"
          class="filter-input"
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
      class="filter-select"
    />
  )
}

function renderPinnedRow(
  row: Row<typeof features, Person>,
  table: Table<typeof features, Person>,
) {
  return (
    <tr
      key={row.id}
      style={{
        backgroundColor: 'lightblue',
        position: 'sticky',
        top:
          row.getIsPinned() === 'top'
            ? `${row.getPinnedIndex() * 26 + 48}px`
            : undefined,
        bottom:
          row.getIsPinned() === 'bottom'
            ? `${
                (table.getBottomRows().length - 1 - row.getPinnedIndex()) * 26
              }px`
            : undefined,
      }}
    >
      {row.getAllCells().map((cell: Cell<typeof features, Person, unknown>) => (
        <td key={cell.id}>
          <FlexRender cell={cell} />
        </td>
      ))}
    </tr>
  )
}

export default defineComponent({
  name: 'RowPinningExample',
  setup() {
    // demo states
    const keepPinnedRows = ref(true)
    const includeLeafRows = ref(true)
    const includeParentRows = ref(false)
    const copyPinnedRows = ref(false)

    const data = ref(makeData(1_000, 2, 2))
    const refreshData = () => {
      data.value = makeData(1_000, 2, 2)
    }
    const stressTest = () => {
      data.value = makeData(200_000, 2, 2)
    }

    const columns = columnHelper.columns([
      columnHelper.display({
        id: 'pin',
        header: () => 'Pin',
        cell: ({ row }) =>
          row.getIsPinned() ? (
            <button
              onClick={() =>
                row.pin(false, includeLeafRows.value, includeParentRows.value)
              }
            >
              ❌
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() =>
                  row.pin('top', includeLeafRows.value, includeParentRows.value)
                }
              >
                ⬆️
              </button>
              <button
                onClick={() =>
                  row.pin(
                    'bottom',
                    includeLeafRows.value,
                    includeParentRows.value,
                  )
                }
              >
                ⬇️
              </button>
            </div>
          ),
      }),
      columnHelper.accessor('firstName', {
        header: ({ table }) => (
          <>
            <button onClick={table.getToggleAllRowsExpandedHandler()}>
              {table.getIsAllRowsExpanded() ? '👇' : '👉'}
            </button>{' '}
            First Name
          </>
        ),
        cell: ({ row, getValue }) => (
          <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
            <>
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
            </>
          </div>
        ),
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.lastName, {
        id: 'lastName',
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
      }),
      columnHelper.accessor('age', {
        header: () => 'Age',
        size: 50,
      }),
      columnHelper.accessor('visits', {
        header: () => <span>Visits</span>,
        size: 50,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
      }),
      columnHelper.accessor('progress', {
        header: 'Profile Progress',
        size: 80,
      }),
    ])

    const table = useTable({
      features,
      columns,
      get data() {
        return data.value
      },
      getSubRows: (row: Person) => row.subRows,
      initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
      get keepPinnedRows() {
        return keepPinnedRows.value
      },
      // atoms: { rowPinning: rowPinningAtom }, // preferred: own pinning state with an external atom
      // state: { rowPinning }, // classic controlled state; pair with onRowPinningChange
      // onRowPinningChange: setRowPinning,
      // enableRowPinning: row => row.original.age > 18, // allow pinning only for matching rows; default true
      debugTable: true,
    })

    return () => (
      <div class="app">
        <div class="demo-root container">
          <div>
            <button
              class="demo-button demo-button-spaced"
              onClick={refreshData}
            >
              Regenerate Data
            </button>
            <button class="demo-button demo-button-spaced" onClick={stressTest}>
              Stress Test (200k rows)
            </button>
          </div>
          <div class="spacer-sm" />
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
                            <>
                              <FlexRender header={header} />
                              {header.column.getCanFilter() ? (
                                <div>{renderFilter(header.column, table)}</div>
                              ) : null}
                            </>
                          )}
                        </th>
                      ),
                    )}
                  </tr>
                ))}
            </thead>
            <tbody>
              {table
                .getTopRows()
                .map((row: Row<typeof features, Person>) =>
                  renderPinnedRow(row, table),
                )}
              {(copyPinnedRows.value
                ? table.getRowModel().rows
                : table.getCenterRows()
              ).map((row: Row<typeof features, Person>) => (
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
              {table
                .getBottomRows()
                .map((row: Row<typeof features, Person>) =>
                  renderPinnedRow(row, table),
                )}
            </tbody>
          </table>
        </div>

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
              {(table.atoms.pagination.get().pageIndex + 1).toLocaleString()} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="inline-controls">
            | Go to page:
            <input
              type="number"
              min="1"
              max={table.getPageCount()}
              value={table.atoms.pagination.get().pageIndex + 1}
              onInput={(event: Event) => {
                const target = event.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              class="page-size-input"
            />
          </span>
          <select
            value={table.atoms.pagination.get().pageSize}
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
        <div class="spacer-sm" />
        <hr />
        <br />
        <div class="vertical-options">
          <div>
            <input
              type="checkbox"
              checked={keepPinnedRows.value}
              onChange={() => {
                keepPinnedRows.value = !keepPinnedRows.value
              }}
            />
            <label class="label-offset">
              Keep/Persist Pinned Rows across Pagination and Filtering
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={includeLeafRows.value}
              onChange={() => {
                includeLeafRows.value = !includeLeafRows.value
              }}
            />
            <label class="label-offset">
              Include Leaf Rows When Pinning Parent
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={includeParentRows.value}
              onChange={() => {
                includeParentRows.value = !includeParentRows.value
              }}
            />
            <label class="label-offset">
              Include Parent Rows When Pinning Child
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              checked={copyPinnedRows.value}
              onChange={() => {
                copyPinnedRows.value = !copyPinnedRows.value
              }}
            />
            <label class="label-offset">
              Duplicate/Keep Pinned Rows in main table
            </label>
          </div>
        </div>
        <div></div>
        <pre data-testid="table-state">
          {JSON.stringify(table.store.get(), null, 2)}
        </pre>
      </div>
    )
  },
})

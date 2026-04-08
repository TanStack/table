import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  getInitialTableState,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { makeData } from './makeData'
import type {
  PaginationState,
  SortingState,
  TableState,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

// This example demonstrates managing ALL table state in a single unified @state() object using getInitialTableState, instead of using separate @state() properties per state slice.

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

const data = makeData(1000)

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  // Store all table state in one unified object, initialized with defaults from features
  @state()
  private tableState: TableState<typeof _features> = getInitialTableState(
    _features,
    {
      sorting: [] as SortingState,
      pagination: { pageIndex: 0, pageSize: 10 } as PaginationState,
    },
  )

  protected render() {
    // Create the table and pass the unified state object
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          sortedRowModel: createSortedRowModel(sortFns),
          paginatedRowModel: createPaginatedRowModel(),
        },
        columns,
        data,
        state: this.tableState,
        onSortingChange: (updater) => {
          this.tableState = {
            ...this.tableState,
            sorting:
              typeof updater === 'function'
                ? updater(this.tableState.sorting)
                : updater,
          }
        },
        onPaginationChange: (updater) => {
          this.tableState = {
            ...this.tableState,
            pagination:
              typeof updater === 'function'
                ? updater(this.tableState.pagination)
                : updater,
          }
        },
        debugTable: true,
      },
      (state) => ({
        sorting: state.sorting,
        pagination: state.pagination,
      }),
    )

    return html`
      <div class="p-2">
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${repeat(
                    headerGroup.headers,
                    (header) => header.id,
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder
                          ? null
                          : html`<div
                              class="${header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : ''}"
                              @click="${header.column.getToggleSortingHandler()}"
                            >
                              ${FlexRender({ header })}
                              ${{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>`}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>
          <tbody>
            ${repeat(
              table.getRowModel().rows,
              (row) => row.id,
              (row) => html`
                <tr>
                  ${repeat(
                    row.getAllCells(),
                    (cell) => cell.id,
                    (cell) => html` <td>${FlexRender({ cell })}</td> `,
                  )}
                </tr>
              `,
            )}
          </tbody>
        </table>
        <div class="h-2"></div>
        <div class="flex items-center gap-2">
          <button
            class="border rounded p-1"
            @click="${() => table.setPageIndex(0)}"
            ?disabled="${!table.getCanPreviousPage()}"
          >
            &lt;&lt;
          </button>
          <button
            class="border rounded p-1"
            @click="${() => table.previousPage()}"
            ?disabled="${!table.getCanPreviousPage()}"
          >
            &lt;
          </button>
          <button
            class="border rounded p-1"
            @click="${() => table.nextPage()}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;
          </button>
          <button
            class="border rounded p-1"
            @click="${() => table.setPageIndex(table.getPageCount() - 1)}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;&gt;
          </button>
          <span class="flex items-center gap-1">
            <div>Page</div>
            <strong>
              ${this.tableState.pagination.pageIndex + 1} of
              ${table.getPageCount()}
            </strong>
          </span>
          <span class="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max="${table.getPageCount()}"
              .value="${String(this.tableState.pagination.pageIndex + 1)}"
              @input="${(e: InputEvent) => {
                const target = e.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}"
              class="border p-1 rounded w-16"
            />
          </span>
          <select
            .value="${String(this.tableState.pagination.pageSize)}"
            @change="${(e: Event) => {
              const target = e.currentTarget as HTMLSelectElement
              table.setPageSize(Number(target.value))
            }}"
          >
            ${[10, 20, 30, 40, 50].map(
              (pageSize) =>
                html`<option value="${pageSize}">Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div class="h-4"></div>
        <pre>${JSON.stringify(this.tableState, null, 2)}</pre>
      </div>
      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table {
          border: 1px solid lightgray;
          border-collapse: collapse;
        }

        tbody {
          border-bottom: 1px solid lightgray;
        }

        th {
          border-bottom: 1px solid lightgray;
          border-right: 1px solid lightgray;
          padding: 2px 4px;
        }

        td {
          padding: 2px 4px;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .select-none {
          user-select: none;
        }
      </style>
    `
  }
}

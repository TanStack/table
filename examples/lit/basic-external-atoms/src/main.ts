import { customElement } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  createColumnHelper,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { createAtom } from '@tanstack/store'
import { makeData } from './makeData'
import type { PaginationState, SortingState } from '@tanstack/lit-table'
import type { Person } from './makeData'

// This example demonstrates managing individual slices of table state via
// external TanStack Store atoms. Each atom is a stand-alone, subscribable
// reactive cell — you can read, write, or subscribe to it from anywhere,
// which makes it convenient for sharing state across components or modules.

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

// Create stable external atoms for the individual state slices you want to
// own. These live at module scope here, but could just as easily be created
// in a shared store module and imported by multiple components.
const sortingAtom = createAtom<SortingState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    // The table creates internal base atoms for every slice, and (because we
    // pass `atoms` below) reads/writes for `sorting` and `pagination` are
    // routed through the external atoms we created instead. The
    // TableController subscribes to `table.store` for us, so any atom change
    // flowing through the derived store triggers `host.requestUpdate()`.
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          sortedRowModel: createSortedRowModel(sortFns),
          paginatedRowModel: createPaginatedRowModel(),
        },
        columns,
        data,
        atoms: {
          sorting: sortingAtom,
          pagination: paginationAtom,
        },
        debugTable: true,
      },
      (state) => ({
        sorting: state.sorting,
        pagination: state.pagination,
      }),
    )

    const pagination = paginationAtom.get()
    const sorting = sortingAtom.get()

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
              ${pagination.pageIndex + 1} of ${table.getPageCount()}
            </strong>
          </span>
          <span class="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max="${table.getPageCount()}"
              .value="${String(pagination.pageIndex + 1)}"
              @input="${(e: InputEvent) => {
                const target = e.currentTarget as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}"
              class="border p-1 rounded w-16"
            />
          </span>
          <select
            .value="${String(pagination.pageSize)}"
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
        <pre>${JSON.stringify({ sorting, pagination }, null, 2)}</pre>
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

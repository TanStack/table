import { customElement, state } from 'lit/decorators.js'
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
import { makeData } from './makeData'
import type { Person } from './makeData'

const _features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof _features, Person>()

const columns = columnHelper.columns([
  columnHelper.accessor('firstName', {
    cell: (info) => info.getValue(),
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    cell: (info) => info.getValue(),
    header: () => html`<span>Last Name</span>`,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor('visits', {
    header: () => html`<span>Visits</span>`,
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

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof _features, Person>(this)

  protected render() {
    const table = this.tableController.table(
      {
        _features,
        _rowModels: {
          sortedRowModel: createSortedRowModel(sortFns),
          paginatedRowModel: createPaginatedRowModel(),
        },
        columns,
        data: this._data,
        debugTable: true,
      },
      (state) => ({ pagination: state.pagination, sorting: state.sorting }),
    )

    return html`
      <div class="p-2">
        <div>
          <button
            @click=${() => {
              this._data = makeData(1_000)
            }}
          >
            Regenerate Data
          </button>
          <button
            @click=${() => {
              this._data = makeData(100_000)
            }}
          >
            Stress Test (100k rows)
          </button>
        </div>
        <div class="h-2"></div>
        <table>
          <thead>
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr>
                  ${headerGroup.headers.map(
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder
                          ? null
                          : html`<div
                              style="cursor: ${header.column.getCanSort()
                                ? 'pointer'
                                : 'default'}; user-select: ${header.column.getCanSort()
                                ? 'none'
                                : 'auto'}"
                              @click="${header.column.getToggleSortingHandler()}"
                            >
                              ${FlexRender({ header })}
                              ${{ asc: ' \u{1F53C}', desc: ' \u{1F53D}' }[
                                header.column.getIsSorted() as string
                              ] ?? null}
                            </div>`}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>
          <tbody>
            ${table.getRowModel().rows.map(
              (row) => html`
                <tr>
                  ${row
                    .getAllCells()
                    .map((cell) => html` <td>${FlexRender({ cell })}</td> `)}
                </tr>
              `,
            )}
          </tbody>
        </table>
        <div class="h-2"></div>
        <div class="flex items-center gap-2">
          <button
            class="border rounded p-1"
            @click="${() => table.firstPage()}"
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
            @click="${() => table.lastPage()}"
            ?disabled="${!table.getCanNextPage()}"
          >
            &gt;&gt;
          </button>
          <span class="flex items-center gap-1">
            <div>Page</div>
            <strong>
              ${(table.state.pagination.pageIndex + 1).toLocaleString()} of
              ${table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <span class="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              min="1"
              max="${table.getPageCount()}"
              .value="${String(table.state.pagination.pageIndex + 1)}"
              @input="${(e: InputEvent) => {
                const target = e.target as HTMLInputElement
                const page = target.value ? Number(target.value) - 1 : 0
                table.setPageIndex(page)
              }}"
              class="border p-1 rounded w-16"
              style="width: 4rem"
            />
          </span>
          <select
            .value="${String(table.state.pagination.pageSize)}"
            @change="${(e: Event) => {
              const target = e.target as HTMLSelectElement
              table.setPageSize(Number(target.value))
            }}"
          >
            ${[10, 20, 30, 40, 50].map(
              (pageSize) =>
                html`<option value="${pageSize}">Show ${pageSize}</option>`,
            )}
          </select>
        </div>
        <div>
          Showing ${table.getRowModel().rows.length.toLocaleString()} of
          ${table.getRowCount().toLocaleString()} Rows
        </div>
        <pre>${JSON.stringify(table.state, null, 2)}</pre>
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

        tfoot {
          color: gray;
        }

        tfoot th {
          font-weight: normal;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .gap-2 {
          gap: 0.5rem;
        }

        .gap-1 {
          gap: 0.25rem;
        }

        .border {
          border: 1px solid lightgray;
        }

        .rounded {
          border-radius: 0.25rem;
        }

        .p-1 {
          padding: 0.25rem;
        }

        .p-2 {
          padding: 0.5rem;
        }

        .h-2 {
          height: 0.5rem;
        }

        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      </style>
    `
  }
}

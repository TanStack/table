import { customElement, state } from 'lit/decorators.js'
import { LitElement, html } from 'lit'
import { repeat } from 'lit/directives/repeat.js'
import {
  FlexRender,
  TableController,
  columnFilteringFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFns,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFns,
  tableFeatures,
} from '@tanstack/lit-table'
import { createAtom } from '@tanstack/lit-store'
import { makeData } from './makeData'
import type {
  ColumnFiltersState,
  LitTable,
  PaginationState,
  RowSelectionState,
  TableFeature,
} from '@tanstack/lit-table'
import type { Person } from './makeData'

/**
 * This example demonstrates fine-grained state subscriptions using table.subscribe.
 * Each part of the table subscribes only to the state it needs, optimizing re-renders.
 * External atoms give you full control over state management.
 */

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: 'Select',
    cell: ({ row }) => html`
      <input
        type="checkbox"
        .checked=${row.getIsSelected()}
        ?disabled=${!row.getCanSelect()}
        @change=${row.getToggleSelectedHandler()}
      />
    `,
  }),
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

// External state atoms for fine-grained control
const rowSelectionAtom = createAtom<RowSelectionState>({})
const columnFiltersAtom = createAtom<ColumnFiltersState>([])
const paginationAtom = createAtom<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof features, Person>(this)

  private table = this.tableController.table(
    {
      features,
      rowModels: {
        filteredRowModel: createFilteredRowModel(filterFns),
        paginatedRowModel: createPaginatedRowModel(),
        sortedRowModel: createSortedRowModel(sortFns),
      },
      columns,
      data: this._data,
      getRowId: (row) => row.id,
      enableRowSelection: true,
      atoms: {
        rowSelection: rowSelectionAtom,
        columnFilters: columnFiltersAtom,
        pagination: paginationAtom,
      },
      debugTable: true,
    },
    () => null, // subscribe to no table state by default
  )

  private getPaginationState = (
    state: ReturnType<typeof this.table.store.get>,
  ) => state.pagination

  private getBodyState = (state: ReturnType<typeof this.table.store.get>) => ({
    columnFilters: state.columnFilters,
    globalFilter: state.globalFilter,
    pagination: state.pagination,
  })

  protected updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('_data')) {
      this.table.setOptions((prev) => ({ ...prev, data: this._data }))
    }
  }

  protected render() {
    return html`
      <div class="demo-root">
        <div>
          <button
            class="demo-button demo-button-spaced"
            @click=${() => (this._data = makeData(1_000))}
          >
            Regenerate Data
          </button>
          <button
            class="demo-button demo-button-spaced"
            @click=${() => (this._data = makeData(200_000))}
          >
            Stress Test (200k rows)
          </button>
        </div>

        <div class="spacer-sm"></div>

        <table>
          <thead>
            ${repeat(
              this.table.getHeaderGroups(),
              (hg) => hg.id,
              (headerGroup) => html`
                <tr>
                  ${repeat(
                    headerGroup.headers,
                    (h) => h.id,
                    (header) => html`
                      <th colspan="${header.colSpan}">
                        ${header.isPlaceholder
                          ? null
                          : html`<div
                              class="${header.column.getCanSort()
                                ? 'sortable-header'
                                : ''}"
                              @click="${header.column.getToggleSortingHandler()}"
                            >
                              ${FlexRender({ header })}
                            </div>`}
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>

          <!-- Row Model Subscribe - re-render tbody only when filtering/pagination changes -->
          ${this.table.subscribe(
            this.table.store,
            this.getBodyState,
            () => html`
              <tbody>
                ${repeat(
                  this.table.getRowModel().rows,
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
              <tfoot>
                <tr>
                  <td class="cell-padding">
                    ${this.table.subscribe(
                      rowSelectionAtom,
                      () => html`
                        <input
                          type="checkbox"
                          .checked=${this.table.getIsAllPageRowsSelected()}
                          @change=${this.table.getToggleAllPageRowsSelectedHandler()}
                        />
                      `,
                    )}
                  </td>
                  <td colspan="20">
                    Page Rows
                    (${this.table.getRowModel().rows.length.toLocaleString()})
                  </td>
                </tr>
              </tfoot>
            `,
          )}
        </table>

        <div class="spacer-sm"></div>

        <!-- Pagination Subscribe - re-renders only when pagination state changes -->
        ${this.table.subscribe(
          this.table.store,
          this.getPaginationState,
          (pagination) => {
            console.log('rendering pagination')
            return html`
              <div class="controls">
                <button
                  class="demo-button demo-button-sm"
                  @click=${() => this.table.setPageIndex(0)}
                  ?disabled=${!this.table.getCanPreviousPage()}
                >
                  &lt;&lt;
                </button>
                <button
                  class="demo-button demo-button-sm"
                  @click=${() => this.table.previousPage()}
                  ?disabled=${!this.table.getCanPreviousPage()}
                >
                  &lt;
                </button>
                <button
                  class="demo-button demo-button-sm"
                  @click=${() => this.table.nextPage()}
                  ?disabled=${!this.table.getCanNextPage()}
                >
                  &gt;
                </button>
                <button
                  class="demo-button demo-button-sm"
                  @click=${() =>
                    this.table.setPageIndex(this.table.getPageCount() - 1)}
                  ?disabled=${!this.table.getCanNextPage()}
                >
                  &gt;&gt;
                </button>
                <span class="inline-controls">
                  <div>Page</div>
                  <strong>
                    ${(pagination.pageIndex + 1).toLocaleString()} of
                    ${this.table.getPageCount().toLocaleString()}
                  </strong>
                </span>
                <span class="inline-controls">
                  | Go to page:
                  <input
                    type="number"
                    min="1"
                    max="${this.table.getPageCount()}"
                    .value="${String(pagination.pageIndex + 1)}"
                    @input=${(e: InputEvent) => {
                      const target = e.currentTarget as HTMLInputElement
                      const page = target.value ? Number(target.value) - 1 : 0
                      this.table.setPageIndex(page)
                    }}
                    class="page-size-input"
                  />
                </span>
                <select
                  .value="${String(pagination.pageSize)}"
                  @change=${(e: Event) => {
                    const target = e.currentTarget as HTMLSelectElement
                    this.table.setPageSize(Number(target.value))
                  }}
                >
                  ${[10, 20, 30, 40, 50, 100].map(
                    (pageSize) =>
                      html`<option value="${pageSize}">
                        Show ${pageSize}
                      </option>`,
                  )}
                </select>
              </div>
            `
          },
        )}

        <br />

        <!-- Row Selection Summary Subscribe - re-renders only when selection changes -->
        ${this.table.subscribe(
          rowSelectionAtom,
          (rowSelection) => html`
            <div>
              ${Object.keys(rowSelection).length.toLocaleString()} of
              ${this.table
                .getPreFilteredRowModel()
                .rows.length.toLocaleString()}
              Total Rows Selected
            </div>
          `,
        )}

        <hr />
        <br />

        <!-- Full Table State Subscribe - for debugging -->
        <label>Table State:</label>
        ${this.table.subscribe(
          this.table.store,
          (state) => state,
          (state) => html` <pre>${JSON.stringify(state, null, 2)}</pre> `,
        )}
      </div>

      <style>
        * {
          font-family: sans-serif;
          font-size: 14px;
          box-sizing: border-box;
        }

        table {
          border: 1px solid lightgray;
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

        .sortable-header {
          cursor: pointer;
          user-select: none;
        }

        .demo-root {
          padding: 0.5rem;
        }

        .spacer-sm {
          height: 0.5rem;
        }

        .controls,
        .inline-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .inline-controls {
          gap: 0.25rem;
        }

        .demo-button,
        .page-size-input {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
          padding: 0.5rem;
        }

        .demo-button-sm {
          padding: 0.25rem;
        }

        .demo-button-spaced {
          margin-bottom: 0.5rem;
        }

        .page-size-input {
          width: 4rem;
          padding: 0.25rem;
        }

        .summary-panel {
          border: 1px solid currentColor;
          box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
          padding: 0.5rem;
          width: 100%;
        }

        .cell-padding {
          padding: 0.25rem;
        }

        select {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
          padding: 0.25rem;
        }

        input[type='number'] {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
          padding: 0.25rem;
        }

        hr {
          margin: 1rem 0;
        }

        pre {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 0.25rem;
          overflow-x: auto;
        }
      </style>
    `
  }
}

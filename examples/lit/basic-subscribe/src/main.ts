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
  filterFn_inNumberRange,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  subscribe,
  tableFeatures,
} from '@tanstack/lit-table'
import { createAtom } from '@tanstack/lit-store'
import { makeData } from './makeData'
import type { HeaderContext, RowSelectionState } from '@tanstack/lit-table'
import type { Person } from './makeData'

/**
 * This example mirrors the React `basic-subscribe` example: it shows fine-grained
 * re-rendering with `table.subscribe`. Each part of the UI subscribes only to the
 * slice of state it needs, so toggling one row, typing in a filter, or paging only
 * re-renders the affected region instead of the whole table.
 *
 * Reach for these patterns only when you hit a real performance issue.
 */

const features = tableFeatures({
  rowPaginationFeature,
  rowSelectionFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  // Row models must be registered as part of the features so the table actually
  // filters and paginates `table.getRowModel()`.
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    inNumberRange: filterFn_inNumberRange,
  },
})

const columnHelper = createColumnHelper<typeof features, Person>()

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    // Select-all checkbox re-renders only when filtering or row selection changes.
    header: ({ table }) =>
      subscribe(
        table.store,
        (state) => ({
          columnFilters: state.columnFilters,
          globalFilter: state.globalFilter,
          rowSelection: state.rowSelection,
        }),
        () => html`
          <input
            type="checkbox"
            .checked=${table.getIsAllRowsSelected()}
            .indeterminate=${table.getIsSomeRowsSelected()}
            @change=${table.getToggleAllRowsSelectedHandler()}
          />
        `,
      ),
    // Each row's checkbox subscribes only to its own selection value, so toggling
    // one row re-renders just that checkbox.
    cell: ({ row, table }) =>
      subscribe(
        table.atoms.rowSelection,
        (rowSelection) => rowSelection[row.id],
        (isRowSelected) => html`
          <input
            type="checkbox"
            .checked=${!!isRowSelected}
            ?disabled=${!row.getCanSelect()}
            @click=${row.getToggleSelectedHandler()}
          />
        `,
      ),
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: 'lastName',
    header: () => html`<span>Last Name</span>`,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('age', {
    header: () => 'Age',
  }),
  columnHelper.accessor('visits', {
    header: () => html`<span>Visits</span>`,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
  }),
  columnHelper.accessor('progress', {
    header: 'Profile Progress',
  }),
])

// Raise just the row selection slice to an external atom for full control over it,
// matching the React example. Other slices stay internal to the table.
const rowSelectionAtom = createAtom<RowSelectionState>({})

@customElement('lit-table-example')
class LitTableExample extends LitElement {
  @state()
  private _data: Array<Person> = makeData(1_000)

  private tableController = new TableController<typeof features, Person>(this)

  // Options are re-synced on every render pass (like the other examples), so
  // reactive inputs such as `this._data` flow into the table in the same
  // update that renders them.
  private tableOptions() {
    return {
      features,
      columns,
      data: this._data,
      getRowId: (row: Person) => row.id,
      enableRowSelection: true,
      atoms: {
        rowSelection: rowSelectionAtom,
      },
      debugTable: true,
    }
  }

  private table = this.tableController.table(
    this.tableOptions(),
    () => null, // subscribe to no table state by default; use table.subscribe below
  )

  // Stable selector references so the directive can skip re-running when the host
  // re-renders with the same source + selector.
  private getBodyState = (state: ReturnType<typeof this.table.store.get>) => ({
    columnFilters: state.columnFilters,
    globalFilter: state.globalFilter,
    pagination: state.pagination,
  })

  private renderColumnFilter(
    context: HeaderContext<typeof features, Person, unknown>,
  ) {
    const { column, table } = context
    if (!column.getCanFilter()) return null

    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id)

    // Re-render the filter inputs only when the column filters change.
    return subscribe(table.atoms.columnFilters, () =>
      typeof firstValue === 'number'
        ? html`
            <div class="filter-row">
              <input
                type="number"
                .value=${String(
                  (column.getFilterValue() as [unknown, unknown])?.[0] ?? '',
                )}
                @input=${(e: InputEvent) => {
                  const value = (e.currentTarget as HTMLInputElement).value
                  column.setFilterValue((old: [unknown, unknown]) => [
                    value,
                    old?.[1],
                  ])
                }}
                placeholder="Min"
                class="filter-input"
              />
              <input
                type="number"
                .value=${String(
                  (column.getFilterValue() as [unknown, unknown])?.[1] ?? '',
                )}
                @input=${(e: InputEvent) => {
                  const value = (e.currentTarget as HTMLInputElement).value
                  column.setFilterValue((old: [unknown, unknown]) => [
                    old?.[0],
                    value,
                  ])
                }}
                placeholder="Max"
                class="filter-input"
              />
            </div>
          `
        : html`
            <input
              type="text"
              .value=${String(column.getFilterValue() ?? '')}
              @input=${(e: InputEvent) => {
                column.setFilterValue(
                  (e.currentTarget as HTMLInputElement).value,
                )
              }}
              placeholder="Search..."
              class="filter-input"
            />
          `,
    )
  }

  protected render() {
    this.table = this.tableController.table(this.tableOptions(), () => null)

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
            @click=${() => (this._data = makeData(1_000_000))}
          >
            Stress Test (1M rows)
          </button>
        </div>

        <!-- Global filter - re-renders only when the global filter changes -->
        <div>
          ${this.table.subscribe(
            this.table.store,
            (state) => state.globalFilter,
            (globalFilter) => html`
              <input
                type="text"
                .value=${globalFilter ?? ''}
                @input=${(e: InputEvent) =>
                  this.table.setGlobalFilter(
                    (e.currentTarget as HTMLInputElement).value,
                  )}
                class="summary-panel"
                placeholder="Search all columns..."
              />
            `,
          )}
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
                        ${
                          header.isPlaceholder
                            ? null
                            : html`
                                <div>${FlexRender({ header })}</div>
                                ${
                                  header.column.getCanFilter()
                                    ? this.renderColumnFilter(
                                        header.getContext(),
                                      )
                                    : null
                                }
                              `
                        }
                      </th>
                    `,
                  )}
                </tr>
              `,
            )}
          </thead>

          <!-- Row model subscribe - re-render tbody only when filtering/pagination changes -->
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
                          .indeterminate=${this.table.getIsSomePageRowsSelected()}
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

        <!-- Pagination subscribe - re-renders only when pagination state changes -->
        ${this.table.subscribe(
          this.table.store,
          (state) => state.pagination,
          (pagination) => html`
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
                @click=${() => this.table.lastPage()}
                ?disabled=${!this.table.getCanLastPage()}
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
                ${[10, 20, 30, 40, 50].map(
                  (pageSize) =>
                    html`<option value="${pageSize}">Show ${pageSize}</option>`,
                )}
              </select>
            </div>
          `,
        )}

        <br />

        <!-- Row selection summary subscribe - re-renders only when selection changes -->
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

        <!-- Full table state subscribe - for debugging -->
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
          text-align: left;
          vertical-align: top;
        }

        td {
          padding: 2px 4px;
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

        .filter-row {
          display: flex;
          gap: 0.25rem;
        }

        .filter-input {
          border: 1px solid currentColor;
          border-radius: 0.25rem;
          padding: 0.25rem;
          width: 6rem;
          font-weight: normal;
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
          border-radius: 0.25rem;
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
